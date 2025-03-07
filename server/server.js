const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const { auth, isAdmin } = require('./middleware/auth');
const db = require('./config/database');

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);  // Make sure this line is present and before protected routes

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Create tasks table if it doesn't exist
db.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATETIME,
    priority VARCHAR(50),
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('Error creating tasks table:', err);
  }
});

// Create users table
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('Error creating users table:', err);
  }
});

// Modify tasks table to include user assignments
db.query(`
  SELECT COUNT(*) as count 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = 'tasks' 
  AND COLUMN_NAME IN ('assigned_by', 'assigned_to')
`, (err, results) => {
  if (err) {
    console.error('Error checking columns:', err);
    return;
  }

  if (results[0].count === 0) {
    db.query(`
      ALTER TABLE tasks 
      ADD COLUMN assigned_by INT,
      ADD COLUMN assigned_to INT,
      ADD CONSTRAINT fk_assigned_by FOREIGN KEY (assigned_by) REFERENCES users(id),
      ADD CONSTRAINT fk_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id)
    `, (err) => {
      if (err) {
        console.error('Error modifying tasks table:', err);
      } else {
        console.log('Tasks table modified successfully');
      }
    });
  } else {
    console.log('User assignment columns already exist');
  }
});

// Auth routes (unprotected)
app.use('/api/auth', authRoutes);

// Protected routes
app.get('/api/tasks', auth, (req, res) => {
  const query = req.user.role === 'admin' 
    ? 'SELECT * FROM tasks ORDER BY created_at DESC'
    : 'SELECT * FROM tasks WHERE assigned_to = ? ORDER BY created_at DESC';
  
  const params = req.user.role === 'admin' ? [] : [req.user.id];
  
  db.query(query, params, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/tasks', auth, isAdmin, (req, res) => {
  const { title, description, dueDate, priority, assignedTo } = req.body;
  db.query(
    'INSERT INTO tasks (title, description, due_date, priority, assigned_by, assigned_to) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, dueDate, priority, req.user.id, assignedTo],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

app.put('/api/tasks/:id/complete', auth, (req, res) => {
  const { id } = req.params;
  const query = req.user.role === 'admin'
    ? 'UPDATE tasks SET completed = NOT completed WHERE id = ?'
    : 'UPDATE tasks SET completed = NOT completed WHERE id = ? AND assigned_to = ?';
  
  const params = req.user.role === 'admin' ? [id] : [id, req.user.id];
  
  db.query(query, params, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Task updated successfully' });
  });
});

app.delete('/api/tasks/:id', auth, isAdmin, (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export db connection
module.exports = db;