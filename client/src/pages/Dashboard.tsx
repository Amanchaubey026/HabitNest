import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { useGoals } from '../contexts/GoalContext';
import { useSchedule } from '../contexts/ScheduleContext';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { state: authState } = useAuth();
  const { state: goalState, getGoals } = useGoals();
  const { state: scheduleState, getScheduleEntries } = useSchedule();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get today's date for schedule
        const today = new Date();
        const todayString = format(today, 'yyyy-MM-dd');
        
        // Get current month and year for goals
        const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
        const currentYear = today.getFullYear();
        
        await Promise.all([
          getGoals(currentMonth, currentYear),
          getScheduleEntries(todayString)
        ]);
        
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, [getGoals, getScheduleEntries]);

  if (loading) {
    return <Spinner className="mt-16" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Welcome, {authState.user?.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Goals Section */}
        <Card title="Current Goals" className="h-full">
          <div className="mb-4">
            <Link to="/goals">
              <Button variant="primary" size="sm">
                View All Goals
              </Button>
            </Link>
          </div>
          
          {goalState.goals.length === 0 ? (
            <p className="text-gray-600">No goals found for this month.</p>
          ) : (
            <div className="space-y-4">
              {goalState.goals.slice(0, 3).map(goal => (
                <div key={goal._id} className="border-b pb-3">
                  <h3 className="font-medium">{goal.title}</h3>
                  <p className="text-sm text-gray-600">
                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <span 
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        goal.status === 'completed' 
                          ? 'bg-green-500' 
                          : goal.status === 'in-progress' 
                            ? 'bg-yellow-500' 
                            : 'bg-gray-500'
                      }`}
                    ></span>
                    <span className="text-xs text-gray-600">
                      {goal.status === 'completed'
                        ? 'Completed'
                        : goal.status === 'in-progress'
                        ? 'In Progress'
                        : 'Not Started'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        
        {/* Schedule Section */}
        <Card title="Today's Schedule" className="h-full">
          <div className="mb-4">
            <Link to="/schedule">
              <Button variant="primary" size="sm">
                View Schedule
              </Button>
            </Link>
          </div>
          
          {scheduleState.scheduleEntries.length === 0 ? (
            <p className="text-gray-600">No schedule entries for today.</p>
          ) : (
            <div className="space-y-4">
              {scheduleState.scheduleEntries.map(entry => (
                <div key={entry._id} className="border-b pb-3">
                  <h3 className="font-medium">{entry.title}</h3>
                  <p className="text-sm text-gray-600">
                    {entry.startTime} - {entry.endTime}
                  </p>
                  {entry.notes && (
                    <p className="text-xs text-gray-500 mt-1">{entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 