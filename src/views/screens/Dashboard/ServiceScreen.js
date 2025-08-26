import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../../components/AppText';
function ServiceScreen(props) {
  return (
    <View style={styles.container}>
    <AppText>Hello</AppText>  {/* ✅ Correct */}
  </View>
  );
}

const styles = StyleSheet.create({
  container: {}
});

export default ServiceScreen;