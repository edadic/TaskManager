const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const db = require('../config/database');

// Get comments for a task
router.get('/task/:taskId', auth, (req, res) => {
  const { taskId } = req.params;
  db.query(
    `SELECT c.*, u.username 
     FROM comments c 
     JOIN users u ON c.user_id = u.id 
     WHERE c.task_id = ? 
     ORDER BY c.created_at DESC`,
    [taskId],
    (err, results) => {
      if (err) {
        console.error('Error fetching comments:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

// Add a comment
router.post('/', auth, (req, res) => {
  const { taskId, content } = req.body;
  
  if (!taskId || !content) {
    return res.status(400).json({ error: 'Task ID and content are required' });
  }

  db.query(
    'INSERT INTO comments (task_id, user_id, content) VALUES (?, ?, ?)',
    [taskId, req.user.id, content],
    (err, result) => {
      if (err) {
        console.error('Error adding comment:', err);
        return res.status(500).json({ error: err.message });
      }
      
      // Fetch the newly created comment with username
      db.query(
        `SELECT c.*, u.username 
         FROM comments c 
         JOIN users u ON c.user_id = u.id 
         WHERE c.id = ?`,
        [result.insertId],
        (err, results) => {
          if (err) {
            console.error('Error fetching new comment:', err);
            return res.status(500).json({ error: err.message });
          }
          res.json(results[0]);
        }
      );
    }
  );
});

// Delete a comment
router.delete('/:id', auth, (req, res) => {
  db.query(
    'DELETE FROM comments WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Comment deleted successfully' });
    }
  );
});

module.exports = router;