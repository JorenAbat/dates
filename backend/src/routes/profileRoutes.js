const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const authMiddleware = require('../middleware/authMiddleware');

// Get user profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get profile data if it exists
    const profileResult = await query(
      'SELECT bio, preferences FROM profiles WHERE user_id = $1',
      [userId]
    );

    const user = result.rows[0];
    const profile = profileResult.rows[0] || { bio: '', preferences: {} };

    res.json({
      ...user,
      ...profile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, bio, preferences } = req.body;

    // Update user table
    await query(
      'UPDATE users SET username = $1, email = $2 WHERE id = $3',
      [username, email, userId]
    );

    // Update or insert profile
    const profileExists = await query(
      'SELECT 1 FROM profiles WHERE user_id = $1',
      [userId]
    );

    if (profileExists.rows.length > 0) {
      await query(
        'UPDATE profiles SET bio = $1, preferences = $2 WHERE user_id = $3',
        [bio, preferences, userId]
      );
    } else {
      await query(
        'INSERT INTO profiles (user_id, bio, preferences) VALUES ($1, $2, $3)',
        [userId, bio, preferences]
      );
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router; 