/**
 * Validates an email address
 * @param email Email to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password meets minimum requirements
 * @param password Password to validate
 * @param minLength Minimum length (default: 8)
 * @returns Boolean indicating if password is valid
 */
export const isValidPassword = (password: string, minLength = 8): boolean => {
  if (password.length < minLength) return false;
  
  // Check for at least one uppercase letter
  const hasUppercase = /[A-Z]/.test(password);
  
  // Check for at least one lowercase letter
  const hasLowercase = /[a-z]/.test(password);
  
  // Check for at least one number
  const hasNumber = /\d/.test(password);
  
  // Check for at least one special character
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  
  return hasUppercase && hasLowercase && hasNumber && hasSpecial;
};

/**
 * Validates a phone number
 * @param phone Phone number to validate
 * @returns Boolean indicating if phone is valid
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

/**
 * Validates a credit card number using Luhn algorithm
 * @param cardNumber Credit card number to validate
 * @returns Boolean indicating if card number is valid
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  // Remove spaces and dashes
  const value = cardNumber.replace(/\s+|-/g, '');
  
  // Check if contains only numbers
  if (!/^\d+$/.test(value)) return false;
  
  // Check length (most cards are 13-19 digits)
  if (value.length < 13 || value.length > 19) return false;
  
  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through values starting from the rightmost digit
  for (let i = value.length - 1; i >= 0; i--) {
    let digit = parseInt(value.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};

/**
 * Validates a credit card expiration date
 * @param month Expiration month (1-12)
 * @param year Expiration year (YYYY)
 * @returns Boolean indicating if expiration date is valid
 */
export const isValidExpirationDate = (month: string, year: string): boolean => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  
  const expMonth = parseInt(month, 10);
  const expYear = parseInt(year, 10);
  
  // Check if month is valid
  if (expMonth < 1 || expMonth > 12) return false;
  
  // Check if year is valid
  if (expYear < currentYear) return false;
  
  // If it's the current year, check if month is valid
  if (expYear === currentYear && expMonth < currentMonth) return false;
  
  return true;
};

/**
 * Validates a CVV code
 * @param cvv CVV code to validate
 * @param cardType Type of card (amex requires 4 digits)
 * @returns Boolean indicating if CVV is valid
 */
export const isValidCVV = (cvv: string, cardType = 'other'): boolean => {
  const cvvRegex = cardType.toLowerCase() === 'amex' ? /^\d{4}$/ : /^\d{3}$/;
  return cvvRegex.test(cvv);
};

/**
 * Validates a zip/postal code (US format)
 * @param zipCode Zip code to validate
 * @returns Boolean indicating if zip code is valid
 */
export const isValidZipCode = (zipCode: string): boolean => {
  const zipRegex = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
  return zipRegex.test(zipCode);
};

/**
 * Validates a URL
 * @param url URL to validate
 * @returns Boolean indicating if URL is valid
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Validates form fields and returns errors
 * @param fields Object containing field values
 * @param rules Validation rules for each field
 * @returns Object containing error messages for invalid fields
 */
export const validateForm = (
  fields: Record<string, any>,
  rules: Record<string, (value: any) => boolean | string>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.keys(rules).forEach(fieldName => {
    const value = fields[fieldName];
    const result = rules[fieldName](value);
    
    if (result !== true) {
      errors[fieldName] = typeof result === 'string' ? result : `${fieldName} is invalid`;
    }
  });
  
  return errors;
};