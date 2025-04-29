const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

// Get all dates for a user
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM dates ORDER BY date DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching dates:', err);
    res.status(500).json({ error: 'Failed to fetch dates' });
  }
});

// Create a new date
router.post('/', auth, async (req, res) => {
  const { title, description, date, location, locationName, latitude, longitude } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO dates (user_id, title, description, date, location, location_name, latitude, longitude, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
       RETURNING *`,
      [req.user.id, title, description, date, location, locationName, latitude, longitude, 'planned']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating date:', err);
    res.status(500).json({ error: 'Failed to create date' });
  }
});

// Update a date
router.put('/:id', auth, async (req, res) => {
  const { title, description, date, location, locationName, latitude, longitude, status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE dates 
       SET title = $1, description = $2, date = $3, location = $4, 
           location_name = $5, latitude = $6, longitude = $7, status = $8, updated_at = NOW()
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      [title, description, date, location, locationName, latitude, longitude, status, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Date not found or unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating date:', err);
    res.status(500).json({ error: 'Failed to update date' });
  }
});

// Delete a date
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM dates WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Date not found or unauthorized' });
    }

    res.json({ message: 'Date deleted successfully' });
  } catch (err) {
    console.error('Error deleting date:', err);
    res.status(500).json({ error: 'Failed to delete date' });
  }
});

module.exports = router; 