import { db, auth } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

// DOM Elements
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
const customModal = document.getElementById('custom-modal');

// Translation helper
function getT(key) {
    if (typeof window.getTranslation === 'function') {
        return window.getTranslation(key);
    }
    return key;
}

// ---------------------------------------------------------
// 1. BARCODE SCANNER CLASS
// ---------------------------------------------------------
class EANScanner {
    constructor(videoElement, onDetected) {
        this.video = videoElement;
        this.onDetected = onDetected;
        this.isScanning = false;
        this.isDecoding = false;
        
        // Setup detectors
        this.zxing = new ZXing.BrowserMultiFormatReader();
        this.native = null;
        if ('BarcodeDetector' in window) {
            try {
                this.native = new BarcodeDetector();
            } catch(e) { console.warn('Native BarcodeDetector not fully supported.'); }
        }
        
        // Pre-allocate canvas for performance fallback
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    }

    start() {
        if (this.isScanning) return;
        this.isScanning = true;
        this.isDecoding = false;
        this.loop();
    }

    stop() {
        this.isScanning = false;
        this.isDecoding = false;
    }

    async loop() {
        if (!this.isScanning) return;
        if (this.isDecoding) return;
        
        // Skip if video isn't rendering yet
        if (this.video.videoWidth === 0 || this.video.videoHeight === 0) {
            setTimeout(() => this.loop(), 200);
            return;
        }

        this.isDecoding = true;

        try {
            // Promise wrapper to prevent hanging!
            const result = await Promise.race([
                this.detectBarcode(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 800))
            ]);

            if (result && this.isScanning) {
                this.isScanning = false;
                this.isDecoding = false;
                this.onDetected(result);
                return; // Stop loop, we found it!
            }
        } catch (e) {
            // Timeout or detection error, ignore and continue
        }

        this.isDecoding = false;
        if (this.isScanning) {
            setTimeout(() => this.loop(), 150);
        }
    }

    async detectBarcode() {
        // 1. Try Native BarcodeDetector (iOS 17+ / Android)
        if (this.native) {
            try {
                const barcodes = await this.native.detect(this.video);
                if (barcodes.length > 0) return barcodes[0].rawValue;
            } catch (e) {}
        }

        // 2. Fallback to ZXing using video directly (fixes TypeError from canvas)
        try {
            const result = await this.zxing.decodeFromVideoElement(this.video);
            if (result) return result.text;
        } catch (e) {
            return null; // NotFoundException is normal
        }
        
        return null;
    }
}

// ---------------------------------------------------------
// 2. IA SCANNER CLASS
// ---------------------------------------------------------
class IAScanner {
    constructor(videoElement, captureCanvas, onCaptured) {
        this.video = videoElement;
        this.canvas = captureCanvas;
        this.ctx = captureCanvas.getContext('2d', { willReadFrequently: true });
        this.onCaptured = onCaptured;
    }

    async captureAndAnalyze() {
        if (!this.video.videoWidth) return;

        // Calculate exact crop to match object-fit: cover
        const vw = this.video.videoWidth;
        const vh = this.video.videoHeight;
        const cw = this.video.clientWidth;
        const ch = this.video.clientHeight;

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

        // Scale down to max 800px to save payload size
        const MAX_WIDTH = 800;
        let scale = 1;
        if (sourceWidth > MAX_WIDTH) {
            scale = MAX_WIDTH / sourceWidth;
        }
        
        this.canvas.width = sourceWidth * scale;
        this.canvas.height = sourceHeight * scale;
        
        this.ctx.drawImage(this.video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, this.canvas.width, this.canvas.height);
        
        const base64Image = this.canvas.toDataURL('image/jpeg', 0.7);
        const base64Data = base64Image.split(',')[1];

        this.onCaptured(base64Image, base64Data);
    }
}

// ---------------------------------------------------------
// 3. MAIN CONTROLLER
// ---------------------------------------------------------
let stream = null;
let currentScanMode = new URLSearchParams(window.location.search).get('mode') || 'EAN';
let lastScannedBarcode = null;

