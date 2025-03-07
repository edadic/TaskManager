const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const db = require('../config/database');

// Get all users (admin only)
router.get('/', auth, isAdmin, (req, res) => {
  console.log('Fetching users...'); // Add this for debugging
  db.query(
    'SELECT id, username, email, role, created_at FROM users',
    (err, results) => {
      if (err) {
        console.error('Error fetching users:', err); // Add this for debugging
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

// Get user profile
router.get('/profile', auth, (req, res) => {
  db.query(
    'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
    [req.user.id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(results[0]);
    }
  );
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  const { email, password } = req.body;
  try {
    let updates = [];
    let values = [];

    if (email) {
      updates.push('email = ?');
      values.push(email);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    values.push(req.user.id);

    db.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values,
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email already in use' });
          }
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Profile updated successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;