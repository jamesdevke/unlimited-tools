const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/admin', express.static('admin'));

// Save new user
app.post('/log-user', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });

  const data = fs.existsSync(USERS_FILE)
    ? JSON.parse(fs.readFileSync(USERS_FILE))
    : [];

  const record = {
    username,
    timestamp: new Date().toISOString()
  };

  data.push(record);
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

// Admin view
app.get('/admin/users', (req, res) => {
  const adminKey = req.query.key;
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const data = fs.existsSync(USERS_FILE)
    ? JSON.parse(fs.readFileSync(USERS_FILE))
    : [];

  res.json(data);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});