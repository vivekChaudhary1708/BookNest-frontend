// Email
export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || 'Enter a valid email address';

// Phone
export const validatePhone = (phone) =>
  /^[6-9]\d{9}$/.test(phone) || 'Enter a valid 10-digit mobile number';

// Password strength (returns { score, label, color })
export const passwordStrength = (password = '') => {
  let score = 0;
  if (password.length >= 8)               score++;
  if (/[A-Z]/.test(password))             score++;
  if (/[0-9]/.test(password))             score++;
  if (/[^A-Za-z0-9]/.test(password))      score++;
  const levels = [
    { label: 'Too Short', color: 'bg-red-500' },
    { label: 'Weak',      color: 'bg-red-400' },
    { label: 'Fair',      color: 'bg-yellow-500' },
    { label: 'Good',      color: 'bg-blue-500' },
    { label: 'Strong',    color: 'bg-green-500' },
  ];
  return { score, ...levels[score] };
};

// Required field
export const required = (label) => ({
  required: `${label} is required`,
});

// Min length
export const minLen = (n) => ({
  minLength: { value: n, message: `Minimum ${n} characters required` },
});

// Max length
export const maxLen = (n) => ({
  maxLength: { value: n, message: `Maximum ${n} characters allowed` },
});
