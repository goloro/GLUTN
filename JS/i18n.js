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
    "history.confirm_title": {
        [Languages.ES]: "¿Borrar historial?",
        [Languages.EN]: "Clear history?",
        [Languages.FR]: "Effacer l'historique ?",
        [Languages.DE]: "Verlauf löschen?",
        [Languages.IT]: "Cancellare la cronologia?"
    },
    "history.confirm_msg": {
        [Languages.ES]: "Esta acción no se puede deshacer.",
        [Languages.EN]: "This action cannot be undone.",
        [Languages.FR]: "Cette action ne peut pas être annulée.",
        [Languages.DE]: "Diese Aktion kann nicht rückgängig gemacht werden.",
        [Languages.IT]: "Questa azione non può essere annullata."
    },
    "history.confirm_yes": {
        [Languages.ES]: "Sí, borrar",
        [Languages.EN]: "Yes, clear",
        [Languages.FR]: "Oui, effacer",
        [Languages.DE]: "Ja, löschen",
        [Languages.IT]: "Sì, cancella"
    },
    "history.confirm_no": {
        [Languages.ES]: "Cancelar",
        [Languages.EN]: "Cancel",
        [Languages.FR]: "Annuler",
        [Languages.DE]: "Abbrechen",
        [Languages.IT]: "Annulla"
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
    },
    
    // ---- Nuevos Textos (EAN, IA, Modal, Resultados) ----
    "home.scan_ean": {
        [Languages.ES]: "Scanner",
        [Languages.EN]: "Scanner",
        [Languages.FR]: "Scanner",
        [Languages.DE]: "Scanner",
        [Languages.IT]: "Scanner"
    },
    "home.scan_ean_desc": {
        [Languages.ES]: "Apuntar al código de barras",
        [Languages.EN]: "Point at the barcode",
        [Languages.FR]: "Pointez le code-barres",
        [Languages.DE]: "Auf den Barcode richten",
        [Languages.IT]: "Punta al codice a barre"
    },
    "home.scan_ia": {
        [Languages.ES]: "Análisis Etiqueta",
        [Languages.EN]: "Label Analysis",
        [Languages.FR]: "Analyse Étiquette",
        [Languages.DE]: "Etikettenanalyse",
        [Languages.IT]: "Analisi Etichetta"
    },
    "home.scan_ia_desc": {
        [Languages.ES]: "Foto a los ingredientes",
        [Languages.EN]: "Photo of ingredients",
        [Languages.FR]: "Photo des ingrédients",
        [Languages.DE]: "Foto der Zutaten",
        [Languages.IT]: "Foto degli ingredienti"
    },
    "scanner.focus_ean": {
        [Languages.ES]: "APUNTA AL CÓDIGO DE BARRAS",
        [Languages.EN]: "POINT AT THE BARCODE",
        [Languages.FR]: "POINTEZ LE CODE-BARRES",
        [Languages.DE]: "AUF DEN BARCODE RICHTEN",
        [Languages.IT]: "PUNTA AL CODICE A BARRE"
    },
    "scanner.switch_ean": {
        [Languages.ES]: "O: Escanear Código (EAN)",
        [Languages.EN]: "OR: Scan Barcode (EAN)",
        [Languages.FR]: "OU: Scanner le Code (EAN)",
        [Languages.DE]: "ODER: Barcode scannen (EAN)",
        [Languages.IT]: "O: Scansiona Codice (EAN)"
    },
    "scanner.switch_ia": {
        [Languages.ES]: "O: Escanear Ingredientes (IA)",
        [Languages.EN]: "OR: Scan Ingredients (AI)",
        [Languages.FR]: "OU: Scanner Ingrédients (IA)",
        [Languages.DE]: "ODER: Zutaten scannen (KI)",
        [Languages.IT]: "O: Scansiona Ingredienti (IA)"
    },
    "scanner.warning": {
        [Languages.ES]: "Información Dudosa",
        [Languages.EN]: "Doubtful Information",
        [Languages.FR]: "Information Douteuse",
        [Languages.DE]: "Zweifelhafte Information",
        [Languages.IT]: "Informazioni Dubbie"
    },
    "scanner.warning_desc": {
        [Languages.ES]: "No podemos garantizar que este producto sea seguro con los datos actuales. Te recomendamos hacerle una foto a los ingredientes.",
        [Languages.EN]: "We cannot guarantee this product is safe with current data. We recommend taking a photo of the ingredients.",
        [Languages.FR]: "Nous ne pouvons garantir que ce produit est sûr avec les données actuelles. Nous recommandons de prendre une photo des ingrédients.",
        [Languages.DE]: "Wir können die Sicherheit dieses Produkts mit aktuellen Daten nicht garantieren. Wir empfehlen, ein Foto der Zutaten zu machen.",
        [Languages.IT]: "Non possiamo garantire che questo prodotto sia sicuro con i dati attuali. Ti consigliamo di fare una foto agli ingredienti."
    },
    "scanner.analyze_ai": {
        [Languages.ES]: "Analizar Etiqueta con IA",
        [Languages.EN]: "Analyze Label with AI",
        [Languages.FR]: "Analyser l'étiquette avec IA",
        [Languages.DE]: "Etikett mit KI analysieren",
        [Languages.IT]: "Analizza Etichetta con IA"
    },
    "modal.warning": {
        [Languages.ES]: "Aviso",
        [Languages.EN]: "Notice",
        [Languages.FR]: "Avis",
        [Languages.DE]: "Hinweis",
        [Languages.IT]: "Avviso"
    },
    "modal.cancel": {
        [Languages.ES]: "Cancelar",
        [Languages.EN]: "Cancel",
        [Languages.FR]: "Annuler",
        [Languages.DE]: "Abbrechen",
        [Languages.IT]: "Annulla"
    },
    "modal.accept": {
        [Languages.ES]: "Aceptar",
        [Languages.EN]: "Accept",
        [Languages.FR]: "Accepter",
        [Languages.DE]: "Akzeptieren",
        [Languages.IT]: "Accetta"
    },
    "modal.error_camera": {
        [Languages.ES]: "Error de Cámara",
        [Languages.EN]: "Camera Error",
        [Languages.FR]: "Erreur de Caméra",
        [Languages.DE]: "Kamerafehler",
        [Languages.IT]: "Errore Fotocamera"
    },
    "modal.error_camera_desc": {
        [Languages.ES]: "No se pudo acceder a la cámara. Asegúrate de dar permisos.",
        [Languages.EN]: "Could not access the camera. Make sure to grant permissions.",
        [Languages.FR]: "Impossible d'accéder à la caméra. Assurez-vous d'accorder les autorisations.",
        [Languages.DE]: "Zugriff auf Kamera nicht möglich. Bitte Berechtigungen erteilen.",
        [Languages.IT]: "Impossibile accedere alla fotocamera. Assicurati di concedere le autorizzazioni."
    },
    "modal.api_key": {
        [Languages.ES]: "API Key de Gemini",
        [Languages.EN]: "Gemini API Key",
        [Languages.FR]: "Clé API Gemini",
        [Languages.DE]: "Gemini API-Schlüssel",
        [Languages.IT]: "Chiave API Gemini"
    },
    "modal.api_key_desc": {
        [Languages.ES]: "Para usar el escáner con IA, introduce tu API Key:",
        [Languages.EN]: "To use the AI scanner, enter your API Key:",
        [Languages.FR]: "Pour utiliser le scanner IA, entrez votre clé API:",
        [Languages.DE]: "Um den KI-Scanner zu nutzen, geben Sie Ihren API-Schlüssel ein:",
        [Languages.IT]: "Per usare lo scanner IA, inserisci la tua Chiave API:"
    },
    "modal.error_api_key": {
        [Languages.ES]: "Falta API Key",
        [Languages.EN]: "Missing API Key",
        [Languages.FR]: "Clé API Manquante",
        [Languages.DE]: "Fehlender API-Schlüssel",
        [Languages.IT]: "Chiave API Mancante"
    },
    "modal.error_api_key_desc": {
        [Languages.ES]: "No hay API Key configurada para el modo IA.",
        [Languages.EN]: "No API Key configured for AI mode.",
        [Languages.FR]: "Aucune clé API configurée pour le mode IA.",
        [Languages.DE]: "Kein API-Schlüssel für den KI-Modus konfiguriert.",
        [Languages.IT]: "Nessuna Chiave API configurata per la modalità IA."
    },
    "modal.error_network": {
        [Languages.ES]: "Error de Red",
        [Languages.EN]: "Network Error",
        [Languages.FR]: "Erreur Réseau",
        [Languages.DE]: "Netzwerkfehler",
        [Languages.IT]: "Errore di Rete"
    },
    "modal.error_network_desc": {
        [Languages.ES]: "No se pudo conectar con la base de datos de productos.",
        [Languages.EN]: "Could not connect to the product database.",
        [Languages.FR]: "Impossible de se connecter à la base de données des produits.",
        [Languages.DE]: "Verbindung zur Produktdatenbank fehlgeschlagen.",
        [Languages.IT]: "Impossibile connettersi al database dei prodotti."
    },
    "modal.disclaimer_title": {
        [Languages.ES]: "Aviso Importante",
        [Languages.EN]: "Important Notice",
        [Languages.FR]: "Avis Important",
        [Languages.DE]: "Wichtiger Hinweis",
        [Languages.IT]: "Avviso Importante"
    },
    "modal.disclaimer_msg": {
        [Languages.ES]: "Esta aplicación utiliza Inteligencia Artificial y la base de datos abierta OpenFoodFacts.<br><br><strong>La información no es infalible</strong> y requiere supervisión humana. No es recomendable fiarse a ciegas. Verifica siempre la etiqueta física si tienes dudas.",
        [Languages.EN]: "This app uses Artificial Intelligence and the OpenFoodFacts open database.<br><br><strong>The information is not infallible</strong> and requires human supervision. Do not rely blindly on it. Always check the physical label if in doubt.",
        [Languages.FR]: "Cette application utilise l'Intelligence Artificielle et la base de données ouverte OpenFoodFacts.<br><br><strong>Les informations ne sont pas infaillibles</strong> et nécessitent une supervision humaine. Ne vous y fiez pas aveuglément. Vérifiez toujours l'étiquette physique en cas de doute.",
        [Languages.DE]: "Diese App verwendet Künstliche Intelligenz und die offene Datenbank OpenFoodFacts.<br><br><strong>Die Informationen sind nicht unfehlbar</strong> und erfordern menschliche Aufsicht. Verlassen Sie sich nicht blind darauf. Überprüfen Sie im Zweifelsfall immer das physische Etikett.",
        [Languages.IT]: "Questa app utilizza l'Intelligenza Artificiale e il database aperto OpenFoodFacts.<br><br><strong>Le informazioni non sono infallibili</strong> e richiedono supervisione umana. Non fidarti ciecamente. Controlla sempre l'etichetta fisica in caso di dubbio."
    },
    "modal.disclaimer_accept": {
        [Languages.ES]: "He leído y entiendo",
        [Languages.EN]: "I have read and understand",
        [Languages.FR]: "J'ai lu et compris",
        [Languages.DE]: "Ich habe gelesen und verstanden",
        [Languages.IT]: "Ho letto e compreso"
    },
    "result.safe_cert": {
        [Languages.ES]: "Certificado oficial Sin Gluten en la etiqueta.",
        [Languages.EN]: "Official Gluten-Free certified on label.",
        [Languages.FR]: "Certifié Sans Gluten officiellement sur l'étiquette.",
        [Languages.DE]: "Offiziell Glutenfrei zertifiziert auf dem Etikett.",
        [Languages.IT]: "Certificato ufficiale Senza Glutine sull'etichetta."
    },
    "result.unsafe_allergens": {
        [Languages.ES]: "Declara contener gluten, trigo, cebada, avena o centeno como alérgeno.",
        [Languages.EN]: "Declares containing gluten, wheat, barley, oats or rye as allergen.",
        [Languages.FR]: "Déclare contenir du gluten, blé, orge, avoine ou seigle comme allergène.",
        [Languages.DE]: "Deklariert Gluten, Weizen, Gerste, Hafer oder Roggen als Allergen.",
        [Languages.IT]: "Dichiara di contenere glutine, grano, orzo, avena o segale come allergene."
    },
    "result.warning_traces": {
        [Languages.ES]: "¡Atención! Este producto declara posibles TRAZAS de gluten.",
        [Languages.EN]: "Attention! This product declares possible TRACES of gluten.",
        [Languages.FR]: "Attention! Ce produit déclare des TRACES possibles de gluten.",
        [Languages.DE]: "Achtung! Dieses Produkt deklariert mögliche SPUREN von Gluten.",
        [Languages.IT]: "Attenzione! Questo prodotto dichiara possibili TRACCE di glutine."
    },
    "result.warning_not_certified": {
        [Languages.ES]: "No está certificado como \"Sin Gluten\" y podría contener trazas o contaminación cruzada.",
        [Languages.EN]: "Not certified as \"Gluten-Free\" and could contain traces or cross-contamination.",
        [Languages.FR]: "Non certifié \"Sans Gluten\" et pourrait contenir des traces ou contamination croisée.",
        [Languages.DE]: "Nicht als \"Glutenfrei\" zertifiziert und könnte Spuren oder Kreuzkontamination enthalten.",
        [Languages.IT]: "Non certificato come \"Senza Glutine\" e potrebbe contenere tracce o contaminazione incrociata."
    },
    "result.not_found": {
        [Languages.ES]: "Producto no encontrado.",
        [Languages.EN]: "Product not found.",
        [Languages.FR]: "Produit introuvable.",
        [Languages.DE]: "Produkt nicht gefunden.",
        [Languages.IT]: "Prodotto non trovato."
    },
    "scanner.not_found_desc": {
        [Languages.ES]: "Este producto no está en la base de datos. Puedes escanear los ingredientes con IA para comprobar si es seguro.",
        [Languages.EN]: "This product is not in the database. You can scan the ingredients with AI to check if it's safe.",
        [Languages.FR]: "Ce produit n'est pas dans la base de données. Vous pouvez scanner les ingrédients avec l'IA pour vérifier s'il est sûr.",
        [Languages.DE]: "Dieses Produkt ist nicht in der Datenbank. Sie können die Zutaten mit KI scannen, um zu prüfen, ob es sicher ist.",
        [Languages.IT]: "Questo prodotto non è nel database. Puoi scansionare gli ingredienti con l'IA per verificare se è sicuro."
    },
    "scanner.not_found_title": {
        [Languages.ES]: "Producto Desconocido",
        [Languages.EN]: "Unknown Product",
        [Languages.FR]: "Produit Inconnu",
        [Languages.DE]: "Unbekanntes Produkt",
        [Languages.IT]: "Prodotto Sconosciuto"
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
            selectedLang = Languages[key];
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
    // Inyectar el Desktop Blocker dinámicamente si no existe
    if (!document.getElementById('desktop-blocker')) {
        const blocker = document.createElement('div');
        blocker.id = 'desktop-blocker';
        blocker.innerHTML = `
            <i class="ph-bold ph-device-mobile" style="font-size: 64px; color: var(--card-green, #0FA874); margin-bottom: 20px;"></i>
            <h2 data-i18n="blocker.title">Solo para móviles</h2>
            <p data-i18n="blocker.desc">Esta App está diseñada exclusivamente para teléfonos móviles. Por favor, accede desde tu smartphone.</p>
        `;
        document.body.appendChild(blocker);
    }

    let userObj = JSON.parse(localStorage.getItem('GLUTN_UserInfo')) || {};
    let lang = userObj.language;

    if (!lang) {
        const browserLang = (navigator.language || navigator.userLanguage || "en").split('-')[0].toLowerCase();
        const langMap = {
            'es': Languages.ES,
            'en': Languages.EN,
            'fr': Languages.FR,
            'de': Languages.DE,
            'it': Languages.IT
        };
        lang = langMap[browserLang] || Languages.EN;
        userObj.language = lang;
        localStorage.setItem('GLUTN_UserInfo', JSON.stringify(userObj));
    }

    applyTranslations(lang);

    // Actualizar el texto del selector de idiomas en el menú (si existe en la vista actual)
    const currentLangText = document.getElementById('current-lang');
    if (currentLangText) {
        currentLangText.innerText = lang;
    }
});
