// api/chat.js
export default async function handler(req, res) {
  const BIN_ID = "69bf3194aa77b81da907b7a4"; 
  const API_KEY = "$2a$10$0Rjs4kz2ItckdcS2D19W2eGLaGA1xjDzpH/fkVcoag18A9VbMs7Uy";
  const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  try {
    // GET: Fetch all global messages
    if (req.method === 'GET') {
      const response = await fetch(`${URL}/latest`, {
        headers: { "X-Master-Key": API_KEY }
      });
      const data = await response.json();
      return res.status(200).json(data.record);
    } 

    // POST: Send a message OR Clear the chat
    if (req.method === 'POST') {
      const body = JSON.parse(req.body);
      
      // Fetch current state
      const getRes = await fetch(`${URL}/latest`, {
        headers: { "X-Master-Key": API_KEY }
      });
      const currentData = await getRes.json();
      let updatedMessages = currentData.record.messages || [];

      // CHECK FOR CLEAR COMMAND (Only Sam can do this)
      if (body.action === "CLEAR_ALL" && body.user.toLowerCase() === "sam") {
        updatedMessages = [{ user: "System", tag: "BOT", text: "Chat cleared by Sam.", time: "Now" }];
      } else {
        // Normal Message push
        updatedMessages.push(body);
      }

      // Save back to JSONbin
      await fetch(URL, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": API_KEY
        },
        body: JSON.stringify({ messages: updatedMessages })
      });

      return res.status(200).json({ success: true });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
