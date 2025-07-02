// src/utils/passwordUtils.js

export const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 6) score += 25;
  if (/[A-Z]/.test(password)) score += 25;
  if (/\d/.test(password)) score += 25;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 25;
  return score;
};

export const getPasswordColor = (strength) => {
  if (strength >= 100) return "success";
  if (strength >= 70) return "info";
  if (strength >= 40) return "warning";
  return "danger";
};

export const getPasswordRules = (password) => ({
  length: password.length >= 6,
  uppercase: /[A-Z]/.test(password),
  number: /\d/.test(password),
  special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
});

export const allRulesPassed = (password) =>
  Object.values(getPasswordRules(password)).every(Boolean);
