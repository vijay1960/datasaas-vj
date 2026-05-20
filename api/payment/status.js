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

  const now = new Date();
  let accessLevel = 'none';
  if (user.plan === 'trial' && user.trial_end && new Date(user.trial_end) >= now) accessLevel = 'trial';
  else if (user.plan === 'monthly' && user.subscription_end && new Date(user.subscription_end) >= now) accessLevel = 'monthly';
  else if (user.plan === 'lifetime') accessLevel = 'lifetime';
  else accessLevel = 'expired';

  res.json({
    plan: user.plan, accessLevel,
    trialEnd: user.trial_end, subscriptionStart: user.subscription_start, subscriptionEnd: user.subscription_end,
    trialDaysRemaining: user.plan === 'trial' && user.trial_end
      ? Math.max(0, Math.ceil((new Date(user.trial_end) - now) / (1000 * 60 * 60 * 24))) : 0
  });
};
