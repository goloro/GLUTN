import { db, auth } from "./firebase-config.js";
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const video = document.getElementById('camera-stream');
const captureCanvas = document.getElementById('capture-canvas');
const ctx = captureCanvas.getContext('2d', { willReadFrequently: true });
const captureBtn = document.getElementById('capture-btn');
const modeSwitchBtn = document.getElementById('mode-switch-btn');
const reticleIa = document.getElementById('reticle-ia');
const reticleEan = document.getElementById('reticle-ean');
const instructionText = document.getElementById('instruction-text');
const modeSwitchText = document.getElementById('mode-switch-text');
const modeSwitchIcon = modeSwitchBtn.querySelector('i');
const loadingScreen = document.getElementById('loading-screen');
const resultScreen = document.getElementById('result-screen');

let iaStream = null;
let currentScanMode = new URLSearchParams(window.location.search).get('mode') || 'EAN';
let lastScannedBarcode = null;
let zxingReader = new ZXing.BrowserMultiFormatReader();
let isEANScanning = false;
let isProcessing = false;

function getT(key) {
    if (typeof window.getTranslation === 'function') return window.getTranslation(key);
    return key;
}

// ---------------------------------------------------------
// 1. ZXING CONTINUOUS SCANNER (EAN MODE)
// ---------------------------------------------------------
async function startEANScanner() {
    if (iaStream) {
        iaStream.getTracks().forEach(t => t.stop());
        iaStream = null;
    }
    
    video.style.display = 'block';
    if (isEANScanning) return;
    isEANScanning = true;
    isProcessing = false;

    // Use ZXing's built-in continuous scanner via getUserMedia directly!
    // This is the most stable method they offer. It handles its own video feed.
    try {
        await zxingReader.decodeFromVideoDevice(undefined, video, async (result, err) => {
            if (result && isEANScanning && !isProcessing) {
                isProcessing = true; // prevent duplicate fires
                isEANScanning = false;
                
                try {
                    zxingReader.reset(); // Stop scanning
                } catch(e) {}
                
                if (navigator.vibrate) navigator.vibrate(100);
                lastScannedBarcode = result.text;
                loadingScreen.classList.add('active');
                
                try {
                    await analyzeWithOpenFoodFacts(result.text);
                } catch (error) {
                    showCustomDialog({
                        type: 'error', title: getT('modal.error_network'), message: getT('modal.error_network_desc')
                    });
                    loadingScreen.classList.remove('active');
                    startEANScanner();
                }
            }
        });
    } catch (e) {
        console.error("ZXing Initialization Error:", e);
    }
}

function stopEANScanner() {
    isEANScanning = false;
    try {
        zxingReader.reset();
    } catch(e){}
}

// ---------------------------------------------------------
// 2. MANUAL VIDEO STREAM (IA MODE)
// ---------------------------------------------------------
async function startIAScanner() {
    stopEANScanner();
    video.style.display = 'block';

    try {
        iaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        video.setAttribute('playsinline', 'true');
        video.srcObject = iaStream;
        
        await new Promise((resolve) => {
            if (video.readyState >= 2) video.play().then(resolve).catch(resolve);
            else video.onloadedmetadata = () => video.play().then(resolve).catch(resolve);
        });
    } catch (error) {
        console.error("IA Camera Error:", error);
    }
}

async function captureAndAnalyzeIA() {
    if (!video.videoWidth) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const cw = video.clientWidth;
    const ch = video.clientHeight;
    const videoRatio = vw / vh;
    const screenRatio = cw / ch;

    let sourceX = 0, sourceY = 0, sourceWidth = vw, sourceHeight = vh;
    if (screenRatio > videoRatio) {
        sourceHeight = vw / screenRatio;
        sourceY = (vh - sourceHeight) / 2;
    } else {
        sourceWidth = vh * screenRatio;
        sourceX = (vw - sourceWidth) / 2;
    }

    const MAX_WIDTH = 800;
    let scale = sourceWidth > MAX_WIDTH ? (MAX_WIDTH / sourceWidth) : 1;
    captureCanvas.width = sourceWidth * scale;
    captureCanvas.height = sourceHeight * scale;
    ctx.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, captureCanvas.width, captureCanvas.height);
    
    const base64Image = captureCanvas.toDataURL('image/jpeg', 0.7);
    const base64Data = base64Image.split(',')[1];

    document.getElementById('scanner-result-img').src = base64Image;
    loadingScreen.classList.add('active');
    
    await analyzeWithGemini(base64Data);
}

