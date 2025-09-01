const colors = {
  primary: '#111149',
  secondary: '#F3F2F4',
  black: '#000',
  white: '#fff',
  gradient: '#393487',
  red: '#E85355',
  yellow: '#eea356',
  blue: '#50b1c9',
  purple: '#756DF0',
  green: '#5db674',
  gray: '#c4c4c4',
  lightViolet: '#e5e3fd',
  lightGray: '#e0e0e0',
  mediumGray: '#9c9aa5',
  darkGray: '#6e6b7b',
  darkViolet: '#6d6a7a',
  lightPurple: '#b5abd4',
  gradientPink: '#B20EB8',
  checkGreen: '#58cc77',
  checkRed: '#eb0c0c',
  background: '#FFFFFF',
  textDark: '#000000',
  textMedium: '#888888',
  border: '#E0E0E0',
  pending: '#007BFF',
  inProgress: '#FF9800',
  completed: '#4CAF50',
  rejected: '#F44336',
scheduled: '#9C27B0',
  statusColors(type) {
    switch (type) {
      case 'open':
        return this.pending;
      case 'in_progress':
        return this.inProgress;
      case 'completed':
        return this.completed;
      case 'rejected':
        return this.rejected;
      case 'scheduled':
        return this.scheduled;
      default:
        return this.black;
    }
  },
};

export default colors;
