// Lógica del Escáner (Cámara + Gemini AI)

document.addEventListener('DOMContentLoaded', async () => {
    const video = document.getElementById('camera-stream');
    const captureBtn = document.getElementById('capture-btn');
    const canvas = document.getElementById('capture-canvas');
    const loadingScreen = document.getElementById('loading-screen');
    const resultScreen = document.getElementById('result-screen');
    const ctx = canvas.getContext('2d');

    let stream = null;

    // Pedir API Key si no existe
    let apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
        apiKey = prompt('Para usar el escáner con IA, introduce tu API Key de Gemini:');
        if (apiKey) {
            localStorage.setItem('gemini_api_key', apiKey);
        } else {
            alert('Sin API Key no se podrá analizar la imagen, pero puedes probar la captura de todos modos.');
        }
    }

    // 1. Iniciar la cámara
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' } // Preferir cámara trasera
        });
        video.srcObject = stream;
    } catch (err) {
        console.error("Error accediendo a la cámara:", err);
        alert("No se pudo acceder a la cámara. Revisa los permisos.");
    }

    // 2. Evento del botón de captura
    captureBtn.addEventListener('click', async () => {
        if (!video.videoWidth) return;

        // Mostrar pantalla de carga
        loadingScreen.classList.add('active');

        // Configurar canvas al tamaño del video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Dibujar el frame actual
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Obtener la imagen en base64 (JPEG)
        const base64Image = canvas.toDataURL('image/jpeg', 0.8);
        const base64Data = base64Image.split(',')[1]; // Quitar el 'data:image/jpeg;base64,'

        // Poner la foto capturada en el resultado
        document.getElementById('scanner-result-img').src = base64Image;

        // Llamar a Gemini
        await analyzeWithGemini(base64Data);
    });

    // 3. Función para llamar a Gemini
    async function analyzeWithGemini(base64Data) {
        const key = localStorage.getItem('gemini_api_key');
        if (!key) {
            loadingScreen.classList.remove('active');
            alert("No hay API Key configurada.");
            return;
        }

        const promptText = `
Eres un experto nutricionista especializado en intolerancias alimentarias y celiaquía.
A continuación tienes una imagen de una etiqueta de ingredientes de un producto.
Extrae los ingredientes y determina si el producto es seguro para un celíaco (gluten-free).
Busca explícitamente: trigo, cebada, centeno, avena, malta, levadura de cerveza, espelta, kamut.
Devuelve EXCLUSIVAMENTE un JSON con esta estructura (no añadas markdown ni texto fuera del JSON):
{
  "productName": "Nombre del producto (infiere de la imagen o pon 'Producto Escaneado')",
  "gluten": true (si contiene gluten) o false (si es seguro),
  "reason": "Explicación breve de por qué es o no seguro",
  "ingredientWithGluten": "El nombre exacto del primer ingrediente detectado con gluten (o null si es seguro)",
  "ingredients": [
    { "name": "Nombre ingrediente 1" },
    { "name": "Nombre ingrediente 2" }
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
                temperature: 0.1, // Baja temperatura para mayor precisión
                responseMimeType: "application/json" // Forzar JSON
            }
        };

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error("Error en la petición a Gemini");
            }

            const data = await response.json();
            const textResponse = data.candidates[0].content.parts[0].text;
            
            // Limpiar markdown residual si Gemini lo envía (```json ... ```)
            const cleanJsonStr = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            const scanResult = JSON.parse(cleanJsonStr);

            // Añadir fecha
            const now = new Date();
            const timeString = \`\${now.getHours().toString().padStart(2, '0')}:\${now.getMinutes().toString().padStart(2, '0')}\`;
            scanResult.date = timeString; // Formato simple por ahora

            // Guardar en localStorage
            saveToHistory(scanResult);

            // Mostrar Resultados
            renderResult(scanResult);

        } catch (error) {
            console.error("Error procesando imagen:", error);
            alert("Hubo un error al procesar la imagen con IA.");
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

        const isSafe = !scan.gluten;
        const badge = document.getElementById('scanner-result-badge');
        
        if (isSafe) {
            badge.className = 'verdict-banner safe';
            badge.innerHTML = \`<i class="ph-fill ph-check-circle"></i> <span data-i18n="scanner.safe">SEGURO</span>\`;
            badge.style.backgroundColor = '#0FA874';
        } else {
            badge.className = 'verdict-banner unsafe';
            badge.innerHTML = \`<i class="ph-fill ph-x-circle"></i> <span data-i18n="scanner.unsafe">No Apto</span>\`;
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

        // Aplicar traducciones a los textos nuevos (Seguro / No Apto)
        if (typeof applyTranslations === 'function') {
            const userObj = JSON.parse(localStorage.getItem('GLUTN_UserInfo')) || {};
            applyTranslations(userObj.language || 'Español');
        }

        // Mostrar pantalla de resultado
        resultScreen.classList.add('active');
    }
});
