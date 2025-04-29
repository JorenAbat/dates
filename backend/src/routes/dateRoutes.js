const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Get all dates for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, user_id, title, description, date, location_name, latitude, longitude, estimated_budget, created_at, updated_at FROM dates ORDER BY date DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching dates:', err);
    res.status(500).json({ message: 'Error fetching dates' });
  }
});

// Create a new date
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, date, location_name, latitude, longitude, estimated_budget } = req.body;

  try {
    const result = await query(
      'INSERT INTO dates (user_id, title, description, date, location_name, latitude, longitude, estimated_budget) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [req.user.id, title, description, date, location_name, latitude, longitude, estimated_budget]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating date:', err);
    res.status(500).json({ message: 'Error creating date' });
  }
});

// Update a date
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, date, location_name, latitude, longitude, estimated_budget } = req.body;
  const dateId = req.params.id;

  try {
    // First check if the date belongs to the user
    const dateCheck = await query(
      'SELECT * FROM dates WHERE id = $1 AND user_id = $2',
      [dateId, req.user.id]
    );

    if (dateCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Date not found' });
    }

    const result = await query(
      'UPDATE dates SET title = $1, description = $2, date = $3, location_name = $4, latitude = $5, longitude = $6, estimated_budget = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 AND user_id = $9 RETURNING *',
      [title, description, date, location_name, latitude, longitude, estimated_budget, dateId, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating date:', err);
    res.status(500).json({ message: 'Error updating date' });
  }
});

// Delete a date
router.delete('/:id', authMiddleware, async (req, res) => {
  const dateId = req.params.id;

  try {
    // First check if the date belongs to the user
    const dateCheck = await query(
      'SELECT * FROM dates WHERE id = $1 AND user_id = $2',
      [dateId, req.user.id]
    );

    if (dateCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Date not found' });
    }

    await query(
      'DELETE FROM dates WHERE id = $1 AND user_id = $2',
      [dateId, req.user.id]
    );

    res.json({ message: 'Date deleted successfully' });
  } catch (err) {
    console.error('Error deleting date:', err);
    res.status(500).json({ message: 'Error deleting date' });
  }
});

module.exports = router; 