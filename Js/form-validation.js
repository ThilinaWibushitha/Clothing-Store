// form-validation.js - Comprehensive form validation utility
/**
 * Form Validation Utility
 * Provides client-side validation with accessibility support
 */

class FormValidator {
  constructor(formSelector, options = {}) {
    this.form = document.querySelector(formSelector);
    this.options = {
      showErrorsInline: true,
      errorClass: 'error',
      successClass: 'success',
      ...options
    };
    this.rules = new Map();
    this.errors = new Map();
    
    if (this.form) {
      this.init();
    }
  }

  /**
   * Initialize form validation
   */
  init() {
    this.setupEventListeners();
    this.setupAccessibility();
  }

  /**
   * Add validation rule for a field
   */
  addRule(fieldName, rule, message) {
    if (!this.rules.has(fieldName)) {
      this.rules.set(fieldName, []);
    }
    this.rules.get(fieldName).push({ rule, message });
  }

  /**
   * Validate a single field
   */
  validateField(fieldName) {
    const field = this.form.querySelector(`[name="${fieldName}"]`);
    if (!field) return true;

    const fieldRules = this.rules.get(fieldName) || [];
    const value = field.value.trim();
    
    for (const { rule, message } of fieldRules) {
      if (!rule(value, field)) {
        this.setFieldError(fieldName, message);
        return false;
      }
    }

    this.clearFieldError(fieldName);
    return true;
  }

  /**
   * Validate entire form
   */
  validateForm() {
    let isValid = true;
    this.errors.clear();

    for (const [fieldName] of this.rules) {
      if (!this.validateField(fieldName)) {
        isValid = false;
      }
    }

    return isValid;
  }

  /**
   * Set field error
   */
  setFieldError(fieldName, message) {
    const field = this.form.querySelector(`[name="${fieldName}"]`);
    if (!field) return;

    this.errors.set(fieldName, message);
    
    // Add error class
    field.classList.add(this.options.errorClass);
    field.classList.remove(this.options.successClass);
    
    // Set aria-invalid
    field.setAttribute('aria-invalid', 'true');
    
    // Create or update error message
    this.updateErrorMessage(fieldName, message);
  }

  /**
   * Clear field error
   */
  clearFieldError(fieldName) {
    const field = this.form.querySelector(`[name="${fieldName}"]`);
    if (!field) return;

    this.errors.delete(fieldName);
    
    // Remove error class
    field.classList.remove(this.options.errorClass);
    field.classList.add(this.options.successClass);
    
    // Remove aria-invalid
    field.removeAttribute('aria-invalid');
    
    // Remove error message
    this.removeErrorMessage(fieldName);
  }

  /**
   * Update error message display
   */
  updateErrorMessage(fieldName, message) {
    const field = this.form.querySelector(`[name="${fieldName}"]`);
    if (!field) return;

    let errorElement = field.parentNode.querySelector('.error-message');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.setAttribute('role', 'alert');
      errorElement.setAttribute('aria-live', 'polite');
      field.parentNode.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  /**
   * Remove error message
   */
  removeErrorMessage(fieldName) {
    const field = this.form.querySelector(`[name="${fieldName}"]`);
    if (!field) return;

    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Real-time validation on blur
    this.form.addEventListener('blur', (e) => {
      if (e.target.matches('input, textarea, select')) {
        this.validateField(e.target.name);
      }
    }, true);

    // Clear errors on input
    this.form.addEventListener('input', (e) => {
      if (e.target.matches('input, textarea, select')) {
        if (this.errors.has(e.target.name)) {
          this.clearFieldError(e.target.name);
        }
      }
    });

    // Form submission validation
    this.form.addEventListener('submit', (e) => {
      if (!this.validateForm()) {
        e.preventDefault();
        this.focusFirstError();
      }
    });
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    // Add required attributes
    const requiredFields = this.form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!field.hasAttribute('aria-required')) {
        field.setAttribute('aria-required', 'true');
      }
    });

    // Add error summary
    this.createErrorSummary();
  }

  /**
   * Create error summary for screen readers
   */
  createErrorSummary() {
    const summary = document.createElement('div');
    summary.id = 'error-summary';
    summary.className = 'error-summary';
    summary.setAttribute('role', 'alert');
    summary.setAttribute('aria-live', 'assertive');
    summary.style.display = 'none';
    
    this.form.insertBefore(summary, this.form.firstChild);
  }

  /**
   * Update error summary
   */
  updateErrorSummary() {
    const summary = this.form.querySelector('#error-summary');
    if (!summary) return;

    if (this.errors.size === 0) {
      summary.style.display = 'none';
      return;
    }

    const errorList = Array.from(this.errors.entries())
      .map(([field, message]) => {
        const fieldElement = this.form.querySelector(`[name="${field}"]`);
        const fieldLabel = fieldElement?.labels?.[0]?.textContent || field;
        return `<li><a href="#${field}" onclick="document.querySelector('[name=\\'${field}\\']').focus()">${fieldLabel}: ${message}</a></li>`;
      })
      .join('');

    summary.innerHTML = `
      <h2>Please correct the following errors:</h2>
      <ul>${errorList}</ul>
    `;
    summary.style.display = 'block';
  }

  /**
   * Focus first error field
   */
  focusFirstError() {
    const firstErrorField = this.form.querySelector(`.${this.options.errorClass}`);
    if (firstErrorField) {
      firstErrorField.focus();
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    this.updateErrorSummary();
  }
}

