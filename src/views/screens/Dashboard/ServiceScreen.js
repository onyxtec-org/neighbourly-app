import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

function ServiceScreen(props) {
  return (
    <View style={styles.container}>
    <Text>Hello</Text>  {/* ✅ Correct */}
  </View>
  );
}

const styles = StyleSheet.create({
  container: {}
});

export default ServiceScreen;