#!/bin/bash

# Install all dependencies including dev dependencies
npm install

# Make sure type definitions are properly installed
npm install --save-dev @types/node @types/express @types/cors @types/mongoose @types/bcryptjs @types/jsonwebtoken @types/express-validator

# Build the application
npm run build 