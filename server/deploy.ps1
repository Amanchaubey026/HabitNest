# Install all dependencies including dev dependencies
npm install

# Make sure type definitions are properly installed
npm install --save-dev @types/node @types/express @types/cors @types/mongoose @types/bcryptjs @types/jsonwebtoken @types/express-validator

# Install express-validator with the correct version
npm install express-validator@7.0.1

# Build the application
npm run build 