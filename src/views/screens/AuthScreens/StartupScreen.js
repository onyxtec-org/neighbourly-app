import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import SvgWelcome from '../assets/icons/welcome.svg'; // If using SVG
// import logo from '../assets/images/logo.png'; // Use if using PNG

const StartupScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* SVG or PNG logo */}
      <View style={styles.imageContainer}>
        <SvgWelcome width={250} height={250} />
        {/* <Image source={logo} style={styles.logo} resizeMode="contain" /> */}
      </View>

      {/* App Title */}
      <Text style={styles.title}>Welcome to MyApp</Text>
      <Text style={styles.subtitle}>Manage your tasks easily and smartly</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StartupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
