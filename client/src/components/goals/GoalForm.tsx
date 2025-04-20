import React, { useState, useEffect } from 'react';
import FormInput from '../common/FormInput';
import TextArea from '../common/TextArea';
import Select from '../common/Select';
import Button from '../common/Button';
import { Goal, GoalFormData } from '../../types';

interface GoalFormProps {
  onSubmit: (goalData: GoalFormData) => void;
  initialData?: Goal;
  isLoading?: boolean;
  buttonText?: string;
}

const GoalForm: React.FC<GoalFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
  buttonText = 'Create Goal'
}) => {
  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    description: '',
    targetDate: '',
    status: 'not-started'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      // Format date for the input
      const targetDate = new Date(initialData.targetDate).toISOString().split('T')[0];
      
      setFormData({
        title: initialData.title,
        description: initialData.description,
        targetDate,
        status: initialData.status
      });
    }
  }, [initialData]);

  const { title, description, targetDate, status } = formData;

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const formErrors: Record<string, string> = {};
    
    if (!title) {
      formErrors.title = 'Title is required';
    }
    
    if (!description) {
      formErrors.description = 'Description is required';
    }
    
    if (!targetDate) {
      formErrors.targetDate = 'Target date is required';
    }
    
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        name="title"
        value={title}
        onChange={onChange}
        label="Title"
        placeholder="Enter goal title"
        required
        error={errors.title}
      />
      
      <TextArea
        name="description"
        value={description}
        onChange={onChange}
        label="Description"
        placeholder="Enter goal description"
        required
        error={errors.description}
      />
      
      <FormInput
        type="date"
        name="targetDate"
        value={targetDate}
        onChange={onChange}
        label="Target Date"
        required
        error={errors.targetDate}
      />
      
      {initialData && (
        <Select
          name="status"
          value={status || ''}
          onChange={onChange}
          label="Status"
          options={[
            { value: 'not-started', label: 'Not Started' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' }
          ]}
        />
      )}
      
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : buttonText}
        </Button>
      </div>
    </form>
  );
};

export default GoalForm; 