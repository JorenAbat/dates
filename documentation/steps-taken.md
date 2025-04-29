# Steps Taken to Build the Couple's Date Planner

## 1. Project Structure Setup

### 1.1 Directory Structure
```bash
mkdir -p frontend/src/{components,pages,services,hooks,utils,styles}
mkdir -p backend/src/{controllers,models,routes,middleware,utils}
```
- Created a modular directory structure for both frontend and backend
- Frontend directories:
  - `components`: Reusable UI components
  - `pages`: Main page components
  - `services`: API service functions
  - `hooks`: Custom React hooks
  - `utils`: Utility functions
  - `styles`: CSS and styling files
- Backend directories:
  - `controllers`: Request handlers
  - `models`: Database models
  - `routes`: API routes
  - `middleware`: Express middleware
  - `utils`: Utility functions

### 1.2 Git Initialization
```bash
git init
```
- Initialized Git repository for version control
- Allows tracking changes and collaboration

## 2. Backend Setup

### 2.1 Node.js Project Initialization
```bash
cd backend
npm init -y
```
- Created `package.json` with default configuration
- Set up the backend as a Node.js project

### 2.2 Installing Dependencies
```bash
npm install express pg dotenv cors jsonwebtoken bcrypt
npm install --save-dev nodemon
```
- Core dependencies:
  - `express`: Web framework for Node.js
  - `pg`: PostgreSQL client for Node.js
  - `dotenv`: Environment variable management
  - `cors`: Cross-Origin Resource Sharing middleware
  - `jsonwebtoken`: JWT authentication
  - `bcrypt`: Password hashing
- Development dependency:
  - `nodemon`: Auto-restarts server on file changes

### 2.3 Basic Express Server Setup
Created `backend/src/app.js`:
```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Couple\'s Date Planner API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```
- Set up basic Express server with middleware
- Added error handling
- Created test route
- Configured environment variables

### 2.4 Environment Variables
Created `.env` file (manually):
```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/couple_dates
JWT_SECRET=your_jwt_secret_key_here
```
- Configured essential environment variables
- Set up database connection string
- Added JWT secret for authentication

## 3. Frontend Setup

### 3.1 React Application Creation
```bash
cd frontend
npx create-react-app .
```
- Created new React application
- Set up development environment
- Installed core React dependencies

### 3.2 Installing Frontend Dependencies
```bash
npm install react-router-dom @fullcalendar/react @fullcalendar/daygrid axios
```
- `react-router-dom`: Client-side routing
- `@fullcalendar/react`: Calendar component
- `@fullcalendar/daygrid`: Calendar day grid view
- `axios`: HTTP client for API requests

### 3.3 Setting Up Routing
Created `frontend/src/App.js`:
```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import './App.css';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Calendar from './pages/Calendar';
import DateManagement from './pages/DateManagement';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/dates" element={<DateManagement />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
```
- Set up React Router for navigation
- Created route structure for all pages
- Added basic layout with navigation and main content area

### 3.4 Creating Page Components

#### Home Page (`frontend/src/pages/Home.js`)
```javascript
import React from 'react';

function Home() {
  return (
    <div className="home">
      <h1>Welcome to Couple's Date Planner</h1>
      <p>Plan and organize your special moments together</p>
    </div>
  );
}
```
- Simple welcome page
- Introduces the application's purpose

#### Login Page (`frontend/src/pages/Login.js`)
```javascript
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login form submitted:', formData);
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}
```
- Form with email and password fields
- Form state management using React hooks
- Link to registration page
- Basic form validation

#### Register Page (`frontend/src/pages/Register.js`)
```javascript
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement registration logic
    console.log('Registration form submitted:', formData);
  };

  return (
    <div className="register">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}
```
- Registration form with name, email, and password fields
- Password confirmation
- Form state management
- Link to login page

#### Calendar Page (`frontend/src/pages/Calendar.js`)
```javascript
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

function Calendar() {
  return (
    <div className="calendar">
      <h2>Date Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
        }}
        events={[
          // TODO: Add events from API
          { title: 'Date Night', date: '2024-03-15' },
          { title: 'Movie Night', date: '2024-03-20' }
        ]}
        height="auto"
      />
    </div>
  );
}
```
- Integrated FullCalendar component
- Set up calendar views (month, week, day)
- Added sample events
- Configured calendar toolbar

