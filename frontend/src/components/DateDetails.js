import React from 'react';
import { format } from 'date-fns';
import '../styles/DateDetails.css';

const DateDetails = ({ date, onClose }) => {
  if (!date) return null;

  return (
    <div className="date-details">
      <div className="date-details-header">
        <h2>{date.title}</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="date-info">
        <p className="date-time">
          {format(new Date(date.date), 'PPP p')}
        </p>
        
        {date.location_name && (
          <div className="location-info">
            <p className="location-name">
              <a 
                href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(date.location_name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="location-link"
              >
                {date.location_name}
              </a>
            </p>
          </div>
        )}
        
        {date.estimated_budget && (
          <div className="date-budget">
            <span className="budget-icon">💰</span>
            ${parseFloat(date.estimated_budget).toFixed(2)}
          </div>
        )}
        
        {date.description && (
          <div className="date-description">
            <div dangerouslySetInnerHTML={{ __html: date.description }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DateDetails; 