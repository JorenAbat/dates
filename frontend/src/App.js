import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

// Import pages (we'll create these next)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Calendar from './pages/Calendar';
import DateManagement from './pages/DateManagement';
import Profile from './pages/Profile';
import DateIdeas from './pages/DateIdeas';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    // Initial check
    checkAuth();

    // Add event listener for storage changes
    window.addEventListener('storage', checkAuth);

    // Custom event listener for auth changes
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="sakura-petal" />
          ))}
          
          <Navigation isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
          <main className="main-content">
            <Routes>
              <Route 
                path="/" 
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/login" 
                element={<Login setIsAuthenticated={setIsAuthenticated} />} 
              />
              <Route path="/register" element={<Register />} />
              <Route
                path="/calendar"
                element={
                  <PrivateRoute>
                    <Calendar />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dates"
                element={
                  <PrivateRoute>
                    <DateManagement />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dates/:id"
                element={
                  <PrivateRoute>
                    <DateManagement />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/date-ideas"
                element={
                  <PrivateRoute>
                    <DateIdeas />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
