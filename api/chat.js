// api/chat.js
export default async function handler(req, res) {
  const BIN_ID = "69bf3194aa77b81da907b7a4"; 
  const API_KEY = "$2a$10$0Rjs4kz2ItckdcS2D19W2eGLaGA1xjDzpH/fkVcoag18A9VbMs7Uy"; 
  const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  const headers = { "X-Master-Key": API_KEY, "Content-Type": "application/json" };

  try {
    const response = await fetch(`${URL}/latest`, { headers });
    const data = await response.json();
    let msgList = data.record.messages || [];

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      if (body.action === "CLEAR_ALL" && body.user.toLowerCase() === "sam") {
        msgList = [];
      } else {
        msgList.push({
            user: body.user,
            text: body.text,
            room: body.room, // This is the secret room name (e.g. "sam-and-cold")
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }

      await fetch(URL, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ messages: msgList })
      });
      return res.status(200).json({ success: true });
    }

    return res.status(200).json({ messages: msgList });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
