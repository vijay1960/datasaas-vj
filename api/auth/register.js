const { readDB, writeDB, getNextId } = require('../lib/db');
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

  const db = readDB();
  if (db.users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'Email already registered.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const trialStart = new Date().toISOString();
  const trialEnd = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
  const id = getNextId('users');

  const newUser = {
    id, email, password: hashedPassword, role: 'customer', plan: 'trial',
    trial_start: trialStart, trial_end: trialEnd, created_at: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  const token = jwt.sign({ id, email, role: 'customer', plan: 'trial' }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    message: 'Registration successful. 3-day free trial started.',
    token,
    user: { id, email, role: 'customer', plan: 'trial', trialEnd }
  });
};
