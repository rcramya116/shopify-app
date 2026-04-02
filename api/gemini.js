module.exports = async function handler(req, res) {
  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // ✅ Check API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API key missing" });
    }

    const { prompt } = req.body;

    // ✅ Validate input
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // ✅ Call Gemini
    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    // ✅ SAFE JSON parsing (fixes your 500 error)
    const raw = await response.text();
    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      console.log("RAW ERROR FROM GEMINI:", raw);
      return res.status(500).json({ error: "Invalid JSON from Gemini" });
    }

    // ✅ Handle API errors
    if (!response.ok) {
      console.log("Gemini API error:", data);
      return res.status(500).json({
        error: data?.error?.message || "Gemini API failed"
      });
    }

    // ✅ Extract text safely
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No AI response";

    // ✅ TRACK ONLY SUCCESSFUL USERS
    console.log("GLOBAL TRACK:", {
      time: new Date(),
      event: "AI_SUCCESS"
    });

    // ✅ Send response
    return res.status(200).json({ text });

  } catch (error) {
    console.log("SERVER ERROR:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
