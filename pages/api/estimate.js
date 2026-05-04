export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured on server" });
  const { systemPrompt, userPrompt, images } = req.body;
  if (!userPrompt) return res.status(400).json({ error: "userPrompt is required" });
  try {
    const content = [];
    if (images && images.length > 0) {
      for (const img of images) {
        content.push({ type:"image", source:{ type:"base64", media_type:img.mediaType||"image/jpeg", data:img.data }});
      }
    }
    content.push({ type:"text", text:userPrompt });
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{ "Content-Type":"application/json", "x-api-key":apiKey, "anthropic-version":"2023-06-01" },
      body:JSON.stringify({ model:"claude-sonnet-4-5", max_tokens:16000, system:systemPrompt, messages:[{ role:"user", content }]}),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || "Anthropic API error" });
    const text = data.content?.map(b => b.text || "").join("") || "";
    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Server error" });
  }
}