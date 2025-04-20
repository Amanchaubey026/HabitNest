import express from 'express';
// Using require for express-validator
const { check } = require('express-validator');
import { register, login, getMe, logout } from '../controllers/auth';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

router.get('/me', protect, getMe);

router.get('/logout', protect, logout);

export default router; 