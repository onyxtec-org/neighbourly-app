import { View, Text, StyleSheet } from 'react-native';

const MainScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🚀 Welcome to Main Screen</Text>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  subtext: {
    fontSize: 14,
    marginTop: 10,
    color: 'gray'
  }
});
