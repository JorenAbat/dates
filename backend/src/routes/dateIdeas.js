const express = require('express');
const router = express.Router();
const dateIdeaController = require('../controllers/dateIdeaController');
const auth = require('../middleware/auth');

// Get all date ideas (no auth required)
router.get('/', dateIdeaController.getAllDateIdeas);

// Create a new date idea (auth required)
router.post('/', auth, dateIdeaController.createDateIdea);

// Update a date idea (auth required)
router.put('/:dateId', auth, dateIdeaController.updateDateIdea);

// Delete a date idea (auth required)
router.delete('/:dateId', auth, dateIdeaController.deleteDateIdea);

module.exports = router; 