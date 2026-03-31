export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { prompt } = req.body;

    const raw = await response.text();
console.log("RAW GEMINI RESPONSE:", raw);

let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  return res.status(500).json({ error: raw });
}

    const data = await response.json();

 const text =
  data?.candidates?.[0]?.content?.parts?.[0]?.text ||
  JSON.stringify(data);

    res.status(200).json({ text });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
