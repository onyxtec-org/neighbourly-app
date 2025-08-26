import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppButton from '../../components/AppButton';
import CrossIconButton from '../../components/CrossIconButton';
import colors from '../../../config/colors';
import StartupSVG from '../../../assets/icons/startup.svg';
import AppText from '../../components/AppText';
const StartupScreen = ({ navigation, route }) => {
  const { accountType } = route.params;
  return (
    <View style={styles.container}>
      <CrossIconButton
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate(' Welcome');
          }
        }}
        size={22}
        color="#212529"
        style={styles.closeButton}
      />
      {/* SVG Illustration */}
      <View style={styles.imageContainer}>
        <StartupSVG width={250} height={250} />
      </View>

      {/* Title & Subtitle */}
      <AppText style={styles.title}>Get Started</AppText>
      <AppText style={styles.subtitle}>
        Create an account or log in to connect with reliable local support and
        community services.
      </AppText>

      <View style={styles.buttonContainer}>
        <AppButton
          title="Register"
          onPress={() => navigation.navigate('Signup', { accountType })}
          btnStyles={styles.primaryButton}
          textStyle={styles.primaryButtonText}
          IconName="account-plus-outline"
          IconSize={20}
        />

        <AppButton
          title="Login"
          onPress={() => navigation.navigate('Login',{ accountType })}
          btnStyles={styles.secondaryButton}
          textStyle={styles.secondaryButtonText}
          IconName="login"
          IconSize={20}
          iconColor={colors.primary}
        />
      </View>
    </View>
  );
};

export default StartupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imageContainer: {
    marginBottom: 48,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: '#495057',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 25,
    right: 25,
    zIndex: 999,
    backgroundColor: '#f1f3f5',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: colors.primary || '#6C63FF',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary || '#6C63FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: colors.primary || '#6C63FF',
    fontSize: 18,
    fontWeight: '600',
  },
});
