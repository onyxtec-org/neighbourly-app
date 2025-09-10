// components/NoRecordFound.js or .tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import StartupSVG from '../../assets/icons/startup.svg';
import colors from '../../config/colors';
import AppText from './AppText';
const NoRecordFound = ({ message, marginTop = 0, iconHeight = 160 }) => {
  return (
    <View style={[styles.container, { marginTop }]}>
      <StartupSVG width={iconHeight} height={iconHeight} />
      <AppText style={styles.message}>{message}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
container: {
  //flex: 1,
  justifyContent: 'center',
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
