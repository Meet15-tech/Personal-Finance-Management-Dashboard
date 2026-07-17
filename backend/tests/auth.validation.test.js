const test = require('node:test');
const assert = require('node:assert/strict');
const { validateRegistrationInput, validateLoginInput } = require('../utils/validation');

test('validateRegistrationInput rejects missing fields and weak passwords', () => {
  const result = validateRegistrationInput({
    fullName: '  ',
    email: 'invalid-email',
    password: '1234',
  });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.includes('Full name is required'));
  assert.ok(result.errors.includes('Please provide a valid email address'));
  assert.ok(result.errors.includes('Password must contain at least 8 characters'));
});

test('validateRegistrationInput accepts valid data and trims values', () => {
  const result = validateRegistrationInput({
    fullName: '  Jane Doe  ',
    email: '  JANE@EXAMPLE.COM  ',
    password: 'StrongPass123',
    currency: 'usd',
    monthlyIncome: '25000',
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.cleanedData, {
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    password: 'StrongPass123',
    currency: 'USD',
    monthlyIncome: 25000,
  });
});

test('validateLoginInput rejects blank credentials', () => {
  const result = validateLoginInput({ email: '  ', password: '' });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.includes('Email and password are required'));
});
