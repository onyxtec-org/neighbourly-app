import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../redux/thunks/auth/loginThunk';
import { resetLoginState } from '../../../redux/slices/authSlice/loginSlice';
import { setMyServices } from '../../../redux/slices/servicesSlice/servicesSlice';
import { fetchUserProfile } from '../../../redux/slices/authSlice/profileSlice';
import { fetchNotifications } from '../../../redux/slices/notificationSlice/notificationSlice';
import storage from '../../../app/storage';
import StartupSVG from '../../../assets/icons/startup.svg';
import CustomTextInput from '../../components/CustomTextInput';
import AppButton from '../../components/ButtonComponents/AppButton';
import CustomToast from '../../components/CustomToast';
import colors from '../../../config/colors';
import AppText from '../../components/AppText';
import AppActivityIndicator from '../../components/AppActivityIndicator';
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const LoginAndSelectTypeScreen = ({ navigation, route }) => {
  const accountType = route?.params?.accountType || null;
  const dispatch = useDispatch();
  const { loading, error, success, user, token } = useSelector((state) => state.login);

  const [loginEmail, setLoginEmail] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fadeAnim = useState(new Animated.Value(0))[0];

  const handleLogin = (values) => {
    setLoginEmail(values.email);
    dispatch(loginUser(values));
  };

  const handleSelectType = (type) => {
    navigation.navigate('Signup', { accountType: type });
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (success && user && token) {
      dispatch(setMyServices(user.services));
      dispatch(fetchUserProfile({userId:user.id}));
       dispatch(fetchNotifications())
      setToastMessage('Login Successful!');
      setToastType('success');
      setToastVisible(true);

      const saveAndNavigate = async () => {
        await storage.storeToken(token);
        await storage.storeUser(user);

        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'DashboardRouter' }],
            })
          );
        }, 1000);
      };
      saveAndNavigate();
    } else if (error) {
      const message = error?.message || error?.toString() || 'Login failed. Please try again.';
      setToastMessage(message);
      setToastType('error');
      setToastVisible(true);

      if (message.toLowerCase().includes('not verified') || message.toLowerCase().includes('verify your account')) {
        setTimeout(() => {
          navigation.navigate('OTPScreen', { email: loginEmail });
        }, 600);
      }

      dispatch(resetLoginState());
    }
  }, [success, error, user, dispatch, navigation, loginEmail, token]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      

      {/* Animated Logo */}
      <Animated.View style={[styles.imageContainer, { opacity: fadeAnim }]}>
        <StartupSVG width={160} height={160} />
        <AppText style={styles.welcomeText}>Welcome Back 👋</AppText>
        <AppText style={styles.subText}>Log in to continue</AppText>
      </Animated.View>

      {/* Login Form */}
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={handleLogin}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
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
              style={styles.input}
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
              style={styles.input}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPasswordContainer}
            >
              <AppText style={styles.forgotPasswordText}>Forgot Password?</AppText>
            </TouchableOpacity>

            <AppButton
              title={loading ? 'Logging in...' : 'Login'}
              onPress={handleSubmit}
              disabled={loading}
              btnStyles={styles.loginButton}
              textStyle={styles.buttonText}
              IconName="log-in-outline"
            />
          </View>
        )}
      </Formik>

      {/* Divider */}
      <AppText style={styles.signupPrompt}>Don’t have an account?</AppText>

      {/* Signup Buttons */}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Signup as a Consumer"
          onPress={() => handleSelectType('consumer')}
          btnStyles={styles.consumerButton}
          textStyle={styles.signupButtonText}
          IconName="person-add-outline"
          IconSize={20}
        />

        <AppButton
          title="Signup as a  Provider"
          onPress={() => handleSelectType('provider')}
          btnStyles={styles.providerButton}
          textStyle={styles.providerButtonText}
          IconName="briefcase-outline"
          IconSize={20}
          iconColor={colors.primary}
        />
      </View>

      <CustomToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
      {loading && <AppActivityIndicator/>}
    </ScrollView>
  );
};

export default LoginAndSelectTypeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    borderRadius: 30,
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 10,
  },
  subText: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  formContainer: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    borderRadius: 12,
    //backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
  },
  loginButton: {
    backgroundColor: colors.primary,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  signupPrompt: {
    fontSize: 15,
    color: '#495057',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: -10,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  consumerButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  providerButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  providerButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});