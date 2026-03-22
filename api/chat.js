// api/chat.js
export default async function handler(req, res) {
  // HIDDEN CREDENTIALS - These never reach the user's browser
  const BIN_ID = "69bf3194aa77b81da907b7a4"; 
  const API_KEY = "$2a$10$0Rjs4kz2ItckdcS2D19W2eGLaGA1xjDzpH/fkVcoag18A9VbMs7Uy";
  const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  try {
    if (req.method === 'GET') {
      const response = await fetch(`${URL}/latest`, {
        headers: { "X-Master-Key": API_KEY }
      });
      const data = await response.json();
      return res.status(200).json(data.record);
    } 

    if (req.method === 'POST') {
      const newMessage = JSON.parse(req.body);
      
      // First, get existing messages
      const getRes = await fetch(`${URL}/latest`, {
        headers: { "X-Master-Key": API_KEY }
      });
      const currentData = await getRes.json();
      const updatedMessages = [...currentData.record.messages, newMessage];

      // Then, save the updated list
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
