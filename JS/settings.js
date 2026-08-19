import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { auth } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
    const userNameEl = document.getElementById('user-name');
    const userEmailEl = document.getElementById('user-email');
    const userAvatarEl = document.getElementById('user-avatar');
    const logoutBtn = document.getElementById('logout-btn');

    // Escuchar cambios en la autenticación
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Usuario logueado
            const displayName = user.displayName || 'Usuario';
            const email = user.email || 'Sin email';

            userNameEl.innerText = displayName;
            userEmailEl.innerText = email;

            // Obtener inicial para el avatar
            let initial = 'U';
            if (displayName && displayName !== 'Usuario') {
                initial = displayName.charAt(0).toUpperCase();
            } else if (email && email !== 'Sin email') {
                initial = email.charAt(0).toUpperCase();
            }
            userAvatarEl.innerText = initial;
            
        } else {
            // No hay usuario, opcionalmente redirigir a auth
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
                // Borrar datos locales si los hubiera
                localStorage.removeItem('GLUTN_UserInfo');
                // Redirigir a login
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

    // Cargar idioma actual
    let userObj = JSON.parse(localStorage.getItem('GLUTN_UserInfo')) || {};
    if (userObj.language && currentLangText) {
        currentLangText.innerText = userObj.language;
        // Ocultar opción actual
        langOptions.forEach(opt => {
            if (opt.getAttribute('data-lang') === userObj.language) {
                opt.style.display = 'none';
            } else {
                opt.style.display = 'block';
            }
        });
    }

    if (langItem && langDropdown) {
        langItem.addEventListener('click', (e) => {
            langDropdown.classList.toggle('show');
            e.stopPropagation();
        });

        langOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                const lang = this.getAttribute('data-lang');
                
                // Actualizar UI
                currentLangText.innerText = lang;
                langDropdown.classList.remove('show');
                
                langOptions.forEach(opt => {
                    if (opt.getAttribute('data-lang') === lang) {
                        opt.style.display = 'none';
                    } else {
                        opt.style.display = 'block';
                    }
                });

                // Guardar
                userObj.language = lang;
                localStorage.setItem('GLUTN_UserInfo', JSON.stringify(userObj));

                // Aplicar traducción si está disponible
                if (typeof applyTranslations === 'function') {
                    applyTranslations(lang);
                }
                
                e.stopPropagation();
            });
        });

        // Cerrar dropdown si se hace clic fuera
        document.addEventListener('click', () => {
            langDropdown.classList.remove('show');
        });
    }
});
