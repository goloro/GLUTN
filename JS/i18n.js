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
    "nav.settings": {
        [Languages.ES]: "Ajustes",
        [Languages.EN]: "Settings",
        [Languages.FR]: "Paramètres",
        [Languages.DE]: "Einstellungen",
        [Languages.IT]: "Impostazioni"
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
    "status.unsafe_wheat": {
        [Languages.ES]: "Contiene trigo",
        [Languages.EN]: "Contains wheat",
        [Languages.FR]: "Contient du blé",
        [Languages.DE]: "Enthält Weizen",
        [Languages.IT]: "Contiene grano"
    },
    "status.unsafe_oats": {
        [Languages.ES]: "Contiene avena",
        [Languages.EN]: "Contains oats",
        [Languages.FR]: "Contient de l'avoine",
        [Languages.DE]: "Enthält Hafer",
        [Languages.IT]: "Contiene avena"
    },
    "status.unsafe_rye": {
        [Languages.ES]: "Contiene centeno",
        [Languages.EN]: "Contains rye",
        [Languages.FR]: "Contient du seigle",
        [Languages.DE]: "Enthält Roggen",
        [Languages.IT]: "Contiene segale"
    },
    "status.unsafe_traces": {
        [Languages.ES]: "Trazas de gluten",
        [Languages.EN]: "Traces of gluten",
        [Languages.FR]: "Traces de gluten",
        [Languages.DE]: "Spuren von Gluten",
        [Languages.IT]: "Tracce di glutine"
    },
    "time.just_now": {
        [Languages.ES]: "Ahora mismo",
        [Languages.EN]: "Just now",
        [Languages.FR]: "À l'instant",
        [Languages.DE]: "Gerade eben",
        [Languages.IT]: "Proprio ora"
    },
    "time.mins_ago": {
        [Languages.ES]: "hace {m} min",
        [Languages.EN]: "{m} mins ago",
        [Languages.FR]: "il y a {m} min",
        [Languages.DE]: "vor {m} Min",
        [Languages.IT]: "{m} min fa"
    },
    "time.hours_ago": {
        [Languages.ES]: "hace {h} horas",
        [Languages.EN]: "{h} hours ago",
        [Languages.FR]: "il y a {h} heures",
        [Languages.DE]: "vor {h} Stunden",
        [Languages.IT]: "{h} ore fa"
    },
    "time.yesterday": {
        [Languages.ES]: "Ayer",
        [Languages.EN]: "Yesterday",
        [Languages.FR]: "Hier",
        [Languages.DE]: "Gestern",
        [Languages.IT]: "Ieri"
    },

    // ---- Extras (Scanner UI) ----
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
        [Languages.FR]: "Nous ne pouvons garantir la sécurité de ce produit avec les données actuelles. Nous recommandons de prendre une photo des ingrédients.",
        [Languages.DE]: "Wir können mit den aktuellen Daten nicht garantieren, dass dieses Produkt sicher ist. Wir empfehlen, ein Foto der Zutaten zu machen.",
        [Languages.IT]: "Non possiamo garantire che questo prodotto sia sicuro con i dati attuali. Si consiglia di scattare una foto degli ingredienti."
    },
    "scanner.analyze_ai": {
        [Languages.ES]: "Analizar Etiqueta con IA",
        [Languages.EN]: "Analyze Label with AI",
        [Languages.FR]: "Analyser l'étiquette avec l'IA",
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
    },

    // ---- auth.html ----
    "auth.login_tab": {
        [Languages.ES]: "Log In",
        [Languages.EN]: "Log In",
        [Languages.FR]: "Connexion",
        [Languages.DE]: "Anmelden",
        [Languages.IT]: "Accedi"
    },
    "auth.signup_tab": {
        [Languages.ES]: "Sign Up",
        [Languages.EN]: "Sign Up",
        [Languages.FR]: "S'inscrire",
        [Languages.DE]: "Registrieren",
        [Languages.IT]: "Registrati"
    },
    "auth.username": {
        [Languages.ES]: "Nombre de usuario",
        [Languages.EN]: "Username",
        [Languages.FR]: "Nom d'utilisateur",
        [Languages.DE]: "Benutzername",
        [Languages.IT]: "Nome utente"
    },
    "auth.username_placeholder": {
        [Languages.ES]: "Tu nombre de usuario",
        [Languages.EN]: "Your username",
        [Languages.FR]: "Votre nom d'utilisateur",
        [Languages.DE]: "Dein Benutzername",
        [Languages.IT]: "Il tuo nome utente"
    },
    "auth.first_name": {
        [Languages.ES]: "Nombre",
        [Languages.EN]: "First Name",
        [Languages.FR]: "Prénom",
        [Languages.DE]: "Vorname",
        [Languages.IT]: "Nome"
    },
    "auth.first_name_placeholder": {
        [Languages.ES]: "Tu nombre",
        [Languages.EN]: "Your first name",
        [Languages.FR]: "Votre prénom",
        [Languages.DE]: "Dein Vorname",
        [Languages.IT]: "Il tuo nome"
    },
    "auth.last_name": {
        [Languages.ES]: "Apellidos",
        [Languages.EN]: "Last Name",
        [Languages.FR]: "Nom de famille",
        [Languages.DE]: "Nachname",
        [Languages.IT]: "Cognome"
    },
    "auth.last_name_placeholder": {
        [Languages.ES]: "Tus apellidos",
        [Languages.EN]: "Your last name",
        [Languages.FR]: "Votre nom de famille",
        [Languages.DE]: "Dein Nachname",
        [Languages.IT]: "Il tuo cognome"
    },
    "auth.email_or_username": {
        [Languages.ES]: "Email o Nombre de usuario",
        [Languages.EN]: "Email or Username",
        [Languages.FR]: "Email ou Nom d'utilisateur",
        [Languages.DE]: "E-Mail oder Benutzername",
        [Languages.IT]: "Email o Nome utente"
    },
    "auth.password": {
        [Languages.ES]: "Contraseña",
        [Languages.EN]: "Password",
        [Languages.FR]: "Mot de passe",
        [Languages.DE]: "Passwort",
        [Languages.IT]: "Password"
    },
    "auth.forgot_password": {
        [Languages.ES]: "Contraseña olvidada?",
        [Languages.EN]: "Forgot password?",
        [Languages.FR]: "Mot de passe oublié ?",
        [Languages.DE]: "Passwort vergessen?",
        [Languages.IT]: "Password dimenticata?"
    },
    "auth.confirm_password": {
        [Languages.ES]: "Repetir Contraseña",
        [Languages.EN]: "Repeat Password",
        [Languages.FR]: "Répéter le mot de passe",
        [Languages.DE]: "Passwort wiederholen",
        [Languages.IT]: "Ripeti Password"
    },
    "auth.or_continue_with": {
        [Languages.ES]: "O CONTINÚA CON",
        [Languages.EN]: "OR CONTINUE WITH",
        [Languages.FR]: "OU CONTINUER AVEC",
        [Languages.DE]: "ODER WEITER MIT",
        [Languages.IT]: "O CONTINUA CON"
    },
    "auth.terms": {
        [Languages.ES]: "Términos y Condiciones",
        [Languages.EN]: "Terms and Conditions",
        [Languages.FR]: "Conditions d'utilisation",
        [Languages.DE]: "Allgemeine Geschäftsbedingungen",
        [Languages.IT]: "Termini e Condizioni"
    },
    "auth.privacy": {
        [Languages.ES]: "Política de Privacidad",
        [Languages.EN]: "Privacy Policy",
        [Languages.FR]: "Politique de confidentialité",
        [Languages.DE]: "Datenschutz-Bestimmungen",
        [Languages.IT]: "Informativa sulla privacy"
    },
    "auth.footer_text": {
        [Languages.ES]: "Al continuar, aceptas nuestros",
        [Languages.EN]: "By continuing, you accept our",
        [Languages.FR]: "En continuant, vous acceptez nos",
        [Languages.DE]: "Indem Sie fortfahren, akzeptieren Sie unsere",
        [Languages.IT]: "Continuando, accetti i nostri"
    },
    "auth.and": {
        [Languages.ES]: "y",
        [Languages.EN]: "and",
        [Languages.FR]: "et",
        [Languages.DE]: "und",
        [Languages.IT]: "e"
    },

    // ---- settings.html ----
    "settings.title": {
        [Languages.ES]: "Ajustes",
        [Languages.EN]: "Settings",
        [Languages.FR]: "Paramètres",
        [Languages.DE]: "Einstellungen",
        [Languages.IT]: "Impostazioni"
    },
    "settings.account": {
        [Languages.ES]: "CUENTA",
        [Languages.EN]: "ACCOUNT",
        [Languages.FR]: "COMPTE",
        [Languages.DE]: "KONTO",
        [Languages.IT]: "ACCOUNT"
    },
    "settings.language": {
        [Languages.ES]: "Idioma",
        [Languages.EN]: "Language",
        [Languages.FR]: "Langue",
        [Languages.DE]: "Sprache",
        [Languages.IT]: "Lingua"
    },
    "settings.support": {
        [Languages.ES]: "SOPORTE",
        [Languages.EN]: "SUPPORT",
        [Languages.FR]: "SUPPORT",
        [Languages.DE]: "SUPPORT",
        [Languages.IT]: "SUPPORTO"
    },
    "settings.help": {
        [Languages.ES]: "Ayuda y Contacto",
        [Languages.EN]: "Help and Contact",
        [Languages.FR]: "Aide et Contact",
        [Languages.DE]: "Hilfe und Kontakt",
        [Languages.IT]: "Guida e Contatti"
    },
    "settings.privacy": {
        [Languages.ES]: "Privacidad",
        [Languages.EN]: "Privacy",
        [Languages.FR]: "Confidentialité",
        [Languages.DE]: "Datenschutz",
        [Languages.IT]: "Privacy"
    },
    "settings.logout": {
        [Languages.ES]: "Cerrar Sesión",
        [Languages.EN]: "Log Out",
        [Languages.FR]: "Déconnexion",
        [Languages.DE]: "Abmelden",
        [Languages.IT]: "Esci"
    },

    // ---- edit-profile.html ----
    "edit_profile.title": {
        [Languages.ES]: "Editar Perfil",
        [Languages.EN]: "Edit Profile",
        [Languages.FR]: "Modifier le profil",
        [Languages.DE]: "Profil bearbeiten",
        [Languages.IT]: "Modifica Profilo"
    },
    "edit_profile.username": {
        [Languages.ES]: "Nombre de usuario",
        [Languages.EN]: "Username",
        [Languages.FR]: "Nom d'utilisateur",
        [Languages.DE]: "Benutzername",
        [Languages.IT]: "Nome utente"
    },
    "edit_profile.first_name": {
        [Languages.ES]: "Nombre",
        [Languages.EN]: "First Name",
        [Languages.FR]: "Prénom",
        [Languages.DE]: "Vorname",
        [Languages.IT]: "Nome"
    },
    "edit_profile.last_name": {
        [Languages.ES]: "Apellidos",
        [Languages.EN]: "Last Name",
        [Languages.FR]: "Nom de famille",
        [Languages.DE]: "Nachname",
        [Languages.IT]: "Cognome"
    },
    "edit_profile.email": {
        [Languages.ES]: "Email",
        [Languages.EN]: "Email",
        [Languages.FR]: "Email",
        [Languages.DE]: "E-Mail",
        [Languages.IT]: "Email"
    },
    "edit_profile.new_password": {
        [Languages.ES]: "Nueva Contraseña",
        [Languages.EN]: "New Password",
        [Languages.FR]: "Nouveau mot de passe",
        [Languages.DE]: "Neues Passwort",
        [Languages.IT]: "Nuova Password"
    },
    "edit_profile.confirm_password": {
        [Languages.ES]: "Repetir Contraseña",
        [Languages.EN]: "Repeat Password",
        [Languages.FR]: "Répéter le mot de passe",
        [Languages.DE]: "Passwort wiederholen",
        [Languages.IT]: "Ripeti Password"
    },
    "edit_profile.save": {
        [Languages.ES]: "Guardar Cambios",
        [Languages.EN]: "Save Changes",
        [Languages.FR]: "Enregistrer les modifications",
        [Languages.DE]: "Änderungen speichern",
        [Languages.IT]: "Salva modifiche"
    },
    "terminos.title": {
        [Languages.ES]: "Términos y Condiciones",
        [Languages.EN]: "Terms and Conditions",
        [Languages.FR]: "Conditions d'utilisation",
        [Languages.DE]: "Allgemeine Geschäftsbedingungen",
        [Languages.IT]: "Termini e Condizioni"
    },

    // ---- help.html ----
    "help.title": {
        [Languages.ES]: "Ayuda y Contacto",
        [Languages.EN]: "Help and Contact",
        [Languages.FR]: "Aide et Contact",
        [Languages.DE]: "Hilfe und Kontakt",
        [Languages.IT]: "Guida e Contatti"
    },
    "help.desc": {
        [Languages.ES]: "¿Tienes algún problema con la aplicación, alguna sugerencia o has encontrado un error? Escríbenos y te responderemos lo antes posible.",
        [Languages.EN]: "Do you have any problem with the app, a suggestion or found a bug? Write to us and we will reply as soon as possible.",
        [Languages.FR]: "Avez-vous un problème avec l'application, une suggestion ou avez-vous trouvé un bogue ? Écrivez-nous et nous vous répondrons dans les plus brefs délais.",
        [Languages.DE]: "Haben Sie ein Problem mit der App, einen Vorschlag oder einen Fehler gefunden? Schreiben Sie uns und wir werden so schnell wie möglich antworten.",
        [Languages.IT]: "Hai qualche problema con l'app, un suggerimento o hai trovato un bug? Scrivici e ti risponderemo il prima possibile."
    },
    "help.email": {
        [Languages.ES]: "Tu Email",
        [Languages.EN]: "Your Email",
        [Languages.FR]: "Votre Email",
        [Languages.DE]: "Ihre E-Mail",
        [Languages.IT]: "La tua Email"
    },
    "help.subject": {
        [Languages.ES]: "Asunto",
        [Languages.EN]: "Subject",
        [Languages.FR]: "Sujet",
        [Languages.DE]: "Betreff",
        [Languages.IT]: "Oggetto"
    },
    "help.subject_placeholder": {
        [Languages.ES]: "Selecciona un motivo",
        [Languages.EN]: "Select a reason",
        [Languages.FR]: "Sélectionnez un motif",
        [Languages.DE]: "Wählen Sie einen Grund",
        [Languages.IT]: "Seleziona un motivo"
    },
    "help.subject_tech": {
        [Languages.ES]: "Problema técnico / Error",
        [Languages.EN]: "Technical issue / Bug",
        [Languages.FR]: "Problème technique / Bogue",
        [Languages.DE]: "Technisches Problem / Fehler",
        [Languages.IT]: "Problema tecnico / Bug"
    },
    "help.subject_suggestion": {
        [Languages.ES]: "Sugerencia de mejora",
        [Languages.EN]: "Suggestion for improvement",
        [Languages.FR]: "Suggestion d'amélioration",
        [Languages.DE]: "Verbesserungsvorschlag",
        [Languages.IT]: "Suggerimento per migliorare"
    },
    "help.subject_doubt": {
        [Languages.ES]: "Duda sobre un escaneo",
        [Languages.EN]: "Doubt about a scan",
        [Languages.FR]: "Doute sur un scan",
        [Languages.DE]: "Zweifel an einem Scan",
        [Languages.IT]: "Dubbio su una scansione"
    },
    "help.subject_other": {
        [Languages.ES]: "Otro",
        [Languages.EN]: "Other",
        [Languages.FR]: "Autre",
        [Languages.DE]: "Andere",
        [Languages.IT]: "Altro"
    },
    "help.message": {
        [Languages.ES]: "Mensaje",
        [Languages.EN]: "Message",
        [Languages.FR]: "Message",
        [Languages.DE]: "Nachricht",
        [Languages.IT]: "Messaggio"
    },
    "help.message_placeholder": {
        [Languages.ES]: "Explícanos en detalle...",
        [Languages.EN]: "Explain in detail...",
        [Languages.FR]: "Expliquez-nous en détail...",
        [Languages.DE]: "Erklären Sie im Detail...",
        [Languages.IT]: "Spiegaci in dettaglio..."
    },
    "help.send": {
        [Languages.ES]: "Enviar Mensaje",
        [Languages.EN]: "Send Message",
        [Languages.FR]: "Envoyer le message",
        [Languages.DE]: "Nachricht senden",
        [Languages.IT]: "Invia Messaggio"
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
    window.currentGlobalLang = selectedLang;

    // Traducir todos los elementos marcados en el HTML
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (Translations[key] && Translations[key][selectedLang]) {
            // Si el elemento es un input o textarea y tiene placeholder
            if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') && el.hasAttribute('placeholder')) {
                el.placeholder = Translations[key][selectedLang];
            } else {
                // Si el elemento contiene HTML (por ejemplo <br>), usamos innerHTML
                if (Translations[key][selectedLang].includes('<br>')) {
                    el.innerHTML = Translations[key][selectedLang];
                } else {
                    el.innerText = Translations[key][selectedLang];
                }
            }
        }
    });
}
window.applyTranslations = applyTranslations;

