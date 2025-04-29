import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
        setNewBio(data.bio || '');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load profile');
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleBioEdit = () => {
    setIsEditingBio(true);
  };

  const handleBioSave = async () => {
    try {
      const updatedUser = { ...user, bio: newBio };
      await updateUserProfile(updatedUser);
      setUser(updatedUser);
      setIsEditingBio(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error updating bio:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleBioCancel = () => {
    setNewBio(user.bio || '');
    setIsEditingBio(false);
  };

  if (loading) {
    return (
      <div className="profile">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile">
        <div className="error-message">
          No profile data available
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <h2>Your Profile</h2>
        <div className="decorative-heart"></div>
      </div>
      
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <span>{user.username ? user.username.charAt(0).toUpperCase() : '?'}</span>
          </div>
          <div className="profile-info">
            <h3>{user.username || 'Anonymous User'}</h3>
            <p className="email">{user.email || 'No email provided'}</p>
          </div>
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h3>About Me</h3>
            {!isEditingBio && (
              <button 
                className="edit-button"
                onClick={handleBioEdit}
              >
                Edit Bio
              </button>
            )}
          </div>
          <div className="bio-card">
            {isEditingBio ? (
              <div className="bio-edit">
                <textarea
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
                <div className="bio-actions">
                  <button 
                    className="save-button"
                    onClick={handleBioSave}
                  >
                    Save
                  </button>
                  <button 
                    className="cancel-button"
                    onClick={handleBioCancel}
                  >
                    Cancel
                  </button>
                </div>
                {saveStatus === 'success' && (
                  <div className="success-message">Bio updated successfully!</div>
                )}
                {saveStatus === 'error' && (
                  <div className="error-message">Failed to update bio. Please try again.</div>
                )}
              </div>
            ) : (
              <p>{user.bio || 'No bio added yet'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 