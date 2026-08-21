import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
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
    
    // Re-aplicar traducciones si están cargadas
    if (typeof window.applyTranslations === 'function') {
        window.applyTranslations(window.currentGlobalLang || 'Español');
    }
};

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
            window.location.href = '../index.html';
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

            window.location.href = '../index.html';
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
        
        window.location.href = '../index.html';
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
        window.location.href = '../index.html';
    }
});
