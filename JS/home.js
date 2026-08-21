import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', function() {
    
    // Variables globales para la página
    let currentUserDoc = null;
    let currentUid = null;

    // Escuchar estado de autenticación
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUid = user.uid;
            
            // Traer documento de usuario desde Firestore
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                currentUserDoc = docSnap.data();

                // 1. Aplicar idioma guardado si existe
                if (currentUserDoc.language && typeof window.applyTranslations === 'function') {
                    window.applyTranslations(currentUserDoc.language);
                }

                // 2. Mostrar modal de disclaimer si no lo ha visto
                checkDisclaimer(currentUserDoc);

                // 3. Cargar el último escaneo
                loadLastScan(currentUserDoc);
            } else {
                loadLastScan({});
            }
        } else {
            // No logueado
            loadLastScan({});
        }
    });

    function checkDisclaimer(userDoc) {
        const disclaimerModal = document.getElementById('disclaimer-modal');
        const disclaimerAcceptBtn = document.getElementById('disclaimer-accept-btn');
        
        if (disclaimerModal && disclaimerAcceptBtn) {
            if (!userDoc.hasSeenDisclaimer) {
                setTimeout(() => {
                    disclaimerModal.classList.add('active');
                }, 300);
            }

            disclaimerAcceptBtn.addEventListener('click', async () => {
                disclaimerModal.classList.remove('active');
                
                // Actualizar Firestore
                if (currentUid) {
                    const docRef = doc(db, "users", currentUid);
                    await updateDoc(docRef, { hasSeenDisclaimer: true });
                }
            });
        }
    }

    function loadLastScan(userDoc) {
        const container = document.getElementById('last-scan-container');
        if (!container) return;

        if (!userDoc.scans || userDoc.scans.length === 0) {
            container.innerHTML = `
                <div data-i18n="home.no_scans" style="text-align: left; color: #6B7280; font-size: 14px; padding: 12px 0;">
                    Aún no has escaneado ningún producto. ¡Anímate a probarlo!
                </div>
            `;
            if (typeof window.applyTranslations === 'function') {
                window.applyTranslations(userDoc.language || 'Español');
            }
            return;
        }

        const lastScan = userDoc.scans[userDoc.scans.length - 1];
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

        document.getElementById('last-scan-item').addEventListener('click', () => openDetail(lastScan, userDoc));
    }

    function openDetail(scan, userDoc) {
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

        document.getElementById('detail-reason-text').innerText = scan.reason || (isSafe ? "Todos los ingredientes son libres de gluten." : "Contiene ingredientes prohibidos.");

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

        if (typeof window.applyTranslations === 'function') {
            window.applyTranslations(userDoc.language || 'Español');
        }

        document.getElementById('history-detail-screen').classList.add('active');
    }

    // === MANEJO DE TARJETAS DE ESCANEO ===
    const scanEanCard = document.getElementById('scan-ean-card');
    const scanIaCard = document.getElementById('scan-ia-card');

    if (scanEanCard) {
        scanEanCard.addEventListener('click', () => {
            window.location.href = 'HTML/scanner.html?mode=EAN';
        });
    }

    if (scanIaCard) {
        scanIaCard.addEventListener('click', () => {
            window.location.href = 'HTML/scanner.html?mode=IA';
        });
    }
});