// ---------------------------------------------------------
// 3. UI CONTROLLER
// ---------------------------------------------------------
function updateScannerUI(mode, keepBarcode = false) {
    if (!keepBarcode) lastScannedBarcode = null;
    currentScanMode = mode;

    if (mode === 'EAN') {
        reticleIa.classList.add('reticle-hidden');
        reticleEan.classList.remove('reticle-hidden');
        instructionText.setAttribute('data-i18n', 'scanner.focus_ean');
        modeSwitchText.setAttribute('data-i18n', 'home.scan_ia');
        modeSwitchIcon.className = "ph-bold ph-scan";
        captureBtn.style.display = 'none';
        startEANScanner();
    } else {
        reticleEan.classList.add('reticle-hidden');
        reticleIa.classList.remove('reticle-hidden');
        instructionText.setAttribute('data-i18n', 'scanner.focus');
        modeSwitchText.setAttribute('data-i18n', 'home.scan_ean');
        modeSwitchIcon.className = "ph-bold ph-barcode";
        captureBtn.style.display = 'flex';
        startIAScanner();
    }

    if (typeof window.applyTranslations === 'function') window.applyTranslations(localStorage.getItem('glutn_lang') || 'es');
}

modeSwitchBtn.addEventListener('click', () => updateScannerUI(currentScanMode === 'IA' ? 'EAN' : 'IA'));
captureBtn.addEventListener('click', () => captureAndAnalyzeIA());

// INITIALIZE
updateScannerUI(currentScanMode);
window.addEventListener('beforeunload', () => {
    if (iaStream) iaStream.getTracks().forEach(t => t.stop());
    stopEANScanner();
});

