import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { getDateIdeas, createDateIdea, updateDateIdea, deleteDateIdea } from '../services/api';
import '../styles/DateIdeas.css';

const DateIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [newIdea, setNewIdea] = useState('');
  const [editingIdea, setEditingIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchDateIdeas();
  }, []);

  const fetchDateIdeas = async () => {
    try {
      const data = await getDateIdeas();
      setIdeas(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch date ideas');
      setLoading(false);
    }
  };

  const handleAddIdea = async (e) => {
    e.preventDefault();
    if (!newIdea.trim()) return;

    try {
      const ideaData = {
        content: newIdea,
        userId: currentUser.id,
        username: currentUser.username
      };
      console.log('Sending idea data:', ideaData);
      const newIdeaData = await createDateIdea(ideaData);
      setIdeas([newIdeaData, ...ideas]);
      setNewIdea('');
    } catch (err) {
      console.error('Error adding date idea:', err);
      setError('Failed to add date idea');
    }
  };

  const handleEditIdea = (idea) => {
    setEditingIdea(idea);
    setNewIdea(idea.content);
  };

  const handleUpdateIdea = async (e) => {
    e.preventDefault();
    if (!newIdea.trim()) return;

    try {
      console.log('Current user:', currentUser);
      console.log('Editing idea:', editingIdea);
      if (!editingIdea || (!editingIdea.dateId && !editingIdea.dateid)) {
        console.error('No idea selected for editing or missing dateId');
        return;
      }
      const updateData = { 
        content: newIdea,
        userId: currentUser.id,
        username: currentUser.username
      };
      console.log('Sending update data:', updateData);
      const updatedIdea = await updateDateIdea(editingIdea.dateId || editingIdea.dateid, updateData);
      console.log('Received updated idea:', updatedIdea);
      const updatedIdeas = ideas.map(idea => 
        (idea.dateId || idea.dateid) === (editingIdea.dateId || editingIdea.dateid) ? updatedIdea : idea
      );
      setIdeas(updatedIdeas);
      setEditingIdea(null);
      setNewIdea('');
    } catch (err) {
      console.error('Error updating date idea:', err);
      setError('Failed to update date idea');
    }
  };

  const handleDeleteIdea = async (dateId) => {
    try {
      await deleteDateIdea(dateId);
      setIdeas(ideas.filter(idea => (idea.dateId || idea.dateid) !== dateId));
    } catch (err) {
      setError('Failed to delete date idea');
    }
  };

  if (loading) {
    return <div className="loading">Loading date ideas...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="date-ideas-container">
      <h1>Date Ideas</h1>
      
      <form onSubmit={editingIdea ? handleUpdateIdea : handleAddIdea} className="idea-form">
        <textarea
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          placeholder="Share your date idea..."
          className="idea-input"
        />
        <button type="submit" className="submit-button">
          {editingIdea ? 'Update Idea' : 'Add Idea'}
        </button>
        {editingIdea && (
          <button 
            type="button" 
            onClick={() => {
              setEditingIdea(null);
              setNewIdea('');
            }}
            className="cancel-button"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="ideas-list">
        {ideas.map((idea, index) => (
          <div key={`${idea.dateId || idea.dateid}-${index}`} className="idea-card">
            <div className="idea-content">{idea.content}</div>
            <div className="idea-meta">
              <span className="username">{idea.username}</span>
              <span className="timestamp">
                {idea.createdAt ? format(new Date(idea.createdAt), 'MMM d, yyyy h:mm a') : 'Just now'}
              </span>
            </div>
            {currentUser && idea.userId === currentUser.id && (
              <div className="idea-actions">
                <button 
                  onClick={() => handleEditIdea(idea)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteIdea(idea.dateId || idea.dateid)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DateIdeas; 