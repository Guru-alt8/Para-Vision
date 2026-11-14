const { db } = require('./database.js');

try {
  db.prepare('ALTER TABLE places ADD COLUMN is_verified BOOLEAN DEFAULT 1').run();
  console.log('Added is_verified to places');
} catch (e) {
  console.log('Places column is_verified might already exist');
}