// ---------------------------------------------------------
// 4. API & RENDERING LOGIC
// ---------------------------------------------------------
async function analyzeWithOpenFoodFacts(barcode) {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await response.json();

    if (data.status === 0 || !data.product) {
        renderResult({
            isNotFound: true, isWarning: true, barcode: barcode,
            reason: getT('result.not_found') + ` (EAN: ${barcode})`, ingredients: [], gluten: null, productName: `Producto ${barcode}`
        });
        return;
    }

    const p = data.product;
    const labels = p.labels_tags || [];
    const allergens = p.allergens_tags || [];
    const traces = p.traces_tags || [];
    const ingredientsText = p.ingredients_text || '';
    const analysisTags = p.ingredients_analysis_tags || [];
    const displayName = p.brands ? `${p.product_name || ''} - ${p.brands}` : (p.product_name || '');

    const isGlutenFreeLabel = labels.some(l => {
        const tag = l.toLowerCase();
        return tag.includes('gluten-free') || 
               tag.includes('no-gluten') || 
               tag.includes('without-gluten') || 
               tag.includes('free-from-gluten') ||
               tag.includes('sin-gluten') || 
               tag.includes('libre-de-gluten') ||
               tag.includes('sans-gluten') || 
               tag.includes('glutenfrei') || 
               tag.includes('ohne-gluten') ||
               tag.includes('senza-glutine') || 
               tag.includes('sem-gluten') || 
               tag.includes('glutenvrij') ||
               tag.includes('bez-glutenu') || 
               tag.includes('glutenfri') || 
               tag.includes('gluteeniton') ||
               tag.includes('glutensiz') || 
               tag.includes('æ— éº¸è´¨') || 
               tag.includes('ç„¡éº©è³ª') || 
               tag.includes('ã‚°ãƒ«ãƒ†ãƒ³ãƒ•ãƒªãƒ¼') ||
               tag.includes('Ø®Ø§Ù„ÙŠ Ù…Ù† Ø§Ù„Ø¬Ù„ÙˆØªÙŠÙ†') ||
               // Fallback: if it contains 'gluten' and any negation word in the same tag
               (tag.includes('gluten') && (tag.includes('no') || tag.includes('sin') || tag.includes('sans') || tag.includes('senza') || tag.includes('sem') || tag.includes('bez') || tag.includes('ohne') || tag.includes('free') || tag.includes('frei')));
    }) || analysisTags.includes('en:gluten-free');

    let offLang = 'es';
    if (typeof window.currentGlobalLang !== 'undefined') {
        if (window.currentGlobalLang === 'English') offLang = 'en';
        else if (window.currentGlobalLang === 'FranÃ§ais') offLang = 'fr';
        else if (window.currentGlobalLang === 'Deutsch') offLang = 'de';
        else if (window.currentGlobalLang === 'Italiano') offLang = 'it';
    }

    let localizedText = p[`ingredients_text_${offLang}`];
    let defaultText = p.ingredients_text || '';
    let mappedIngredients = [];

    // Prioritize text in user's language
    let textToParse = localizedText || defaultText;
    
    if (textToParse) {
        // Split by comma or dot to create a nice list
        let parts = textToParse.split(/[,\.]/);
        mappedIngredients = parts.map(i => ({ name: i.trim() })).filter(i => i.name.length > 1);
    } 
    
    if (mappedIngredients.length === 0 && p.ingredients && p.ingredients.length > 0) {
        // Fallback to OFF's ingredient array if text is completely missing
        mappedIngredients = p.ingredients.map(i => ({ name: i.text || i.id || '' })).filter(i => i.name.trim() !== '');
    }

    if (mappedIngredients.length === 0 && !isGlutenFreeLabel) {
        renderResult({
            isWarning: true, gluten: null, reason: getT('result.missing_ingredients'), ingredients: [],
            imageUrl: p.image_url || p.image_front_url || null, barcode: barcode, productName: displayName
        });
        return;
    }

    if (isGlutenFreeLabel) {
        renderResult({
            isWarning: false, gluten: false, reason: getT('result.safe_cert'), ingredients: mappedIngredients,
            imageUrl: p.image_url || p.image_front_url || null, barcode: barcode, productName: displayName
        });
        return;
    }

    const hasGlutenAllergens = allergens.includes('en:gluten') || allergens.includes('en:wheat') || allergens.includes('en:barley') || allergens.includes('en:oats') || allergens.includes('en:rye');
    if (hasGlutenAllergens) {
        const glutenKeywords = ['gluten', 'trigo', 'cebada', 'centeno', 'avena', 'espelta', 'kamut', 'wheat', 'barley', 'rye', 'oats', 'spelt'];
        const hasGlutenInList = mappedIngredients.some(i => glutenKeywords.some(kw => i.name.toLowerCase().includes(kw)));
        
        if (!hasGlutenInList) {
            mappedIngredients.push({ name: 'Contiene gluten (detectado en base de datos, no detallado en ingredientes)' });
        }

        renderResult({
            isWarning: false, gluten: true, reason: getT('result.unsafe_allergens'), ingredientWithGluten: 'Gluten / Cereales',
            ingredients: mappedIngredients, imageUrl: p.image_url || p.image_front_url || null, barcode: barcode, productName: displayName
        });
        return;
    }

    const hasGlutenTraces = traces.includes('en:gluten') || traces.includes('en:wheat') || traces.includes('en:barley') || traces.includes('en:oats') || traces.includes('en:rye');
    let reasonText = hasGlutenTraces ? getT('result.warning_traces') : getT('result.warning_not_certified');
    
    // Si tiene trazas y no estÃ¡n en la lista de ingredientes, las inyectamos para que el usuario las vea
    if (hasGlutenTraces) {
        const hasTracesInList = mappedIngredients.some(i => i.name.toLowerCase().includes('trazas') || i.name.toLowerCase().includes('traces'));
        if (!hasTracesInList) {
            mappedIngredients.push({ name: 'Puede contener trazas de gluten' });
        }
    }

    renderResult({
        isWarning: true, gluten: null, reason: reasonText, ingredients: mappedIngredients,
        imageUrl: p.image_url || p.image_front_url || null, barcode: barcode, productName: displayName
    });
}

