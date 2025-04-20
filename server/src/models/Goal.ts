import mongoose, { Document, Schema } from 'mongoose';

export interface IGoal extends Document {
  title: string;
  description: string;
  targetDate: Date;
  status: 'not-started' | 'in-progress' | 'completed';
  user: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const GoalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  targetDate: {
    type: Date,
    required: [true, 'Please add a target date']
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IGoal>('Goal', GoalSchema); 