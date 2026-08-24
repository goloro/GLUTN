import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { collection, query, where, getDocs, getDoc, setDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

// Estado actual de la UI
let currentMode = 'login'; // 'login' o 'signup'

// Elementos DOM
const authCard = document.getElementById('auth-card');
const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const submitBtn = document.getElementById('submit-btn');
const errorMsg = document.getElementById('error-msg');
const authForm = document.getElementById('auth-form');

// Inputs
const nameInput = document.getElementById('name');
const lastNameInput = document.getElementById('last-name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');

const usernameInput = document.getElementById('username');
const emailLabel = document.getElementById('email-label');

window.switchTab = (mode) => {
    currentMode = mode;
    errorMsg.innerText = ''; // Limpiar errores

    if (mode === 'login') {
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        authCard.classList.remove('mode-signup');
        submitBtn.setAttribute('data-i18n', 'auth.login_tab');
        emailLabel.setAttribute('data-i18n', 'auth.email_or_username');
        emailInput.placeholder = 'glutn@gmail.com o @usuario';
        
        // Quitar required del signup
        nameInput.required = false;
        if (lastNameInput) lastNameInput.required = false;
        usernameInput.required = false;
        confirmPasswordInput.required = false;
    } else {
        tabLogin.classList.remove('active');
        tabSignup.classList.add('active');
        authCard.classList.add('mode-signup');
        submitBtn.setAttribute('data-i18n', 'auth.signup_tab');
        emailLabel.setAttribute('data-i18n', 'edit_profile.email'); // Reusar la key de email
        emailInput.placeholder = 'glutn@gmail.com';

        // Poner required al signup
        nameInput.required = true;
        if (lastNameInput) lastNameInput.required = true;
        usernameInput.required = true;
        confirmPasswordInput.required = true;
    }
    
    // Aplicar traducciones inmediatamente
    if (typeof window.applyTranslations === 'function') {
        window.applyTranslations(window.currentGlobalLang || 'Español');
    }
};

// Password Validation Logic
const ruleLength = document.getElementById('rule-length');
const ruleUpper = document.getElementById('rule-upper');
const ruleNumber = document.getElementById('rule-number');
const ruleSpecial = document.getElementById('rule-special');

let isPasswordValid = false;

passwordInput.addEventListener('input', () => {
    if (currentMode === 'signup') {
        const p = passwordInput.value;
        
        const hasLength = p.length >= 8;
        const hasUpper = /[A-Z]/.test(p);
        const hasNumber = /[0-9]/.test(p);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(p);

        isPasswordValid = hasLength && hasUpper && hasNumber && hasSpecial;

        updateRule(ruleLength, hasLength);
        updateRule(ruleUpper, hasUpper);
        updateRule(ruleNumber, hasNumber);
        updateRule(ruleSpecial, hasSpecial);
    } else {
        isPasswordValid = true; // No rules on login
    }
});

function updateRule(element, isValid) {
    if (!element) return;
    const icon = element.querySelector('i');
    if (isValid) {
        element.classList.remove('invalid');
        element.classList.add('valid');
        icon.className = 'ph ph-check';
    } else {
        element.classList.remove('valid');
        element.classList.add('invalid');
        icon.className = 'ph ph-x';
    }
}

// Limpiamos la clase por defecto
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.remove('no-scroll');
});

window.togglePassword = (inputId) => {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling;
    
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("ph-eye");
        icon.classList.add("ph-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("ph-eye-slash");
        icon.classList.add("ph-eye");
    }
};

window.handleAuth = async (event) => {
    event.preventDefault();
    console.log("Auth form submitted! Mode:", currentMode);
    errorMsg.innerText = '';
    window.isAuthenticating = true;
    let email = emailInput.value.trim();
    const password = passwordInput.value;

    if (currentMode === 'signup' && !isPasswordValid) {
        errorMsg.innerText = 'La contraseña no cumple con los requisitos mínimos de seguridad.';
        return;
    }

    try {
        if (currentMode === 'login') {
            console.log("Attempting login with email:", email);
            submitBtn.innerText = 'Iniciando...';
            
            // Check if input is a username (no '@' symbol)
            if (!email.includes('@')) {
                // Remove optional '@' prefix if user typed '@username'
                let searchUsername = email.startsWith('@') ? email.substring(1) : email;
                
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("username", "==", searchUsername));
                const querySnapshot = await getDocs(q);
                
                if (querySnapshot.empty) {
                    errorMsg.innerText = 'Usuario no encontrado.';
                    submitBtn.innerText = 'Log In';
                    return;
                }
                
                // Get the email from the matched user document
                email = querySnapshot.docs[0].data().email;
            }

            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = 'HTML/home.html';
        } else {
            // Sign Up
            const name = nameInput.value.trim();
            const lastName = lastNameInput ? lastNameInput.value.trim() : '';
            const username = usernameInput.value.trim().replace('@', ''); // clean username
            const confirmPassword = confirmPasswordInput.value;

            if (password !== confirmPassword) {
                errorMsg.innerText = 'Las contraseñas no coinciden.';
                return;
            }

            if (password.length < 6) {
                errorMsg.innerText = 'La contraseña debe tener al menos 6 caracteres.';
                return;
            }

            if (username.length < 3) {
                errorMsg.innerText = 'El nombre de usuario es muy corto.';
                return;
            }

            submitBtn.innerText = 'Verificando...';

            // Check if username is already taken
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                errorMsg.innerText = 'Este nombre de usuario ya está en uso.';
                submitBtn.innerText = 'Sign Up';
                return;
            }

            submitBtn.innerText = 'Registrando...';
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Actualizar nombre en Auth
            await updateProfile(userCredential.user, {
                displayName: name
            });

            // Guardar info en Firestore
            await setDoc(doc(db, "users", userCredential.user.uid), {
                uid: userCredential.user.uid,
                email: email,
                username: username,
                name: name,
                lastName: lastName,
                createdAt: serverTimestamp()
            });

            window.location.href = 'HTML/home.html';
        }
    } catch (error) {
        window.isAuthenticating = false;
        console.error("Error Auth:", error);
        submitBtn.innerText = currentMode === 'login' ? 'Log In' : 'Sign Up';
        
        switch(error.code) {
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
            case 'auth/user-not-found':
                errorMsg.innerText = 'Email, usuario o contraseña incorrectos.';
                break;
            case 'auth/email-already-in-use':
                errorMsg.innerText = 'Este email ya está registrado.';
                break;
            default:
                // Error genérico devuelto tras comprobar Firebase
                if (error.code === 'permission-denied' || error.message.includes('permission')) {
                    errorMsg.innerText = 'Error de permisos en Firebase. ¿Publicaste las reglas?';
                    alert("Error detallado Firebase: " + error.message);
                } else {
                    errorMsg.innerText = 'Ocurrió un error. Inténtalo de nuevo.';
                }
                console.error("Error exacto:", error);
        }
    }
};

