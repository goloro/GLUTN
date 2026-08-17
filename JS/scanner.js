// Lógica del Escáner (Cámara + Gemini AI)

document.addEventListener('DOMContentLoaded', async () => {
    const video = document.getElementById('camera-stream');
    const captureBtn = document.getElementById('capture-btn');
    const canvas = document.getElementById('capture-canvas');
    const loadingScreen = document.getElementById('loading-screen');
    const resultScreen = document.getElementById('result-screen');
    const ctx = canvas.getContext('2d');

    let stream = null;
    let codeReader = new ZXing.BrowserMultiFormatReader();
    let isScanningBarcode = false;
    
    // Helper de traducciones para JS
    function getT(key) {
        const userObj = JSON.parse(localStorage.getItem('GLUTN_UserInfo')) || {};
        const lang = userObj.language || 'Español';
        if (typeof Translations !== 'undefined' && Translations[key] && Translations[key][lang]) {
            return Translations[key][lang];
        }
        if (typeof Translations !== 'undefined' && Translations[key] && Translations[key]['Español']) {
            return Translations[key]['Español'];
        }
        return key; // Fallback al key
    }

    // === LÓGICA DE MODOS DE ESCANEO ===
    let currentScanMode = localStorage.getItem('scan_mode') || 'IA';
    localStorage.removeItem('scan_mode'); // Borrar para no sobrecargar
    
    const reticleIa = document.getElementById('reticle-ia');
    const reticleEan = document.getElementById('reticle-ean');
    const instructionText = document.getElementById('instruction-text');
    const modeSwitchBtn = document.getElementById('mode-switch-btn');
    const modeSwitchText = document.getElementById('mode-switch-text');
    const modeSwitchIcon = modeSwitchBtn.querySelector('i');

    function updateScannerUI(mode) {
        currentScanMode = mode;
        if (mode === 'EAN') {
            reticleIa.classList.add('reticle-hidden');
            reticleEan.classList.remove('reticle-hidden');
            instructionText.innerText = getT('scanner.focus_ean');
            modeSwitchText.innerText = getT('scanner.switch_ia');
            modeSwitchIcon.className = "ph-bold ph-scan";
            captureBtn.style.visibility = 'hidden'; // Ocultamos pero mantenemos el espacio
            startBarcodeScan();
        } else {
            reticleEan.classList.add('reticle-hidden');
            reticleIa.classList.remove('reticle-hidden');
            instructionText.innerText = getT('scanner.focus');
            modeSwitchText.innerText = getT('scanner.switch_ean');
            modeSwitchIcon.className = "ph-bold ph-barcode";
            captureBtn.style.visibility = 'visible'; // Restaurar botón
            stopBarcodeScan();
        }
    }

    // Inicializar UI después de definir todo
    // La primera llamada a updateScannerUI se hará después de inicializar la cámara

    // Botón para alternar modo
    modeSwitchBtn.addEventListener('click', () => {
        const newMode = currentScanMode === 'IA' ? 'EAN' : 'IA';
        updateScannerUI(newMode);
    });

    // 1. Iniciar la cámara
    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            video.srcObject = stream;
            
            // Iniciar decodificador continuo en segundo plano
            codeReader.decodeContinuously(video, (result, err) => {
                if (result && currentScanMode === 'EAN' && isScanningBarcode) {
                    isScanningBarcode = false;
                    handleBarcodeDetected(result.text);
                }
            });

            // Iniciar interfaz una vez tenemos el stream
            updateScannerUI(currentScanMode);
        } catch (error) {
            console.error("Error accediendo a la cámara:", error);
            showCustomDialog({
                type: 'error',
                title: getT('modal.error_camera'),
                message: getT('modal.error_camera_desc')
            });
        }
    }

    startCamera();

    // === 2. LÓGICA DE BARCODE (ZXING) ===
    function startBarcodeScan() {
        if (!stream) return;
        isScanningBarcode = true;
    }

    function stopBarcodeScan() {
        isScanningBarcode = false;
    }

    async function handleBarcodeDetected(barcode) {
        // Reproducir un pitido o dar feedback háptico si es posible
        if (navigator.vibrate) navigator.vibrate(100);
        
        loadingScreen.classList.add('active');
        
        try {
            await analyzeWithOpenFoodFacts(barcode);
        } catch (error) {
            console.error("Error analizando EAN:", error);
            showCustomDialog({
                type: 'error',
                title: getT('modal.error_network'),
                message: getT('modal.error_network_desc')
            });
            loadingScreen.classList.remove('active');
            startBarcodeScan(); // Reanudar escaneo si falla
        }
    }

    async function analyzeWithOpenFoodFacts(barcode) {
        try {
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            const data = await response.json();

            if (data.status === 0 || !data.product) {
                // Producto no encontrado
                renderResult({
                    isWarning: true,
                    reason: getT('result.not_found') + ` (EAN: ${barcode})`,
                    ingredients: [],
                    gluten: null
                });
                return;
            }

            const p = data.product;
            const labels = p.labels_tags || [];
            const allergens = p.allergens_tags || [];
            const traces = p.traces_tags || [];
            const ingredientsText = p.ingredients_text || '';

            // 1. Es seguro si tiene el label explícito
            if (labels.includes('en:gluten-free') || labels.includes('es:sin-gluten')) {
                renderResult({
                    isWarning: false,
                    gluten: false,
                    reason: getT('result.safe_cert'),
                    ingredients: [{name: p.product_name || `Producto ${barcode}`}]
                });
                return;
            }

            // 2. Es peligroso si declara alérgenos de gluten explícitos
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
                    ingredients: [{name: 'Gluten / Cereales'}, {name: p.product_name || ''}]
                });
                return;
            }

            // 3. Dudoso: Puede tener trazas o no estar certificado
            let reasonText = getT('result.warning_not_certified');
            if (traces.includes('en:gluten') || traces.includes('en:wheat')) {
                reasonText = getT('result.warning_traces');
            }

            renderResult({
                isWarning: true,
                gluten: null,
                reason: reasonText,
                ingredients: [{name: p.product_name || `Producto ${barcode}`}]
            });

        } catch (error) {
            throw error;
        }
    }

    // 2. Evento del botón de captura (Solo IA)
    captureBtn.addEventListener('click', async () => {
        if (!video.videoWidth) return;

        if (currentScanMode === 'IA') {
            let key = localStorage.getItem('gemini_api_key');
            if (!key) {
                key = await showCustomDialog({
                    type: 'prompt',
                    title: getT('modal.api_key'),
                    message: getT('modal.api_key_desc'),
                    placeholder: 'AIzaSy...'
                });
                if (key) {
                    localStorage.setItem('gemini_api_key', key);
                } else {
                    return; // Si cancela, no hacemos nada
                }
            }
        }

        // Mostrar pantalla de carga
        loadingScreen.classList.add('active');

        // Escalar la imagen para no enviar un payload gigante (máximo 800px)
        const MAX_WIDTH = 800;
        let scale = 1;
        if (video.videoWidth > MAX_WIDTH) {
            scale = MAX_WIDTH / video.videoWidth;
        }
        canvas.width = video.videoWidth * scale;
        canvas.height = video.videoHeight * scale;
        
        // Dibujar el frame actual escalado
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Obtener la imagen en base64 (JPEG) con compresión
        const base64Image = canvas.toDataURL('image/jpeg', 0.7);
        const base64Data = base64Image.split(',')[1];

        // Poner la foto capturada en el resultado
        document.getElementById('scanner-result-img').src = base64Image;

        // Llamar a Gemini
        await analyzeWithGemini(base64Data);
    });

    // 3. Función para llamar a Gemini
    async function analyzeWithGemini(base64Data) {
        let apiKey = localStorage.getItem('gemini_api_key');
        if (!apiKey) {
            loadingScreen.classList.remove('active');
            showCustomDialog({
                type: 'error',
                title: getT('modal.error_api_key'),
                message: getT('modal.error_api_key_desc')
            });
            return;
        }

        const promptText = `
Eres un experto nutricionista especializado en intolerancias alimentarias y celiaquía.
A continuación tienes una imagen de una etiqueta de ingredientes de un producto.
Extrae los ingredientes y determina si el producto es seguro para un celíaco (gluten-free).
Busca explícitamente: trigo, cebada, centeno, avena, malta, levadura de cerveza, espelta, kamut.
Devuelve EXCLUSIVAMENTE un JSON con esta estructura (no añadas markdown ni texto fuera del JSON):
{
  "productName": "Nombre del producto",
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
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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

            const now = new Date();
            const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            scanResult.date = timeString;

            saveToHistory(scanResult);
            renderResult(scanResult);

        } catch (error) {
            console.error("Error procesando imagen:", error);
            showCustomDialog({
                type: 'error',
                title: 'Error de IA',
                message: error.message || 'Hubo un problema al conectar con el servidor.'
            });
            loadingScreen.classList.remove('active');
        }
    }

    // 4. Guardar en Historial
    function saveToHistory(scanResult) {
        let userObj = JSON.parse(localStorage.getItem('GLUTN_UserInfo')) || {};
        if (!userObj.scans) {
            userObj.scans = [];
        }
        
        // Asignar ID
        scanResult.id = userObj.scans.length > 0 ? userObj.scans[userObj.scans.length - 1].id + 1 : 1;
        
        userObj.scans.push(scanResult);
        localStorage.setItem('GLUTN_UserInfo', JSON.stringify(userObj));
    }

    // 5. Renderizar Resultado en Pantalla
    function renderResult(scan) {
        loadingScreen.classList.remove('active');

        const isSafe = scan.gluten === false;
        const isWarning = scan.isWarning;
        
        const badge = document.getElementById('scanner-result-badge');
        const aiBox = document.getElementById('ai-recommendation-box');
        
        // Reset state
        aiBox.style.display = 'none';

        if (isWarning) {
            badge.className = 'verdict-banner warning';
            badge.innerHTML = `<i class="ph-fill ph-warning"></i> <span data-i18n="scanner.warning">Información Dudosa</span>`;
            badge.style.backgroundColor = '#F59E0B';
            aiBox.style.display = 'block';
        } else if (isSafe) {
            badge.className = 'verdict-banner safe';
            badge.innerHTML = `<i class="ph-fill ph-check-circle"></i> <span data-i18n="scanner.safe">SEGURO</span>`;
            badge.style.backgroundColor = '#0FA874';
        } else {
            badge.className = 'verdict-banner unsafe';
            badge.innerHTML = `<i class="ph-fill ph-x-circle"></i> <span data-i18n="scanner.unsafe">No Apto</span>`;
            badge.style.backgroundColor = '#EF4444';
        }

        // Razón
        document.getElementById('scanner-result-reason').innerText = scan.reason;

        // Lista de Ingredientes
        const ul = document.getElementById('scanner-result-ingredients');
        ul.innerHTML = '';
        if (scan.ingredients && scan.ingredients.length > 0) {
            scan.ingredients.forEach(ing => {
                const li = document.createElement('li');
                li.innerText = ing.name;
                if (ing.name === scan.ingredientWithGluten) {
                    li.className = 'unsafe-ingredient unsafe-item'; // Para aplicar el CSS rojo
                }
                ul.appendChild(li);
            });
        } else {
            ul.innerHTML = '<li>Sin información detallada de ingredientes</li>';
        }

        // Aplicar traducciones a los textos nuevos
        if (typeof applyTranslations === 'function') {
            const userObj = JSON.parse(localStorage.getItem('GLUTN_UserInfo')) || {};
            applyTranslations(userObj.language || 'Español');
        }

        // Mostrar pantalla de resultado
        resultScreen.classList.add('active');
    }

    // Botón de Recomendación IA
    document.getElementById('ai-switch-btn').addEventListener('click', () => {
        resultScreen.classList.remove('active');
        updateScannerUI('IA'); // Cambia a modo IA
    });

    // === 4. MODAL PERSONALIZADO ===
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

            // Reset
            input.value = '';
            input.style.display = 'none';
            btnCancel.style.display = 'none';
            
            // Configurar según tipo
            title.innerText = options.title || 'Aviso';
            message.innerText = options.message || '';

            if (options.type === 'error') {
                iconWrapper.className = 'custom-icon-wrapper';
                icon.className = 'ph-bold ph-warning-circle';
                btnConfirm.style.backgroundColor = '#DC2626';
            } else if (options.type === 'prompt') {
                iconWrapper.className = 'custom-icon-wrapper info';
                icon.className = 'ph-bold ph-key';
                btnConfirm.style.backgroundColor = 'var(--card-green)';
                input.style.display = 'block';
                input.placeholder = options.placeholder || '';
                btnCancel.style.display = 'block';
            } else {
                iconWrapper.className = 'custom-icon-wrapper info';
                icon.className = 'ph-bold ph-info';
                btnConfirm.style.backgroundColor = 'var(--card-green)';
            }

            // Manejadores
            const handleConfirm = () => {
                closeModal();
                resolve(options.type === 'prompt' ? input.value.trim() : true);
            };

            const handleCancel = () => {
                closeModal();
                resolve(null);
            };

            const closeModal = () => {
                modal.classList.remove('active');
                btnConfirm.removeEventListener('click', handleConfirm);
                btnCancel.removeEventListener('click', handleCancel);
            };

            btnConfirm.addEventListener('click', handleConfirm);
            btnCancel.addEventListener('click', handleCancel);

            // Mostrar modal
            modal.classList.add('active');
            if (options.type === 'prompt') {
                setTimeout(() => input.focus(), 100);
            }
        });
    }

});