async function analyzeWithGemini(base64Data) {
    let userLang = (JSON.parse(localStorage.getItem('GLUTN_UserInfo')) || {}).language || 'EspaÃ±ol';
    const promptText = `Eres un experto nutricionista. Traduce ingredientes al ${userLang}.
    Si no hay etiqueta, devuelve {"error":"no_label_detected"}.
    Si hay, extrae ingredientes y mira si hay gluten (trigo, cebada, centeno, avena). Devuelve JSON:
    {"productName":"Nombre", "gluten":true/false, "isWarning":true/false, "reason":"...", "ingredientWithGluten":"...", "ingredients":[{"name":"..."}]}`;

    try {
        const response = await fetch(`/api/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }, { inlineData: { mimeType: "image/jpeg", data: base64Data } }] }],
                generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
            })
        });

        if (!response.ok) throw new Error("Error HTTP");
        const data = await response.json();
        const cleanJsonStr = data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
        const scanResult = JSON.parse(cleanJsonStr);

        if (lastScannedBarcode) scanResult.barcode = lastScannedBarcode;
        if (scanResult.error === 'no_label_detected') {
            showCustomDialog({ type: 'error', title: 'No se detectÃ³ etiqueta', message: 'Por favor, asegÃºrate de enfocar bien.' });
            loadingScreen.classList.remove('active');
            return;
        }
        renderResult(scanResult);
    } catch (error) {
        showCustomDialog({ type: 'error', title: 'Error', message: 'No pudimos procesar la imagen.' });
        loadingScreen.classList.remove('active');
    }
}

function renderResult(scan) {
    loadingScreen.classList.remove('active');

    if (!scan.date) {
        const now = new Date();
        scan.date = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth()+1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        saveToHistory(scan);
    }

    const imgEl = document.getElementById('scanner-result-img');
    const ingredientsBox = document.querySelector('.ingredients-box');
    
    // Reset styles
    imgEl.style.objectFit = 'cover';
    imgEl.style.padding = '0px';
    if (ingredientsBox) ingredientsBox.style.display = 'block';

    if (scan.imageUrl) {
        imgEl.src = scan.imageUrl;
    } else {
        imgEl.src = '../Images/Logos/Glutn_Logo-ShortIcon.PNG';
        if (currentScanMode === 'EAN' || scan.isNotFound) {
            imgEl.style.objectFit = 'contain';
            imgEl.style.padding = '20px';
        }
    }

    const badge = document.getElementById('scanner-result-badge');
    const aiBox = document.getElementById('ai-recommendation-box');
    const notFoundBox = document.getElementById('not-found-box');
    const offEditBox = document.getElementById('off-edit-box');
    
    aiBox.style.display = 'none';
    if (notFoundBox) notFoundBox.style.display = 'none';
    if (offEditBox) offEditBox.style.display = 'none';

    const resultCard = document.querySelector('.result-card');
    if (resultCard) resultCard.style.display = 'block';

    if (scan.isNotFound === true) {
        if (resultCard) resultCard.style.display = 'none'; // Hide the ugly placeholder
        
        if (notFoundBox) notFoundBox.style.display = 'flex';
        if (ingredientsBox) ingredientsBox.style.display = 'none';
        
        if (scan.barcode && offEditBox) {
            offEditBox.style.display = 'block';
            document.getElementById('off-edit-btn').onclick = () => window.open(`https://world.openfoodfacts.org/cgi/product.pl?type=edit&code=${scan.barcode}`, '_blank');
        }
    } else if (scan.isWarning) {
        badge.className = 'verdict-banner warning';
        badge.innerHTML = `<i class="ph-bold ph-warning"></i> <span data-i18n="result.caution">Precaución</span>`;
        aiBox.style.display = 'block';
        if (scan.barcode && offEditBox) {
            offEditBox.style.display = 'block';
            document.getElementById('off-edit-btn').onclick = () => window.open(`https://world.openfoodfacts.org/cgi/product.pl?type=edit&code=${scan.barcode}`, '_blank');
        }
    } else if (scan.gluten === false) {
        badge.className = 'verdict-banner safe';
        badge.innerHTML = `<i class="ph-bold ph-check-circle"></i> <span data-i18n="result.safe">Apto</span>`;
    } else {
        badge.className = 'verdict-banner unsafe';
        badge.innerHTML = `<i class="ph-bold ph-x-circle"></i> <span data-i18n="result.not_safe">Contiene Gluten</span>`;
    }

    
    

        const reasonEl = document.getElementById('scanner-result-reason');
    if (reasonEl) {
        if (scan.reason && !scan.isNotFound) {
            reasonEl.innerText = scan.reason;
            reasonEl.style.display = 'block';
        } else {
            reasonEl.style.display = 'none';
        }
    }

    const ul = document.getElementById('scanner-result-ingredients');
    ul.innerHTML = '';
    
    const glutenKeywords = ['gluten', 'trigo', 'cebada', 'centeno', 'avena', 'espelta', 'kamut', 'wheat', 'barley', 'rye', 'oats', 'spelt'];
    
    if (scan.ingredients && scan.ingredients.length > 0 && !scan.isNotFound) {
        scan.ingredients.forEach(ing => {
            const li = document.createElement('li'); li.innerText = ing.name;
            
            let isGluten = false;
            const lowerName = ing.name.toLowerCase();
            
            // Check against our comprehensive keyword list
            if (glutenKeywords.some(kw => lowerName.includes(kw))) {
                isGluten = true;
            }
            // Also check the specific AI-detected ingredient if any
            if (scan.ingredientWithGluten && scan.ingredientWithGluten !== 'Gluten / Cereales' && lowerName.includes(scan.ingredientWithGluten.toLowerCase())) {
                isGluten = true;
            }
            
            if (isGluten) {
                // If it's a short ingredient name, just turn the whole thing red
                if (ing.name.length < 50) {
                    li.style.color = '#ef4444'; 
                    li.style.fontWeight = 'bold';
                } else {
                    // If it's a long text block, wrap keywords in span
                    let highlightedText = ing.name;
                    glutenKeywords.forEach(kw => {
                        const regex = new RegExp(`(${kw})`, 'gi');
                        highlightedText = highlightedText.replace(regex, '<span style="color:#ef4444; font-weight:bold">$1</span>');
                    });
                    if (scan.ingredientWithGluten && scan.ingredientWithGluten !== 'Gluten / Cereales') {
                        const regex = new RegExp(`(${scan.ingredientWithGluten})`, 'gi');
                        highlightedText = highlightedText.replace(regex, '<span style="color:#ef4444; font-weight:bold">$1</span>');
                    }
                    li.innerHTML = highlightedText;
                }
            }
            ul.appendChild(li);
        });
    } else if (!scan.isNotFound) {
        ul.innerHTML = `<li>${getT('scanner.no_ingredients')}</li>`;
    }

    if (typeof window.applyTranslations === 'function') window.applyTranslations(localStorage.getItem('glutn_lang') || 'es');
    resultScreen.classList.add('active');
    document.body.classList.add('showing-result');
    
    // Bind AI buttons
    const bindAiBtn = (id) => {
        const btn = document.getElementById(id);
        if (btn) {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', () => {
                resultScreen.classList.remove('active');
                updateScannerUI('IA', true);
            });
        }
    };
    bindAiBtn('ai-switch-btn');
    bindAiBtn('ai-switch-btn-notfound');
}

