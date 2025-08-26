import React from 'react';
import { View } from 'react-native';
import AppText from './AppText';

// 🔹 Function to check password rules
const passwordChecks = (password) => {
  return {
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&]/.test(password),
    hasMinLength: password.length >= 8,
  };
};

// 🔹 Password checklist component
const PasswordChecklist = ({ password }) => {
  if (!password) return null; // Don't show if empty

  const checks = passwordChecks(password);
  const getColor = (condition) => (condition ? '#28a745' : '#dc3545'); // green or red
  const getIcon = (condition) => (condition ? '✔️' : '❌');

  return (
    <View style={{ marginTop: 5 }}>
      <AppText style={{ color: getColor(checks.hasUppercase) }}>
        {getIcon(checks.hasUppercase)} Contains at least 1 uppercase letter
      </AppText>
      <AppText style={{ color: getColor(checks.hasLowercase) }}>
        {getIcon(checks.hasLowercase)} Contains at least 1 lowercase letter
      </AppText>
      <AppText style={{ color: getColor(checks.hasSpecialChar) }}>
        {getIcon(checks.hasSpecialChar)} At least one special character
      </AppText>
      <AppText style={{ color: getColor(checks.hasNumber) }}>
        {getIcon(checks.hasNumber)} At least one number
      </AppText>
      <AppText style={{ color: getColor(checks.hasMinLength) }}>
        {getIcon(checks.hasMinLength)} Contains at least 8 characters
      </AppText>
    </View>
  );
};

export default PasswordChecklist;