const eanScanner = new EANScanner(video, async (barcode) => {
    // TRIGGERED WHEN BARCODE FOUND
    if (navigator.vibrate) navigator.vibrate(100);
    lastScannedBarcode = barcode;
    loadingScreen.classList.add('active');
    
    try {
        await analyzeWithOpenFoodFacts(barcode);
    } catch (error) {
        console.error("Network Error:", error);
        showCustomDialog({
            type: 'error',
            title: getT('modal.error_network'),
            message: getT('modal.error_network_desc')
        });
        loadingScreen.classList.remove('active');
        eanScanner.start(); // Resume
    }
});

const iaScanner = new IAScanner(video, captureCanvas, async (base64Image, base64Data) => {
    // TRIGGERED WHEN PHOTO TAKEN
    document.getElementById('scanner-result-img').src = base64Image;
    loadingScreen.classList.add('active');
    await analyzeWithGemini(base64Data);
});


// Camera Initialization
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        video.setAttribute('playsinline', 'true');
        video.srcObject = stream;
        
        await new Promise((resolve) => {
            if (video.readyState >= 2) {
                video.play().then(resolve).catch(resolve);
            } else {
                video.onloadedmetadata = () => {
                    video.play().then(resolve).catch(resolve);
                };
            }
        });
        
        updateScannerUI(currentScanMode);
    } catch (error) {
        console.error("Camera Error:", error);
        showCustomDialog({
            type: 'error',
            title: getT('modal.error_camera'),
            message: getT('modal.error_camera_desc')
        });
    }
}

function updateScannerUI(mode, keepBarcode = false) {
    if (!keepBarcode) {
        lastScannedBarcode = null;
    }

    currentScanMode = mode;
    if (mode === 'EAN') {
        reticleIa.classList.add('reticle-hidden');
        reticleEan.classList.remove('reticle-hidden');
        instructionText.setAttribute('data-i18n', 'scanner.focus_ean');
        modeSwitchText.setAttribute('data-i18n', 'home.scan_ia');
        modeSwitchIcon.className = "ph-bold ph-scan";
        captureBtn.style.display = 'none';
        
        eanScanner.start();
    } else {
        reticleEan.classList.add('reticle-hidden');
        reticleIa.classList.remove('reticle-hidden');
        instructionText.setAttribute('data-i18n', 'scanner.focus');
        modeSwitchText.setAttribute('data-i18n', 'home.scan_ean');
        modeSwitchIcon.className = "ph-bold ph-barcode";
        captureBtn.style.display = 'flex';
        
        eanScanner.stop();
    }
    
    // Aplicar traducción inmediatamente
    if (typeof window.applyTranslations === 'function') {
        window.applyTranslations(localStorage.getItem('glutn_lang') || 'es');
    }
}

modeSwitchBtn.addEventListener('click', () => {
    updateScannerUI(currentScanMode === 'IA' ? 'EAN' : 'IA');
});

captureBtn.addEventListener('click', () => {
    iaScanner.captureAndAnalyze();
});

// Start everything
startCamera();

window.addEventListener('beforeunload', () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    eanScanner.stop();
});

