const bcrypt = require('bcryptjs');
const { db, initDb } = require('./database.js');

initDb();

const email = 'guru2dayu@gmail.com';
const password = 'ParaAdmin';
const name = 'Admin';

const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
if (existing) {
  // Update role to admin and update password if already exists
  const hash = bcrypt.hashSync(password, 10);
  db.prepare("UPDATE users SET role = 'admin', password_hash = ? WHERE email = ?").run(hash, email);
  console.log('Admin role and password updated for:', email);
} else {
  const hash = bcrypt.hashSync(password, 10);
  db.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')")
    .run(name, email, hash);
  console.log('Admin user created:', email);
}
