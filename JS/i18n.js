// Enum de Idiomas Soportados
const Languages = {
    ES: 'Español',
    EN: 'English',
    FR: 'Français',
    DE: 'Deutsch',
    IT: 'Italiano'
};

// Diccionario de Traducciones
const Translations = {
    // ---- index.html ----
    "home.scan_title": {
        [Languages.ES]: "Escanear Etiqueta",
        [Languages.EN]: "Scan Label",
        [Languages.FR]: "Scanner l'étiquette",
        [Languages.DE]: "Etikett scannen",
        [Languages.IT]: "Scansiona Etichetta"
    },
    "home.scan_subtitle": {
        [Languages.ES]: "Comprueba instantáneamente<br>si un producto es seguro para ti.",
        [Languages.EN]: "Check instantly<br>if a product is safe for you.",
        [Languages.FR]: "Vérifiez instantanément<br>si un produit est sûr pour vous.",
        [Languages.DE]: "Prüfen Sie sofort,<br>ob ein Produkt sicher für Sie ist.",
        [Languages.IT]: "Controlla all'istante<br>se un prodotto è sicuro per te."
    },
    "home.open_scanner": {
        [Languages.ES]: "Abrir Scanner",
        [Languages.EN]: "Open Scanner",
        [Languages.FR]: "Ouvrir le scanner",
        [Languages.DE]: "Scanner öffnen",
        [Languages.IT]: "Apri Scanner"
    },
    "home.last_scan": {
        [Languages.ES]: "Último escaneo",
        [Languages.EN]: "Last scan",
        [Languages.FR]: "Dernière analyse",
        [Languages.DE]: "Letzter Scan",
        [Languages.IT]: "Ultima scansione"
    },
    "home.no_scans": {
        [Languages.ES]: "Aún no has escaneado ningún producto. ¡Anímate a probarlo!",
        [Languages.EN]: "You haven't scanned any products yet. Give it a try!",
        [Languages.FR]: "Vous n'avez encore scanné aucun produit. Essayez-le !",
        [Languages.DE]: "Sie haben noch keine Produkte gescannt. Probieren Sie es aus!",
        [Languages.IT]: "Non hai ancora scansionato alcun prodotto. Provalo!"
    },

    // ---- scanner.html ----
    "scanner.focus": {
        [Languages.ES]: "Enfoca la etiqueta de ingredientes",
        [Languages.EN]: "Focus on the ingredients label",
        [Languages.FR]: "Concentrez-vous sur l'étiquette des ingrédients",
        [Languages.DE]: "Fokussieren Sie das Zutatenetikett",
        [Languages.IT]: "Metti a fuoco l'etichetta degli ingredienti"
    },
    "scanner.cancel": {
        [Languages.ES]: "Cancelar",
        [Languages.EN]: "Cancel",
        [Languages.FR]: "Annuler",
        [Languages.DE]: "Abbrechen",
        [Languages.IT]: "Annulla"
    },
    "scanner.analyzing": {
        [Languages.ES]: "Analizando ingredientes...",
        [Languages.EN]: "Analyzing ingredients...",
        [Languages.FR]: "Analyse des ingrédients...",
        [Languages.DE]: "Zutaten werden analysiert...",
        [Languages.IT]: "Analisi degli ingredienti..."
    },
    "scanner.wait": {
        [Languages.ES]: "Espera un momento, GLUTN está leyendo la etiqueta.",
        [Languages.EN]: "Please wait, GLUTN is reading the label.",
        [Languages.FR]: "Veuillez patienter, GLUTN lit l'étiquette.",
        [Languages.DE]: "Bitte warten, GLUTN liest das Etikett.",
        [Languages.IT]: "Attendi un momento, GLUTN sta leggendo l'etichetta."
    },
    "scanner.why": {
        [Languages.ES]: "Por qué:",
        [Languages.EN]: "Why:",
        [Languages.FR]: "Pourquoi :",
        [Languages.DE]: "Warum:",
        [Languages.IT]: "Perché:"
    },
    "scanner.ingredients_list": {
        [Languages.ES]: "Lista de ingredientes",
        [Languages.EN]: "Ingredients list",
        [Languages.FR]: "Liste des ingrédients",
        [Languages.DE]: "Zutatenliste",
        [Languages.IT]: "Elenco degli ingredienti"
    },
    "scanner.new_scan": {
        [Languages.ES]: "Nuevo escaneo",
        [Languages.EN]: "New scan",
        [Languages.FR]: "Nouvelle analyse",
        [Languages.DE]: "Neuer Scan",
        [Languages.IT]: "Nuova scansione"
    },
    "scanner.safe": {
        [Languages.ES]: "Seguro",
        [Languages.EN]: "Safe",
        [Languages.FR]: "Sûr",
        [Languages.DE]: "Sicher",
        [Languages.IT]: "Sicuro"
    },
    "scanner.unsafe": {
        [Languages.ES]: "No Apto",
        [Languages.EN]: "Not Safe",
        [Languages.FR]: "Non Adapté",
        [Languages.DE]: "Nicht Sicher",
        [Languages.IT]: "Non Adatto"
    },

    // ---- history.html ----
    "history.title": {
        [Languages.ES]: "Historial",
        [Languages.EN]: "History",
        [Languages.FR]: "Historique",
        [Languages.DE]: "Verlauf",
        [Languages.IT]: "Cronologia"
    },
    "history.delete": {
        [Languages.ES]: "Borrar Historial",
        [Languages.EN]: "Clear History",
        [Languages.FR]: "Effacer l'historique",
        [Languages.DE]: "Verlauf löschen",
        [Languages.IT]: "Cancella cronologia"
    },

    // ---- Nav Bar ----
    "nav.home": {
        [Languages.ES]: "Inicio",
        [Languages.EN]: "Home",
        [Languages.FR]: "Accueil",
        [Languages.DE]: "Startseite",
        [Languages.IT]: "Inizio"
    },
    "nav.scan": {
        [Languages.ES]: "Escanear",
        [Languages.EN]: "Scan",
        [Languages.FR]: "Scanner",
        [Languages.DE]: "Scannen",
        [Languages.IT]: "Scansiona"
    },
    "nav.history": {
        [Languages.ES]: "Historial",
        [Languages.EN]: "History",
        [Languages.FR]: "Historique",
        [Languages.DE]: "Verlauf",
        [Languages.IT]: "Cronologia"
    },

    // ---- Status & Time (Historial) ----
    "status.safe": {
        [Languages.ES]: "100% Seguro",
        [Languages.EN]: "100% Safe",
        [Languages.FR]: "100% Sûr",
        [Languages.DE]: "100% Sicher",
        [Languages.IT]: "100% Sicuro"
    },
    "status.safe_short": {
        [Languages.ES]: "Seguro",
        [Languages.EN]: "Safe",
        [Languages.FR]: "Sûr",
        [Languages.DE]: "Sicher",
        [Languages.IT]: "Sicuro"
    },
    "status.unsafe_barley": {
        [Languages.ES]: "Contiene cebada",
        [Languages.EN]: "Contains barley",
        [Languages.FR]: "Contient de l'orge",
        [Languages.DE]: "Enthält Gerste",
        [Languages.IT]: "Contiene orzo"
    },
    "time.10min": {
        [Languages.ES]: "Hace 10 min",
        [Languages.EN]: "10 min ago",
        [Languages.FR]: "Il y a 10 min",
        [Languages.DE]: "Vor 10 Min.",
        [Languages.IT]: "10 min fa"
    },
    "time.2hours": {
        [Languages.ES]: "Hace 2 horas",
        [Languages.EN]: "2 hours ago",
        [Languages.FR]: "Il y a 2 heures",
        [Languages.DE]: "Vor 2 Stunden",
        [Languages.IT]: "2 ore fa"
    },
    "time.yesterday": {
        [Languages.ES]: "Ayer",
        [Languages.EN]: "Yesterday",
        [Languages.FR]: "Hier",
        [Languages.DE]: "Gestern",
        [Languages.IT]: "Ieri"
    },
    "time.just_now": {
        [Languages.ES]: "Hace un momento",
        [Languages.EN]: "Just now",
        [Languages.FR]: "À l'instant",
        [Languages.DE]: "Gerade eben",
        [Languages.IT]: "Poco fa"
    }
};

/**
 * Aplica las traducciones a todos los elementos con el atributo data-i18n.
 * @param {string} langName El nombre del idioma seleccionado (ej. 'English')
 */
function applyTranslations(langName) {
    // Validar que el idioma existe en nuestro enum, si no, por defecto Español
    let selectedLang = Languages.ES;
    for (const key in Languages) {
        if (Languages[key] === langName) {
            selectedLang = langName;
            break;
        }
    }

    // Traducir todos los elementos marcados en el HTML
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (Translations[key] && Translations[key][selectedLang]) {
            // Si el elemento contiene HTML (por ejemplo <br>), usamos innerHTML
            if (Translations[key][selectedLang].includes('<br>')) {
                el.innerHTML = Translations[key][selectedLang];
            } else {
                el.innerText = Translations[key][selectedLang];
            }
        }
    });
}

// Inicializar traducciones automáticamente al cargar el archivo
document.addEventListener('DOMContentLoaded', () => {
    const userObj = JSON.parse(localStorage.getItem('user')) || {};
    const lang = userObj.language || Languages.ES;
    applyTranslations(lang);
});
