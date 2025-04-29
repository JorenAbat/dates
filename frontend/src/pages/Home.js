import React, { useState, useEffect } from 'react';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';
import { getDates } from '../services/api';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

function Home() {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);

        // Fetch dates
        const datesData = await getDates();
        setDates(datesData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get upcoming dates (next 7 days)
  const upcomingDates = dates
    .filter(date => isAfter(new Date(date.date), startOfDay(new Date())) && 
                   isBefore(new Date(date.date), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Get recent dates (past 7 days)
  const recentDates = dates
    .filter(date => isBefore(new Date(date.date), startOfDay(new Date())) && 
                   isAfter(new Date(date.date), new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate total budget
  const totalBudget = dates.reduce((sum, date) => 
    sum + (date.estimated_budget ? parseFloat(date.estimated_budget) : 0), 0);

  // Calculate average budget per date
  const averageBudget = dates.length > 0 ? totalBudget / dates.length : 0;

  if (loading) {
    return (
      <div className="dashboard">
        <div className="text-center py-8">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome back, {user?.username || 'there'}! 👋</h1>
        <p>Here's what's happening with your dates</p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Dates</h3>
          <p>{dates.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Budget</h3>
          <p>${totalBudget.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Average Budget</h3>
          <p>${averageBudget.toFixed(2)}</p>
        </div>
      </div>

      {/* Upcoming Dates */}
      <div>
        <div className="section-header">
          <h2>Upcoming Dates</h2>
          <Link to="/calendar">View All</Link>
        </div>
        <div className="dates-list">
          {upcomingDates.length > 0 ? (
            <ul>
              {upcomingDates.map(date => (
                <li key={date.id} className="date-item">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3>{date.title}</h3>
                      <p>{format(new Date(date.date), 'PPP p')}</p>
                      {date.location_name && (
                        <p className="location">{date.location_name}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {date.estimated_budget && (
                        <p className="budget">
                          ${parseFloat(date.estimated_budget).toFixed(2)}
                        </p>
                      )}
                      <Link
                        to={`/dates/${date.id}`}
                        className="view-link"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              No upcoming dates in the next 7 days
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="section-header">
          <h2>Recent Activity</h2>
          <Link to="/dates">View All</Link>
        </div>
        <div className="dates-list">
          {recentDates.length > 0 ? (
            <ul>
              {recentDates.map(date => (
                <li key={date.id} className="date-item">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3>{date.title}</h3>
                      <p>{format(new Date(date.date), 'PPP p')}</p>
                      {date.location_name && (
                        <p className="location">{date.location_name}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {date.estimated_budget && (
                        <p className="budget">
                          ${parseFloat(date.estimated_budget).toFixed(2)}
                        </p>
                      )}
                      <Link
                        to={`/dates/${date.id}`}
                        className="view-link"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              No recent activity in the past 7 days
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link
            to="/dates/new"
            className="action-button primary"
          >
            Plan New Date
          </Link>
          <Link
            to="/calendar"
            className="action-button secondary"
          >
            View Calendar
          </Link>
          <Link
            to="/profile"
            className="action-button secondary"
          >
            Update Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home; 