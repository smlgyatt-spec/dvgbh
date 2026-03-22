export default async function handler(req, res) {
  const BIN_ID = "69bf3194aa77b81da907b7a4"; 
  const API_KEY = "$2a$10$0Rjs4kz2ItckdcS2D19W2eGLaGA1xjDzpH/fkVcoag18A9VbMs7Uy"; // Starts with $2a$10$
  const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  const headers = {
    "X-Master-Key": API_KEY,
    "Content-Type": "application/json"
  };

  try {
    // 1. Always get the latest data first
    const getRes = await fetch(`${URL}/latest`, { headers });
    const data = await getRes.json();
    let msgList = data.record.messages || [];

    if (req.method === 'POST') {
      const body = JSON.parse(req.body);

      if (body.action === "CLEAR_ALL" && body.user.toLowerCase() === "sam") {
        msgList = [{ user: "System", tag: "BOT", text: "Chat cleared by Sam.", time: "00:00" }];
      } else {
        // 2. Add your new message to the list
        msgList.push({
            user: body.user,
            tag: body.tag,
            text: body.text,
            time: body.time
        });
      }

      // 3. Save the FULL list back to the cloud
      await fetch(URL, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ messages: msgList })
      });

      return res.status(200).json({ success: true });
    }

    // 4. If it's a GET request, send the list to your screen
    return res.status(200).json({ messages: msgList });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
