import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { auth } from "./firebase-config.js";

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
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');

window.switchTab = (mode) => {
    currentMode = mode;
    errorMsg.innerText = ''; // Limpiar errores

    if (mode === 'login') {
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        authCard.classList.remove('mode-signup');
        submitBtn.innerText = 'Log In';
        
        // Quitar required del signup
        nameInput.required = false;
        confirmPasswordInput.required = false;
    } else {
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        authCard.classList.add('mode-signup');
        submitBtn.innerText = 'Sign Up';

        // Poner required al signup
        nameInput.required = true;
        confirmPasswordInput.required = true;
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
    errorMsg.innerText = '';
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
        if (currentMode === 'login') {
            submitBtn.innerText = 'Iniciando...';
            await signInWithEmailAndPassword(auth, email, password);
            // Login exitoso, ir a la home
            window.location.href = '../index.html';
        } else {
            // Sign Up
            const name = nameInput.value.trim();
            const confirmPassword = confirmPasswordInput.value;

            if (password !== confirmPassword) {
                errorMsg.innerText = 'Las contraseñas no coinciden.';
                return;
            }

            if (password.length < 6) {
                errorMsg.innerText = 'La contraseña debe tener al menos 6 caracteres.';
                return;
            }

            submitBtn.innerText = 'Registrando...';
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Actualizar nombre de usuario
            await updateProfile(userCredential.user, {
                displayName: name
            });

            // Registro exitoso, ir a la home
            window.location.href = '../index.html';
        }
    } catch (error) {
        console.error("Error Auth:", error);
        submitBtn.innerText = currentMode === 'login' ? 'Log In' : 'Sign Up';
        
        // Manejar errores comunes
        switch(error.code) {
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
            case 'auth/user-not-found':
                errorMsg.innerText = 'Email o contraseña incorrectos.';
                break;
            case 'auth/email-already-in-use':
                errorMsg.innerText = 'Este email ya está registrado.';
                break;
            default:
                errorMsg.innerText = 'Ocurrió un error. Inténtalo de nuevo.';
        }
    }
};

window.handleGoogleLogin = async () => {
    errorMsg.innerText = '';
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        // Login exitoso, ir a la home
        window.location.href = '../index.html';
    } catch (error) {
        console.error("Error Google Auth:", error);
        errorMsg.innerText = 'Error al iniciar sesión con Google.';
    }
};

// Verificar si el usuario ya está autenticado
auth.onAuthStateChanged((user) => {
    // Si ya está logueado y está en esta página, lo mandamos a home
    if (user) {
        window.location.href = '../index.html';
    }
});
