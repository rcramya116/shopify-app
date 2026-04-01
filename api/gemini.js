export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
    if (!process.env.GEMINI_API_KEY) {
  return res.status(500).json({ error: "API key missing" });
}
  }

 try {
  const { prompt } = req.body;

  const response = await fetch(
    https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
const data = await response.json();

if (!response.ok) {
  console.error("Gemini API error:", data);
  return res.status(500).json({
    error: data.error?.message || "Gemini failed"
  });
}
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No AI response";

  res.status(200).json({ text });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
