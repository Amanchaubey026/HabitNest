import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import ScheduleList from '../components/schedule/ScheduleList';
import ScheduleForm from '../components/schedule/ScheduleForm';
import DatePicker from '../components/schedule/DatePicker';
import TimelineView from '../components/schedule/TimelineView';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { useSchedule } from '../contexts/ScheduleContext';
import { ScheduleEntry, ScheduleFormData } from '../types';

const Schedule: React.FC = () => {
  const { 
    state, 
    getScheduleEntries, 
    createScheduleEntry, 
    updateScheduleEntry, 
    deleteScheduleEntry, 
    clearError 
  } = useSchedule();
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ScheduleEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchScheduleEntries = async () => {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      await getScheduleEntries(dateString);
    };
    
    fetchScheduleEntries();
  }, [getScheduleEntries, selectedDate]);

  const handleCreateScheduleEntry = async (scheduleData: ScheduleFormData) => {
    try {
      await createScheduleEntry(scheduleData);
      setShowModal(false);
      setSuccessMessage('Schedule entry created successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleUpdateScheduleEntry = async (scheduleData: ScheduleFormData) => {
    if (!editingEntry) return;
    
    try {
      await updateScheduleEntry(editingEntry._id, scheduleData);
      setShowModal(false);
      setEditingEntry(null);
      setSuccessMessage('Schedule entry updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleDeleteScheduleEntry = async (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this schedule entry?')) {
      await deleteScheduleEntry(entryId);
      setSuccessMessage('Schedule entry deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const openCreateModal = () => {
    setEditingEntry(null);
    // Pre-fill the date with the currently selected date
    setShowModal(true);
  };

  const openEditModal = (entry: ScheduleEntry) => {
    setEditingEntry(entry);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEntry(null);
    clearError();
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'timeline' : 'list');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schedule</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={toggleViewMode} className="mr-2">
            {viewMode === 'list' ? 'Timeline View' : 'List View'}
          </Button>
          <Button variant="primary" onClick={openCreateModal}>
            Add New Entry
          </Button>
        </div>
      </div>
      
      {successMessage && (
        <Alert 
          type="success" 
          message={successMessage} 
          onClose={() => setSuccessMessage(null)} 
        />
      )}
      
      <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
      
      {viewMode === 'list' ? (
        <ScheduleList 
          entries={state.scheduleEntries} 
          loading={state.loading}
          error={state.error}
          onEdit={openEditModal}
          onDelete={handleDeleteScheduleEntry}
        />
      ) : (
        <TimelineView 
          entries={state.scheduleEntries}
          onEntryClick={openEditModal}
        />
      )}
      
      {showModal && (
        <Modal 
          title={editingEntry ? 'Edit Schedule Entry' : 'Create Schedule Entry'} 
          onClose={closeModal}
        >
          <ScheduleForm 
            onSubmit={editingEntry ? handleUpdateScheduleEntry : handleCreateScheduleEntry} 
            initialData={editingEntry || undefined}
            isLoading={state.loading}
            buttonText={editingEntry ? 'Update Entry' : 'Create Entry'}
          />
        </Modal>
      )}
    </div>
  );
};

export default Schedule; 