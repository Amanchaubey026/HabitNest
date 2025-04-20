import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  fullWidth = false,
  icon,
  iconPosition = 'left'
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg';
  
  const variantStyle = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary-light shadow-sm dark:bg-primary-dark dark:hover:bg-primary dark:focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary-light shadow-sm dark:bg-secondary-dark dark:hover:bg-secondary dark:focus:ring-secondary',
    outline: 'border border-gray-300 dark:border-dark-border text-gray-700 dark:text-dark-text-primary bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-dark-surface-light focus:ring-primary-light',
    ghost: 'text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-surface-light focus:ring-gray-200 dark:focus:ring-dark-border',
    danger: 'bg-error text-white hover:bg-red-700 focus:ring-red-200 shadow-sm dark:hover:bg-red-600 dark:focus:ring-red-300',
    success: 'bg-success text-white hover:bg-green-600 focus:ring-green-200 shadow-sm dark:hover:bg-green-500 dark:focus:ring-green-300'
  };
  
  const sizeStyle = {
    xs: 'py-1 px-2 text-xs',
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-sm',
    lg: 'py-2.5 px-5 text-base'
  };
  
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer';
  const widthStyle = fullWidth ? 'w-full' : '';

  const iconSpacing = children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : '';

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
      {icon && iconPosition === 'left' && (
        <span className={iconSpacing}>{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className={iconSpacing}>{icon}</span>
      )}
    </button>
  );
};

export default Button; 