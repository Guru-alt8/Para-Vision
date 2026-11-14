const express = require('express');
const cors = require('cors');
const { db, initDb } = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

const JWT_SECRET = 'accessmap_india_secret_key_2024';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize DB (creates tables if not exist)
initDb();

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// --- AUTH ROUTES ---

// Sign up
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password are required' });
  try {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const password_hash = await bcrypt.hash(password, 10);
    const info = db.prepare(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
    ).run(name, email, password_hash);

    const token = jwt.sign(
      { id: info.lastInsertRowid, name, email, role: 'user' },
      JWT_SECRET, { expiresIn: '7d' }
    );
    res.json({ token, user: { id: info.lastInsertRowid, name, email, role: 'user' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET, { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current logged-in user
app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Profile endpoints
app.get('/api/auth/profile', authenticate, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, role, age, gender, disability_type, phone, city, bio FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/auth/profile', authenticate, (req, res) => {
  const { name, age, gender, disability_type, phone, city, bio } = req.body;
  try {
    db.prepare(`
      UPDATE users 
      SET name = ?, age = ?, gender = ?, disability_type = ?, phone = ?, city = ?, bio = ?
      WHERE id = ?
    `).run(name, age, gender, disability_type, phone, city, bio, req.user.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all places
app.get('/api/places', (req, res) => {
  try {
    const places = db.prepare('SELECT * FROM places WHERE is_verified = 1').all();
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all places (including unverified)
app.get('/api/admin/places', authenticate, isAdmin, (req, res) => {
  try {
    const places = db.prepare('SELECT * FROM places').all();
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update place details
app.put('/api/admin/places/:id', authenticate, isAdmin, (req, res) => {
  const { id } = req.params;
  const { 
    name, type, score, 
    ramp, elevator, accessible_toilet, handrails,
    resting_area, accessible_parking, automatic_doors, wide_entrance,
    emergency_alarm, non_slip_floor, lowered_counter, visual_assistance,
    is_verified
  } = req.body;

  try {
    db.prepare(`
      UPDATE places SET 
        name = ?, type = ?, score = ?, 
        ramp = ?, elevator = ?, accessible_toilet = ?, handrails = ?,
        resting_area = ?, accessible_parking = ?, automatic_doors = ?, wide_entrance = ?,
        emergency_alarm = ?, non_slip_floor = ?, lowered_counter = ?, visual_assistance = ?,
        is_verified = ?
      WHERE id = ?
    `).run(
      name, type, score, 
      ramp ? 1 : 0, elevator ? 1 : 0, accessible_toilet ? 1 : 0, handrails ? 1 : 0,
      resting_area ? 1 : 0, accessible_parking ? 1 : 0, automatic_doors ? 1 : 0, wide_entrance ? 1 : 0,
      emergency_alarm ? 1 : 0, non_slip_floor ? 1 : 0, lowered_counter ? 1 : 0, visual_assistance ? 1 : 0,
      is_verified ? 1 : 0,
      id
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit a report / rate a place
app.post('/api/reports', upload.single('evidence'), (req, res) => {
  const { 
    place_name, place_type, lat, lng, user_rating, 
    ramp, elevator, accessible_toilet, handrails,
    resting_area, accessible_parking, automatic_doors, wide_entrance,
    emergency_alarm, non_slip_floor, lowered_counter, visual_assistance,
    description, violation_flag 
  } = req.body;

  const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
  
  try {
    const insertPlaceOrGet = db.transaction(() => {
      let place = db.prepare('SELECT id, score FROM places WHERE name = ?').get(place_name);
      let place_id;
      
      if (!place) {
        const info = db.prepare(`
          INSERT INTO places (
            name, type, lat, lng, score, 
            ramp, elevator, accessible_toilet, handrails,
            resting_area, accessible_parking, automatic_doors, wide_entrance,
            emergency_alarm, non_slip_floor, lowered_counter, visual_assistance,
            is_verified
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        `).run(
          place_name, place_type, lat || 20, lng || 77, user_rating, 
          ramp ? 1 : 0, elevator ? 1 : 0, accessible_toilet ? 1 : 0, handrails ? 1 : 0,
          resting_area ? 1 : 0, accessible_parking ? 1 : 0, automatic_doors ? 1 : 0, wide_entrance ? 1 : 0,
          emergency_alarm ? 1 : 0, non_slip_floor ? 1 : 0, lowered_counter ? 1 : 0, visual_assistance ? 1 : 0
        );
        place_id = info.lastInsertRowid;
      } else {
        place_id = place.id;
      }

      const reportInfo = db.prepare(`
        INSERT INTO reports (
          place_id, user_rating, 
          ramp, elevator, accessible_toilet, handrails,
          resting_area, accessible_parking, automatic_doors, wide_entrance,
          emergency_alarm, non_slip_floor, lowered_counter, visual_assistance,
          description, photo_url, violation_flag
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        place_id, user_rating, 
        ramp === 'true' || ramp === true ? 1 : 0, 
        elevator === 'true' || elevator === true ? 1 : 0, 
        accessible_toilet === 'true' || accessible_toilet === true ? 1 : 0, 
        handrails === 'true' || handrails === true ? 1 : 0,
        resting_area === 'true' || resting_area === true ? 1 : 0, 
        accessible_parking === 'true' || accessible_parking === true ? 1 : 0, 
        automatic_doors === 'true' || automatic_doors === true ? 1 : 0, 
        wide_entrance === 'true' || wide_entrance === true ? 1 : 0,
        emergency_alarm === 'true' || emergency_alarm === true ? 1 : 0, 
        non_slip_floor === 'true' || non_slip_floor === true ? 1 : 0, 
        lowered_counter === 'true' || lowered_counter === true ? 1 : 0, 
        visual_assistance === 'true' || visual_assistance === true ? 1 : 0,
        description, photo_url, (violation_flag === 'true' || violation_flag === true) ? 1 : 0
      );
      
      return reportInfo;
    });

    const result = insertPlaceOrGet();
    res.json({ success: true, report_id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  try {
    const totalPlaces = db.prepare('SELECT COUNT(*) as count FROM places').get().count;
    const reportsToday = db.prepare("SELECT COUNT(*) as count FROM reports WHERE date(created_at) = date('now')").get().count;
    const avgScore = db.prepare('SELECT AVG(score) as avg FROM places').get().avg || 0;
    const pendingComplaints = db.prepare("SELECT COUNT(*) as count FROM reports WHERE status = 'Pending' AND violation_flag = 1").get().count;
    
    // Top 5 most inaccessible
    const topInaccessible = db.prepare(`
      SELECT p.name, p.score, COUNT(r.id) as reports 
      FROM places p 
      LEFT JOIN reports r ON p.id = r.place_id 
      WHERE p.score < 3 
      GROUP BY p.id 
      ORDER BY p.score ASC 
      LIMIT 5
    `).all();

    // Reports all
    const allReports = db.prepare(`
      SELECT r.*, p.name as place_name 
      FROM reports r 
      JOIN places p ON r.place_id = p.id
      ORDER BY r.created_at DESC
    `).all();

    res.json({
      stats: { totalPlaces, reportsToday, avgScore: avgScore.toFixed(1), pendingComplaints },
      topInaccessible,
      allReports
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/reports/:id/status', authenticate, isAdmin, (req, res) => {
  const { status } = req.body;
  try {
    db.prepare('UPDATE reports SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reports/:id/approve', authenticate, isAdmin, (req, res) => {
  try {
    const approveTransaction = db.transaction(() => {
      const reportInDb = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id);
      if (!reportInDb) throw new Error('Report not found');
      
      const place = db.prepare('SELECT * FROM places WHERE id = ?').get(reportInDb.place_id);
      if (!place) throw new Error('Place not found');

      // Use overrides from body if provided, otherwise fallback to DB record
      const finalFeatures = { ...reportInDb, ...req.body };
      
      const userRating = typeof req.body.user_rating !== 'undefined' ? req.body.user_rating : reportInDb.user_rating;
      const newScore = place.is_verified ? (place.score + userRating) / 2 : userRating;
      
      db.prepare(`
        UPDATE places 
        SET is_verified = 1, score = ?, 
            ramp = MAX(ramp, ?), elevator = MAX(elevator, ?), 
            accessible_toilet = MAX(accessible_toilet, ?), 
            handrails = MAX(handrails, ?),
            resting_area = MAX(resting_area, ?), accessible_parking = MAX(accessible_parking, ?),
            automatic_doors = MAX(automatic_doors, ?), wide_entrance = MAX(wide_entrance, ?),
            emergency_alarm = MAX(emergency_alarm, ?), non_slip_floor = MAX(non_slip_floor, ?),
            lowered_counter = MAX(lowered_counter, ?), visual_assistance = MAX(visual_assistance, ?)
        WHERE id = ?
      `).run(
        newScore, 
        finalFeatures.ramp ? 1 : 0, 
        finalFeatures.elevator ? 1 : 0, 
        finalFeatures.accessible_toilet ? 1 : 0, 
        finalFeatures.handrails ? 1 : 0,
        finalFeatures.resting_area ? 1 : 0, 
        finalFeatures.accessible_parking ? 1 : 0, 
        finalFeatures.automatic_doors ? 1 : 0, 
        finalFeatures.wide_entrance ? 1 : 0,
        finalFeatures.emergency_alarm ? 1 : 0, 
        finalFeatures.non_slip_floor ? 1 : 0, 
        finalFeatures.lowered_counter ? 1 : 0, 
        finalFeatures.visual_assistance ? 1 : 0,
        place.id
      );
      
      db.prepare("UPDATE reports SET status = 'Approved' WHERE id = ?").run(req.params.id);
    });
    
    approveTransaction();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reports/:id/revoke', authenticate, isAdmin, (req, res) => {
  try {
    const revokeTransaction = db.transaction(() => {
      const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id);
      if (!report) throw new Error('Report not found');

      // Hide the place from the public map again
      db.prepare('UPDATE places SET is_verified = 0 WHERE id = ?').run(report.place_id);
      // Reset the report status back to Pending
      db.prepare("UPDATE reports SET status = 'Pending' WHERE id = ?").run(req.params.id);
    });

    revokeTransaction();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics Dashboard
app.get('/api/analytics', (req, res) => {
  try {
    const featureBreakdown = [
      { name: 'Ramp', value: db.prepare('SELECT SUM(ramp) as score FROM places').get().score || 0 },
      { name: 'Elevator', value: db.prepare('SELECT SUM(elevator) as score FROM places').get().score || 0 },
      { name: 'Accessible Toilet', value: db.prepare('SELECT SUM(accessible_toilet) as score FROM places').get().score || 0 },
      { name: 'Handrails', value: db.prepare('SELECT SUM(handrails) as score FROM places').get().score || 0 },
      { name: 'Resting Areas', value: db.prepare('SELECT SUM(resting_area) as score FROM places').get().score || 0 },
      { name: 'Parking', value: db.prepare('SELECT SUM(accessible_parking) as score FROM places').get().score || 0 },
      { name: 'Auto Doors', value: db.prepare('SELECT SUM(automatic_doors) as score FROM places').get().score || 0 },
      { name: 'Wide Entry', value: db.prepare('SELECT SUM(wide_entrance) as score FROM places').get().score || 0 },
      { name: 'Emergency Alarm', value: db.prepare('SELECT SUM(emergency_alarm) as score FROM places').get().score || 0 },
      { name: 'Non-slip Floor', value: db.prepare('SELECT SUM(non_slip_floor) as score FROM places').get().score || 0 },
      { name: 'Lowered Counter', value: db.prepare('SELECT SUM(lowered_counter) as score FROM places').get().score || 0 },
      { name: 'Visual Assist', value: db.prepare('SELECT SUM(visual_assistance) as score FROM places').get().score || 0 }
    ];

    // Dummy time series for Area chart
    const reportsOverTime = [
      { name: 'Jan', reports: 12 },
      { name: 'Feb', reports: 19 },
      { name: 'Mar', reports: 3 },
      { name: 'Apr', reports: 5 },
      { name: 'May', reports: 2 },
      { name: 'Jun', reports: 3 },
    ];

    res.json({
      featureBreakdown,
      reportsOverTime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve cached amenities
app.get('/api/amenities', (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const dataPath = path.join(__dirname, 'chennai_amenities.json');
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      res.json(data);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
