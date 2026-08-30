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
    
    // Check if we are on the authentication page (which is now index.html)
    const isAuthPage = currentPath.endsWith('/') || currentPath.endsWith('index.html');
    const isTermsPage = currentPath.includes('terminos.html');
    
    if (!user && !isAuthPage && !isTermsPage) {
        // If not logged in and trying to access app pages (which are inside HTML/), go to auth (index.html)
        if (currentPath.includes('/HTML/')) {
            window.location.href = '../index.html';
        } else {
            window.location.href = 'index.html';
        }
    } else if (user && isAuthPage) {
        // If logged in and on auth page, go to home (HTML/home.html)
        if (currentPath.includes('/HTML/')) {
            window.location.href = 'home.html';
        } else {
            window.location.href = 'HTML/home.html';
        }
    }
});
