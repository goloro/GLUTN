import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBIyEzWcqAJxOJ38rYnWsvsDX1_TFhh1YU",
    authDomain: "glutn-16493.firebaseapp.com",
    projectId: "glutn-16493",
    storageBucket: "glutn-16493.firebasestorage.app",
    messagingSenderId: "72389490623",
    appId: "1:72389490623:web:11aedc945fc1b36aa4130a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicializar y exportar los servicios para usarlos en el resto de la app
export const auth = getAuth(app);
export const db = getFirestore(app);

// Hacerlos disponibles globalmente por si hay scripts que no son módulos
window.firebaseAuth = auth;
window.firebaseDb = db;

// Global Route Protection
onAuthStateChanged(auth, (user) => {
    const currentPath = window.location.pathname;
    
    // We only want to protect app pages, not auth.html
    const isAuthPage = currentPath.includes('auth.html');
    const isTermsPage = currentPath.includes('terminos.html');
    
    if (!user && !isAuthPage && !isTermsPage) {
        // If not logged in and trying to access app pages, go to auth
        if (currentPath.includes('/HTML/')) {
            window.location.href = 'auth.html';
        } else {
            // Probably at root index.html
            window.location.href = 'HTML/auth.html';
        }
    } else if (user && isAuthPage) {
        // If logged in and on auth page, go to index
        window.location.href = '../index.html';
    }
});
