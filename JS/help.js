import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const msgInput = document.getElementById('contact-msg');
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const statusMsg = document.getElementById('status-msg');

    // 1. Obtener el email del usuario logueado
    onAuthStateChanged(auth, (user) => {
        if (user) {
            emailInput.value = user.email;
        } else {
            // Si no está logueado por lo que sea, habilitar para que lo escriba
            emailInput.disabled = false;
        }
    });

            // 1.5. Lógica del Custom Select
    const customSelect = document.getElementById('custom-select');
    const customSelectText = document.getElementById('custom-select-text');
    const customSelectOptions = document.getElementById('custom-select-options');
    const options = document.querySelectorAll('.custom-option');

    customSelect.addEventListener('click', () => {
        customSelect.classList.toggle('active');
        customSelectOptions.classList.toggle('show');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            subjectInput.value = option.getAttribute('data-value');
            customSelectText.innerText = option.innerText;
            customSelectText.style.color = 'var(--text-dark)';
            customSelect.classList.remove('active');
            customSelectOptions.classList.remove('show');
            subjectInput.dispatchEvent(new Event('change'));
        });
    });

    document.addEventListener('click', (e) => {
        if (!document.getElementById('subject-wrapper').contains(e.target)) {
            customSelect.classList.remove('active');
            customSelectOptions.classList.remove('show');
        }
    });

    // 2. Manejar el envío del formulario usando Web3Forms (Gratis y sin backend)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const subject = subjectInput.value;
        const message = msgInput.value.trim();

        if (!email || !subject || !message) return;

        // Mostrar estado de carga
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Enviando...';
        statusMsg.style.display = 'none';

        try {
            // Documentación: https://docs.web3forms.com/how-to-guides/js-frameworks/javascript
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    // SUSTITUYE ESTA CLAVE POR LA TUYA DE WEB3FORMS (https://web3forms.com/)
                    access_key: "04fb9e0c-af41-4a9a-91d2-309fd61df792", 
                    email: email,
                    subject: "[GLUTN App] - " + subject,
                    message: message
                })
            });

            const result = await response.json();

            if (response.status === 200) {
                statusMsg.innerText = "¡Mensaje enviado con éxito! Te responderemos pronto.";
                statusMsg.className = 'status-msg status-success';
                statusMsg.style.display = 'block';
                form.reset();
                if (auth.currentUser) emailInput.value = auth.currentUser.email; // Restaurar email
            } else {
                console.error(result);
                statusMsg.innerText = "Hubo un error al enviar. Revisa la consola o asegúrate de haber puesto tu Access Key.";
                statusMsg.className = 'status-msg status-error';
                statusMsg.style.display = 'block';
            }
        } catch (error) {
            console.error("Error enviando email:", error);
            statusMsg.innerText = "Error de conexión. Inténtalo de nuevo más tarde.";
            statusMsg.className = 'status-msg status-error';
            statusMsg.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
});



