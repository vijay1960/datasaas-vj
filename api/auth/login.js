const { readDB, initDB } = require('../lib/db');
const { JWT_SECRET } = require('../lib/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

  initDB();
  const db = readDB();
  const user = db.users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) return res.status(401).json({ error: 'Invalid credentials.' });

  const now = new Date();
  let plan = user.plan;
  if (plan === 'trial' && user.trial_end && new Date(user.trial_end) < now) plan = 'expired';
  else if (plan === 'monthly' && user.subscription_end && new Date(user.subscription_end) < now) plan = 'expired';

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, plan }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    message: 'Login successful.',
    token,
    user: {
      id: user.id, email: user.email, role: user.role, plan,
      trialEnd: user.trial_end, subscriptionEnd: user.subscription_end, subscriptionStart: user.subscription_start
    }
  });
};
