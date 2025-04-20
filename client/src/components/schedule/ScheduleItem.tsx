import React from 'react';
import { format } from 'date-fns';
import Card from '../common/Card';
import Button from '../common/Button';
import { ScheduleEntry } from '../../types';

interface ScheduleItemProps {
  entry: ScheduleEntry;
  onEdit: (entry: ScheduleEntry) => void;
  onDelete: (entryId: string) => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ entry, onEdit, onDelete }) => {
  const getFormattedDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'EEE, MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Format time from 24h to 12h with AM/PM
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-4">
          <h3 className="font-semibold text-lg">{entry.title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {getFormattedDate(entry.date)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
          </p>
          {entry.notes && (
            <p className="mt-3 text-sm text-gray-700">{entry.notes}</p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(entry)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(entry._id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ScheduleItem; 