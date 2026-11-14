const { db, initDb } = require('./database.js');

initDb();

const seedPlaces = [
  {
    name: "Phoenix Marketcity", type: "mall", lat: 12.9915, lng: 80.2160, score: 5, ramp: 1, elevator: 1, accessible_toilet: 1, handrails: 1
  },
  {
    name: "Apollo Hospital", type: "hospital", lat: 13.0614, lng: 80.2546, score: 4.5, ramp: 1, elevator: 1, accessible_toilet: 1, handrails: 1
  },
  {
    name: "T Nagar Bus Station", type: "bus stop", lat: 13.0401, lng: 80.2335, score: 2, ramp: 0, elevator: 0, accessible_toilet: 0, handrails: 1
  },
  {
    name: "Andheri Railway Station", type: "transit", lat: 19.1197, lng: 72.8464, score: 3.5, ramp: 1, elevator: 0, accessible_toilet: 1, handrails: 1
  },
  {
    name: "Juhu Beach Entrance", type: "public space", lat: 19.0988, lng: 72.8258, score: 3, ramp: 1, elevator: 0, accessible_toilet: 0, handrails: 0
  },
  {
    name: "Infiniti Mall", type: "mall", lat: 19.1411, lng: 72.8315, score: 4.8, ramp: 1, elevator: 1, accessible_toilet: 1, handrails: 1
  },
  {
    name: "AIIMS Delhi", type: "hospital", lat: 28.5672, lng: 77.2100, score: 4, ramp: 1, elevator: 1, accessible_toilet: 0, handrails: 1
  },
  {
    name: "Connaught Place", type: "public space", lat: 28.6304, lng: 77.2177, score: 2.5, ramp: 0, elevator: 0, accessible_toilet: 0, handrails: 0
  },
  {
    name: "New Delhi Railway Station", type: "transit", lat: 28.6429, lng: 77.2191, score: 3.8, ramp: 1, elevator: 1, accessible_toilet: 1, handrails: 1
  },
  {
    name: "Select CITYWALK", type: "mall", lat: 28.5283, lng: 77.2185, score: 5, ramp: 1, elevator: 1, accessible_toilet: 1, handrails: 1
  }
];

// Check if database is already seeded
const currentPlacesCount = db.prepare('SELECT COUNT(*) as count FROM places').get();
if (currentPlacesCount.count === 0) {
  const insertPlace = db.prepare(`
    INSERT INTO places (name, type, lat, lng, score, ramp, elevator, accessible_toilet, handrails)
    VALUES (@name, @type, @lat, @lng, @score, @ramp, @elevator, @accessible_toilet, @handrails)
  `);
  
  const insertMany = db.transaction((places) => {
    for (const place of places) insertPlace.run(place);
  });
  
  insertMany(seedPlaces);

  // Seed some dummy reports
  const insertReport = db.prepare(`
    INSERT INTO reports (place_id, user_rating, ramp, elevator, accessible_toilet, handrails, description, violation_flag, status)
    VALUES (@place_id, @user_rating, @ramp, @elevator, @accessible_toilet, @handrails, @description, @violation_flag, @status)
  `);

  insertReport.run({
    place_id: 3, user_rating: 1, ramp: 0, elevator: 0, accessible_toilet: 0, handrails: 0, description: "Very difficult to navigate on wheelchair. Ramps missing at platforms.", violation_flag: 1, status: "Pending"
  });

  insertReport.run({
    place_id: 1, user_rating: 5, ramp: 1, elevator: 1, accessible_toilet: 1, handrails: 1, description: "Excellent accessibility, smooth ramps and well-maintained accessible restrooms.", violation_flag: 0, status: "Resolved"
  });

  insertReport.run({
    place_id: 8, user_rating: 2, ramp: 0, elevator: 0, accessible_toilet: 0, handrails: 0, description: "Cobblestones make movement hard. No proper wheelchair ramps anywhere in the inner circle.", violation_flag: 1, status: "In Progress"
  });
  
  console.log("Database seeded successfully with places and reports.");
} else {
  console.log("Database already seeded. Skipping.");
}
