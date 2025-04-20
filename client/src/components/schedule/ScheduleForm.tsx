import React, { useState, useEffect } from 'react';
import FormInput from '../common/FormInput';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import { ScheduleEntry, ScheduleFormData } from '../../types';

interface ScheduleFormProps {
  onSubmit: (scheduleData: ScheduleFormData) => void;
  initialData?: ScheduleEntry;
  isLoading?: boolean;
  buttonText?: string;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
  buttonText = 'Create Schedule Entry'
}) => {
  const [formData, setFormData] = useState<ScheduleFormData>({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      // Format date for the inputs
      const date = new Date(initialData.date).toISOString().split('T')[0];
      
      setFormData({
        title: initialData.title,
        date,
        startTime: initialData.startTime,
        endTime: initialData.endTime,
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  const { title, date, startTime, endTime, notes } = formData;

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const formErrors: Record<string, string> = {};
    
    if (!title) {
      formErrors.title = 'Title is required';
    }
    
    if (!date) {
      formErrors.date = 'Date is required';
    }
    
    if (!startTime) {
      formErrors.startTime = 'Start time is required';
    } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(startTime)) {
      formErrors.startTime = 'Invalid time format. Use HH:MM';
    }
    
    if (!endTime) {
      formErrors.endTime = 'End time is required';
    } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(endTime)) {
      formErrors.endTime = 'Invalid time format. Use HH:MM';
    }
    
    if (startTime && endTime) {
      const start = convertTimeToMinutes(startTime);
      const end = convertTimeToMinutes(endTime);
      
      if (end <= start) {
        formErrors.endTime = 'End time must be after start time';
      }
    }
    
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        name="title"
        value={title}
        onChange={onChange}
        label="Title"
        placeholder="Enter schedule title"
        required
        error={errors.title}
      />
      
      <FormInput
        type="date"
        name="date"
        value={date}
        onChange={onChange}
        label="Date"
        required
        error={errors.date}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          type="time"
          name="startTime"
          value={startTime}
          onChange={onChange}
          label="Start Time"
          required
          error={errors.startTime}
        />
        
        <FormInput
          type="time"
          name="endTime"
          value={endTime}
          onChange={onChange}
          label="End Time"
          required
          error={errors.endTime}
        />
      </div>
      
      <TextArea
        name="notes"
        value={notes || ''}
        onChange={onChange}
        label="Notes (Optional)"
        placeholder="Add any additional notes"
        rows={3}
      />
      
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : buttonText}
        </Button>
      </div>
    </form>
  );
};

export default ScheduleForm; 