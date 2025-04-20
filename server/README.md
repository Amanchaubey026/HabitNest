# Achievement Planner Server

Backend API for the Achievement Planner application built with Node.js, Express, TypeScript, and MongoDB.

## Features

- Authentication with JWT
- CRUD operations for goals and schedule entries
- Data validation
- Error handling
- TypeScript support

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update values in `.env` file
   - Make sure MongoDB is running locally or update MONGODB_URI with your MongoDB connection string

3. Build the application:
   ```
   npm run build
   ```

4. Run the server:
   - For development: `npm run dev`
   - For production: `npm start`

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