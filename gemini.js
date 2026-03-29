export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    console.log("Gemini response:", data); // 🔥 important

    if (!data.candidates || data.candidates.length === 0) {
      return res.status(200).json({
        text: "No response from AI",
        debug: data,
      });
    }

    const text = data.candidates[0].content.parts[0].text;

    res.status(200).json({ text });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
