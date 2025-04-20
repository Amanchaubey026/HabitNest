import React, { useEffect } from 'react';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ 
  title, 
  children, 
  onClose,
  className = '',
  size = 'md'
}) => {
  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  // Stop propagation to prevent closing when clicking on modal content
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-200"
      onClick={onClose}
    >
      <div 
        className={`bg-white dark:bg-dark-surface rounded-xl shadow-smooth-lg max-h-[90vh] overflow-y-auto w-full ${sizeClasses[size]} ${className} transition-all duration-200 transform`}
        onClick={handleModalContentClick}
      >
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-dark-border p-5">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-dark-text-secondary dark:hover:text-dark-text-primary transition-colors focus:outline-none rounded-full p-1 hover:bg-gray-100 dark:hover:bg-dark-surface-light"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 