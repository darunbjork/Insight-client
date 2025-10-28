import { type InputHTMLAttributes, forwardRef } from 'react';
import './Input.scss'; // Import the SCSS file

// Combined props for type safety and forwarding ref for React Hook Form
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className={`form-field ${className}`}>
        {label && (
          <label htmlFor={props.id || props.name} className="form-label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`form-input ${error ? 'form-input--error' : ''}`}
          {...props}
        />
        {error && (
          <p className="form-error-message" role="alert">{error}</p>
        )}
      </div>
    );
  }
);
// Important for React Hook Form integration
Input.displayName = 'Input';