// ---------------------------------------------------------
// 4. API CALLS & RENDERING (OpenFoodFacts & Gemini)
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
    const categories = p.categories_tags || [];
    const productName = (p.product_name || '').toLowerCase();
    
    const rawProductName = p.product_name || '';
    const rawBrand = p.brands || '';
    const displayName = rawBrand ? `${rawProductName} - ${rawBrand}` : rawProductName;

    let ingredientsList = [];
    if (p.ingredients && Array.isArray(p.ingredients)) {
        ingredientsList = p.ingredients;
    }

    const mappedIngredients = ingredientsList.map(i => ({
        name: i.text || i.id || ''
    })).filter(i => i.name.trim() !== '');

    if (mappedIngredients.length === 0 && ingredientsText) {
        mappedIngredients.push({ name: ingredientsText });
    }

    if (
        labels.includes('en:gluten-free') || 
        labels.includes('es:sin-gluten') ||
        analysisTags.includes('en:gluten-free')
    ) {
        renderResult({
            isWarning: false,
            gluten: false,
            reason: getT('result.safe_certified'),
            ingredients: mappedIngredients,
            imageUrl: p.image_url || p.image_front_url || null,
            barcode: barcode,
            productName: displayName
        });
        return;
    }

    if (
        allergens.includes('en:gluten') || 
        allergens.includes('en:wheat') || 
        allergens.includes('en:barley') || 
        allergens.includes('en:oats') || 
        allergens.includes('en:rye')
    ) {
        renderResult({
            isWarning: false,
            gluten: true,
            reason: getT('result.unsafe_allergens'),
            ingredientWithGluten: 'Gluten / Cereales',
            ingredients: mappedIngredients,
            imageUrl: p.image_url || p.image_front_url || null,
            barcode: barcode,
            productName: displayName
        });
        return;
    }

    let reasonText = getT('result.warning_not_certified');
    if (traces.includes('en:gluten') || traces.includes('en:wheat')) {
        reasonText = getT('result.warning_traces');
    }

    renderResult({
        isWarning: true,
        gluten: null,
        reason: reasonText,
        ingredients: mappedIngredients,
        imageUrl: p.image_url || p.image_front_url || null,
        barcode: barcode,
        productName: displayName
    });
}

