// Lógica para el botón de idiomas en la pantalla de inicio

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const langBtn = document.getElementById('lang-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    const currentLangText = document.getElementById('current-lang');
    const langOptions = document.querySelectorAll('.lang-option');

    if (!langBtn || !langDropdown) return; // Salir si no estamos en index.html

    // Cargar el idioma guardado al iniciar la página
    let userObj = JSON.parse(localStorage.getItem('GLUTN_UserInfo')) || {};
    if (userObj.language) {
        selectLang(userObj.language);
    }
    
    // Cargar el último escaneo
    loadLastScan(userObj);

    // Toggle del menú al hacer click en el botón
    langBtn.addEventListener('click', function(e) {
        langDropdown.classList.toggle('show');
        e.stopPropagation(); // Evitar que el evento llegue a window
    });

    // Añadir eventos a las opciones
    langOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            const lang = this.getAttribute('data-lang');
            selectLang(lang);
            e.stopPropagation();
        });
    });

    // Función para renderizar el último escaneo
    function loadLastScan(user) {
        const container = document.getElementById('last-scan-container');
        if (!container) return;

        // Si no hay historial o está vacío
        if (!user.history || user.history.length === 0) {
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
        const lastScan = user.history[user.history.length - 1];
        
        // Determinar estilo en base a si es seguro o no
        const iconClass = lastScan.isSafe ? "icon-safe" : "icon-unsafe";
        const iconPh = lastScan.isSafe ? "ph-check" : "ph-x";
        const statusClass = lastScan.isSafe ? "" : "unsafe-text"; 
        // Nota: en home.css .unsafe-text no existe aún pero icon-unsafe sí. Si no existe, usamos style inline o clases genéricas.
        // En history.css sí existe. Añadiremos estilos si hace falta o los copiamos luego.

        container.innerHTML = `
            <div class="scan-item">
                <div class="${iconClass}"><i class="ph-bold ${iconPh}"></i></div>
                <div class="info">
                    <h3>${lastScan.name || 'Producto desconocido'}</h3>
                    <span class="status ${statusClass}" data-i18n="${lastScan.isSafe ? 'status.safe_short' : 'scanner.unsafe'}">${lastScan.statusText || (lastScan.isSafe ? 'Seguro' : 'NO APTO')}</span>
                </div>
                <div class="time" data-i18n="time.just_now">${lastScan.timeAgo || 'Hace un momento'}</div>
            </div>
        `;
    }

    // Función principal para seleccionar el idioma
    function selectLang(lang) {
        if (!currentLangText) return;
        
        // Cambiar el texto del botón
        currentLangText.innerText = lang;
        // Cerrar el desplegable
        langDropdown.classList.remove('show');
        
        // Ocultar la opción del idioma actual y mostrar las demás
        langOptions.forEach(opt => {
            if (opt.getAttribute('data-lang') === lang) {
                opt.style.display = 'none';
            } else {
                opt.style.display = 'block';
            }
        });

        // Guardar en el JSON de usuario en LocalStorage
        userObj = JSON.parse(localStorage.getItem('GLUTN_UserInfo')) || {};
        userObj.language = lang;
        localStorage.setItem('GLUTN_UserInfo', JSON.stringify(userObj));

        // Aplicar la traducción a la UI si la función existe (i18n.js cargado)
        if (typeof applyTranslations === 'function') {
            applyTranslations(lang);
        }
    }

    // Cerrar el menú si el usuario clica fuera de él
    window.addEventListener('click', function(event) {
        if (!event.target.closest('.language-selector')) {
            if (langDropdown.classList.contains('show')) {
                langDropdown.classList.remove('show');
            }
        }
    });
});
