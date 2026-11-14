const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'accessmap.db'));

try {
  // Ensure the name column is unique to support UPSERT/Conflict resolution safely
  db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_places_name ON places(name)`);

  const metroStations = [
    // Blue Line (Corridor 1)
    { name: 'Wimco Nagar Metro', lat: 13.1751, lng: 80.3015 },
    { name: 'Tiruvottriyur Metro', lat: 13.1610, lng: 80.3013 },
    { name: 'Kaladipet Metro', lat: 13.1492, lng: 80.3005 },
    { name: 'Tollgate Metro', lat: 13.1421, lng: 80.2982 },
    { name: 'New Washermanpet Metro', lat: 13.1345, lng: 80.2932 },
    { name: 'Tondiarpet Metro', lat: 13.1251, lng: 80.2912 },
    { name: 'Sir Theagaraya College Metro', lat: 13.1165, lng: 80.2882 },
    { name: 'Washermanpet Metro', lat: 13.1099, lng: 80.2831 },
    { name: 'Mannadi Metro', lat: 13.1018, lng: 80.2832 },
    { name: 'High Court Metro', lat: 13.0906, lng: 80.2861 },
    { name: 'Chennai Central Metro (Interchange)', lat: 13.0827, lng: 80.2707 },
    { name: 'Government Estate Metro', lat: 13.0718, lng: 80.2687 },
    { name: 'LIC Metro', lat: 13.0645, lng: 80.2644 },
    { name: 'Thousand Lights Metro', lat: 13.0592, lng: 80.2588 },
    { name: 'AG-DMS Metro', lat: 13.0485, lng: 80.2514 },
    { name: 'Teynampet Metro', lat: 13.0410, lng: 80.2464 },
    { name: 'Nandanam Metro', lat: 13.0335, lng: 80.2431 },
    { name: 'Saidapet Metro', lat: 13.0232, lng: 80.2375 },
    { name: 'Little Mount Metro', lat: 13.0163, lng: 80.2312 },
    { name: 'Guindy Metro', lat: 13.0084, lng: 80.2215 },
    { name: 'Alandur Metro (Interchange)', lat: 12.9992, lng: 80.2017 },
    { name: 'Nanganallur Road Metro', lat: 12.9912, lng: 80.1917 },
    { name: 'Meenambakkam Metro', lat: 12.9868, lng: 80.1772 },
    { name: 'Chennai International Airport Metro', lat: 12.9808, lng: 80.1642 },

    // Green Line (Corridor 2)
    { name: 'Egmore Metro', lat: 13.0792, lng: 80.2612 },
    { name: 'Nehru Park Metro', lat: 13.0791, lng: 80.2517 },
    { name: 'Kilpauk Metro', lat: 13.0783, lng: 80.2434 },
    { name: 'Pachaiyappa\'s College Metro', lat: 13.0785, lng: 80.2341 },
    { name: 'Shenoy Nagar Metro', lat: 13.0788, lng: 80.2252 },
    { name: 'Anna Nagar East Metro', lat: 13.0827, lng: 80.2187 },
    { name: 'Anna Nagar Tower Metro', lat: 13.0846, lng: 80.2099 },
    { name: 'Thirumangalam Metro', lat: 13.0850, lng: 80.1988 },
    { name: 'Koyambedu Metro', lat: 13.0732, lng: 80.1947 },
    { name: 'Puratchi Thalaivi Dr J. Jayalalithaa CMBT Metro', lat: 13.0673, lng: 80.1914 },
    { name: 'Arumbakkam Metro', lat: 13.0617, lng: 80.2045 },
    { name: 'Vadapalani Metro', lat: 13.0501, lng: 80.2117 },
    { name: 'Ashok Nagar Metro', lat: 13.0351, lng: 80.2115 },
    { name: 'Ekkattuthangal Metro', lat: 13.0187, lng: 80.2052 },
    { name: 'St. Thomas Mount Metro', lat: 12.9959, lng: 80.2025 }
  ];

  const insertPlace = db.prepare(`
    INSERT INTO places (name, type, lat, lng, score, is_verified, ramp, elevator, accessible_toilet, handrails)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(name) DO UPDATE SET
      lat = excluded.lat,
      lng = excluded.lng
  `);

  const insertStations = db.transaction((stations) => {
    for (const station of stations) {
      insertPlace.run(station.name, 'transit', station.lat, station.lng, 4.0, 1, 1, 1, 1, 1);
    }
  });

  insertStations(metroStations);
  console.log(`Successfully seeded/updated 39 Chennai Metro stations in accessmap.db.`);
} catch (error) {
  console.error('Error seeding metro stations:', error);
} finally {
  db.close();
}
