// src/utils/stringHelpers.js
export const formatStatusText = (status) => {
  if (!status) return '';

  return status
    .toString()
    .split('_') // split by underscore
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize
    .join(' '); // join with space
};
