import { auth, db } from "./firebase-config.js";
import { doc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { updateProfile, updatePassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const editForm = document.getElementById('edit-profile-form');
    const usernameInput = document.getElementById('username');
    const nameInput = document.getElementById('name');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const avatar = document.getElementById('edit-avatar');
    const saveBtn = document.getElementById('save-btn');
    const statusMsg = document.getElementById('status-msg');

    let currentUserId = null;
    
    // Auth State Observer
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUserId = user.uid;
            emailInput.value = user.email;
            
            // Try to load fresh from Firestore
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    usernameInput.value = data.username || '';
                    nameInput.value = data.name || user.displayName || '';
                    lastNameInput.value = data.lastName || '';
                    
                    if (data.name) {
                        avatar.innerText = data.name.charAt(0).toUpperCase();
                    } else if (data.username) {
                        avatar.innerText = data.username.charAt(0).toUpperCase();
                    }
                } else {
                    // Fallback to Auth data
                    nameInput.value = user.displayName || '';
                    if (user.displayName) avatar.innerText = user.displayName.charAt(0).toUpperCase();
                }
            } catch (error) {
                console.error("Error loading user data:", error);
                alert("Error cargando perfil: " + error.message + "\n(Probablemente las reglas de Firestore no estén publicadas correctamente)");
                
                // Fallback to Auth data on error so they at least see something
                nameInput.value = user.displayName || '';
                if (user.displayName) avatar.innerText = user.displayName.charAt(0).toUpperCase();
            }
        } else {
            // Not logged in, redirect to auth (DESHABILITADO TEMPORALMENTE)
            // window.location.href = 'auth.html';
        }
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!currentUserId) return;

        const newUsername = usernameInput.value.trim();
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newUsername.length < 3) {
            statusMsg.style.color = '#EF4444';
            statusMsg.innerText = 'El nombre de usuario debe tener al menos 3 caracteres.';
            return;
        }

        if (newPassword || confirmPassword) {
            if (newPassword !== confirmPassword) {
                statusMsg.style.color = '#EF4444';
                statusMsg.innerText = 'Las contraseñas no coinciden.';
                return;
            }
            if (newPassword.length < 6) {
                statusMsg.style.color = '#EF4444';
                statusMsg.innerText = 'La contraseña debe tener al menos 6 caracteres.';
                return;
            }
        }

        saveBtn.disabled = true;
        saveBtn.innerText = 'Guardando...';
        statusMsg.innerText = '';

        try {
            // Update Firestore with username only, using setDoc to create if it doesn't exist
            await setDoc(doc(db, "users", currentUserId), {
                username: newUsername
            }, { merge: true });

            // If user wants to change password
            if (newPassword && auth.currentUser) {
                await updatePassword(auth.currentUser, newPassword);
            }

            // Update Avatar visually
            if (newUsername) {
                avatar.innerText = newUsername.charAt(0).toUpperCase();
            }

            statusMsg.style.color = 'var(--card-green)';
            statusMsg.innerText = 'Perfil actualizado correctamente.';
            
            // Clear password fields
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
            
            setTimeout(() => {
                statusMsg.innerText = '';
            }, 3000);

        } catch (error) {
            console.error("Error updating profile:", error);
            statusMsg.style.color = '#EF4444';
            
            // Firebase Auth requires recent login for password changes
            if (error.code === 'auth/requires-recent-login') {
                statusMsg.innerText = 'Por seguridad, debes cerrar sesión y volver a entrar para cambiar tu contraseña.';
            } else {
                statusMsg.innerText = 'Error al actualizar. Inténtalo de nuevo.';
            }
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerText = 'Guardar Cambios';
        }
    });
});
