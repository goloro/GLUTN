// Lógica para el botón de idiomas en la pantalla de inicio

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const currentLangText = document.getElementById('current-lang');

    // Cargar el idioma guardado al iniciar la página
    let userObj = JSON.parse(localStorage.getItem('GLUTN_UserInfo')) || {};
    
    // Cargar el último escaneo
    loadLastScan(userObj);

    // Toggle del menú al hacer click en el botón (ELIMINADO)

    // Función para renderizar el último escaneo
    function loadLastScan(user) {
        const container = document.getElementById('last-scan-container');
        if (!container) return;

        // Si no hay historial o está vacío
        if (!user.scans || user.scans.length === 0) {
            container.innerHTML = `
                <div data-i18n="home.no_scans" style="text-align: left; color: #6B7280; font-size: 14px; padding: 12px 0;">
                    Aún no has escaneado ningún producto. ¡Anímate a probarlo!
                </div>
            `;
            if (typeof applyTranslations === 'function') {
                applyTranslations(user.language || 'Español');
            }
            return;
        }

        // Coger el último escaneo (asumiendo que el último añadido es el último del array)
        const lastScan = user.scans[user.scans.length - 1];
        
        // Determinar estilo en base a si es seguro o no
        const isSafe = !lastScan.gluten;
        const iconClass = isSafe ? "icon-safe" : "icon-unsafe";
        const iconPh = isSafe ? "ph-fill ph-check-circle" : "ph-fill ph-x-circle";
        const statusClass = isSafe ? "" : "unsafe-text"; 

        container.innerHTML = `
            <div class="scan-item" id="last-scan-item" style="cursor: pointer;">
                <div class="${iconClass}"><i class="${iconPh}"></i></div>
                <div class="info">
                    <h3>${lastScan.productName || 'Producto desconocido'}</h3>
                    <span class="status ${statusClass}" data-i18n="${isSafe ? 'status.safe' : 'scanner.unsafe'}">${lastScan.statusText || (isSafe ? '100% Seguro' : 'No Apto')}</span>
                </div>
                <div class="time" data-i18n="time.just_now">${lastScan.date || 'Hace un momento'}</div>
            </div>
        `;

        document.getElementById('last-scan-item').addEventListener('click', () => openDetail(lastScan));
    }

    function openDetail(scan) {
        document.getElementById('detail-title').innerText = scan.productName || 'Producto';
        document.getElementById('detail-time').innerText = scan.date || 'Reciente';
        
        const isSafe = !scan.gluten;
        const badge = document.getElementById('detail-badge');
        if (isSafe) {
            badge.innerHTML = `<i class="ph-fill ph-check-circle"></i> <span data-i18n="scanner.safe">SEGURO</span>`;
            badge.style.backgroundColor = '#0FA874';
            badge.style.color = '#FFFFFF';
        } else {
            badge.innerHTML = `<i class="ph-fill ph-x-circle"></i> <span data-i18n="scanner.unsafe">No Apto</span>`;
            badge.style.backgroundColor = '#EF4444';
            badge.style.color = '#FFFFFF';
        }

        // Explicación
        document.getElementById('detail-reason-text').innerText = scan.reason || (isSafe ? "Todos los ingredientes son libres de gluten." : "Contiene ingredientes prohibidos.");

        // Lista de Ingredientes
        const ul = document.getElementById('detail-ingredients-list');
        ul.innerHTML = '';
        if (scan.ingredients && scan.ingredients.length > 0) {
            scan.ingredients.forEach(ing => {
                const li = document.createElement('li');
                li.innerText = ing.name;
                if (ing.name === scan.ingredientWithGluten) {
                    li.className = 'unsafe-item';
                }
                ul.appendChild(li);
            });
        } else {
            ul.innerHTML = '<li>Sin información detallada de ingredientes</li>';
        }

        if (typeof applyTranslations === 'function') {
            applyTranslations(userObj.language || 'Español');
        }

        document.getElementById('history-detail-screen').classList.add('active');
    }

    if (userObj.language && typeof applyTranslations === 'function') {
        applyTranslations(userObj.language);
    }

    // === 3. MANEJO DE TARJETAS DE ESCANEO ===
    const scanEanCard = document.getElementById('scan-ean-card');
    const scanIaCard = document.getElementById('scan-ia-card');

    if (scanEanCard) {
        scanEanCard.addEventListener('click', () => {
            localStorage.setItem('scan_mode', 'EAN');
            window.location.href = 'HTML/scanner.html';
        });
    }

    if (scanIaCard) {
        scanIaCard.addEventListener('click', () => {
            localStorage.setItem('scan_mode', 'IA');
            window.location.href = 'HTML/scanner.html';
        });
    }



    // === 4. DISCLAIMER MODAL ===
    const disclaimerModal = document.getElementById('disclaimer-modal');
    const disclaimerAcceptBtn = document.getElementById('disclaimer-accept-btn');
    
    if (disclaimerModal && disclaimerAcceptBtn) {
        // Mostrar modal si es la primera vez
        if (!userObj.hasSeenDisclaimer) {
            setTimeout(() => {
                disclaimerModal.classList.add('active');
            }, 300);
        }

        disclaimerAcceptBtn.addEventListener('click', () => {
            disclaimerModal.classList.remove('active');
            userObj.hasSeenDisclaimer = true;
            localStorage.setItem('GLUTN_UserInfo', JSON.stringify(userObj));
        });
    }
});
