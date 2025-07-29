interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  sanitizedData?: {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
  };
}

interface RegistrationData {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

class ValidationService {
  validateRegistration(data: RegistrationData): ValidationResult {
    const errors: string[] = [];
    const sanitizedData: {
      firstName?: string;
      lastName?: string;
      email: string;
      password: string;
    } = {} as {
      firstName?: string;
      lastName?: string;
      email: string;
      password: string;
    };

    // Validate firstName
    if (data.firstName) {
      const trimmedFirstName = data.firstName.trim();
      if (trimmedFirstName.length < 2) {
        errors.push('First name must be at least 2 characters long');
      } else {
        sanitizedData.firstName = trimmedFirstName;
      }
    } else {
      errors.push('First name is required');
    }

    // Validate lastName
    if (data.lastName) {
      const trimmedLastName = data.lastName.trim();
      if (trimmedLastName.length < 2) {
        errors.push('Last name must be at least 2 characters long');
      } else {
        sanitizedData.lastName = trimmedLastName;
      }
    } else {
      errors.push('Last name is required');
    }

    // Validate email
    const email = data.email?.trim().toLowerCase();
    if (!email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(email)) {
      errors.push('Invalid email format');
    } else {
      sanitizedData.email = email;
    }

    // Validate password
    const password = data.password;
    if (!password) {
      errors.push('Password is required');
    } else if (password.length < 8) {
      errors.push('Password must be at least 4 characters long');
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.push(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      );
    } else {
      sanitizedData.password = password;
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      sanitizedData: errors.length === 0 ? sanitizedData : undefined,
    };
  }

  validateLogin(data: LoginData): ValidationResult {
    const errors: string[] = [];
    const sanitizedData: {
      email: string;
      password: string;
    } = {} as {
      email: string;
      password: string;
    };

    // Validate email
    const email = data.email?.trim().toLowerCase();
    if (!email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(email)) {
      errors.push('Invalid email format');
    } else {
      sanitizedData.email = email;
    }

    // Validate password
    const password = data.password;
    if (!password) {
      errors.push('Password is required');
    } else {
      sanitizedData.password = password;
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      sanitizedData: errors.length === 0 ? sanitizedData : undefined,
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export const validationService = new ValidationService();
