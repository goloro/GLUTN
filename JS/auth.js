import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
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
        submitBtn.innerText = 'Log In';
        emailLabel.innerText = 'Email o Nombre de usuario';
        emailInput.placeholder = 'glutn@gmail.com o @usuario';
        
        // Quitar required del signup
        nameInput.required = false;
        usernameInput.required = false;
        confirmPasswordInput.required = false;
    } else {
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        authCard.classList.add('mode-signup');
        submitBtn.innerText = 'Sign Up';
        emailLabel.innerText = 'Email';
        emailInput.placeholder = 'glutn@gmail.com';

        // Poner required al signup
        nameInput.required = true;
        usernameInput.required = true;
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
    let email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
        if (currentMode === 'login') {
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
                createdAt: serverTimestamp()
            });

            window.location.href = '../index.html';
        }
    } catch (error) {
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

