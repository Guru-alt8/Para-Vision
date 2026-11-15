const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'accessmap.db');

let db;
try {
  const Database = require('better-sqlite3');
  db = new Database(dbPath);
} catch (err) {
  // If better-sqlite3 native binary is missing/mismatched, fall back to built-in node:sqlite
  const { DatabaseSync } = require('node:sqlite');
  db = new DatabaseSync(dbPath);

  if (!db.transaction) {
    db.transaction = function(fn) {
      return function(...args) {
        db.exec('BEGIN');
        try {
          const res = fn(...args);
          db.exec('COMMIT');
          return res;
        } catch (e) {
          db.exec('ROLLBACK');
          throw e;
        }
      };
    };
  }

  const origPrepare = db.prepare.bind(db);
  db.prepare = function(sql) {
    const stmt = origPrepare(sql);
    const origRun = stmt.run.bind(stmt);
    const origGet = stmt.get.bind(stmt);
    const origAll = stmt.all.bind(stmt);

    stmt.run = function(...args) {
      if (args.length === 1 && Array.isArray(args[0])) return origRun(...args[0]);
      return origRun(...args);
    };
    stmt.get = function(...args) {
      if (args.length === 1 && Array.isArray(args[0])) return origGet(...args[0]);
      return origGet(...args);
    };
    stmt.all = function(...args) {
      if (args.length === 1 && Array.isArray(args[0])) return origAll(...args[0]);
      return origAll(...args);
    };
    return stmt;
  };
}

function initDb() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      score REAL DEFAULT 0,
      ramp BOOLEAN DEFAULT 0,
      elevator BOOLEAN DEFAULT 0,
      accessible_toilet BOOLEAN DEFAULT 0,
      handrails BOOLEAN DEFAULT 0,
      resting_area BOOLEAN DEFAULT 0,
      accessible_parking BOOLEAN DEFAULT 0,
      automatic_doors BOOLEAN DEFAULT 0,
      wide_entrance BOOLEAN DEFAULT 0,
      emergency_alarm BOOLEAN DEFAULT 0,
      non_slip_floor BOOLEAN DEFAULT 0,
      lowered_counter BOOLEAN DEFAULT 0,
      visual_assistance BOOLEAN DEFAULT 0,
      is_verified BOOLEAN DEFAULT 1
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      place_id INTEGER,
      user_id INTEGER,
      user_rating INTEGER NOT NULL,
      ramp BOOLEAN DEFAULT 0,
      elevator BOOLEAN DEFAULT 0,
      accessible_toilet BOOLEAN DEFAULT 0,
      handrails BOOLEAN DEFAULT 0,
      resting_area BOOLEAN DEFAULT 0,
      accessible_parking BOOLEAN DEFAULT 0,
      automatic_doors BOOLEAN DEFAULT 0,
      wide_entrance BOOLEAN DEFAULT 0,
      emergency_alarm BOOLEAN DEFAULT 0,
      non_slip_floor BOOLEAN DEFAULT 0,
      lowered_counter BOOLEAN DEFAULT 0,
      visual_assistance BOOLEAN DEFAULT 0,
      description TEXT,
      photo_url TEXT,
      violation_flag BOOLEAN DEFAULT 0,
      status TEXT DEFAULT 'Pending' ,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(place_id) REFERENCES places(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `).run();

  // Add new columns to existing tables if they don't exist
  const newCols = [
    'resting_area', 'accessible_parking', 'automatic_doors', 'wide_entrance', 
    'emergency_alarm', 'non_slip_floor', 'lowered_counter', 'visual_assistance'
  ];

  for (const col of newCols) {
    try {
      db.prepare(`ALTER TABLE places ADD COLUMN ${col} BOOLEAN DEFAULT 0`).run();
    } catch (e) { /* ignore if column exists */ }
    try {
      db.prepare(`ALTER TABLE reports ADD COLUMN ${col} BOOLEAN DEFAULT 0`).run();
    } catch (e) { /* ignore if column exists */ }
  }

  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

module.exports = { db, initDb };
