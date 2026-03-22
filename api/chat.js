// api/chat.js
export default async function handler(req, res) {
  // 1. Double check these are exactly right from your JSONbin Dashboard
  const BIN_ID = "69bf3194aa77b81da907b7a4"; 
  const API_KEY = "$2a$10$0Rjs4kz2ItckdcS2D19W2eGLaGA1xjDzpH/fkVcoag18A9VbMs7Uy"; 
  const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  // This header is the "Key" that opens your Private collection
  const authHeaders = {
    "X-Master-Key": API_KEY,
    "Content-Type": "application/json"
  };

  try {
    // --- FETCH MESSAGES ---
    if (req.method === 'GET') {
      const response = await fetch(`${URL}/latest`, { headers: authHeaders });
      const data = await response.json();
      
      // If JSONbin is blocking us, it returns an error instead of a record
      if (!data.record) {
          return res.status(200).json({ messages: [] });
      }
      return res.status(200).json(data.record);
    } 

    // --- SEND MESSAGE OR CLEAR ---
    if (req.method === 'POST') {
      const body = JSON.parse(req.body);
      
      // Get current list first
      const getRes = await fetch(`${URL}/latest`, { headers: authHeaders });
      const currentData = await getRes.json();
      let msgList = currentData.record?.messages || [];

      if (body.action === "CLEAR_ALL" && body.user.toLowerCase() === "sam") {
        msgList = [{ user: "System", text: "Chat cleared by Sam.", time: "Now" }];
      } else {
        msgList.push(body);
      }

      // Save the updated list back to the private bin
      await fetch(URL, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ messages: msgList })
      });

      return res.status(200).json({ success: true });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
