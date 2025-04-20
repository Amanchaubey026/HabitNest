import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterFormData } from '../../types';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, state, clearError } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const formErrors: Record<string, string> = {};
    
    if (!name) {
      formErrors.name = 'Name is required';
    }
    
    if (!email) {
      formErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      formErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      formErrors.password = 'Password is required';
    } else if (password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await register(formData);
        navigate('/dashboard');
      } catch (error) {
        // Error is handled by context
      }
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
      
      {state.error && (
        <Alert 
          type="error" 
          message={state.error} 
          onClose={clearError}
        />
      )}
      
      <form onSubmit={onSubmit} className="card">
        <FormInput
          name="name"
          value={name}
          onChange={onChange}
          label="Name"
          placeholder="Enter your name"
          required
          error={errors.name}
        />
        
        <FormInput
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          label="Email"
          placeholder="Enter your email"
          required
          error={errors.email}
        />
        
        <FormInput
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          label="Password"
          placeholder="Enter your password"
          required
          error={errors.password}
        />
        
        <FormInput
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={onChange}
          label="Confirm Password"
          placeholder="Confirm your password"
          required
          error={errors.confirmPassword}
        />
        
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          disabled={state.loading}
        >
          {state.loading ? 'Registering...' : 'Register'}
        </Button>
        
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm; 