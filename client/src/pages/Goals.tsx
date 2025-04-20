import React, { useEffect, useState } from 'react';
import GoalList from '../components/goals/GoalList';
import GoalForm from '../components/goals/GoalForm';
import GoalFilter from '../components/goals/GoalFilter';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { useGoals } from '../contexts/GoalContext';
import { Goal, GoalFormData } from '../types';

const Goals: React.FC = () => {
  const { 
    state, 
    getGoals, 
    createGoal, 
    updateGoal, 
    deleteGoal, 
    clearError 
  } = useGoals();
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      const monthNum = month ? parseInt(month) : undefined;
      const yearNum = year ? parseInt(year) : undefined;
      await getGoals(monthNum, yearNum);
    };
    
    fetchGoals();
  }, [getGoals, month, year]);

  const handleCreateGoal = async (goalData: GoalFormData) => {
    try {
      await createGoal(goalData);
      setShowModal(false);
      setSuccessMessage('Goal created successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleUpdateGoal = async (goalData: GoalFormData) => {
    if (!editingGoal) return;
    
    try {
      await updateGoal(editingGoal._id, goalData);
      setShowModal(false);
      setEditingGoal(null);
      setSuccessMessage('Goal updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      await deleteGoal(goalId);
      setSuccessMessage('Goal deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const openCreateModal = () => {
    setEditingGoal(null);
    setShowModal(true);
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGoal(null);
    clearError();
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Goals</h1>
        <Button variant="primary" onClick={openCreateModal}>
          Add New Goal
        </Button>
      </div>
      
      {successMessage && (
        <Alert 
          type="success" 
          message={successMessage} 
          onClose={() => setSuccessMessage(null)} 
        />
      )}
      
      <GoalFilter 
        month={month} 
        year={year} 
        onMonthChange={handleMonthChange} 
        onYearChange={handleYearChange} 
      />
      
      <GoalList 
        goals={state.goals} 
        loading={state.loading}
        error={state.error}
        onEdit={openEditModal}
        onDelete={handleDeleteGoal}
      />
      
      {showModal && (
        <Modal 
          title={editingGoal ? 'Edit Goal' : 'Create Goal'} 
          onClose={closeModal}
        >
          <GoalForm 
            onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal} 
            initialData={editingGoal || undefined}
            isLoading={state.loading}
            buttonText={editingGoal ? 'Update Goal' : 'Create Goal'}
          />
        </Modal>
      )}
    </div>
  );
};

export default Goals; 