#### Date Management Page (`frontend/src/pages/DateManagement.js`)
```javascript
import React, { useState } from 'react';

function DateManagement() {
  const [dates, setDates] = useState([
    // Sample data - will be replaced with API data
    {
      id: 1,
      title: 'Movie Night',
      date: '2024-03-15',
      location: 'Local Cinema',
      status: 'planned'
    },
    {
      id: 2,
      title: 'Dinner Date',
      date: '2024-03-20',
      location: 'Italian Restaurant',
      status: 'planned'
    }
  ]);

  return (
    <div className="date-management">
      <h2>Manage Dates</h2>
      <div className="date-list">
        {dates.map(date => (
          <div key={date.id} className="date-card">
            <h3>{date.title}</h3>
            <p>Date: {date.date}</p>
            <p>Location: {date.location}</p>
            <p>Status: {date.status}</p>
            <button>Edit</button>
            <button>Delete</button>
          </div>
        ))}
      </div>
      <button className="add-date-btn">Add New Date</button>
    </div>
  );
}
```
- Date listing with sample data
- Basic CRUD operations UI
- State management for dates
- Card-based layout for dates

#### Profile Page (`frontend/src/pages/Profile.js`)
```javascript
import React, { useState } from 'react';

function Profile() {
  const [user, setUser] = useState({
    // Sample data - will be replaced with API data
    name: 'John Doe',
    email: 'john@example.com',
    joinDate: '2024-03-01'
  });

  return (
    <div className="profile">
      <h2>Profile</h2>
      <div className="profile-info">
        <div>
          <label>Name:</label>
          <span>{user.name}</span>
        </div>
        <div>
          <label>Email:</label>
          <span>{user.email}</span>
        </div>
        <div>
          <label>Member Since:</label>
          <span>{user.joinDate}</span>
        </div>
      </div>
      <div className="profile-actions">
        <button>Edit Profile</button>
        <button>Change Password</button>
      </div>
    </div>
  );
}
```
- User profile display
- Sample user data
- Profile editing options
- Password change option

### 3.5 Navigation Component
Created `frontend/src/components/Navigation.js`:
```javascript
import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="navigation">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/calendar">Calendar</Link></li>
        <li><Link to="/dates">Dates</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
}
```
- Navigation bar component
- Links to all main pages
- Uses React Router's Link component

### 3.6 Styling
Created and updated CSS files:

#### App.css
```css
/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

/* App layout */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navigation */
.navigation {
  background-color: #333;
  padding: 1rem;
}

.navigation ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.navigation a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.navigation a:hover {
  background-color: #555;
}

/* Main content */
.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Page specific styles */
.home {
  text-align: center;
  padding: 2rem;
}

.home h1 {
  margin-bottom: 1rem;
  color: #333;
}

/* Form styles */
form {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f5f5f5;
  border-radius: 8px;
}

form div {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #333;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #555;
}
```
- Reset and base styles
- Navigation styling
- Form styling
- Layout and spacing
- Responsive design elements

#### index.css
```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8f8f8;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
```
- Global styles
- Font settings
- Background color

## 4. Key Learning Points

### React Concepts Used
1. **Components**: Created reusable UI components
2. **State Management**: Used React's useState hook
3. **Routing**: Implemented client-side routing with react-router-dom
4. **Forms**: Created controlled form components
5. **Props and State**: Managed component data flow
6. **Event Handling**: Implemented form submissions and changes
7. **Conditional Rendering**: Used in form validation
8. **CSS Styling**: Applied styles using CSS modules

### Backend Concepts Used
1. **Express Setup**: Basic server configuration
2. **Middleware**: CORS and JSON parsing
3. **Environment Variables**: Configuration management
4. **Error Handling**: Basic error middleware
5. **Routing**: Basic API route setup

### Development Practices
1. **Modular Structure**: Organized code into logical directories
2. **Component Separation**: Separated concerns into different components
3. **State Management**: Used React hooks for state
4. **Form Handling**: Implemented controlled forms
5. **Styling**: Used CSS for styling with a focus on reusability
6. **Routing**: Set up client-side routing
7. **API Integration**: Prepared for backend integration

## 5. Next Steps
1. Implement backend authentication
2. Set up database models and migrations
3. Create API endpoints
4. Connect frontend to backend
5. Add form validation
6. Implement user authentication flow
7. Add date creation and management functionality
8. Enhance calendar integration
9. Add location management
10. Implement media upload functionality 