/**
 * Common validation rules
 */
const ValidationRules = {
  required: (value) => value.length > 0,
  
  minLength: (min) => (value) => value.length >= min,
  
  maxLength: (max) => (value) => value.length <= max,
  
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  
  phone: (value) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(value.replace(/\s/g, ''));
  },
  
  password: (value) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(value);
  },
  
  confirmPassword: (originalPassword) => (value) => value === originalPassword,
  
  numeric: (value) => !isNaN(value) && !isNaN(parseFloat(value)),
  
  integer: (value) => Number.isInteger(Number(value)),
  
  range: (min, max) => (value) => {
    const num = Number(value);
    return num >= min && num <= max;
  },
  
  pattern: (regex) => (value) => regex.test(value),
  
  url: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  
  date: (value) => {
    const date = new Date(value);
    return date instanceof Date && !isNaN(date);
  },
  
  futureDate: (value) => {
    const date = new Date(value);
    return date instanceof Date && !isNaN(date) && date > new Date();
  },
  
  pastDate: (value) => {
    const date = new Date(value);
    return date instanceof Date && !isNaN(date) && date < new Date();
  }
};

/**
 * Initialize form validation for common forms
 */
function initializeFormValidation() {
  // Login form validation
  const loginForm = document.querySelector('#login-form');
  if (loginForm) {
    const loginValidator = new FormValidator('#login-form');
    
    loginValidator.addRule('uname', ValidationRules.required, 'Username is required');
    loginValidator.addRule('uname', ValidationRules.minLength(3), 'Username must be at least 3 characters');
    loginValidator.addRule('psw', ValidationRules.required, 'Password is required');
    loginValidator.addRule('psw', ValidationRules.minLength(6), 'Password must be at least 6 characters');
  }

  // Registration form validation
  const registerForm = document.querySelector('#register-form');
  if (registerForm) {
    const registerValidator = new FormValidator('#register-form');
    
    registerValidator.addRule('username', ValidationRules.required, 'Username is required');
    registerValidator.addRule('username', ValidationRules.minLength(3), 'Username must be at least 3 characters');
    registerValidator.addRule('email', ValidationRules.required, 'Email is required');
    registerValidator.addRule('email', ValidationRules.email, 'Please enter a valid email address');
    registerValidator.addRule('password', ValidationRules.required, 'Password is required');
    registerValidator.addRule('password', ValidationRules.password, 'Password must be at least 8 characters with uppercase, lowercase, and number');
    registerValidator.addRule('confirmPassword', ValidationRules.required, 'Please confirm your password');
    registerValidator.addRule('confirmPassword', ValidationRules.confirmPassword(document.querySelector('[name="password"]')?.value), 'Passwords do not match');
  }

  // Payment form validation
  const paymentForm = document.querySelector('#payment-form');
  if (paymentForm) {
    const paymentValidator = new FormValidator('#payment-form');
    
    paymentValidator.addRule('cardNumber', ValidationRules.required, 'Card number is required');
    paymentValidator.addRule('cardNumber', ValidationRules.pattern(/^\d{16}$/), 'Card number must be 16 digits');
    paymentValidator.addRule('expiryDate', ValidationRules.required, 'Expiry date is required');
    paymentValidator.addRule('expiryDate', ValidationRules.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/), 'Please enter expiry date in MM/YY format');
    paymentValidator.addRule('cvv', ValidationRules.required, 'CVV is required');
    paymentValidator.addRule('cvv', ValidationRules.pattern(/^\d{3,4}$/), 'CVV must be 3 or 4 digits');
    paymentValidator.addRule('cardholderName', ValidationRules.required, 'Cardholder name is required');
    paymentValidator.addRule('cardholderName', ValidationRules.minLength(2), 'Cardholder name must be at least 2 characters');
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeFormValidation);

// Export for module usage
export { FormValidator, ValidationRules, initializeFormValidation };
