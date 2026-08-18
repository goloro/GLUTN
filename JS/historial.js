document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('history-list-container');
    const clearBtn = document.getElementById('clear-history-btn');
    const clearContainer = document.getElementById('clear-history-container');
    
    let userObj = JSON.parse(localStorage.getItem('GLUTN_UserInfo')) || {};
    
    function renderHistory() {
        if (!userObj.scans || userObj.scans.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: #6B7280; margin-top: 40px; padding: 0 20px;">
                    <i class="ph ph-clock-counter-clockwise" style="font-size: 48px; color: #D1D5DB; margin-bottom: 16px; display: block;"></i>
                    <p data-i18n="home.no_scans">Aún no has escaneado ningún producto. ¡Anímate a probarlo!</p>
                </div>
            `;
            if (clearContainer) clearContainer.style.display = 'none';
            if (typeof applyTranslations === 'function') {
                applyTranslations(userObj.language || 'Español');
            }
            return;
        }

        container.innerHTML = '';
        if (clearContainer) clearContainer.style.display = 'block';

        // Recorrer historial al revés para mostrar el más reciente primero
        [...userObj.scans].reverse().forEach((scan, index) => {
            const isSafe = !scan.gluten;
            const iconClass = isSafe ? "icon-safe" : "icon-unsafe";
            const iconPh = isSafe ? "ph-fill ph-check-circle" : "ph-fill ph-x-circle";
            const statusClass = isSafe ? "" : "unsafe-text";
            
            // Creamos el div
            const itemDiv = document.createElement('div');
            itemDiv.className = 'scan-item history-item';
            itemDiv.style.cursor = 'pointer'; // Indicador visual de que es clicable
            
            // Último elemento sin borde
            if (index === userObj.scans.length - 1) {
                itemDiv.classList.add('no-border');
            }

            itemDiv.innerHTML = `
                <div class="${iconClass}"><i class="${iconPh}"></i></div>
                <div class="info">
                    <h3>${scan.productName || 'Producto desconocido'}</h3>
                    <span class="status ${statusClass}" data-i18n="${isSafe ? 'status.safe' : 'scanner.unsafe'}">
                        ${scan.statusText || (isSafe ? '100% Seguro' : 'No Apto')}
                    </span>
                </div>
                <div class="time">${scan.date || 'Hace un momento'}</div>
            `;

            // Evento click para abrir el detalle
            itemDiv.addEventListener('click', () => openDetail(scan));
            
            container.appendChild(itemDiv);
        });

        if (typeof applyTranslations === 'function') {
            applyTranslations(userObj.language || 'Español');
        }
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

        // Aplicar traducciones a los badges que acabamos de inyectar
        if (typeof applyTranslations === 'function') {
            applyTranslations(userObj.language || 'Español');
        }

        document.getElementById('history-detail-screen').classList.add('active');
    }

    // Modal de Confirmación
    const confirmModal = document.getElementById('confirm-modal');
    const confirmCancelBtn = document.getElementById('confirm-cancel-btn');
    const confirmYesBtn = document.getElementById('confirm-yes-btn');

    // Botón principal de borrar historial
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if(confirmModal) confirmModal.classList.add('active');
        });
    }

    if(confirmCancelBtn) {
        confirmCancelBtn.addEventListener('click', () => {
            confirmModal.classList.remove('active');
        });
    }

    if(confirmYesBtn) {
        confirmYesBtn.addEventListener('click', () => {
            userObj.scans = [];
            localStorage.setItem('GLUTN_UserInfo', JSON.stringify(userObj));
            renderHistory();
            confirmModal.classList.remove('active');
        });
    }

    // Inicializar
    renderHistory();
});
