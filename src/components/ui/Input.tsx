import { type InputHTMLAttributes, forwardRef } from 'react';

// Combined props for type safety and forwarding ref for React Hook Form
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none 
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
            ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500" role="alert">{error}</p>
        )}
      </div>
    );
  }
);
// Important for React Hook Form integration
Input.displayName = 'Input';