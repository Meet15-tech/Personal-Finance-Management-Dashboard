const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeCurrency = (currency) => {
  if (typeof currency !== 'string') {
    return 'INR';
  }

  const trimmedCurrency = currency.trim().toUpperCase();
  return ['INR', 'USD', 'EUR', 'GBP'].includes(trimmedCurrency)
    ? trimmedCurrency
    : 'INR';
};

const toNumberOrDefault = (value) => {
  if (value === undefined || value === null || value === '') {
    return 0;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const validateRegistrationInput = (payload = {}) => {
  const errors = [];
  const cleanedData = {};

  const fullName = typeof payload.fullName === 'string' ? payload.fullName.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const password = typeof payload.password === 'string' ? payload.password : '';
  const currency = normalizeCurrency(payload.currency);
  const monthlyIncome = toNumberOrDefault(payload.monthlyIncome);

  if (!fullName) {
    errors.push('Full name is required');
  } else if (fullName.length < 2) {
    errors.push('Full name must contain at least 2 characters');
  } else {
    cleanedData.fullName = fullName;
  }

  if (!email) {
    errors.push('Email is required');
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push('Please provide a valid email address');
  } else {
    cleanedData.email = email;
  }

  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 8) {
    errors.push('Password must contain at least 8 characters');
  } else {
    cleanedData.password = password;
  }

  if (monthlyIncome < 0) {
    errors.push('Monthly income cannot be negative');
  } else {
    cleanedData.monthlyIncome = monthlyIncome;
  }

  cleanedData.currency = currency;

  return {
    isValid: errors.length === 0,
    errors,
    cleanedData,
  };
};

const validateLoginInput = (payload = {}) => {
  const errors = [];
  const cleanedData = {};

  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const password = typeof payload.password === 'string' ? payload.password : '';

  if (!email || !password) {
    errors.push('Email and password are required');
  } else {
    cleanedData.email = email;
    cleanedData.password = password;
  }

  return {
    isValid: errors.length === 0,
    errors,
    cleanedData,
  };
};

module.exports = {
  validateRegistrationInput,
  validateLoginInput,
};
