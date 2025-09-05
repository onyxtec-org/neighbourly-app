// CustomContainer.js
import React from 'react';
import {   StyleSheet, TouchableOpacity } from 'react-native';
import AppText from './AppText';
import colors from '../../config/colors';

function CustomContainer({ title, backgroundColor = '#f1f1f1', onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.container, { backgroundColor }]}
    >
      <AppText style={styles.text}>{title} </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 40,
    margin: 8,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black, // text color white for contrast
  },
});

export default CustomContainer;
