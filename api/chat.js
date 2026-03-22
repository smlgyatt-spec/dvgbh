// api/chat.js
export default async function handler(req, res) {
  // Extract roomId from the URL (e.g., /api/chat?roomId=123)
  const { roomId } = req.query;
  const BIN_ID = roomId || "69bf3194aa77b81da907b7a4"; 
  const API_KEY = "$2a$10$0Rjs4kz2ItckdcS2D19W2eGLaGA1xjDzpH/fkVcoag18A9VbMs7Uy"; // Starts with $2a$10$
  const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  const headers = {
    "X-Master-Key": API_KEY,
    "Content-Type": "application/json"
  };

  try {
    const response = await fetch(`${URL}/latest`, { headers });
    const data = await response.json();
    let msgList = data.record.messages || [];

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      if (body.action === "CLEAR_ALL" && body.user.toLowerCase() === "sam") {
        msgList = [{ user: "System", tag: "BOT", text: "Chat cleared.", time: "00:00" }];
      } else {
        msgList.push({
            user: body.user,
            tag: body.tag,
            text: body.text,
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
