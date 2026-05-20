const { readDB, initDB } = require('../lib/db');
const { requireAdmin } = require('../lib/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });

  const auth = requireAdmin(req);
  if (auth.error) return res.status(auth.status).json({ error: auth.error });

  initDB();
  const db = readDB();
  const receipts = db.payment_receipts
    .map(r => {
      const user = db.users.find(u => u.id === r.user_id);
      return { ...r, email: user ? user.email : 'Unknown' };
    })
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

  res.json({ receipts });
};