window.handleGoogleLogin = async () => {
    console.log("Google login clicked!");
    errorMsg.innerText = '';
    window.isAuthenticating = true;
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("Google login successful!");
        
        // Crear documento en Firestore si no existe
        const user = result.user;
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        
        if (!docSnap.exists()) {
            // Generar un username por defecto basado en email
            const defaultUsername = user.email ? user.email.split('@')[0] : 'user' + Math.floor(Math.random() * 10000);
            
            // Separar nombre y apellidos si existen
            let firstName = user.displayName || 'Usuario';
            let lastName = '';
            if (user.displayName && user.displayName.includes(' ')) {
                const parts = user.displayName.split(' ');
                firstName = parts[0];
                lastName = parts.slice(1).join(' ');
            }

            await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                username: defaultUsername,
                name: firstName,
                lastName: lastName,
                createdAt: serverTimestamp()
            });
        }
        
        window.location.href = 'HTML/home.html';
    } catch (error) {
        window.isAuthenticating = false;
        console.error("Error Google Auth:", error);
        errorMsg.innerText = `Error Google: ${error.code || error.message}`;
    }
};

// Verificar si el usuario ya está autenticado (restaurado)
onAuthStateChanged(auth, (user) => {
    // Solo redirigir si NO estamos en medio de un proceso de auth (que maneja su propia redirección)
    if (user && !window.isAuthenticating) {
        window.location.href = 'HTML/home.html';
    }
});

// Lógica de "Contraseña Olvidada"
document.addEventListener('DOMContentLoaded', () => {
    const forgotLink = document.querySelector('.forgot-password');
    const forgotModal = document.getElementById('forgot-password-modal');
    const closeForgotModal = document.getElementById('close-forgot-modal');
    const sendResetBtn = document.getElementById('send-reset-btn');
    const forgotEmailInput = document.getElementById('forgot-email');
    const forgotMessage = document.getElementById('forgot-message');

    if (forgotLink && forgotModal) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            forgotModal.classList.add('active');
        });

        closeForgotModal.addEventListener('click', () => {
            forgotModal.classList.remove('active');
            forgotMessage.style.display = 'none';
            forgotEmailInput.value = '';
        });

        // Close on click outside
        forgotModal.addEventListener('click', (e) => {
            if (e.target === forgotModal) {
                forgotModal.classList.remove('active');
                forgotMessage.style.display = 'none';
                forgotEmailInput.value = '';
            }
        });

        sendResetBtn.addEventListener('click', async () => {
            const email = forgotEmailInput.value.trim();
            if (!email) {
                forgotMessage.innerText = "Por favor, introduce tu correo.";
                forgotMessage.style.color = "#EF4444";
                forgotMessage.style.display = "block";
                return;
            }

            const originalText = sendResetBtn.innerHTML;
            sendResetBtn.disabled = true;
            sendResetBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i>';

            try {
                await sendPasswordResetEmail(auth, email);
                forgotMessage.innerText = "¡Correo enviado! Revisa tu bandeja de entrada.";
                forgotMessage.style.color = "#10B981";
                forgotMessage.style.display = "block";
                setTimeout(() => {
                    forgotModal.classList.remove('active');
                    forgotMessage.style.display = 'none';
                    forgotEmailInput.value = '';
                }, 3000);
            } catch (error) {
                console.error("Error al restablecer contraseña:", error);
                if (error.code === 'auth/user-not-found') {
                    forgotMessage.innerText = "No hay ninguna cuenta con este correo.";
                } else if (error.code === 'auth/invalid-email') {
                    forgotMessage.innerText = "El correo no es válido.";
                } else {
                    forgotMessage.innerText = "Hubo un error al enviar el correo.";
                }
                forgotMessage.style.color = "#EF4444";
                forgotMessage.style.display = "block";
            } finally {
                sendResetBtn.disabled = false;
                sendResetBtn.innerHTML = originalText;
            }
        });
    }
});
