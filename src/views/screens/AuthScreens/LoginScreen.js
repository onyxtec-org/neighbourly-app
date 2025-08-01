import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../redux/thunks/auth/loginThunk';
import { resetLoginState } from '../../../redux/slices/auth/loginSlice';
import StartupSVG from '../../../assets/icons/startup.svg';
import CrossIconButton from '../../components/CrossIconButton';
import CustomTextInput from '../../components/CustomTextInput';
import AppButton from '../../components/AppButton';
import colors from '../../../config/colors';
import CustomToast from '../../components/CustomToast';
import storage from '../../../app/storage'; // Adjust the path as per your structure

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error, success, user, token } = useSelector(
    state => state.login,
  );
  const [loginEmail, setLoginEmail] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const handleLogin = values => {
    console.log('Login form submitted with values:', values);
    setLoginEmail(values.email);
    dispatch(loginUser(values));
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };
  useEffect(() => {
    console.log('Login State Changed:');
    console.log('Success:', success);
    console.log('User:', user);
    console.log('Error:', error);
  
    if (success && user && token) {
      setToastMessage('Login Successful!');
      setToastType('success');
      setToastVisible(true);
  
      console.log('Saving token to AsyncStorage:', token);
      console.log('Saving user to AsyncStorage:', user);
  
      const saveAndNavigate = async () => {
        await storage.storeToken(token);
        await storage.storeUser(user);
  
        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Dashboard' }],
            })
          );
        }, 1200);
      };
  
      saveAndNavigate();
    } else if (error) {
      const message =
        error?.message ||
        error?.toString() ||
        'Login failed. Please try again.';
      setToastMessage(message);
      setToastType('error');
      setToastVisible(true);
  
      if (
        message.toLowerCase().includes('not verified') ||
        message.toLowerCase().includes('verify your account')
      ) {
        setTimeout(() => {
          navigation.navigate('OTPScreen', { email: loginEmail });
        }, 600);
      }
  
      dispatch(resetLoginState());
    }
  }, [success, error, user, dispatch, navigation, loginEmail, token]);
  
  return (
    <View style={styles.container}>
      <CrossIconButton
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('Welcome');
          }
        }}
        size={22}
        color="#212529"
        style={styles.closeButton}
      />

      <View style={styles.imageContainer}>
        <StartupSVG width={150} height={150} />
      </View>

      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={handleLogin}
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

            <CustomTextInput
              label="Password"
              required
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              placeholder="Enter password"
              secureTextEntry
              error={touched.password && errors.password}
            />

            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <AppButton
              title={loading ? 'Logging in...' : 'Login'}
              onPress={handleSubmit}
              disabled={loading}
              btnStyles={styles.loginButton}
              textStyle={styles.buttonText}
              IconName="login"
            />

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don’t have an account? </Text>
              <TouchableOpacity onPress={handleSignup}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>

      {/* ✅ Custom Toast at the end */}
      <CustomToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 25,
    right: 25,
    zIndex: 999,
    backgroundColor: '#f1f3f5',
  },
  formContainer: {
    width: '100%',
  },
  imageContainer: {
    marginBottom: 40,
    alignItems: 'center',
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 0,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    color: '#666',
  },
  signupLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
  },
});
