import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
    const userNameEl = document.getElementById('user-name');
    const userEmailEl = document.getElementById('user-email');
    const userAvatarEl = document.getElementById('user-avatar');
    const logoutBtn = document.getElementById('logout-btn');

    let currentUid = null;

    // Escuchar cambios en la autenticación
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUid = user.uid;
            let displayName = user.displayName || 'Usuario';
            let email = user.email || 'Sin email';
            let userLang = 'Español';
            
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    if (data.username) {
                        displayName = '@' + data.username;
                    }
                    if (data.language) {
                        userLang = data.language;
                    }
                }
            } catch(e) {
                console.error("Error fetching user data", e);
            }

            userNameEl.innerText = displayName;
            userEmailEl.innerText = email;

            let initial = 'U';
            if (displayName && displayName !== 'Usuario' && displayName !== '@Usuario') {
                initial = displayName.startsWith('@') ? displayName.charAt(1).toUpperCase() : displayName.charAt(0).toUpperCase();
            } else if (email && email !== 'Sin email') {
                initial = email.charAt(0).toUpperCase();
            }
            userAvatarEl.innerText = initial;

            // Actualizar selector de idioma
            updateLanguageSelector(userLang);
            if (typeof window.applyTranslations === 'function') {
                window.applyTranslations(userLang);
            }
            
        } else {
            userNameEl.innerText = 'Invitado';
            userEmailEl.innerText = 'Inicia sesión para guardar datos';
            userAvatarEl.innerText = '?';
        }
    });

    // Lógica para cerrar sesión
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.href = 'auth.html';
            } catch (error) {
                console.error("Error cerrando sesión: ", error);
                alert("Hubo un problema al cerrar sesión.");
            }
        });
    }

    // Configuración de idioma
    const langItem = document.getElementById('lang-setting-item');
    const langDropdown = document.getElementById('lang-dropdown');
    const currentLangText = document.getElementById('current-lang-text');
    const langOptions = document.querySelectorAll('.lang-option');

    function updateLanguageSelector(lang) {
        if (currentLangText) {
            currentLangText.innerText = lang;
            langOptions.forEach(opt => {
                if (opt.getAttribute('data-lang') === lang) {
                    opt.style.display = 'none';
                } else {
                    opt.style.display = 'block';
                }
            });
        }
    }

    if (langItem && langDropdown) {
        langItem.addEventListener('click', (e) => {
            langDropdown.classList.toggle('show');
            e.stopPropagation();
        });

        langOptions.forEach(option => {
            option.addEventListener('click', async function(e) {
                e.stopPropagation();
                const lang = this.getAttribute('data-lang');
                
                updateLanguageSelector(lang);
                langDropdown.classList.remove('show');

                // Aplicar traducción si está disponible
                if (typeof window.applyTranslations === 'function') {
                    window.applyTranslations(lang);
                }

                // Guardar en Firestore
                if (currentUid) {
                    try {
                        const docRef = doc(db, "users", currentUid);
                        await updateDoc(docRef, { language: lang });
                    } catch (error) {
                        console.error("Error guardando idioma:", error);
                    }
                }
            });
        });

        // Cerrar dropdown si se hace clic fuera
        document.addEventListener('click', () => {
            langDropdown.classList.remove('show');
        });
    }
});
