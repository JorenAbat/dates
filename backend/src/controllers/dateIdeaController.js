const { query } = require('../config/database');

// Get all date ideas
exports.getAllDateIdeas = async (req, res) => {
  try {
    const result = await query(
      'SELECT "dateId", content, "userId", username, created_at, updated_at FROM date_ideas ORDER BY created_at DESC'
    );
    // Transform the response to use camelCase
    const transformedRows = result.rows.map(row => ({
      dateId: row.dateId,
      content: row.content,
      userId: row.userId,
      username: row.username,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    res.json(transformedRows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching date ideas', error: error.message });
  }
};

// Create a new date idea
exports.createDateIdea = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { content, userId, username } = req.body;
    
    if (!content || !userId || !username) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: req.body,
        required: ['content', 'userId', 'username']
      });
    }

    const result = await query(
      'INSERT INTO date_ideas (content, "userId", username) VALUES ($1, $2, $3) RETURNING "dateId", content, "userId", username, created_at, updated_at',
      [content, userId, username]
    );
    // Transform the response to use camelCase
    const transformedRow = {
      dateId: result.rows[0].dateId,
      content: result.rows[0].content,
      userId: result.rows[0].userId,
      username: result.rows[0].username,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at
    };
    res.status(201).json(transformedRow);
  } catch (error) {
    console.error('Error creating date idea:', error);
    res.status(400).json({ message: 'Error creating date idea', error: error.message });
  }
};

// Update a date idea
exports.updateDateIdea = async (req, res) => {
  try {
    const { dateId } = req.params;
    const { content, userId } = req.body;
    
    // First check if the date idea exists and belongs to the user
    const checkResult = await query(
      'SELECT "userId" FROM date_ideas WHERE "dateId" = $1',
      [dateId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Date idea not found' });
    }
    
    if (checkResult.rows[0].userId !== userId) {
      return res.status(403).json({ message: 'You can only update your own date ideas' });
    }
    
    const result = await query(
      'UPDATE date_ideas SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE "dateId" = $2 RETURNING "dateId", content, "userId", username, created_at, updated_at',
      [content, dateId]
    );
    
    // Transform the response to use camelCase
    const transformedRow = {
      dateId: result.rows[0].dateId,
      content: result.rows[0].content,
      userId: result.rows[0].userId,
      username: result.rows[0].username,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at
    };
    res.json(transformedRow);
  } catch (error) {
    res.status(400).json({ message: 'Error updating date idea', error: error.message });
  }
};

// Delete a date idea
exports.deleteDateIdea = async (req, res) => {
  try {
    const { dateId } = req.params;
    const { userId } = req.body;
    
    // First check if the date idea exists and belongs to the user
    const checkResult = await query(
      'SELECT "userId" FROM date_ideas WHERE "dateId" = $1',
      [dateId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Date idea not found' });
    }
    
    if (checkResult.rows[0].userId !== userId) {
      return res.status(403).json({ message: 'You can only delete your own date ideas' });
    }
    
    const result = await query(
      'DELETE FROM date_ideas WHERE "dateId" = $1 RETURNING "dateId"',
      [dateId]
    );
    
    res.json({ message: 'Date idea deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting date idea', error: error.message });
  }
}; 