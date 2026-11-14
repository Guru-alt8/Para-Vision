const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'accessmap.db'));

const corrections = [
  { name: 'Chennai International Airport Metro', lat: 12.9808, lng: 80.1642 },
  { name: 'Chennai International Airport', lat: 12.9808, lng: 80.1642 }, // Both variations
  { name: 'Phoenix Marketcity', lat: 12.9906, lng: 80.2163 },
  { name: 'VR Chennai Mall', lat: 13.0811, lng: 80.1967 },
  { name: 'Marina Beach Accessible Pathway', lat: 13.0475, lng: 80.2824 },
  { name: 'Apollo Hospitals (Greams Road)', lat: 13.0588, lng: 80.2512 },
  { name: 'Arignar Anna Alandur Metro (Interchange)', lat: 12.9992, lng: 80.2017 },
  { name: 'Semmozhi Poonga (Botanical Garden)', lat: 13.0494, lng: 80.2510 }
];

const updateStmt = db.prepare('UPDATE places SET lat = ?, lng = ? WHERE name = ?');

let updatedCount = 0;
for (const loc of corrections) {
  const info = updateStmt.run(loc.lat, loc.lng, loc.name);
  if (info.changes > 0) {
    updatedCount++;
    console.log(`Updated precision for: ${loc.name}`);
  } else {
    // Try fuzzy
    const fuzzy = db.prepare('UPDATE places SET lat = ?, lng = ? WHERE name LIKE ?').run(loc.lat, loc.lng, `%${loc.name}%`);
    if (fuzzy.changes > 0) {
      updatedCount++;
      console.log(`Updated precision for (Fuzzy): ${loc.name}`);
    } else {
       console.warn(`Could not find entry for: ${loc.name}`);
    }
  }
}

console.log(`Total precision updates completed in accessmap.db: ${updatedCount}`);
db.close();
