import React from 'react';
import { format, addDays, subDays } from 'date-fns';
import Button from '../common/Button';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateChange }) => {
  const goToPreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const goToNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <button 
          onClick={goToPreviousDay}
          className="p-2 rounded hover:bg-gray-100"
          aria-label="Previous day"
        >
          &larr;
        </button>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToToday}
            className="mt-2"
          >
            Today
          </Button>
        </div>
        
        <button 
          onClick={goToNextDay}
          className="p-2 rounded hover:bg-gray-100"
          aria-label="Next day"
        >
          &rarr;
        </button>
      </div>
      
      <div className="mt-4">
        <input
          type="date"
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={(e) => {
            if (e.target.value) {
              onDateChange(new Date(e.target.value));
            }
          }}
          className="form-input"
        />
      </div>
    </div>
  );
};

export default DatePicker; 