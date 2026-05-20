const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'datasaas-secret-key-2026-secure';

function authenticateToken(req) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return { error: 'Access denied. No token provided.', status: 401 };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { user: decoded };
  } catch (err) {
    return { error: 'Invalid or expired token.', status: 403 };
  }
}

function requireAdmin(req) {
  const auth = authenticateToken(req);
  if (auth.error) return auth;
  if (auth.user.role !== 'admin') {
    return { error: 'Admin access required.', status: 403 };
  }
  return { user: auth.user };
}

module.exports = { authenticateToken, requireAdmin, JWT_SECRET };
