import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppButton from '../../components/AppButton';
import colors from '../../../config/colors'; 
import StartupSVG from '../../../assets/icons/startup.svg';
import AppText from '../../components/AppText';
const WelcomeScreen = ({ navigation }) => {
  const handleSelectType = type => {
    navigation.navigate('Startup', { accountType: type });
  };
  return (
    <View style={styles.container}>
      {/* SVG Illustration */}
      <View style={styles.imageContainer}>
        <StartupSVG width={250} height={250} />
      </View>

      {/* Title & Subtitle */}
      <AppText style={styles.title}>Welcome to Neighbourly</AppText>
      <AppText style={styles.subtitle}>
        A service-based platform designed to connect you with reliable local
        support and community services.{' '}
      </AppText>

      <View style={styles.buttonContainer}>
        <AppButton
          title="Continue as Consumer"
          onPress={() => handleSelectType('consumer')}
          btnStyles={styles.consumerButton}
          textStyle={styles.buttonText}
          IconName="account-plus-outline" 
          IconSize={20}
        />

        <AppButton
          title="Continue as Provider"
          onPress={() => handleSelectType('provider')}
          btnStyles={styles.providerButton}
          textStyle={styles.providerButtonText}
          IconName="briefcase-outline" 
          IconSize={20}
          iconColor={colors.primary} 
        />
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', 
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 16, 
  },
  consumerButton: {
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
  providerButton: {
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
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 18,
    fontWeight: '600', 
  },
  providerButtonText: {
    color: colors.primary || '#6C63FF',
    fontSize: 18,
    fontWeight: '600',
  },
});
