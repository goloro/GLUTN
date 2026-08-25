import { db, auth } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

// DOM Elements
const video = document.getElementById('camera-stream');
const readerDiv = document.getElementById('reader');
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

let html5QrCode = null;
let iaStream = null;
let currentScanMode = new URLSearchParams(window.location.search).get('mode') || 'EAN';
let lastScannedBarcode = null;

// Helper to get translation or fallback
function getT(key) {
    if (typeof window.getTranslation === 'function') {
        return window.getTranslation(key);
    }
    return key;
}

// ---------------------------------------------------------
// 1. HTML5-QRCODE BARCODE SCANNER (EAN MODE)
// ---------------------------------------------------------
async function startEANScanner() {
    if (iaStream) {
        iaStream.getTracks().forEach(t => t.stop());
        iaStream = null;
    }
    video.style.display = 'none';
    readerDiv.style.display = 'block';

    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("reader");
    }

    try {
        if (html5QrCode.isScanning) {
            await html5QrCode.stop();
        }
        
        await html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 150 },
                formatsToSupport: [ Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.EAN_8, Html5QrcodeSupportedFormats.UPC_A, Html5QrcodeSupportedFormats.UPC_E ]
            },
            async (decodedText, decodedResult) => {
                // Success Callback
                if (html5QrCode.isScanning) {
                    await html5QrCode.stop(); // Stop scanning immediately
                }
                
                if (navigator.vibrate) navigator.vibrate(100);
                lastScannedBarcode = decodedText;
                loadingScreen.classList.add('active');
                
                try {
                    await analyzeWithOpenFoodFacts(decodedText);
                } catch (error) {
                    showCustomDialog({
                        type: 'error',
                        title: getT('modal.error_network'),
                        message: getT('modal.error_network_desc')
                    });
                    loadingScreen.classList.remove('active');
                    startEANScanner(); // Restart on failure
                }
            },
            (errorMessage) => {
                // Ignore parsing errors (very frequent during continuous scanning)
            }
        );
    } catch (err) {
        console.error("Error starting html5-qrcode:", err);
    }
}

async function stopEANScanner() {
    if (html5QrCode && html5QrCode.isScanning) {
        try {
            await html5QrCode.stop();
        } catch (e) {}
    }
    readerDiv.style.display = 'none';
}

