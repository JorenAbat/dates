# Couple's Date Planner

A web application to help organize and plan dates with your significant other.

## Features

### Core Features
- [ ] User Authentication
  - Login/Register system
  - Profile management
  - Secure password storage
- [ ] Date Management
  - Create, edit, and delete dates
  - Date details (title, description, time, location)
  - Status tracking (planned, completed, cancelled)
- [ ] Calendar Integration
  - Monthly, weekly, and daily views
  - Color-coded date types
  - Drag-and-drop functionality
- [ ] Location Management
  - Address storage
  - Maps integration
  - Favorite locations
- [ ] Database Storage
  - Persistent data storage
  - Data backup
  - Secure data handling

### Advanced Features
- [ ] Date Categories
  - Romantic
  - Adventure
  - Food & Dining
  - Entertainment
  - Custom categories
- [ ] Budget Tracking
  - Cost estimation
  - Expense logging
  - Budget limits
- [ ] Media Integration
  - Photo uploads
  - Date memories
  - Photo gallery
- [ ] Weather Integration
  - Weather forecasts
  - Weather-based suggestions
- [ ] Notifications
  - Date reminders
  - Weather alerts
  - Special occasion notifications

## Technical Requirements

### Frontend
- React.js
- React Router for navigation
- FullCalendar.js for calendar functionality
- Google Maps API for location services
- CSS Modules for styling (simple, scoped CSS)
- Axios for API calls

### Backend
- Node.js
- Express.js
- PostgreSQL database
- JWT for authentication
- Multer for file uploads

### APIs and Services
- Google Maps API
- Weather API (e.g., OpenWeatherMap)
- Cloud storage for images

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Dates Table
```sql
CREATE TABLE dates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(100) NOT NULL,
  description TEXT,
  date_time TIMESTAMP NOT NULL,
  location_id INTEGER REFERENCES locations(id),
  category_id INTEGER REFERENCES categories(id),
  status VARCHAR(20) DEFAULT 'planned',
  budget DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Locations Table
```sql
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Photos Table
```sql
CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  date_id INTEGER REFERENCES dates(id),
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Installation Steps

1. Clone the repository
```bash
git clone [repository-url]
cd couple-dates
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
```bash
# Create .env file in backend directory
cp .env.example .env

# Create .env file in frontend directory
cp .env.example .env
```

4. Set up the database
```bash
# Create database
createdb couple_dates

# Run migrations
cd backend
npm run migrate
```

5. Start the development servers
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd frontend
npm start
```

## Project Structure

```
couple-dates/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   ├── package.json
│   └── .env
└── README.md
```

## Development Roadmap

### Phase 1: Core Setup
- [ ] Basic project structure
- [ ] Database setup
- [ ] User authentication
- [ ] Basic date creation

### Phase 2: Essential Features
- [ ] Calendar implementation
- [ ] Location management
- [ ] Date editing and deletion
- [ ] Basic UI/UX

### Phase 3: Advanced Features
- [ ] Photo uploads
- [ ] Weather integration
- [ ] Budget tracking
- [ ] Notifications

### Phase 4: Polish
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Error handling
- [ ] Documentation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 