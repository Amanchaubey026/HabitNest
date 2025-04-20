import express from 'express';
import { check } from 'express-validator';
import {
  getScheduleEntries,
  getScheduleEntry,
  createScheduleEntry,
  updateScheduleEntry,
  deleteScheduleEntry
} from '../controllers/schedule';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect); // All schedule routes require authentication

router
  .route('/')
  .get(getScheduleEntries)
  .post(
    [
      check('title', 'Title is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('startTime', 'Start time is required')
        .not()
        .isEmpty()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Start time must be in format HH:MM'),
      check('endTime', 'End time is required')
        .not()
        .isEmpty()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('End time must be in format HH:MM')
    ],
    createScheduleEntry
  );

router
  .route('/:id')
  .get(getScheduleEntry)
  .put(
    [
      check('title', 'Title is required').optional().not().isEmpty(),
      check('date', 'Date is required').optional().not().isEmpty(),
      check('startTime', 'Start time is required')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Start time must be in format HH:MM'),
      check('endTime', 'End time is required')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('End time must be in format HH:MM')
    ],
    updateScheduleEntry
  )
  .delete(deleteScheduleEntry);

export default router; 