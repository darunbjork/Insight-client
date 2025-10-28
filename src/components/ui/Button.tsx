import React, { type ButtonHTMLAttributes } from 'react';
import { Spinner } from './Spinner';
import './Button.scss'; // Import the SCSS file

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
  console.log('Button component rendered'); // Debugging line
  // Construct the class names based on variant and loading state
  const baseClass = 'btn';
  const variantClass = `btn--${variant}`;
  
  // Disable button and add loading spinner if loading
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`${baseClass} ${variantClass} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};