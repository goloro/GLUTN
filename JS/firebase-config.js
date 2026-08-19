import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
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