// ---------------------------------------------------------
// 2. MANUAL VIDEO STREAM (IA MODE)
// ---------------------------------------------------------
async function startIAScanner() {
    await stopEANScanner();
    video.style.display = 'block';

    try {
        iaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        video.setAttribute('playsinline', 'true');
        video.srcObject = iaStream;
        
        await new Promise((resolve) => {
            if (video.readyState >= 2) {
                video.play().then(resolve).catch(resolve);
            } else {
                video.onloadedmetadata = () => {
                    video.play().then(resolve).catch(resolve);
                };
            }
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

    if (typeof window.applyTranslations === 'function') {
        window.applyTranslations(localStorage.getItem('glutn_lang') || 'es');
    }
}

modeSwitchBtn.addEventListener('click', () => {
    updateScannerUI(currentScanMode === 'IA' ? 'EAN' : 'IA');
});

captureBtn.addEventListener('click', () => {
    captureAndAnalyzeIA();
});

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
            isNotFound: true,
            isWarning: true,
            barcode: barcode,
            reason: getT('result.not_found') + ` (EAN: ${barcode})`,
            ingredients: [],
            gluten: null,
            productName: `Producto ${barcode}`
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

    let mappedIngredients = (p.ingredients || []).map(i => ({ name: i.text || i.id || '' })).filter(i => i.name.trim() !== '');
    if (mappedIngredients.length === 0 && ingredientsText) {
        mappedIngredients.push({ name: ingredientsText });
    }

    if (labels.includes('en:gluten-free') || labels.includes('es:sin-gluten') || analysisTags.includes('en:gluten-free')) {
        renderResult({
            isWarning: false, gluten: false, reason: getT('result.safe_certified'), ingredients: mappedIngredients,
            imageUrl: p.image_url || p.image_front_url || null, barcode: barcode, productName: displayName
        });
        return;
    }

    if (allergens.includes('en:gluten') || allergens.includes('en:wheat') || allergens.includes('en:barley') || allergens.includes('en:oats') || allergens.includes('en:rye')) {
        renderResult({
            isWarning: false, gluten: true, reason: getT('result.unsafe_allergens'), ingredientWithGluten: 'Gluten / Cereales',
            ingredients: mappedIngredients, imageUrl: p.image_url || p.image_front_url || null, barcode: barcode, productName: displayName
        });
        return;
    }

    let reasonText = (traces.includes('en:gluten') || traces.includes('en:wheat')) ? getT('result.warning_traces') : getT('result.warning_not_certified');
    renderResult({
        isWarning: true, gluten: null, reason: reasonText, ingredients: mappedIngredients,
        imageUrl: p.image_url || p.image_front_url || null, barcode: barcode, productName: displayName
    });
}

async function analyzeWithGemini(base64Data) {
    let userLang = (JSON.parse(localStorage.getItem('GLUTN_UserInfo')) || {}).language || 'Español';
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
            showCustomDialog({ type: 'error', title: 'No se detectó etiqueta', message: 'Por favor, asegúrate de enfocar bien.' });
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

    if (scan.imageUrl) {
        document.getElementById('scanner-result-img').src = scan.imageUrl;
    } else if (currentScanMode === 'EAN' && !document.getElementById('scanner-result-img').src.startsWith('data:')) {
        document.getElementById('scanner-result-img').src = '../Images/Logos/Glutn_Logo-ShortIcon.PNG';
    }

    const badge = document.getElementById('scanner-result-badge');
    const aiBox = document.getElementById('ai-recommendation-box');
    const offEditBox = document.getElementById('off-edit-box');
    
    aiBox.style.display = 'none';
    if (offEditBox) offEditBox.style.display = 'none';

    if (scan.isNotFound === true) {
        badge.className = 'verdict-banner';
        badge.innerHTML = `<i class="ph-bold ph-question"></i> <span data-i18n="result.not_found">Producto no encontrado</span>`;
        badge.style.backgroundColor = '#6B7280';
        aiBox.style.display = 'block';
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
        badge.className = 'verdict-banner danger';
        badge.innerHTML = `<i class="ph-bold ph-x-circle"></i> <span data-i18n="result.not_safe">Contiene Gluten</span>`;
    }

    document.getElementById('scanner-result-reason').innerHTML = scan.ingredientWithGluten ? `${scan.reason} <br><strong>Ingrediente detectado: <span style="color:#ef4444">${scan.ingredientWithGluten}</span></strong>` : scan.reason;

    const ul = document.getElementById('scanner-result-ingredients');
    ul.innerHTML = '';
    if (scan.ingredients && scan.ingredients.length > 0) {
        scan.ingredients.forEach(ing => {
            const li = document.createElement('li');
            li.innerText = ing.name;
            if (scan.ingredientWithGluten && ing.name.toLowerCase().includes(scan.ingredientWithGluten.toLowerCase())) {
                li.style.color = '#ef4444'; li.style.fontWeight = 'bold';
            }
            ul.appendChild(li);
        });
    } else {
        ul.innerHTML = `<li>${getT('scanner.no_ingredients')}</li>`;
    }

    if (typeof window.applyTranslations === 'function') window.applyTranslations(localStorage.getItem('glutn_lang') || 'es');
    resultScreen.classList.add('active');
    
    const aiBtn = document.getElementById('ai-switch-btn');
    const newAiBtn = aiBtn.cloneNode(true);
    aiBtn.parentNode.replaceChild(newAiBtn, aiBtn);
    newAiBtn.addEventListener('click', () => {
        resultScreen.classList.remove('active');
        updateScannerUI('IA', true);
    });
}

async function saveToHistory(scanResult) {
    if (!auth.currentUser) return;
    scanResult.id = Date.now();
    try {
        await addDoc(collection(db, "users", auth.currentUser.uid, "history"), { ...scanResult, timestamp: serverTimestamp() });
    } catch (e) { console.error("Error guardando en historial: ", e); }
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
