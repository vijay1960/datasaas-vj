const { readDB, initDB } = require('../lib/db');
const { authenticateToken } = require('../lib/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });

  const auth = authenticateToken(req);
  if (auth.error) return res.status(auth.status).json({ error: auth.error });

  initDB();
  const db = readDB();
  const user = db.users.find(u => u.id === auth.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const { password, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
};
