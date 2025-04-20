import React from 'react';
import { ScheduleEntry } from '../../types';

interface TimelineViewProps {
  entries: ScheduleEntry[];
  onEntryClick: (entry: ScheduleEntry) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({ entries, onEntryClick }) => {
  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);
  
  // Group entries by hour
  const entriesByHour: Record<number, ScheduleEntry[]> = {};
  
  entries.forEach(entry => {
    const startHour = parseInt(entry.startTime.split(':')[0]);
    if (!entriesByHour[startHour]) {
      entriesByHour[startHour] = [];
    }
    entriesByHour[startHour].push(entry);
  });
  
  // Format time from 24h to 12h with AM/PM
  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert 0 to 12
    return `${formattedHour} ${period}`;
  };

  return (
    <div className="timeline-view mt-6">
      {hoursOfDay.map(hour => (
        <div 
          key={hour} 
          className="grid grid-cols-12 border-t border-gray-200 py-2 hover:bg-gray-50"
        >
          {/* Hour column */}
          <div className="col-span-2 font-medium text-gray-500 pr-4 text-right">
            {formatHour(hour)}
          </div>
          
          {/* Events column */}
          <div className="col-span-10">
            {entriesByHour[hour]?.map(entry => (
              <div 
                key={entry._id}
                onClick={() => onEntryClick(entry)}
                className="bg-primary bg-opacity-80 text-white p-2 mb-1 rounded cursor-pointer hover:bg-opacity-100 transition-all"
              >
                <div className="font-medium">{entry.title}</div>
                <div className="text-xs">
                  {entry.startTime} - {entry.endTime}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineView; 