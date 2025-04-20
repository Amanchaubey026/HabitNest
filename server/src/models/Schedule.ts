import mongoose, { Document, Schema } from 'mongoose';

export interface ISchedule extends Document {
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  notes?: string;
  user: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const ScheduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  startTime: {
    type: String,
    required: [true, 'Please add a start time'],
    match: [
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Please add a valid time format (HH:MM)'
    ]
  },
  endTime: {
    type: String,
    required: [true, 'Please add an end time'],
    match: [
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Please add a valid time format (HH:MM)'
    ]
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot be more than 500 characters']
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

export default mongoose.model<ISchedule>('Schedule', ScheduleSchema); 