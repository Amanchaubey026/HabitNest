# Achievement Planner - Client

Frontend application for Achievement Planner built with React, TypeScript, and Tailwind CSS.

## Features

- User authentication (register/login)
- Goal management and tracking
- Daily schedule planning with timeline view
- Responsive design for all devices

## Technologies Used

- React 18
- TypeScript
- React Router v6
- Tailwind CSS
- Context API for state management
- Axios for API requests
- date-fns for date manipulation

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Build for production:
   ```
   npm run build
   ```

## Project Structure

- `/src/components`: Reusable UI components
  - `/common`: Shared components like buttons, forms, modals
  - `/layout`: Layout components like navbar and layout wrapper
  - `/auth`: Authentication-related components
  - `/goals`: Goal-related components
  - `/schedule`: Schedule-related components
- `/src/contexts`: React contexts for state management
- `/src/pages`: Page components
- `/src/services`: API service functions
- `/src/types`: TypeScript types and interfaces

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## Notes

The application expects a backend API running at the URL specified in the proxy setting (http://localhost:5000 by default). Make sure the backend server is running before using the application. 