export default async function handler(req, res) {
  const BIN_ID = "69bf3194aa77b81da907b7a4"; 
  const API_KEY = "$2a$10$0Rjs4kz2ItckdcS2D19W2eGLaGA1xjDzpH/fkVcoag18A9VbMs7Uy"; 
  const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
  const headers = { "X-Master-Key": API_KEY, "Content-Type": "application/json" };

  try {
    const response = await fetch(`${URL}/latest`, { headers });
    const data = await response.json();
    let msgList = data.record.messages || [];
    let serverList = data.record.servers || [{id: "global", name: "Dcord", icon: "", boosted: false}];

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      // Create Server with optional Icon
      if (body.action === "CREATE_SERVER" && (body.isAdmin || body.user.toLowerCase() === 'sam')) {
        if (!serverList.find(s => s.id === body.serverId)) {
            serverList.push({ 
                id: body.serverId, 
                name: body.serverName, 
                icon: body.icon || "", 
                boosted: false 
            });
        }
      }
      
      if (body.action === "BOOST" && body.nitro) {
        const srv = serverList.find(s => s.id === body.serverId);
        if (srv) srv.boosted = true;
      }

      if (!body.action) {
        msgList.push({
            user: body.user, text: body.text, room: body.room,
            nitro: body.nitro, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
        });
      }

      await fetch(URL, { method: 'PUT', headers, body: JSON.stringify({ messages: msgList, servers: serverList }) });
      return res.status(200).json({ success: true });
    }
    return res.status(200).json(data.record);
  } catch (error) { return res.status(500).json({ error: error.message }); }
}
