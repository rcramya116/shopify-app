export default async function handler(req, res) {
  // CORS
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

    console.log("GLOBAL TRACK:", {
  time: new Date(),
  event: "AI_USED"
});
    console.log("User used AI:", {
  time: new Date(),
  promptLength: prompt?.length
});

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // ✅ Call Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    // ✅ SAFELY parse response
    let data;
    try {
      data = await response.json();
    } catch (e) {
      return res.status(500).json({
        error: "Invalid JSON from Gemini",
      });
    }

    // ✅ Handle Gemini errors
    if (!response.ok) {
      return res.status(500).json({
        error: data?.error?.message || "Gemini API failed",
      });
    }

    // ✅ Extract text safely
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No AI response";

    return res.status(200).json({ text });

  } catch (error) {
    // ✅ ALWAYS return JSON (this fixes your main bug)
    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
}
