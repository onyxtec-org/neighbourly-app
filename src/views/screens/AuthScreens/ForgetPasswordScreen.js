import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import StartupSVG from '../../../assets/icons/startup.svg';
import CustomTextInput from '../../components/CustomTextInput';
import AppButton from '../../components/ButtonComponents/AppButton';
import BackButton from '../../components/ButtonComponents/BackButton';
import CustomToast from '../../components/CustomToast';
import colors from '../../../config/colors';

import {
  sendForgotPasswordOtp,
  resetForgotPasswordState,
} from '../../../redux/slices/authSlice/forgotPasswordSlice';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});
const ForgotPasswordScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error, success, email, message } = useSelector(state => state.forgotPassword);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('error');

  const handleToast = (msg, type = 'error') => {
    console.log('Showing toast:', { msg, type });
    setToastMessage(msg);
    setToastType(type);
    setToastVisible(true);
  };

  const handleToastHide = () => {
    console.log('Hiding toast...');
    setToastVisible(false);
    setToastMessage('');
    setToastType('error');
  };

  // 🔍 Debug success state
  useEffect(() => {
    console.log('Success effect triggered:', { success, email, message });

    if (success && email) {
      handleToast(message || 'OTP sent successfully!', 'success');

      const timer = setTimeout(() => {
        console.log('Navigating to OTPScreen...');
        navigation.navigate('OTPScreen', { email ,context: 'forgotpassword'});
        dispatch(resetForgotPasswordState());
      }, 1500);

      return () => {
        console.log('Clearing timer...');
        clearTimeout(timer);
      };
    }
  }, [success, email, message, navigation, dispatch]);

  useEffect(() => {
    if (error) {
      console.log('Error occurred:', error);
      handleToast(error, 'error');
      dispatch(resetForgotPasswordState());
    }
  }, [error, dispatch]);

  const handleForgotPassword = values => {
    console.log('Sending OTP for email:', values.email);
    dispatch(sendForgotPasswordOtp(values.email));
  };


  // ✅ (rest of your component remains unchanged)

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Bar */}
        <View style={styles.header}>
          <View style={styles.backWrapper}>
            <BackButton onPress={() => navigation.goBack()} />
          </View>
          <Text style={styles.headerTitle}>Forgot Password</Text>
        </View>

        {/* Image & Subtext */}
        <View style={styles.imageContainer}>
          <StartupSVG width={150} height={150} />
          <Text style={styles.instructionText}>
            Please enter your registered Email, so we will send you OTP.
          </Text>
        </View>

        {/* Form */}
        <Formik
          initialValues={{ email: '' }}
          onSubmit={handleForgotPassword}
          validationSchema={validationSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formContainer}>
              <CustomTextInput
                label="Email"
                required
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                placeholder="Enter your email"
                keyboardType="email-address"
                error={touched.email && errors.email}
              />

              <AppButton
                title={loading ? 'Sending...' : 'Send OTP'}
                onPress={handleSubmit}
                btnStyles={styles.loginButton}
                textStyle={styles.buttonText}
                disabled={loading}
              />
            </View>
          )}
        </Formik>
      </View>

      {/* ✅ Toast Component */}
      <CustomToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={handleToastHide}
      />
    </SafeAreaView>
  );
};



export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingTop: 10,
    marginBottom: 20,
  },
  backWrapper: {
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: -8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 10,
  },
  instructionText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 12,
  },
  formContainer: {
    width: '100%',
  },
  loginButton: {
    backgroundColor: colors.primary,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