async function saveToHistory(scanResult) {
    if (!auth.currentUser) return;
    scanResult.id = Date.now();
    try { 
        const historyRef = collection(db, "users", auth.currentUser.uid, "history");
        await addDoc(historyRef, { ...scanResult, timestamp: serverTimestamp() });
    } 
    catch (e) { console.error("Error guardando en historial: ", e); }
}

function showCustomDialog(options) {
    return new Promise((resolve) => {
        const modal = document.getElementById('custom-modal');
        const iconWrapper = document.getElementById('custom-modal-icon');
        const icon = iconWrapper.querySelector('i');
        
        iconWrapper.className = 'custom-icon-wrapper';
        if (options.type === 'error') { iconWrapper.classList.add('error'); icon.className = 'ph-bold ph-warning-circle'; }
        else if (options.type === 'success') { iconWrapper.classList.add('success'); icon.className = 'ph-bold ph-check-circle'; }
        else { iconWrapper.classList.add('info'); icon.className = 'ph-bold ph-info'; }

        document.getElementById('custom-modal-title').innerText = options.title || 'Aviso';
        document.getElementById('custom-modal-message').innerText = options.message || '';
        
        const btnConfirm = document.getElementById('custom-modal-confirm');
        btnConfirm.onclick = () => { modal.classList.remove('active'); resolve({ confirmed: true }); };
        modal.classList.add('active');
    });
}

