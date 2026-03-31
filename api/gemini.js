export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

 try {
  const { prompt } = req.body;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

  const raw = await response.text();
  console.log("RAW GEMINI RESPONSE:", raw);

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return res.status(500).json({ error: raw });
  }

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No AI response";

  res.status(200).json({ text });

} catch (error) {
  res.status(500).json({ error: error.message });
}

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
