const fs = require('fs');

async function fetchAmenities() {
  // Chennai bounding box: south, west, north, east
  const bbox = '12.95,80.15,13.15,80.30';

  const query = `[out:json][timeout:60];
(
  node["amenity"="toilets"](${bbox});
  node["amenity"="pharmacy"](${bbox});
  node["highway"="bus_stop"](${bbox});
);
out body;`;

  const mirrors = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  ];

  for (const url of mirrors) {
    try {
      console.log(`Trying ${url} ...`);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        console.log(`  HTTP ${response.status} — skipping`);
        continue;
      }

      const data = await response.json();
      const elements = data.elements || [];
      console.log(`  Got ${elements.length} real amenities!`);
      fs.writeFileSync('chennai_amenities.json', JSON.stringify(elements, null, 2));
      console.log('Saved to chennai_amenities.json');
      return;
    } catch (err) {
      console.log(`  Failed: ${err.message}`);
    }
  }

  console.error('All mirrors failed. No file written.');
}

fetchAmenities();
