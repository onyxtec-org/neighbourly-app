import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

function AppActivityIndicator({opacity}) {
  return (
    <View style={styles.loaderOverlay}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

export default AppActivityIndicator;