async function analyzeWithGemini(base64Data) {
    let userObj = JSON.parse(localStorage.getItem('GLUTN_UserInfo')) || {};
    let userLang = userObj.language || 'Español';

    const promptText = `
Eres un experto nutricionista especializado en intolerancias alimentarias y celiaquía.
A continuación tienes una imagen de una etiqueta. 
IMPORTANTE: El idioma principal del usuario es ${userLang}. Debes TRADUCIR todos los nombres de los ingredientes, el nombre del producto y la explicación al ${userLang}, independientemente del idioma en el que esté escrita la etiqueta original.

1. Primero, verifica si en la imagen aparece una lista de ingredientes o etiqueta de un producto alimenticio.
2. Si NO detectas ninguna etiqueta legible o no parece un alimento, devuelve EXCLUSIVAMENTE este JSON:
{
  "error": "no_label_detected",
  "reason": "No he podido detectar una lista de ingredientes clara. Por favor, asegúrate de enfocar bien la etiqueta y repite la foto."
}
3. Si SÍ hay una etiqueta, extrae los ingredientes (traducidos al ${userLang}) y determina si el producto es seguro para un celíaco (gluten-free). Busca explícitamente: trigo, cebada, centeno, avena, malta, levadura de cerveza, espelta, kamut.
Devuelve EXCLUSIVAMENTE un JSON con esta estructura (no añadas markdown ni texto fuera del JSON):
{
  "productName": "Nombre del producto - Nombre de la marca (si no logras deducir la marca de la foto, pon solo el nombre del producto. Si no ves ninguno, pon 'Producto detectado')",
  "gluten": true (si contiene gluten explícito) o false (si es seguro),
  "isWarning": true (si tienes dudas, información ilegible o dice "puede contener trazas de gluten") o false,
  "reason": "Explicación breve",
  "ingredientWithGluten": "El nombre exacto del primer ingrediente detectado con gluten (o null si es seguro)",
  "ingredients": [
    { "name": "Ingrediente 1" }
  ]
}
`;

    const requestBody = {
        contents: [{
            parts: [
                { text: promptText },
                {
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: base64Data
                    }
                }
            ]
        }],
        generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json"
        }
    };

    try {
        const response = await fetch(`/api/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || "Error HTTP " + response.status);
        }

        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;
        
        const cleanJsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const scanResult = JSON.parse(cleanJsonStr);

        if (lastScannedBarcode) {
            scanResult.barcode = lastScannedBarcode;
        }

        if (scanResult.error === 'no_label_detected') {
            showCustomDialog({
                type: 'error',
                title: 'No se detectó etiqueta',
                message: scanResult.reason || 'No he podido detectar una lista de ingredientes clara. Por favor, asegúrate de enfocar bien la etiqueta y repite la foto.'
            });
            loadingScreen.classList.remove('active');
            return;
        }

        renderResult(scanResult);

    } catch (error) {
        console.error("Error procesando imagen:", error);
        showCustomDialog({
            type: 'error',
            title: 'Error en el análisis',
            message: 'No pudimos procesar la imagen correctamente. Asegúrate de que la foto se vea nítida e inténtalo de nuevo.'
        });
        loadingScreen.classList.remove('active');
    }
}

// 5. Render Result & Save to History
function renderResult(scan) {
    loadingScreen.classList.remove('active');

    if (!scan.date) {
        const now = new Date();
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        scan.date = `${day}/${month}/${year} ${hours}:${minutes}`;
        saveToHistory(scan);
    }

    if (scan.imageUrl) {
        document.getElementById('scanner-result-img').src = scan.imageUrl;
    } else if (currentScanMode === 'EAN' && !document.getElementById('scanner-result-img').src.startsWith('data:')) {
        document.getElementById('scanner-result-img').src = '../Images/Logos/Glutn_Logo-ShortIcon.PNG';
    }

    const isNotFound = scan.isNotFound === true;
    const isSafe = scan.gluten === false;
    const isWarning = scan.isWarning && !isNotFound;
    
    const badge = document.getElementById('scanner-result-badge');
    const aiBox = document.getElementById('ai-recommendation-box');
    const offEditBox = document.getElementById('off-edit-box');
    const offEditBtn = document.getElementById('off-edit-btn');
    const aiWarningHeader = aiBox.querySelector('.ai-warning-header');
    const aiWarningText = aiBox.querySelector('.ai-warning-text');
    
    aiBox.style.display = 'none';
    if (offEditBox) offEditBox.style.display = 'none';

    if (isNotFound) {
        badge.className = 'verdict-banner';
        badge.innerHTML = `<i class="ph-bold ph-question"></i> <span data-i18n="result.not_found">Producto no encontrado</span>`;
        badge.style.backgroundColor = '#6B7280';
        
        aiBox.style.display = 'block';
        aiWarningHeader.innerHTML = `<i class="ph-bold ph-magnifying-glass"></i> <span data-i18n="scanner.not_found_title">Producto Desconocido</span>`;
        aiWarningText.setAttribute('data-i18n', 'scanner.not_found_desc');
        aiWarningText.innerText = getT('scanner.not_found_desc');
        
    } else if (isWarning) {
        badge.className = 'verdict-banner warning';
        badge.innerHTML = `<i class="ph-bold ph-warning"></i> <span data-i18n="result.caution">Precaución</span>`;
        
        aiBox.style.display = 'block';
        aiWarningHeader.innerHTML = `<i class="ph-bold ph-warning"></i> <span data-i18n="scanner.warning">Información Dudosa</span>`;
        aiWarningText.setAttribute('data-i18n', 'scanner.warning_desc');
        aiWarningText.innerText = getT('scanner.warning_desc');
        
        if (scan.barcode) {
            if (offEditBox) {
                offEditBox.style.display = 'block';
                offEditBtn.onclick = () => {
                    window.open(`https://world.openfoodfacts.org/cgi/product.pl?type=edit&code=${scan.barcode}`, '_blank');
                };
            }
        }
    } else if (isSafe) {
        badge.className = 'verdict-banner safe';
        badge.innerHTML = `<i class="ph-bold ph-check-circle"></i> <span data-i18n="result.safe">Apto para Celíacos</span>`;
    } else {
        badge.className = 'verdict-banner danger';
        badge.innerHTML = `<i class="ph-bold ph-x-circle"></i> <span data-i18n="result.not_safe">Contiene Gluten</span>`;
    }

    const reasonEl = document.getElementById('scanner-result-reason');
    if (scan.ingredientWithGluten) {
        reasonEl.innerHTML = `${scan.reason} <br><strong>Ingrediente detectado: <span style="color:#ef4444">${scan.ingredientWithGluten}</span></strong>`;
    } else {
        reasonEl.innerText = scan.reason;
    }

    const ul = document.getElementById('scanner-result-ingredients');
    ul.innerHTML = '';
    
    if (scan.ingredients && scan.ingredients.length > 0) {
        scan.ingredients.forEach(ing => {
            const li = document.createElement('li');
            li.innerText = ing.name;
            if (scan.ingredientWithGluten && ing.name.toLowerCase().includes(scan.ingredientWithGluten.toLowerCase())) {
                li.style.color = '#ef4444';
                li.style.fontWeight = 'bold';
            }
            ul.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.innerText = getT('scanner.no_ingredients');
        ul.appendChild(li);
    }

    // Traducir los textos dinámicos generados
    if (typeof window.applyTranslations === 'function') {
        window.applyTranslations(localStorage.getItem('glutn_lang') || 'es');
    }

    resultScreen.classList.add('active');
    
    // Configurar botón de IA
    const aiSwitchBtn = document.getElementById('ai-switch-btn');
    const oldAiSwitchBtn = aiSwitchBtn.cloneNode(true);
    aiSwitchBtn.parentNode.replaceChild(oldAiSwitchBtn, aiSwitchBtn);
    
    oldAiSwitchBtn.addEventListener('click', () => {
        resultScreen.classList.remove('active');
        updateScannerUI('IA', true);
    });
}

// 6. Save to History
async function saveToHistory(scanResult) {
    if (!auth.currentUser) return;

    scanResult.id = Date.now();
    
    try {
        await addDoc(collection(db, "users", auth.currentUser.uid, "history"), {
            ...scanResult,
            timestamp: serverTimestamp()
        });
    } catch (e) {
        console.error("Error guardando en historial: ", e);
    }
}

// 7. CUSTOM MODAL LOGIC
function showCustomDialog(options) {
    return new Promise((resolve) => {
        const modal = document.getElementById('custom-modal');
        const iconWrapper = document.getElementById('custom-modal-icon');
        const icon = iconWrapper.querySelector('i');
        const title = document.getElementById('custom-modal-title');
        const message = document.getElementById('custom-modal-message');
        const input = document.getElementById('custom-modal-input');
        const btnCancel = document.getElementById('custom-modal-cancel');
        const btnConfirm = document.getElementById('custom-modal-confirm');

        input.value = '';
        input.style.display = 'none';
        btnCancel.style.display = 'none';
        
        iconWrapper.className = 'custom-icon-wrapper';
        if (options.type === 'error') {
            iconWrapper.classList.add('error');
            icon.className = 'ph-bold ph-warning-circle';
        } else if (options.type === 'success') {
            iconWrapper.classList.add('success');
            icon.className = 'ph-bold ph-check-circle';
        } else {
            iconWrapper.classList.add('info');
            icon.className = 'ph-bold ph-info';
        }

        title.innerText = options.title || 'Aviso';
        message.innerText = options.message || '';

        if (options.showInput) {
            input.style.display = 'block';
            input.placeholder = options.inputPlaceholder || '';
        }

        if (options.showCancel) {
            btnCancel.style.display = 'inline-block';
            btnCancel.onclick = () => {
                modal.classList.remove('active');
                resolve({ confirmed: false });
            };
        }

        btnConfirm.onclick = () => {
            modal.classList.remove('active');
            resolve({ 
                confirmed: true,
                value: options.showInput ? input.value : null
            });
        };

        modal.classList.add('active');
        if (options.showInput) {
            input.focus();
        }
    });
}
