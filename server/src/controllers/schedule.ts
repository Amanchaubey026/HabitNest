import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Schedule, { ISchedule } from '../models/Schedule';

// @desc    Get all schedule entries for a user for a specific date
// @route   GET /api/schedule
// @access  Private
export const getScheduleEntries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryParams: any = { user: req.user!.id };
    
    // Filter by date if provided
    if (req.query.date) {
      const date = new Date(req.query.date as string);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      queryParams.date = {
        $gte: date,
        $lt: nextDay
      };
    }

    const scheduleEntries = await Schedule.find(queryParams).sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      count: scheduleEntries.length,
      data: scheduleEntries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single schedule entry
// @route   GET /api/schedule/:id
// @access  Private
export const getScheduleEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scheduleEntry = await Schedule.findById(req.params.id);

    if (!scheduleEntry) {
      return res.status(404).json({
        success: false,
        error: 'Schedule entry not found'
      });
    }

    // Make sure user owns schedule entry
    if (scheduleEntry.user.toString() !== req.user!.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this schedule entry'
      });
    }

    res.status(200).json({
      success: true,
      data: scheduleEntry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new schedule entry
// @route   POST /api/schedule
// @access  Private
export const createScheduleEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Add user to request body
    req.body.user = req.user!.id;

    // Check for time conflicts
    const { date, startTime, endTime } = req.body;
    const dateObj = new Date(date);
    const nextDay = new Date(dateObj);
    nextDay.setDate(dateObj.getDate() + 1);
    
    const existingEntries = await Schedule.find({
      user: req.user!.id,
      date: {
        $gte: dateObj,
        $lt: nextDay
      }
    });
    
    // Check if new entry conflicts with existing entries
    const newStartTime = convertTimeToMinutes(startTime);
    const newEndTime = convertTimeToMinutes(endTime);
    
    const hasConflict = existingEntries.some(entry => {
      const entryStartTime = convertTimeToMinutes(entry.startTime);
      const entryEndTime = convertTimeToMinutes(entry.endTime);
      
      return (
        (newStartTime >= entryStartTime && newStartTime < entryEndTime) ||
        (newEndTime > entryStartTime && newEndTime <= entryEndTime) ||
        (newStartTime <= entryStartTime && newEndTime >= entryEndTime)
      );
    });
    
    if (hasConflict) {
      return res.status(400).json({
        success: false,
        error: 'Time conflict with existing schedule entry'
      });
    }

    const scheduleEntry = await Schedule.create(req.body);

    res.status(201).json({
      success: true,
      data: scheduleEntry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update schedule entry
// @route   PUT /api/schedule/:id
// @access  Private
export const updateScheduleEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let scheduleEntry = await Schedule.findById(req.params.id);

    if (!scheduleEntry) {
      return res.status(404).json({
        success: false,
        error: 'Schedule entry not found'
      });
    }

    // Make sure user owns schedule entry
    if (scheduleEntry.user.toString() !== req.user!.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this schedule entry'
      });
    }
    
    // Check for time conflicts if time is being updated
    if (req.body.startTime || req.body.endTime || req.body.date) {
      const { startTime, endTime, date } = {
        startTime: req.body.startTime || scheduleEntry.startTime,
        endTime: req.body.endTime || scheduleEntry.endTime,
        date: req.body.date || scheduleEntry.date
      };
      
      const dateObj = new Date(date);
      const nextDay = new Date(dateObj);
      nextDay.setDate(dateObj.getDate() + 1);
      
      const existingEntries = await Schedule.find({
        user: req.user!.id,
        _id: { $ne: req.params.id },
        date: {
          $gte: dateObj,
          $lt: nextDay
        }
      });
      
      const newStartTime = convertTimeToMinutes(startTime);
      const newEndTime = convertTimeToMinutes(endTime);
      
      const hasConflict = existingEntries.some(entry => {
        const entryStartTime = convertTimeToMinutes(entry.startTime);
        const entryEndTime = convertTimeToMinutes(entry.endTime);
        
        return (
          (newStartTime >= entryStartTime && newStartTime < entryEndTime) ||
          (newEndTime > entryStartTime && newEndTime <= entryEndTime) ||
          (newStartTime <= entryStartTime && newEndTime >= entryEndTime)
        );
      });
      
      if (hasConflict) {
        return res.status(400).json({
          success: false,
          error: 'Time conflict with existing schedule entry'
        });
      }
    }

    scheduleEntry = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: scheduleEntry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete schedule entry
// @route   DELETE /api/schedule/:id
// @access  Private
export const deleteScheduleEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scheduleEntry = await Schedule.findById(req.params.id);

    if (!scheduleEntry) {
      return res.status(404).json({
        success: false,
        error: 'Schedule entry not found'
      });
    }

    // Make sure user owns schedule entry
    if (scheduleEntry.user.toString() !== req.user!.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this schedule entry'
      });
    }

    await scheduleEntry.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to convert time (HH:MM) to minutes for comparison
const convertTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}; 