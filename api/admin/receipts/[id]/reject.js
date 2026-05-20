const { readDB, writeDB, initDB } = require('../lib/db');
const { requireAdmin } = require('../lib/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const auth = requireAdmin(req);
  if (auth.error) return res.status(auth.status).json({ error: auth.error });

  const receiptId = parseInt(req.query.id);
  if (!receiptId) return res.status(400).json({ error: 'Receipt ID required.' });

  initDB();
  const db = readDB();
  const idx = db.payment_receipts.findIndex(r => r.id === receiptId);
  if (idx === -1) return res.status(404).json({ error: 'Receipt not found.' });

  const receipt = db.payment_receipts[idx];
  if (receipt.status !== 'pending') return res.status(400).json({ error: 'Already processed.' });

  const { admin_notes } = req.body;
  db.payment_receipts[idx] = { ...receipt, status: 'rejected', admin_notes: admin_notes || 'Payment not verified.' };

  writeDB(db);
  res.json({ message: 'Receipt rejected.' });
};
