const { db } = require('./database.js');

const morePlaces = [
  { name: "Lalbagh Botanical Garden", type: "public space", lat: 12.9507, lng: 77.5848, score: 3.5, ramp: 1, elevator: 0, accessible_toilet: 1, handrails: 1 },
  { name: "Kempegowda Int. Airport", type: "transit", lat: 13.1986, lng: 77.7066, score: 4.9, ramp: 1, elevator: 1, accessible_toilet: 1, handrails: 1 },
  { name: "NIMHANS", type: "hospital", lat: 12.9373, lng: 77.5950, score: 4.2, ramp: 1, elevator: 1, accessible_toilet: 1, handrails: 1 },
  { name: "Charminar Area", type: "public space", lat: 17.3616, lng: 78.4747, score: 2.0, ramp: 0, elevator: 0, accessible_toilet: 0, handrails: 0 },
  { name: "Victoria Memorial", type: "public space", lat: 22.5448, lng: 88.3426, score: 3.0, ramp: 1, elevator: 0, accessible_toilet: 0, handrails: 1 },
  { name: "Apollo Health City Hyderabad", type: "hospital", lat: 17.4170, lng: 78.4116, score: 4.5, ramp: 1, elevator: 1, accessible_toilet: 1, handrails: 1 },
  { name: "Orion Mall Bengaluru", type: "mall", lat: 13.0110, lng: 77.5550, score: 4.8, ramp: 1, elevator: 1, accessible_toilet: 1, handrails: 1 },
  { name: "Science City Kolkata", type: "public space", lat: 22.5401, lng: 88.3965, score: 4.0, ramp: 1, elevator: 1, accessible_toilet: 1, handrails: 1 },
  { name: "Chennai Central Railway Station", type: "transit", lat: 13.0827, lng: 80.2707, score: 3.8, ramp: 1, elevator: 1, accessible_toilet: 1, handrails: 1 },
  { name: "Siddhivinayak Temple", type: "public space", lat: 19.0163, lng: 72.8300, score: 3.2, ramp: 1, elevator: 1, accessible_toilet: 0, handrails: 1 }
];

const insertPlace = db.prepare(`
    INSERT INTO places (name, type, lat, lng, score, ramp, elevator, accessible_toilet, handrails)
    VALUES (@name, @type, @lat, @lng, @score, @ramp, @elevator, @accessible_toilet, @handrails)
`);

const insertMany = db.transaction((places) => {
    let count = 0;
    for (const place of places) {
        // Prevent exact duplicates
        const exists = db.prepare('SELECT id FROM places WHERE name = ?').get(place.name);
        if(!exists) {
            insertPlace.run(place);
            count++;
        }
    }
    return count;
});

const added = insertMany(morePlaces);
console.log(`Successfully added ${added} new places!`);
