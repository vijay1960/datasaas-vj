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

function requireAdmin(req) {
  const auth = authenticateToken(req);
  if (auth.error) return auth;
  if (auth.user.role !== 'admin') return { error: 'Admin access required.', status: 403 };
  return auth;
}

function getBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch (e) { return {}; }
  }
  return {};
}

function jsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    const body = getBody(req);
    const urlPath = (req.url || '').split('?')[0];
    const parts = urlPath.split('/').filter(Boolean);
    const group = parts[1];
    const action = parts[2];
    const queryStr = (req.url || '').split('?')[1] || '';
    const queryId = queryStr.includes('id=') ? parseInt(queryStr.split('id=')[1]) : null;

    initDB();
    const db = readDB();

    // AUTH ROUTES
    if (group === 'auth') {
      if (action === 'register' && req.method === 'POST') {
        const { email, password } = body;
        if (!email || !password) return jsonResponse(res, 400, { error: 'Email and password required.' });
        if (db.users.find(u => u.email === email)) return jsonResponse(res, 409, { error: 'Email already registered.' });
        const hashedPassword = bcrypt.hashSync(password, 10);
        const trialStart = new Date().toISOString();
        const trialEnd = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
        const id = getNextId('users');
        const verificationCode = String(Math.floor(100000 + Math.random() * 900000));
        const verificationToken = jwt.sign({ id, email, code: verificationCode }, JWT_SECRET, { expiresIn: '24h' });
        db.users.push({ id, email, password: hashedPassword, role: 'customer', plan: 'trial', trial_start: trialStart, trial_end: trialEnd, email_verified: false, verification_code: verificationCode, created_at: new Date().toISOString() });
        writeDB(db);
        return jsonResponse(res, 201, { message: 'Registration successful. Please verify your email.', verificationToken, email });
      }
      if (action === 'login' && req.method === 'POST') {
        const { email, password } = body;
        if (!email || !password) return jsonResponse(res, 400, { error: 'Email and password required.' });
        const user = db.users.find(u => u.email === email);
        if (!user) return jsonResponse(res, 401, { error: 'Invalid credentials.' });
        if (!bcrypt.compareSync(password, user.password)) return jsonResponse(res, 401, { error: 'Invalid credentials.' });
        if (!user.email_verified) return jsonResponse(res, 403, { error: 'Please verify your email before logging in.', unverified: true });
        const now = new Date();
        let plan = user.plan;
        if (plan === 'trial' && user.trial_end && new Date(user.trial_end) < now) plan = 'expired';
        else if (plan === 'monthly' && user.subscription_end && new Date(user.subscription_end) < now) plan = 'expired';
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role, plan }, JWT_SECRET, { expiresIn: '7d' });
        return jsonResponse(res, 200, { message: 'Login successful.', token, user: { id: user.id, email: user.email, role: user.role, plan, trialEnd: user.trial_end, subscriptionEnd: user.subscription_end, subscriptionStart: user.subscription_start } });
      }
      if (action === 'me' && req.method === 'GET') {
        const auth = authenticateToken(req);
        if (auth.error) return jsonResponse(res, auth.status, { error: auth.error });
        const user = db.users.find(u => u.id === auth.user.id);
        if (!user) return jsonResponse(res, 404, { error: 'User not found.' });
        const { password, ...safe } = user;
        return jsonResponse(res, 200, { user: safe });
      }
      if (action === 'verify' && req.method === 'POST') {
        const { email, code, token } = body;
        let userId, verificationCode;
        if (token) {
          try {
            const decoded = jwt.verify(token, JWT_SECRET);
            userId = decoded.id;
            verificationCode = decoded.code;
          } catch (err) {
            return jsonResponse(res, 400, { error: 'Invalid or expired verification link.' });
          }
        } else if (email && code) {
          const user = db.users.find(u => u.email === email);
          if (!user) return jsonResponse(res, 404, { error: 'User not found.' });
          if (user.email_verified) return jsonResponse(res, 400, { error: 'Email already verified.' });
          if (user.verification_code !== code) return jsonResponse(res, 400, { error: 'Invalid verification code.' });
          userId = user.id;
          verificationCode = user.verification_code;
        } else {
          return jsonResponse(res, 400, { error: 'Email and code or token required.' });
        }
        const userIdx = db.users.findIndex(u => u.id === userId);
        if (userIdx === -1) return jsonResponse(res, 404, { error: 'User not found.' });
        db.users[userIdx] = { ...db.users[userIdx], email_verified: true, verification_code: undefined };
        writeDB(db);
        return jsonResponse(res, 200, { message: 'Email verified successfully. You can now log in.' });
      }
      if (action === 'resend-verification' && req.method === 'POST') {
        const { email } = body;
        if (!email) return jsonResponse(res, 400, { error: 'Email required.' });
        const userIdx = db.users.findIndex(u => u.email === email);
        if (userIdx === -1) return jsonResponse(res, 404, { error: 'User not found.' });
        if (db.users[userIdx].email_verified) return jsonResponse(res, 400, { error: 'Email already verified.' });
        const newCode = String(Math.floor(100000 + Math.random() * 900000));
        const newToken = jwt.sign({ id: db.users[userIdx].id, email, code: newCode }, JWT_SECRET, { expiresIn: '24h' });
        db.users[userIdx] = { ...db.users[userIdx], verification_code: newCode };
        writeDB(db);
        return jsonResponse(res, 200, { message: 'Verification code sent.', verificationToken: newToken });
      }
    }

    // PAYMENT ROUTES
    if (group === 'payment') {
      if (action === 'submit' && req.method === 'POST') {
        const auth = authenticateToken(req);
        if (auth.error) return jsonResponse(res, auth.status, { error: auth.error });
        const { plan_type, amount, receipt_notes } = body;
        if (!plan_type || !amount) return jsonResponse(res, 400, { error: 'Plan type and amount required.' });
        if (plan_type !== 'monthly' && plan_type !== 'lifetime') return jsonResponse(res, 400, { error: 'Invalid plan type.' });
        const expectedAmount = plan_type === 'monthly' ? 50 : 199;
        if (Math.abs(amount - expectedAmount) > 0.01) return jsonResponse(res, 400, { error: `Amount must be $${expectedAmount}.` });
        const id = getNextId('payment_receipts');
        db.payment_receipts.push({ id, user_id: auth.user.id, plan_type, amount, receipt_notes: receipt_notes || '', status: 'pending', submitted_at: new Date().toISOString() });
        writeDB(db);
        return jsonResponse(res, 201, { message: 'Receipt submitted. Send payment proof to WhatsApp 968-99061298.', receipt_id: id });
      }
      if (action === 'status' && req.method === 'GET') {
        const auth = authenticateToken(req);
        if (auth.error) return jsonResponse(res, auth.status, { error: auth.error });
        const user = db.users.find(u => u.id === auth.user.id);
        if (!user) return jsonResponse(res, 404, { error: 'User not found.' });
        const now = new Date();
        let accessLevel = 'none';
        if (user.plan === 'trial' && user.trial_end && new Date(user.trial_end) >= now) accessLevel = 'trial';
        else if (user.plan === 'monthly' && user.subscription_end && new Date(user.subscription_end) >= now) accessLevel = 'monthly';
        else if (user.plan === 'lifetime') accessLevel = 'lifetime';
        else accessLevel = 'expired';
        return jsonResponse(res, 200, { plan: user.plan, accessLevel, trialEnd: user.trial_end, subscriptionStart: user.subscription_start, subscriptionEnd: user.subscription_end, trialDaysRemaining: user.plan === 'trial' && user.trial_end ? Math.max(0, Math.ceil((new Date(user.trial_end) - now) / 86400000)) : 0 });
      }
      if (action === 'my-receipts' && req.method === 'GET') {
        const auth = authenticateToken(req);
        if (auth.error) return jsonResponse(res, auth.status, { error: auth.error });
        const receipts = db.payment_receipts.filter(r => r.user_id === auth.user.id).sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
        return jsonResponse(res, 200, { receipts });
      }
    }

    // ADMIN ROUTES
    if (group === 'admin') {
      const adminAuth = requireAdmin(req);
      if (adminAuth.error) return jsonResponse(res, adminAuth.status, { error: adminAuth.error });

      if (action === 'dashboard' && req.method === 'GET') {
        const totalUsers = db.users.filter(u => u.role === 'customer').length;
        const approvedReceipts = db.payment_receipts.filter(r => r.status === 'approved');
        const revenue = approvedReceipts.reduce((sum, r) => sum + r.amount, 0);
        return jsonResponse(res, 200, { total_users: totalUsers, revenue, approved_subscriptions: approvedReceipts.length });
      }
      if (action === 'receipts' && req.method === 'GET') {
        const receipts = db.payment_receipts.map(r => {
          const user = db.users.find(u => u.id === r.user_id);
          return { ...r, email: user ? user.email : 'Unknown' };
        }).sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
        return jsonResponse(res, 200, { receipts });
      }
      if (action === 'receipts' && req.method === 'POST' && queryStr.includes('approve')) {
        if (!queryId) return jsonResponse(res, 400, { error: 'Receipt ID required.' });
        const idx = db.payment_receipts.findIndex(r => r.id === queryId);
        if (idx === -1) return jsonResponse(res, 404, { error: 'Receipt not found.' });
        const receipt = db.payment_receipts[idx];
        if (receipt.status !== 'pending') return jsonResponse(res, 400, { error: 'Already processed.' });
        const now = new Date().toISOString();
        const subscriptionEnd = receipt.plan_type === 'monthly' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : '2099-12-31T23:59:59Z';
        const { admin_notes } = body;
        db.payment_receipts[idx] = { ...receipt, status: 'approved', admin_notes: admin_notes || '', approved_at: now };
        const userIdx = db.users.findIndex(u => u.id === receipt.user_id);
        if (userIdx !== -1) db.users[userIdx] = { ...db.users[userIdx], plan: receipt.plan_type === 'lifetime' ? 'lifetime' : 'monthly', subscription_start: now, subscription_end: subscriptionEnd };
        writeDB(db);
        return jsonResponse(res, 200, { message: `Approved. ${receipt.plan_type} subscription activated for ${receipt.email}.` });
      }
      if (action === 'receipts' && req.method === 'POST' && queryStr.includes('reject')) {
        if (!queryId) return jsonResponse(res, 400, { error: 'Receipt ID required.' });
        const idx = db.payment_receipts.findIndex(r => r.id === queryId);
        if (idx === -1) return jsonResponse(res, 404, { error: 'Receipt not found.' });
        const receipt = db.payment_receipts[idx];
        if (receipt.status !== 'pending') return jsonResponse(res, 400, { error: 'Already processed.' });
        const { admin_notes } = body;
        db.payment_receipts[idx] = { ...receipt, status: 'rejected', admin_notes: admin_notes || 'Payment not verified.' };
        writeDB(db);
        return jsonResponse(res, 200, { message: 'Receipt rejected.' });
      }
      if (action === 'users' && req.method === 'GET') {
        const users = db.users.map(u => { const { password, ...safe } = u; return safe; });
        return jsonResponse(res, 200, { users });
      }
      if (action === 'config' && req.method === 'GET') {
        return jsonResponse(res, 200, {
          payment_methods: {
            paypal: { email: 'Vijayaraghavan1960@gmail.com' },
            iban: { number: 'OM760270342000439520018', bank: 'Bankmuscat' },
            stripe: { publishable_key: 'pk_test_51T9gQs1y89aWCXv8LllBLMy6S7O4w6VyCvQyGmtFrtuqp793IKPSJxKuySKAgfkCScCWrURXHn73R1l8FEPk08ai00iYur4Vfz' },
            whatsapp: { number: '968-99061298' }
          },
          pricing: { monthly: { price: 50, currency: 'USD', duration: '1 month' }, lifetime: { price: 199, currency: 'USD', duration: 'forever' } }
        });
      }
    }

    return jsonResponse(res, 404, { error: 'Not found.' });
  } catch (err) {
    console.error('API error:', err);
    return jsonResponse(res, 500, { error: 'Server error: ' + err.message });
  }
};
