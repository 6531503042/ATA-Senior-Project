import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FormError } from './form-error';

interface FormFieldProps {
  label: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  animate?: any;
  helpText?: string;
}

export function FormField({
  label,
  error,
  touched,
  required,
  children,
  className,
  animate,
  helpText
}: FormFieldProps) {
  const showError = touched && error;

  return (
    <motion.div 
      animate={animate}
      className={cn("space-y-1.5", className)}
    >
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {helpText && (
          <span className="text-xs text-gray-500">{helpText}</span>
        )}
      </div>

      <div className={cn(
        "relative",
        showError && "animate-shake"
      )}>
        {children}
        <FormError message={showError ? error : undefined} />
      </div>
    </motion.div>
  );
}

// Add shake animation to tailwind.config.js
// @keyframes shake {
//   0%, 100% { transform: translateX(0); }
//   20% { transform: translateX(-2px); }
//   40% { transform: translateX(2px); }
//   60% { transform: translateX(-2px); }
//   80% { transform: translateX(2px); }
// }
// animation: {
//   shake: 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
// } 