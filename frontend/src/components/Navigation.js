import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    // Dispatch auth change event
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/calendar">Calendar</Link>
            </li>
            <li>
              <Link to="/dates">Dates</Link>
            </li>
            <li>
              <Link to="/date-ideas">Date Ideas</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="link-button">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation; 