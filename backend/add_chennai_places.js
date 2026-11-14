const { db } = require('./database.js');

const morePlaces = [
  { name: "Chennai International Airport", type: "transit", lat: 12.9716, lng: 80.1636, score: 4.8, ramp: 1, elevator: 1, accessible_toilet: 1, handrails: 1 },
  { name: "Marina Beach Accessible Pathway", type: "public space", lat: 13.0485, lng: 80.2831, score: 4.0, ramp: 1, elevator: 0, accessible_toilet: 0, handrails: 1 },
  { name: "Express Avenue Mall", type: "mall", lat: 13.0566, lng: 80.2642, score: 5.0, ramp: 1, elevator: 1, accessible_toilet: 1, handrails: 1 },
  { name: "Chennai Egmore Railway Station", type: "transit", lat: 13.0805, lng: 80.2612, score: 3.5, ramp: 1, elevator: 1, accessible_toilet: 0, handrails: 1 },
  { name: "Government Museum Chennai", type: "public space", lat: 13.0710, lng: 80.2580, score: 3.0, ramp: 1, elevator: 0, accessible_toilet: 0, handrails: 0 }
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
console.log(`Successfully added ${added} new places in Chennai!`);
