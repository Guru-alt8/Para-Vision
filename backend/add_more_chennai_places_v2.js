const { db } = require('./database.js');

const chennaiPlaces = [
  { 
    name: "Apollo Hospitals (Greams Road)", 
    type: "public space", 
    lat: 13.0617, 
    lng: 80.2492, 
    score: 4.5, 
    ramp: 1, elevator: 1, accessible_toilet: 1, handrails: 1, 
    resting_area: 1, accessible_parking: 1, automatic_doors: 1, wide_entrance: 1,
    emergency_alarm: 1, non_slip_floor: 1, lowered_counter: 1, visual_assistance: 1,
    is_verified: 1
  },
  { 
    name: "Guindy National Park", 
    type: "public space", 
    lat: 13.0033, 
    lng: 80.2333, 
    score: 3.2, 
    ramp: 1, elevator: 0, accessible_toilet: 1, handrails: 1, 
    resting_area: 1, accessible_parking: 0, automatic_doors: 0, wide_entrance: 1,
    emergency_alarm: 0, non_slip_floor: 0, lowered_counter: 0, visual_assistance: 0,
    is_verified: 1
  },
  { 
    name: "IIT Madras - Gajendra Circle", 
    type: "public space", 
    lat: 12.9915, 
    lng: 80.2336, 
    score: 4.2, 
    ramp: 1, elevator: 1, accessible_toilet: 1, handrails: 1, 
    resting_area: 1, accessible_parking: 1, automatic_doors: 0, wide_entrance: 1,
    emergency_alarm: 1, non_slip_floor: 1, lowered_counter: 0, visual_assistance: 1,
    is_verified: 1
  },
  { 
    name: "VR Chennai Mall", 
    type: "mall", 
    lat: 13.0841, 
    lng: 80.2014, 
    score: 4.9, 
    ramp: 1, elevator: 1, accessible_toilet: 1, handrails: 1, 
    resting_area: 1, accessible_parking: 1, automatic_doors: 1, wide_entrance: 1,
    emergency_alarm: 1, non_slip_floor: 1, lowered_counter: 1, visual_assistance: 1,
    is_verified: 1
  },
  { 
    name: "Semmozhi Poonga (Botanical Garden)", 
    type: "public space", 
    lat: 13.0487, 
    lng: 80.2520, 
    score: 3.8, 
    ramp: 1, elevator: 0, accessible_toilet: 1, handrails: 1, 
    resting_area: 1, accessible_parking: 1, automatic_doors: 0, wide_entrance: 1,
    emergency_alarm: 0, non_slip_floor: 1, lowered_counter: 0, visual_assistance: 0,
    is_verified: 1
  },
  { 
    name: "Anna Centenary Library", 
    type: "public space", 
    lat: 13.0117, 
    lng: 80.2415, 
    score: 4.7, 
    ramp: 1, elevator: 1, accessible_toilet: 1, handrails: 1, 
    resting_area: 1, accessible_parking: 1, automatic_doors: 1, wide_entrance: 1,
    emergency_alarm: 1, non_slip_floor: 1, lowered_counter: 1, visual_assistance: 1,
    is_verified: 1
  },
  { 
    name: "Besant Nagar Beach Pathway", 
    type: "public space", 
    lat: 12.9981, 
    lng: 80.2721, 
    score: 3.5, 
    ramp: 1, elevator: 0, accessible_toilet: 1, handrails: 1, 
    resting_area: 1, accessible_parking: 0, automatic_doors: 0, wide_entrance: 1,
    emergency_alarm: 0, non_slip_floor: 0, lowered_counter: 0, visual_assistance: 0,
    is_verified: 1
  },
  { 
    name: "T. Nagar Ranganathan Street", 
    type: "mall", 
    lat: 13.0336, 
    lng: 80.2323, 
    score: 2.0, 
    ramp: 0, elevator: 0, accessible_toilet: 0, handrails: 0, 
    resting_area: 0, accessible_parking: 0, automatic_doors: 0, wide_entrance: 0,
    emergency_alarm: 0, non_slip_floor: 0, lowered_counter: 0, visual_assistance: 0,
    is_verified: 1
  },
  { 
    name: "Mylapore Kapaleeshwarar Temple", 
    type: "public space", 
    lat: 13.0334, 
    lng: 80.2696, 
    score: 2.5, 
    ramp: 0, elevator: 0, accessible_toilet: 0, handrails: 1, 
    resting_area: 1, accessible_parking: 0, automatic_doors: 0, wide_entrance: 1,
    emergency_alarm: 0, non_slip_floor: 0, lowered_counter: 0, visual_assistance: 0,
    is_verified: 1
  },
  { 
    name: "Rajiv Gandhi Government General Hospital", 
    type: "public space", 
    lat: 13.0825, 
    lng: 80.2755, 
    score: 4.0, 
    ramp: 1, elevator: 1, accessible_toilet: 1, handrails: 1, 
    resting_area: 1, accessible_parking: 1, automatic_doors: 0, wide_entrance: 1,
    emergency_alarm: 1, non_slip_floor: 1, lowered_counter: 1, visual_assistance: 0,
    is_verified: 1
  }
];

const insertPlace = db.prepare(`
    INSERT INTO places (
      name, type, lat, lng, score, is_verified,
      ramp, elevator, accessible_toilet, handrails,
      resting_area, accessible_parking, automatic_doors, wide_entrance,
      emergency_alarm, non_slip_floor, lowered_counter, visual_assistance
    )
    VALUES (
      @name, @type, @lat, @lng, @score, @is_verified,
      @ramp, @elevator, @accessible_toilet, @handrails,
      @resting_area, @accessible_parking, @automatic_doors, @wide_entrance,
      @emergency_alarm, @non_slip_floor, @lowered_counter, @visual_assistance
    )
`);

const count = db.prepare('SELECT COUNT(*) as count FROM places').get().count;
console.log(`Current places in DB: ${count}`);

const insertMany = db.transaction((places) => {
    let added = 0;
    for (const place of places) {
        const exists = db.prepare('SELECT id FROM places WHERE name = ?').get(place.name);
        if(!exists) {
            insertPlace.run(place);
            added++;
        }
    }
    return added;
});

const result = insertMany(chennaiPlaces);
console.log(`Successfully added ${result} new places in Chennai!`);
const newCount = db.prepare('SELECT COUNT(*) as count FROM places').get().count;
console.log(`Total places in DB: ${newCount}`);
