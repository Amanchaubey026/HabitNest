import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Goal, { IGoal } from '../models/Goal';

// @desc    Get all goals for a user
// @route   GET /api/goals
// @access  Private
export const getGoals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Add filter for month/year if query params are provided
    const queryParams: any = { user: req.user!.id };
    
    if (req.query.month && req.query.year) {
      const month = parseInt(req.query.month as string);
      const year = parseInt(req.query.year as string);
      
      // Create date range for the specified month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // Last day of the month
      
      queryParams.targetDate = {
        $gte: startDate,
        $lte: endDate
      };
    } else if (req.query.year) {
      const year = parseInt(req.query.year as string);
      
      // Create date range for the specified year
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      
      queryParams.targetDate = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const goals = await Goal.find(queryParams).sort({ targetDate: 1 });

    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access  Private
export const getGoal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    // Make sure user owns goal
    if (goal.user.toString() !== req.user!.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this goal'
      });
    }

    res.status(200).json({
      success: true,
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (
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

    const goal = await Goal.create(req.body);

    res.status(201).json({
      success: true,
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    // Make sure user owns goal
    if (goal.user.toString() !== req.user!.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this goal'
      });
    }

    goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    // Make sure user owns goal
    if (goal.user.toString() !== req.user!.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this goal'
      });
    }

    await goal.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
}; 