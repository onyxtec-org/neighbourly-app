import React from 'react';
import { View, Text } from 'react-native';


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
      <Text style={{ color: getColor(checks.hasUppercase) }}>
        {getIcon(checks.hasUppercase)} Contains at least 1 uppercase letter
      </Text>
      <Text style={{ color: getColor(checks.hasLowercase) }}>
        {getIcon(checks.hasLowercase)} Contains at least 1 lowercase letter
      </Text>
      <Text style={{ color: getColor(checks.hasSpecialChar) }}>
        {getIcon(checks.hasSpecialChar)} At least one special character
      </Text>
      <Text style={{ color: getColor(checks.hasNumber) }}>
        {getIcon(checks.hasNumber)} At least one number
      </Text>
      <Text style={{ color: getColor(checks.hasMinLength) }}>
        {getIcon(checks.hasMinLength)} Contains at least 8 characters
      </Text>
    </View>
  );
};

export default PasswordChecklist;
