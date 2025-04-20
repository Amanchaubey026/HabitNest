import React from 'react';
import ScheduleItem from './ScheduleItem';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';
import { ScheduleEntry } from '../../types';

interface ScheduleListProps {
  entries: ScheduleEntry[];
  loading: boolean;
  error: string | null;
  onEdit: (entry: ScheduleEntry) => void;
  onDelete: (entryId: string) => void;
}

const ScheduleList: React.FC<ScheduleListProps> = ({
  entries,
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

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No schedule entries found for this date. Create a new entry to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map(entry => (
        <ScheduleItem
          key={entry._id}
          entry={entry}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ScheduleList; 