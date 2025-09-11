import React from 'react';
import { View, StyleSheet } from 'react-native';
import StartupSVG from '../../assets/icons/norecord.svg';
import colors from '../../config/colors';
import AppText from './AppText';

const NoRecordFound = ({ message, iconHeight = 180 }) => {
  return (
    <View style={styles.container}>
      <StartupSVG width={iconHeight} height={iconHeight} />
      <AppText style={styles.message}>{message}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,               
    justifyContent: 'center', 
    alignItems: 'center',     
    paddingHorizontal: 20,
  },
  message: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default NoRecordFound;
