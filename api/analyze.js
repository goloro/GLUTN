export default async function handler(req, res) {
    // Solo aceptamos peticiones POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("Falta la variable de entorno GEMINI_API_KEY en Vercel.");
        return res.status(500).json({ error: 'Falta la configuración de la clave de API en el servidor.' });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            const errData = await response.json();
            return res.status(response.status).json({ error: errData.error?.message || "Error from Gemini API" });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error("API proxy error:", error);
        return res.status(500).json({ error: error.message });
    }
}
