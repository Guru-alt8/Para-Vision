const { db } = require('./database.js');
const fs = require('fs');

let dump = "================ ACCESSMAP INDIA DATABASE ================\n\n";

dump += "------------- PLACES -------------\n";
const places = db.prepare('SELECT * FROM places').all();
dump += JSON.stringify(places, null, 2);

dump += "\n\n------------- REPORTS -------------\n";
const reports = db.prepare('SELECT * FROM reports').all();
dump += JSON.stringify(reports, null, 2);

fs.writeFileSync('database_dump.txt', dump);
console.log("Database dumped to database_dump.txt");
