import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
}

const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className = '',
  headerAction,
  variant = 'default'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'outlined':
        return 'border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface shadow-none';
      case 'elevated':
        return 'border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface shadow-smooth-lg';
      case 'default':
      default:
        return 'border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface shadow-smooth';
    }
  };

  return (
    <div className={`card ${getVariantClasses()} ${className}`}>
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text-primary">{title}</h3>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card; 