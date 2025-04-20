import React from 'react';
import { format } from 'date-fns';
import Card from '../common/Card';
import Button from '../common/Button';
import { Goal } from '../../types';

interface GoalItemProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, onEdit, onDelete }) => {
  const getStatusColorClass = () => {
    switch (goal.status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'not-started':
      default:
        return 'bg-gray-500';
    }
  };

  const getFormattedDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusText = () => {
    switch (goal.status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'not-started':
      default:
        return 'Not Started';
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-4">
          <h3 className="font-semibold text-lg">{goal.title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Target Date: {getFormattedDate(goal.targetDate)}
          </p>
          <div className="flex items-center mt-2">
            <span className="text-sm mr-2">Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColorClass()}`}>
              {getStatusText()}
            </span>
          </div>
          <p className="mt-3 text-sm text-gray-700">{goal.description}</p>
        </div>
        <div className="flex flex-col space-y-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(goal)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(goal._id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GoalItem; 