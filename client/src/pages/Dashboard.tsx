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
    let isMounted = true;
    
    const fetchData = async () => {
      if (!authState.isAuthenticated) return;
      
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
        
        if (isMounted) setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [getGoals, getScheduleEntries, authState.isAuthenticated]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="text-primary" />
      </div>
    );
  }

  // Get current date formatted nicely
  const currentDate = format(new Date(), 'EEEE, MMMM do');

  // Get time of day for greeting
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="p-6 bg-gradient-to-r from-primary to-secondary dark:from-dark-surface-light dark:to-dark-surface rounded-xl shadow-smooth text-white transition-theme">
        <h1 className="text-2xl md:text-3xl font-bold">
          {getGreeting()}, {authState.user?.name}
        </h1>
        <p className="mt-2 text-white/80">Today is {currentDate}</p>
      </div>
      
      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Goals Section */}
        <Card 
          title="Current Goals" 
          className="h-full"
          variant="elevated"
          headerAction={
            <Link to="/goals">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          }
        >
          {goalState.goals.length === 0 ? (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 dark:text-dark-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-4 text-gray-500 dark:text-dark-text-muted">No goals found for this month.</p>
              <div className="mt-4">
                <Link to="/goals">
                  <Button variant="primary" size="sm">
                    Create New Goal
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {goalState.goals.slice(0, 3).map(goal => (
                <div key={goal._id} className="p-4 rounded-lg border border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-surface-light transition-theme">
                  <h3 className="font-medium text-gray-800 dark:text-dark-text-primary">{goal.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
                    Target: {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                  </p>
                  <div className="flex items-center mt-2">
                    <span 
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        goal.status === 'completed' 
                          ? 'bg-success' 
                          : goal.status === 'in-progress' 
                            ? 'bg-warning' 
                            : 'bg-gray-400 dark:bg-gray-500'
                      }`}
                    ></span>
                    <span className={`text-xs ${
                      goal.status === 'completed'
                        ? 'text-success'
                        : goal.status === 'in-progress'
                        ? 'text-warning'
                        : 'text-gray-500 dark:text-dark-text-muted'
                    }`}>
                      {goal.status === 'completed'
                        ? 'Completed'
                        : goal.status === 'in-progress'
                        ? 'In Progress'
                        : 'Not Started'}
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Link to="/goals" className="text-primary dark:text-primary-light text-sm font-medium hover:underline transition-colors flex items-center">
                  View all goals
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </Card>
        
        {/* Schedule Section */}
        <Card 
          title="Today's Schedule" 
          className="h-full"
          variant="elevated"
          headerAction={
            <Link to="/schedule">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          }
        >
          {scheduleState.scheduleEntries.length === 0 ? (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 dark:text-dark-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-4 text-gray-500 dark:text-dark-text-muted">No schedule entries for today.</p>
              <div className="mt-4">
                <Link to="/schedule">
                  <Button variant="primary" size="sm">
                    Add New Task
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduleState.scheduleEntries.map(entry => (
                <div key={entry._id} className="p-4 rounded-lg border border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-surface-light transition-theme">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-dark-text-primary">{entry.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
                        {entry.startTime} - {entry.endTime}
                      </p>
                    </div>
                    <span className="inline-flex px-2 py-1 text-xs rounded-full bg-primary bg-opacity-10 text-primary dark:text-primary-light">
                      Today
                    </span>
                  </div>
                  {entry.notes && (
                    <p className="text-xs text-gray-500 dark:text-dark-text-muted mt-2 line-clamp-2">{entry.notes}</p>
                  )}
                </div>
              ))}
              <div className="pt-2">
                <Link to="/schedule" className="text-primary dark:text-primary-light text-sm font-medium hover:underline transition-colors flex items-center">
                  View full schedule
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 