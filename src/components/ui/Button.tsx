import React, { ButtonHTMLAttributes } from 'react';

// Type safety for props
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = 'px-4 py-2 rounded-lg font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2';

  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle = 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
      break;
    case 'secondary':
      variantStyle = 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400';
      break;
    case 'danger':
      variantStyle = 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      break;
  }

  // Disable button and add loading spinner if loading
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};