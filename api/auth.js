const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const DB_PATH = path.join('/tmp', 'datasaas-db.json');
const JWT_SECRET = process.env.JWT_SECRET || 'datasaas-secret-key-2026-secure';

function readDB() {
  try {
    if (fs.existsSync(DB_PATH)) return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch (e) {}
  return { users: [], payment_receipts: [], tasks: [], projects: [] };
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function initDB() {
  const db = readDB();
  if (db.users.length === 0) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    const now = new Date().toISOString();
    db.users.push({ id: 1, email: 'Vijayaraghavan1960@gmail.com', password: hashedPassword, role: 'admin', plan: 'lifetime', trial_start: now, trial_end: '2099-12-31T23:59:59Z', subscription_start: now, subscription_end: '2099-12-31T23:59:59Z', created_at: now });
    writeDB(db);
  }
  return db;
}

function getNextId(collection) {
  const db = readDB();
  const items = db[collection] || [];
  return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
}

function authenticateToken(req) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return { error: 'Access denied.', status: 401 };
  try {
    return { user: jwt.verify(token, JWT_SECRET) };
  } catch (err) {
    return { error: 'Invalid token.', status: 403 };
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
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
  } catch (err) {
    console.error('Auth API error:', err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};
