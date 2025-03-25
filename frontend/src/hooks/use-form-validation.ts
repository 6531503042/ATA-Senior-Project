import { useState, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export function useFormValidation<T extends Record<string, any>>(rules: ValidationRules) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const controls = useAnimation();

  const validateField = useCallback((name: string, value: any) => {
    const rule = rules[name];
    if (!rule) return '';

    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return rule.message || `${name} is required`;
    }

    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      return rule.message || `${name} must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      return rule.message || `${name} must be no more than ${rule.maxLength} characters`;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || `${name} is invalid`;
    }

    if (rule.custom && !rule.custom(value)) {
      return rule.message || `${name} is invalid`;
    }

    return '';
  }, [rules]);

  const validateForm = useCallback((data: T) => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach((key) => {
      const error = validateField(key, data[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    
    if (!isValid) {
      // Trigger shake animation
      controls.start({
        x: [-10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      });
    }

    return isValid;
  }, [rules, validateField, controls]);

  const handleBlur = useCallback((name: string, value: any) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const getFieldProps = useCallback((name: string) => ({
    error: errors[name],
    touched: touched[name],
    onBlur: (value: any) => handleBlur(name, value),
    hasError: touched[name] && errors[name],
    animate: controls,
  }), [errors, touched, handleBlur, controls]);

  return {
    errors,
    validateForm,
    validateField,
    clearErrors,
    getFieldProps,
    controls,
  };
} 