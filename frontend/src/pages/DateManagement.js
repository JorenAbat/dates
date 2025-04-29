import React, { useState, useEffect, useRef } from 'react';
import { getDates, createDate, deleteDate, updateDate } from '../services/api';
import { format } from 'date-fns';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState, Modifier } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../styles/DateManagement.css';
import CustomDatePickerComponent from '../components/DatePicker';
import DateDetails from '../components/DateDetails';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48];
const DEFAULT_FONT_SIZE = 16;

const DateManagement = () => {
  const { id } = useParams();
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPastDates, setShowPastDates] = useState(false);
  const searchTimeout = useRef(null);
  const [newDate, setNewDate] = useState({
    id: null,
    title: '',
    description: '',
    date: '',
    location: '',
    estimated_budget: ''
  });
  const [currentFontSize, setCurrentFontSize] = useState(DEFAULT_FONT_SIZE);
  const [selectedDate, setSelectedDate] = useState(null);
  const { currentUser } = useAuth();

  const fetchDates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDates();
      setDates(data);
      
      // If an ID is provided in the URL, find and select that date
      if (id) {
        const dateToView = data.find(date => date.id === parseInt(id));
        if (dateToView) {
          setSelectedDate(dateToView);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDates();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input change - ${name}:`, value); // Debug log
    setNewDate(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'location') {
      handleLocationSearch(value);
    }
  };

  const handleLocationSearch = async (query) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!query.trim()) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        );
        const data = await response.json();
        setLocationSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    }, 300);
  };

  const handleLocationSelect = (location) => {
    console.log('Selected location:', location); // Debug log
    setNewDate(prev => ({
      ...prev,
      location: location.display_name
    }));
    setShowSuggestions(false);
  };

  const getCurrentFontSize = (editorState) => {
    const selection = editorState.getSelection();
    const currentStyle = editorState.getCurrentInlineStyle();
    
    let fontSize = DEFAULT_FONT_SIZE;
    currentStyle.forEach(style => {
      if (style.startsWith('FONTSIZE_')) {
        fontSize = parseInt(style.split('_')[1]);
      }
    });
    return fontSize;
  };

  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    setCurrentFontSize(getCurrentFontSize(newEditorState));
    const html = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
    setNewDate(prev => ({
      ...prev,
      description: html
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const dateData = {
        ...newDate,
        description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        location_name: newDate.location,
        estimated_budget: newDate.estimated_budget ? parseFloat(newDate.estimated_budget) : null
      };

      console.log('Submitting date data:', dateData); // Debug log

      if (isEditing) {
        await updateDate(newDate.id, dateData);
      } else {
        await createDate(dateData);
      }
      resetForm();
      await fetchDates();
    } catch (err) {
      setError(err.message || 'Error saving date');
      console.error('Error saving date:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewDate({
      id: null,
      title: '',
      description: '',
      date: '',
      location: '',
      estimated_budget: ''
    });
    setEditorState(EditorState.createEmpty());
    setIsEditing(false);
    setError(null);
    setShowAddForm(false);
  };

  const handleEdit = (date) => {
    try {
      console.log('Editing date with budget:', date.estimated_budget); // Debug log
      let editorContent = EditorState.createEmpty();
      if (date.description) {
        const contentBlock = htmlToDraft(date.description);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          editorContent = EditorState.createWithContent(contentState);
        }
      }

      const formattedDate = date.date ? format(new Date(date.date), "yyyy-MM-dd'T'HH:mm") : '';
      
      setNewDate({
        id: date.id,
        title: date.title || '',
        description: date.description || '',
        date: formattedDate,
        location: date.location_name || '',
        estimated_budget: date.estimated_budget || ''
      });
      
      setEditorState(editorContent);
      setIsEditing(true);
      setShowAddForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error setting up edit form:', err);
      setError('Failed to load date for editing');
    }
  };

  const handleDelete = async (dateId) => {
    if (!window.confirm('Are you sure you want to delete this date?')) return;
    
    setLoading(true);
    setError(null);
    try {
      await deleteDate(dateId);
      await fetchDates();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting date:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowAddForm(false);
  };

  const handleCloseDetails = () => {
    setSelectedDate(null);
  };

  const handleDateChange = (date) => {
    setNewDate(prev => ({
      ...prev,
      date: date ? format(date, "yyyy-MM-dd'T'HH:mm") : ''
    }));
  };

  const filterDates = (dates) => {
    const now = new Date();
    return {
      upcoming: dates.filter(date => new Date(date.date) >= now),
      past: dates.filter(date => new Date(date.date) < now)
    };
  };

  return (
    <div className="date-management">
      <div className="date-management-container">
        <h1 className="date-management-title">Date Management</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading && <div className="loading-text">Loading...</div>}
        
        {!loading && (
          <>
            <button 
              className="add-date-button"
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
            >
              Add New Date
            </button>
            
            {showAddForm && (
              <form className="date-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={newDate.title}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Date & Time</label>
                    <CustomDatePickerComponent
                      selected={newDate.date ? new Date(newDate.date) : null}
                      onChange={handleDateChange}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="date-location-group">
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <div className="location-search-input-wrapper">
                        <input
                          type="text"
                          name="location"
                          value={newDate.location}
                          onChange={handleInputChange}
                          placeholder="Search for a location..."
                          className="form-input"
                        />
                        {showSuggestions && locationSuggestions.length > 0 && (
                          <div className="autocomplete-dropdown-container">
                            {locationSuggestions.map((suggestion) => (
                              <div
                                key={suggestion.place_id}
                                className="suggestion-item"
                                onClick={() => handleLocationSelect(suggestion)}
                              >
                                <span>{suggestion.display_name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Estimated Budget</label>
                    <div className="budget-input-wrapper">
                      <span className="currency-symbol">$</span>
                      <input
                        type="number"
                        name="estimated_budget"
                        value={newDate.estimated_budget}
                        onChange={handleInputChange}
                        className="form-input budget-input"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <div className="description-editor">
                      <Editor
                        editorState={editorState}
                        onEditorStateChange={handleEditorStateChange}
                        wrapperClassName="wrapper-class"
                        editorClassName="editor-input"
                        toolbarClassName="toolbar-class"
                        toolbar={{
                          options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'link', 'history'],
                          inline: {
                            options: ['bold', 'italic', 'underline', 'strikethrough'],
                          },
                          blockType: {
                            options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote'],
                          },
                          fontSize: {
                            options: FONT_SIZES,
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    {isEditing ? 'Update Date' : 'Add Date'}
                  </button>
                  <button type="button" className="cancel-button" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </>
        )}
        
        {!loading && dates.length > 0 && (
          <>
            <div className="dates-section">
              <h2 className="section-title">Upcoming Dates</h2>
              <div className="dates-grid">
                {filterDates(dates).upcoming.map(date => (
                  <div 
                    key={date.id} 
                    className={`date-card ${selectedDate?.id === date.id ? 'selected' : ''}`}
                    onClick={() => handleDateClick(date)}
                  >
                    <h3 className="date-card-title">{date.title}</h3>
                    <p className="date-card-date">{format(new Date(date.date), 'PPP p')}</p>
                    {date.estimated_budget !== null && date.estimated_budget !== undefined && date.estimated_budget !== '' && (
                      <p className="date-card-budget">
                        <span className="budget-icon">💰</span>
                        ${(parseFloat(date.estimated_budget) || 0).toFixed(2)}
                      </p>
                    )}
                    <p className="date-card-location">
                      <a 
                        href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(date.location_name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="location-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {date.location_name}
                      </a>
                    </p>
                    <div className="date-card-actions">
                      <button 
                        className="edit-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(date);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(date.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dates-section">
              <div className="section-header">
                <h2 className="section-title">Past Dates</h2>
                <button 
                  className="toggle-past-dates"
                  onClick={() => setShowPastDates(!showPastDates)}
                >
                  {showPastDates ? 'Hide Past Dates' : 'Show Past Dates'}
                </button>
              </div>
              {showPastDates && (
                <div className="dates-grid">
                  {filterDates(dates).past.map(date => (
                    <div 
                      key={date.id} 
                      className={`date-card past-date ${selectedDate?.id === date.id ? 'selected' : ''}`}
                      onClick={() => handleDateClick(date)}
                    >
                      <h3 className="date-card-title">{date.title}</h3>
                      <p className="date-card-date">{format(new Date(date.date), 'PPP p')}</p>
                      {date.estimated_budget !== null && date.estimated_budget !== undefined && date.estimated_budget !== '' && (
                        <p className="date-card-budget">
                          <span className="budget-icon">💰</span>
                          ${(parseFloat(date.estimated_budget) || 0).toFixed(2)}
                        </p>
                      )}
                      <p className="date-card-location">
                        <a 
                          href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(date.location_name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="location-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {date.location_name}
                        </a>
                      </p>
                      <div className="date-card-actions">
                        <button 
                          className="edit-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(date);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(date.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        
        {!loading && dates.length === 0 && (
          <div className="empty-message">
            No dates found. Add your first date to get started!
          </div>
        )}
        
        {selectedDate && (
          <div className="date-details-modal">
            <div className="date-details-content">
              <DateDetails date={selectedDate} onClose={handleCloseDetails} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateManagement; 