
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateField = (value: any, rules: ValidationRule): ValidationResult => {
  const errors: string[] = [];

  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    errors.push('This field is required');
  }

  if (value && typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`Must be at least ${rules.minLength} characters`);
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`Must be no more than ${rules.maxLength} characters`);
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push('Invalid format');
    }
  }

  if (rules.custom && value) {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEmail = (email: string): ValidationResult => {
  return validateField(email, {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  });
};

export const validatePassword = (password: string): ValidationResult => {
  return validateField(password, {
    required: true,
    minLength: 6,
    custom: (value) => {
      if (!/(?=.*[a-z])/.test(value)) return 'Must contain at least one lowercase letter';
      if (!/(?=.*[A-Z])/.test(value)) return 'Must contain at least one uppercase letter';
      if (!/(?=.*\d)/.test(value)) return 'Must contain at least one number';
      return null;
    }
  });
};
