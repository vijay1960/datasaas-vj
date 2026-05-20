const { readDB, writeDB, getNextId, initDB } = require('./lib/db');
const { JWT_SECRET, authenticateToken } = require('./lib/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const path = req.url.replace('/api/auth/', '');

  if (path === 'register' && req.method === 'POST') {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });
    const db = readDB();
    if (db.users.find(u => u.email === email)) return res.status(409).json({ error: 'Email already registered.' });
    const hashedPassword = bcrypt.hashSync(password, 10);
    const trialStart = new Date().toISOString();
    const trialEnd = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
    const id = getNextId('users');
    db.users.push({ id, email, password: hashedPassword, role: 'customer', plan: 'trial', trial_start: trialStart, trial_end: trialEnd, created_at: new Date().toISOString() });
    writeDB(db);
    const token = jwt.sign({ id, email, role: 'customer', plan: 'trial' }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ message: 'Registration successful. 3-day free trial started.', token, user: { id, email, role: 'customer', plan: 'trial', trialEnd } });
  }

  if (path === 'login' && req.method === 'POST') {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });
    initDB();
    const db = readDB();
    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
    if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid credentials.' });
    const now = new Date();
    let plan = user.plan;
    if (plan === 'trial' && user.trial_end && new Date(user.trial_end) < now) plan = 'expired';
    else if (plan === 'monthly' && user.subscription_end && new Date(user.subscription_end) < now) plan = 'expired';
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, plan }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ message: 'Login successful.', token, user: { id: user.id, email: user.email, role: user.role, plan, trialEnd: user.trial_end, subscriptionEnd: user.subscription_end, subscriptionStart: user.subscription_start } });
  }

  if (path === 'me' && req.method === 'GET') {
    const auth = authenticateToken(req);
    if (auth.error) return res.status(auth.status).json({ error: auth.error });
    initDB();
    const db = readDB();
    const user = db.users.find(u => u.id === auth.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    const { password, ...safe } = user;
    return res.json({ user: safe });
  }

  res.status(404).json({ error: 'Not found.' });
};
