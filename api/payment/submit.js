const { readDB, writeDB, getNextId, initDB } = require('../lib/db');
const { authenticateToken } = require('../lib/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const auth = authenticateToken(req);
  if (auth.error) return res.status(auth.status).json({ error: auth.error });

  const { plan_type, amount, receipt_notes } = req.body;
  if (!plan_type || !amount) return res.status(400).json({ error: 'Plan type and amount required.' });
  if (plan_type !== 'monthly' && plan_type !== 'lifetime') return res.status(400).json({ error: 'Invalid plan type.' });

  const expectedAmount = plan_type === 'monthly' ? 50 : 199;
  if (Math.abs(amount - expectedAmount) > 0.01) {
    return res.status(400).json({ error: `Amount must be $${expectedAmount} for ${plan_type} plan.` });
  }

  initDB();
  const db = readDB();
  const id = getNextId('payment_receipts');

  db.payment_receipts.push({
    id, user_id: auth.user.id, plan_type, amount,
    receipt_notes: receipt_notes || '', status: 'pending',
    submitted_at: new Date().toISOString()
  });
  writeDB(db);

  res.status(201).json({
    message: 'Receipt submitted. Send payment proof to WhatsApp 968-99061298. Admin will activate your subscription.',
    receipt_id: id
  });
};
