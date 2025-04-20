# Achievement Planner Server

Backend API for the Achievement Planner application built with Node.js, Express, TypeScript, and MongoDB.

## Features

- Authentication with JWT
- CRUD operations for goals and schedule entries
- Data validation
- Error handling
- TypeScript support

## Setup Instructions

### Local Development

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

### Deployment on Render

This application is configured for easy deployment on [Render](https://render.com/). Follow these steps to deploy:

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

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

5. **Verify Deployment**
   - Once deployment is complete, you can test the API using the provided URL
   - Test the health endpoint at `/health` to verify the server is running

### Troubleshooting Deployment Issues

If you encounter TypeScript errors during deployment:

1. Make sure all type dependencies are installed:
   ```
   npm install --save-dev @types/node @types/express @types/cors @types/mongoose @types/bcryptjs @types/jsonwebtoken @types/express-validator
   ```

2. Verify that `tsconfig.json` is properly configured:
   ```json
   {
     "compilerOptions": {
       "target": "es2017",
       "module": "commonjs",
       "rootDir": "./src",
       "outDir": "./dist",
       "esModuleInterop": true,
       "allowSyntheticDefaultImports": true,
       "forceConsistentCasingInFileNames": true,
       "strict": true,
       "skipLibCheck": true,
       "resolveJsonModule": true,
       "types": ["node", "express", "mongoose", "jsonwebtoken", "bcryptjs", "cors", "express-validator"]
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules"]
   }
   ```

3. Check Render logs for specific errors and resolve them accordingly

## Building for Production

To prepare the server for production:

1. Install dependencies:
   ```
   npm install
   ```

2. Install development dependencies (needed for TypeScript compilation):
   ```
   npm install --save-dev @types/node @types/express @types/cors @types/mongoose @types/bcryptjs @types/jsonwebtoken @types/express-validator
   ```

3. Build the TypeScript project:
   ```
   npm run build
   ```

   This compiles the TypeScript code to JavaScript in the `dist` directory.

4. Set production environment variables:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

5. Start the production server:
   ```
   npm start
   ```

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
- `GET /health` - Health check endpoint (returns status "ok" if server is running) 