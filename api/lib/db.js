const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join('/tmp', 'datasaas-db.json');

function readDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    }
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
    db.users.push({
      id: 1,
      email: 'Vijayaraghavan1960@gmail.com',
      password: hashedPassword,
      role: 'admin',
      plan: 'lifetime',
      trial_start: now,
      trial_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      subscription_start: now,
      subscription_end: '2099-12-31T23:59:59Z',
      created_at: now
    });
    writeDB(db);
  }
  return db;
}

function getNextId(collection) {
  const db = readDB();
  const items = db[collection] || [];
  return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
}

module.exports = { readDB, writeDB, initDB, getNextId };
