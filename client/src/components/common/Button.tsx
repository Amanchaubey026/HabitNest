import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  fullWidth = false
}) => {
  const baseStyle = 'rounded font-medium transition-all';
  
  const variantStyle = {
    primary: 'bg-primary text-white hover:bg-opacity-90',
    secondary: 'bg-secondary text-white hover:bg-opacity-90',
    outline: 'border border-primary text-primary hover:bg-primary hover:bg-opacity-10',
    danger: 'bg-red-600 text-white hover:bg-opacity-90'
  };
  
  const sizeStyle = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg'
  };
  
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyle}
        ${variantStyle[variant]}
        ${sizeStyle[size]} 
        ${disabledStyle}
        ${widthStyle}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button; 