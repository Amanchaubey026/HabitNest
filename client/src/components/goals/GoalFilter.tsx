import React from 'react';
import Select from '../common/Select';

interface GoalFilterProps {
  month: string;
  year: string;
  onMonthChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const GoalFilter: React.FC<GoalFilterProps> = ({
  month,
  year,
  onMonthChange,
  onYearChange
}) => {
  // Generate array of years from 5 years ago to 5 years in the future
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const months = [
    { value: '', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const yearOptions = [
    { value: '', label: 'All Years' },
    ...years.map(year => ({ value: year.toString(), label: year.toString() }))
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Select
        name="month"
        value={month}
        onChange={onMonthChange}
        options={months}
        label="Filter by Month"
        className="w-full sm:w-48"
      />
      <Select
        name="year"
        value={year}
        onChange={onYearChange}
        options={yearOptions}
        label="Filter by Year"
        className="w-full sm:w-48"
      />
    </div>
  );
};

export default GoalFilter; 