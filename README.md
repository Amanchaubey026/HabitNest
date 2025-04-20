# Achievement Planner

A complete web application for planning and tracking goals and daily schedules. Built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript.

## Features

- **User Authentication**: Register, login, and secure access to personal data
- **Monthly/Yearly Goal Tracker**:
  - CRUD operations for goals
  - Track goals by month or year
  - Update progress status (not started, in progress, completed)
- **Daily Scheduler**:
  - Plan time blocks throughout the day
  - View timeline of daily activities
  - Manage schedule entries with notes

## Technology Stack

### Backend
- Node.js + Express with TypeScript
- MongoDB with Mongoose
- JWT authentication
- RESTful API architecture

### Frontend
- React with TypeScript
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Responsive design

## Project Structure

The project is organized into two main directories:

- `/server`: Contains the backend API code
- `/client`: Contains the frontend React application

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup
1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the environment variables with your values

4. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user profile

### Goals
- `GET /api/goals` - Get all goals (with optional month/year filtering)
- `GET /api/goals/:id` - Get a single goal
- `POST /api/goals` - Create a new goal
- `PUT /api/goals/:id` - Update a goal
- `DELETE /api/goals/:id` - Delete a goal

### Schedule
- `GET /api/schedule` - Get all schedule entries (with optional date filtering)
- `GET /api/schedule/:id` - Get a single schedule entry
- `POST /api/schedule` - Create a new schedule entry
- `PUT /api/schedule/:id` - Update a schedule entry
- `DELETE /api/schedule/:id` - Delete a schedule entry

## License

MIT
