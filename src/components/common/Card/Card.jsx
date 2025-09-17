import React from 'react';

const Card = ({ 
  children, 
  title, 
  className = '', 
  titleClassName = '',
  bodyClassName = '',
  variant = 'default',
  ...props 
}) => {
  const variants = {
    default: 'bg-white shadow-sm border border-gray-100',
    elevated: 'bg-white shadow-md border border-gray-100',
    flat: 'bg-white border border-gray-200'
  };

  return (
    <div 
      className={`rounded-xl ${variants[variant]} ${className}`}
      {...props}
    >
      {title && (
        <div className={`px-6 py-5 border-b border-gray-100 ${titleClassName}`}>
          <h3 className="text-lg font-semibold text-gray-900 tracking-tight">{title}</h3>
        </div>
      )}
      <div className={`px-6 py-5 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
