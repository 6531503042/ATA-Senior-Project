import React from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helper?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helper,
  id,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        className={`
          block w-full px-3 py-2 border rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-offset-0
          ${
            error
              ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          }
          ${className}
        `}
        {...props}
      />
      {(error || helper) && (
        <p
          className={`mt-1 text-sm ${error ? "text-red-600" : "text-gray-500"}`}
        >
          {error || helper}
        </p>
      )}
    </div>
  );
};

interface TextAreaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helper?: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  error,
  helper,
  id,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        id={id}
        className={`
          block w-full px-3 py-2 border rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-offset-0
          ${
            error
              ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          }
          ${className}
        `}
        {...props}
      />
      {(error || helper) && (
        <p
          className={`mt-1 text-sm ${error ? "text-red-600" : "text-gray-500"}`}
        >
          {error || helper}
        </p>
      )}
    </div>
  );
};

interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  helper?: string;
  options: Array<{ value: string; label: string }>;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  error,
  helper,
  options,
  id,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        className={`
          block w-full px-3 py-2 border rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-offset-0
          ${
            error
              ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          }
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(error || helper) && (
        <p
          className={`mt-1 text-sm ${error ? "text-red-600" : "text-gray-500"}`}
        >
          {error || helper}
        </p>
      )}
    </div>
  );
};

interface CheckboxFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  helper?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  error,
  helper,
  id,
  className = "",
  ...props
}) => {
  return (
    <div className="relative flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          id={id}
          className={`
            h-4 w-4 rounded border-gray-300 text-indigo-600
            focus:ring-indigo-500
            ${error ? "border-red-300" : "border-gray-300"}
            ${className}
          `}
          {...props}
        />
      </div>
      <div className="ml-3 text-sm">
        <label
          htmlFor={id}
          className={`font-medium ${error ? "text-red-900" : "text-gray-700"}`}
        >
          {label}
        </label>
        {(error || helper) && (
          <p className={`mt-1 ${error ? "text-red-600" : "text-gray-500"}`}>
            {error || helper}
          </p>
        )}
      </div>
    </div>
  );
};

interface RadioGroupProps {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helper?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  helper,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange?.(e.target.value)}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="ml-3 text-sm text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {(error || helper) && (
        <p
          className={`mt-1 text-sm ${error ? "text-red-600" : "text-gray-500"}`}
        >
          {error || helper}
        </p>
      )}
    </div>
  );
};

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e: React.FormEvent) => void;
  error?: string;
}

export const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  error,
  className = "",
  ...props
}) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`} {...props}>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      {children}
    </form>
  );
};