// Inicializar traducciones automáticamente al cargar el archivo
document.addEventListener('DOMContentLoaded', () => {
    // Inyectar el Desktop Blocker dinámicamente si no existe
    if (!document.getElementById('desktop-blocker')) {
        // Añadir el estilo global
        const style = document.createElement('style');
        style.innerHTML = `
            #desktop-blocker {
                display: none;
            }
            @media (min-width: 600px) {
                #desktop-blocker {
                    display: flex !important;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: #FAFAF9;
                    z-index: 999999;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    padding: 24px;
                    color: #2C2C2C;
                    font-family: 'Inter', sans-serif;
                }
                body > *:not(#desktop-blocker) {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);

        const blocker = document.createElement('div');
        blocker.id = 'desktop-blocker';
        blocker.innerHTML = `
            <i class="ph-bold ph-device-mobile" style="font-size: 64px; color: var(--card-green, #5B7553); margin-bottom: 20px;"></i>
            <h2 data-i18n="blocker.title">Solo para móviles</h2>
            <p data-i18n="blocker.desc">Esta App está diseñada exclusivamente para teléfonos móviles. Por favor, accede desde tu smartphone.</p>
        `;
        document.body.appendChild(blocker);
    }

    // Por defecto usar idioma del navegador
    const browserLang = (navigator.language || navigator.userLanguage || "en").split('-')[0].toLowerCase();
    const langMap = {
        'es': Languages.ES,
        'en': Languages.EN,
        'fr': Languages.FR,
        'de': Languages.DE,
        'it': Languages.IT
    };
    let lang = langMap[browserLang] || Languages.EN;

    applyTranslations(lang);

    // Actualizar el texto del selector de idiomas en el menú (si existe en la vista actual)
    const currentLangText = document.getElementById('current-lang');
    if (currentLangText) {
        currentLangText.innerText = lang;
    }
});
