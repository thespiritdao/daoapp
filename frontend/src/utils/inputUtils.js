// Regular expressions for validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const URL_REGEX = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

// Validate text input
export const validateText = (text, minLength = 1, maxLength = 255) => {
  if (typeof text !== 'string') return false;
  return text.length >= minLength && text.length <= maxLength;
};

// Validate number input
export const validateNumber = (number, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) => {
  if (typeof number !== 'number') return false;
  return number >= min && number <= max;
};

// Validate email address
export const validateEmail = (email) => {
  return EMAIL_REGEX.test(email);
};

// Validate URL
export const validateURL = (url) => {
  return URL_REGEX.test(url);
};

// Sanitize input to prevent XSS attacks
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// General purpose input validator
export const validateInput = (input, type, options = {}) => {
  switch (type) {
    case 'text':
      return validateText(input, options.minLength, options.maxLength);
    case 'number':
      return validateNumber(input, options.min, options.max);
    case 'email':
      return validateEmail(input);
    case 'url':
      return validateURL(input);
    default:
      return false;
  }
};