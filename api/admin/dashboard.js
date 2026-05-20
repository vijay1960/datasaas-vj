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
  const totalUsers = db.users.filter(u => u.role === 'customer').length;
  const approvedReceipts = db.payment_receipts.filter(r => r.status === 'approved');
  const revenue = approvedReceipts.reduce((sum, r) => sum + r.amount, 0);

  res.json({ total_users: totalUsers, revenue, approved_subscriptions: approvedReceipts.length });
};
