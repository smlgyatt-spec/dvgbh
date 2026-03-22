export default async function handler(req, res) {
  // --- 1. CHECK THESE TWO CAREFULLY ---
  const BIN_ID = "69bf3194aa77b81da907b7a4"; 
  const API_KEY = "$2a$10$0Rjs4kz2ItckdcS2D19W2eGLaGA1xjDzpH/fkVcoag18A9VbMs7Uy"; // Starts with $2a$10$
  const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  const headers = {
    "X-Master-Key": API_KEY,
    "Content-Type": "application/json"
  };

  try {
    // GET: Fetch messages
    const response = await fetch(`${URL}/latest`, { headers });
    const data = await response.json();
    
    if (!response.ok) {
        return res.status(response.status).json({ error: "JSONbin Read Failed", details: data });
    }

    let msgList = data.record.messages || [];

    // POST: Save a new message
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      if (body.action === "CLEAR_ALL" && body.user.toLowerCase() === "sam") {
        msgList = [{ user: "System", tag: "BOT", text: "Chat cleared by Sam.", time: "00:00" }];
      } else {
        msgList.push({
            user: body.user,
            tag: body.tag,
            text: body.text,
            time: body.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }

      const putRes = await fetch(URL, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ messages: msgList })
      });

      if (!putRes.ok) {
          const errData = await putRes.json();
          return res.status(putRes.status).json({ error: "JSONbin Write Failed", details: errData });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(200).json({ messages: msgList });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
