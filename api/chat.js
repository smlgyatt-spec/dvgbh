export default async function handler(req, res) {
  const BIN_ID = "69bf3194aa77b81da907b7a4"; 
  const API_KEY = "$2a$10$0Rjs4kz2ItckdcS2D19W2eGLaGA1xjDzpH/fkVcoag18A9VbMs7Uy"; 
  const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
  const headers = { "X-Master-Key": API_KEY, "Content-Type": "application/json" };

  try {
    const response = await fetch(`${URL}/latest`, { headers });
    const data = await response.json();
    let msgList = data.record.messages || [];
    let bannedUsers = data.record.banned || [];

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      // BAN CHECK
      if (bannedUsers.includes(body.user.toLowerCase())) {
        return res.status(403).json({ error: "BANNED" });
      }

      // COMMANDS (?ban, ?unban, ?clear)
      if (body.text.startsWith('?')) {
        const args = body.text.split(' ');
        const cmd = args[0].toLowerCase();
        const target = args[1]?.toLowerCase();

        if (body.isAdmin || body.user.toLowerCase() === 'sam') {
          if (cmd === '?ban' && target) {
            if (!bannedUsers.includes(target)) bannedUsers.push(target);
          }
          if (cmd === '?unban' && target && body.user.toLowerCase() === 'sam') {
            bannedUsers = bannedUsers.filter(u => u !== target);
          }
          if (cmd === '?clear') {
            msgList = msgList.filter(m => m.room !== body.room);
          }
        }
      } else {
        msgList.push({
            user: body.user,
            text: body.text,
            room: body.room || "global",
            nitro: body.nitro || false,
            role: body.role || "User",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }

      await fetch(URL, { method: 'PUT', headers, body: JSON.stringify({ messages: msgList, banned: bannedUsers }) });
      return res.status(200).json({ success: true });
    }
    return res.status(200).json({ messages: msgList, banned: bannedUsers });
  } catch (error) { return res.status(500).json({ error: error.message }); }
}
