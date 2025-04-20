import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useAuth } from '../../contexts/AuthContext';
import { LoginFormData } from '../../types';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, state, clearError } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const formErrors: Record<string, string> = {};
    
    if (!email) {
      formErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      formErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      formErrors.password = 'Password is required';
    }
    
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await login(formData);
        navigate('/dashboard');
      } catch (error) {
        // Error is handled by context
      }
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h1>
      
      {state.error && (
        <Alert 
          type="error" 
          message={state.error} 
          onClose={clearError}
        />
      )}
      
      <form onSubmit={onSubmit} className="card">
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
        
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          disabled={state.loading}
        >
          {state.loading ? 'Logging in...' : 'Login'}
        </Button>
        
        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm; 