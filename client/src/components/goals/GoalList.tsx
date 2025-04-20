import React from 'react';
import GoalItem from './GoalItem';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';
import { Goal } from '../../types';

interface GoalListProps {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
}

const GoalList: React.FC<GoalListProps> = ({
  goals,
  loading,
  error,
  onEdit,
  onDelete
}) => {
  if (loading) {
    return <Spinner className="py-8" />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No goals found. Create a new goal to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map(goal => (
        <GoalItem
          key={goal._id}
          goal={goal}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default GoalList; 