'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export type ValidationRule = {
  pattern: RegExp;
  message: string;
};

export type ValidationRules = {
  [key: string]: ValidationRule;
};

// Predefined common validation patterns
export const ValidationPatterns = {
  EMAIL: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Please enter a valid email address',
  },
  PASSWORD: {
    pattern:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message:
      'Password must be at least 8 characters and include uppercase, lowercase, number and special character',
  },
  URL: {
    pattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    message: 'Please enter a valid URL',
  },
  ALPHANUMERIC: {
    pattern: /^[a-zA-Z0-9]+$/,
    message: 'Only letters and numbers are allowed',
  },
  NUMERIC: {
    pattern: /^[0-9]+$/,
    message: 'Please enter numbers only',
  },
  PHONE: {
    pattern: /^\+?[0-9]{10,15}$/,
    message: 'Please enter a valid phone number',
  },
  USERNAME: {
    pattern: /^[a-zA-Z0-9_-]{3,16}$/,
    message:
      'Username must be 3-16 characters and can include letters, numbers, underscore and hyphen',
  },
  DATE_MMDDYYYY: {
    pattern: /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/,
    message: 'Please enter a valid date in MM/DD/YYYY format',
  },
  HEX_COLOR: {
    pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    message: 'Please enter a valid hex color code',
  },
};

interface RegexValidatorProps {
  value: string;
  validationRule: ValidationRule;
  onValidationChange?: (isValid: boolean) => void;
  displayMessage?: boolean;
  className?: string;
  messageClassName?: string;
}

export const RegexValidator: React.FC<RegexValidatorProps> = ({
  value,
  validationRule,
  onValidationChange,
  displayMessage = true,
  messageClassName = '',
}) => {
  const [isValid, setIsValid] = useState<boolean>(true);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  useEffect(() => {
    if (value) {
      const valid = validationRule.pattern.test(value);
      setIsValid(valid);
      if (onValidationChange) {
        onValidationChange(valid);
      }
      if (!isDirty) {
        setIsDirty(true);
      }
    } else {
      setIsValid(true);
      if (onValidationChange) {
        onValidationChange(true);
      }
    }
  }, [value, validationRule, onValidationChange, isDirty]);

  return (
    <>
      {displayMessage && !isValid && isDirty && (
        <div className={cn('text-red-500 text-sm mt-1', messageClassName)}>
          {validationRule.message}
        </div>
      )}
    </>
  );
};

// Input component with built-in validation
interface ValidatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  validationRule?: ValidationRule;
  onValidationChange?: (isValid: boolean) => void;
  displayMessage?: boolean;
  messageClassName?: string;
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  validationRule,
  onValidationChange,
  displayMessage = true,
  messageClassName = '',
  label,
  labelClassName = '',
  containerClassName = '',
  className = '',
  ...props
}) => {
  const [value, setValue] = useState<string>(
    props.defaultValue?.toString() || ''
  );
  const [isValid, setIsValid] = useState<boolean>(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const handleValidationChange = (valid: boolean) => {
    setIsValid(valid);
    if (onValidationChange) {
      onValidationChange(valid);
    }
  };

  return (
    <div className={cn('flex flex-col', containerClassName)}>
      {label && (
        <label
          htmlFor={props.id}
          className={cn('block text-sm font-medium mb-2', labelClassName)}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        className={cn(
          'w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary',
          !isValid && 'border-red-500 focus:ring-red-500',
          className
        )}
        onChange={handleChange}
        value={props.value !== undefined ? props.value : value}
      />
      {validationRule && (
        <RegexValidator
          value={props.value?.toString() || value}
          validationRule={validationRule}
          onValidationChange={handleValidationChange}
          displayMessage={displayMessage}
          messageClassName={messageClassName}
        />
      )}
    </div>
  );
};

// TextArea component with built-in validation
interface ValidatedTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  validationRule?: ValidationRule;
  onValidationChange?: (isValid: boolean) => void;
  displayMessage?: boolean;
  messageClassName?: string;
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
}

export const ValidatedTextArea: React.FC<ValidatedTextAreaProps> = ({
  validationRule,
  onValidationChange,
  displayMessage = true,
  messageClassName = '',
  label,
  labelClassName = '',
  containerClassName = '',
  className = '',
  ...props
}) => {
  const [value, setValue] = useState<string>(
    props.defaultValue?.toString() || ''
  );
  const [isValid, setIsValid] = useState<boolean>(true);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const handleValidationChange = (valid: boolean) => {
    setIsValid(valid);
    if (onValidationChange) {
      onValidationChange(valid);
    }
  };

  return (
    <div className={cn('flex flex-col', containerClassName)}>
      {label && (
        <label
          htmlFor={props.id}
          className={cn('block text-sm font-medium mb-2', labelClassName)}
        >
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={cn(
          'w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary',
          !isValid && 'border-red-500 focus:ring-red-500',
          className
        )}
        onChange={handleChange}
        value={props.value !== undefined ? props.value : value}
      />
      {validationRule && (
        <RegexValidator
          value={props.value?.toString() || value}
          validationRule={validationRule}
          onValidationChange={handleValidationChange}
          displayMessage={displayMessage}
          messageClassName={messageClassName}
        />
      )}
    </div>
  );
};

// Custom hook for form validation
export const useFormValidation = (
  initialValues: Record<string, string> = {}
) => {
  const [values, setValues] = useState(initialValues);
  const [validations, setValidations] = useState<Record<string, boolean>>({});
  const [isDirty, setIsDirty] = useState<Record<string, boolean>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (!isDirty[name]) {
      setIsDirty((prev) => ({ ...prev, [name]: true }));
    }
  };

  const setValidationStatus = (field: string, isValid: boolean) => {
    setValidations((prev) => ({ ...prev, [field]: isValid }));
  };

  const isFormValid = () => {
    return (
      Object.values(validations).every((valid) => valid === true) &&
      Object.keys(validations).length > 0
    );
  };

  return {
    values,
    handleChange,
    setValidationStatus,
    isFormValid,
    setValues,
    validations,
    isDirty,
  };
};
