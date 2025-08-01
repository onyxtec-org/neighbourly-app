// components/NoRecordFound.js or .tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import StartupSVG from '../../assets/icons/startup.svg';
import colors from '../../config/colors';

const NoRecordFound = ({ message, marginTop = 0, iconHeight = 160 }) => {
  return (
    <View style={[styles.container, { marginTop }]}>
      <StartupSVG width={iconHeight} height={iconHeight} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  message: {
    marginTop: 10,
    color: colors.primary, // Replace with your primary color
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default NoRecordFound;
