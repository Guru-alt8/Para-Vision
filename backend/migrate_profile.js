const { db } = require('./database.js');

const cols = [
  { name: 'age', def: 'INTEGER' },
  { name: 'gender', def: 'TEXT' },
  { name: 'disability_type', def: 'TEXT' },
  { name: 'phone', def: 'TEXT' },
  { name: 'city', def: 'TEXT' },
  { name: 'bio', def: 'TEXT' },
];

for (const col of cols) {
  try {
    db.prepare(`ALTER TABLE users ADD COLUMN ${col.name} ${col.def}`).run();
    console.log(`Added column: ${col.name}`);
  } catch {
    console.log(`Column already exists: ${col.name}`);
  }
}
