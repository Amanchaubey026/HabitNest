import express from 'express';
import { check } from 'express-validator';
import {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal
} from '../controllers/goals';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect); // All goal routes require authentication

router
  .route('/')
  .get(getGoals)
  .post(
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('targetDate', 'Target date is required').not().isEmpty()
    ],
    createGoal
  );

router
  .route('/:id')
  .get(getGoal)
  .put(
    [
      check('title', 'Title is required').optional().not().isEmpty(),
      check('description', 'Description is required').optional().not().isEmpty(),
      check('targetDate', 'Target date is required').optional().not().isEmpty(),
      check('status', 'Status must be not-started, in-progress, or completed')
        .optional()
        .isIn(['not-started', 'in-progress', 'completed'])
    ],
    updateGoal
  )
  .delete(deleteGoal);

export default router; 