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

3. Set up environment variables:
   - Copy `.env.example` to `.env.development` for local development
   - The environment variables control the API URL and development mode:
     - `REACT_APP_API_URL`: URL of the backend API
     - `REACT_APP_DEVELOPMENT`: Set to 'true' for local development, omit for production

4. Start the development server:
   ```
   npm start
   ```

## Deployment

### Backend Deployment (Render)

The backend server is configured for easy deployment on Render:

1. **Create a new Web Service on Render**
   - Sign in to your Render account
   - Click "New" and select "Web Service"
   - Connect your GitHub repository

2. **Configure the Web Service**
   - **Name**: Choose a name for your service (e.g., `habitnest-server`)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm install --save-dev @types/node @types/express @types/cors @types/mongoose @types/bcryptjs @types/jsonwebtoken @types/express-validator && npm install express-validator@7.0.1 && npm run build`
   - **Start Command**: `npm start`

3. **Environment Variables**
   Set the following environment variables in the Render dashboard:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB connection string
   - `PORT`: `10000` (or any port Render supports)
   - `JWT_SECRET`: Your JWT secret key

4. **Health Check**
   The server includes a health check endpoint at `/health` that returns a 200 status code with a JSON response `{ "status": "ok" }` when the server is running properly.

### Frontend Deployment

The frontend React application can be deployed on Render, Vercel, Netlify, or any other static site hosting service:

1. **Build the frontend**:
   ```
   cd client
   npm run build
   ```

2. **Environment Configuration**:
   - For Render, set the following environment variables in the dashboard:
     - `REACT_APP_API_URL`: URL of your deployed backend (e.g., `https://habitnest-hknx.onrender.com`)
     - Do NOT set `REACT_APP_DEVELOPMENT` in production
   - The application will automatically use the production API URL when `REACT_APP_DEVELOPMENT` is not present

3. **Deploy the built files**:
   - Upload the contents of the `client/build` directory to your hosting provider
   - For Render, create a Static Site service and point it to your repository

## Building for Production

### Backend

To build the server for production:

```bash
cd server
npm install
npm run build
```

The compiled JavaScript files will be in the `server/dist` directory.

### Frontend

To build the React application for production:

```bash
cd client
npm install
npm run build
```

The optimized production build will be in the `client/build` directory.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/logout` - Logout user

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

### System
- `GET /health` - Health check endpoint

## License

MIT
