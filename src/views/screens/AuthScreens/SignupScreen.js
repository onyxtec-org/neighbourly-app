import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { resetRegisterState } from '../../../redux/slices/auth/registerSlice';
import { registerUser } from '../../../redux/thunks/auth/registerThunks';
import CustomTextInput from '../../components/CustomTextInput';
import PhoneNumberInput from '../../components/PhoneNumberInput';
import CrossIconButton from '../../components/CrossIconButton';
import CustomToast from '../../components/CustomToast';
import AppButton from '../../components/AppButton';
import CheckBox from '@react-native-community/checkbox';
import TermsAndConditionsModal from '../../components/TermsAndConditionsModal';
import CircularImagePicker from '../../components/CircularImagePicker';
import colors from '../../../config/colors';
import PasswordChecklist from '../../components/PasswordChecklist';
const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  countryCode: Yup.string().required('Country code is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),

  password: Yup.string()
    .matches(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least 1 lowercase letter')
    .matches(/\d/, 'Password must contain at least 1 number')
    .matches(/[@$!%*?&]/, 'Password must contain at least 1 special character')
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const SignupScreen = ({ navigation, route }) => {
  const { accountType } = route.params;

  const dispatch = useDispatch();
  const { loading, success, error, user } = useSelector(
    state => state.register,
  );
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [profileImage, setProfileImage] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    console.log('🟢 useEffect check:', { success, user, error });

    if (success && user) {
      console.log('✅ Navigating to OTPScreen with:', user);

      setToastMessage('Please verify your email via OTP.');
      setToastType('success');
      setToastVisible(true);

      setTimeout(() => {
        navigation.replace('OTPScreen', {
          userId: user.id,
          email: user.email,
          otp: user.otp,
          context: 'auth',
        });
        dispatch(resetRegisterState());
      }, 1000);
    } else if (error) {
      console.log('❌ Registration error:', error);

      const formattedMessage =
        typeof error.message === 'object'
          ? Object.values(error.message).flat().join('\n')
          : error.message;

      // ✅ Show error toast
      setToastMessage(formattedMessage || 'Something went wrong.');
      setToastType('error');
      setToastVisible(true);

      dispatch(resetRegisterState());
    }
  }, [success, user, error, dispatch, navigation]);

  const handleSignup = values => {
    if (!agreeTerms) {
      Alert.alert(
        'Terms Required',
        'You must agree to the terms and conditions.',
      );
      return;
    }

    const payload = {
      name: values.fullName,
      email: values.email,
      password: values.password,
      password_confirmation: values.confirmPassword,
      phone: values.phoneNumber,
      country_code: values.countryCode,
      location: values.address,
      location_lng: '0.0',
      location_lat: '0.0',

      role: accountType,
      image: profileImage, // pass raw image object
    };

    console.log('📤 Sending payload to thunk:', payload);
    dispatch(registerUser(payload));
    console.log('✅ registerUser dispatched');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={60}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CrossIconButton
          onPress={() =>
            navigation.canGoBack()
              ? navigation.goBack()
              : navigation.navigate('Login')
          }
          size={22}
          color="#212529"
          style={styles.closeButton}
        />

        <CircularImagePicker onImagePicked={asset => setProfileImage(asset)} />

        <Formik
          initialValues={{
            fullName: '',
            email: '',
            address: '',
            countryCode: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSignup}
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
                label="Full Name"
                required
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                placeholder="Enter your Full Name"
                error={touched.fullName && errors.fullName}
              />

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
                label="Location"
                required
                value={values.address}
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                placeholder="Enter your address"
                error={touched.address && errors.address}
              />

              <PhoneNumberInput
                label="Phone Number"
                countryCode={values.countryCode}
                onChangeCountryCode={handleChange('countryCode')}
                phoneNumber={values.phoneNumber}
                onChangePhoneNumber={handleChange('phoneNumber')}
                required
                error={
                  (touched.countryCode && errors.countryCode) ||
                  (touched.phoneNumber && errors.phoneNumber)
                }
              />

              <CustomTextInput
                label="Password"
                showError={false}
                required
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholder="Enter password"
                secureTextEntry
                error={touched.password && errors.password}
              />
              <PasswordChecklist password={values.password} />
              <CustomTextInput
                label="Confirm Password"
                required
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                placeholder="Confirm password"
                secureTextEntry
                error={touched.confirmPassword && errors.confirmPassword}
              />

              <View style={styles.termsContainer}>
                <CheckBox
                  value={agreeTerms}
                  onValueChange={setAgreeTerms}
                  tintColors={{ true: colors.primary, false: '#999' }}
                />
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text
                    style={styles.link}
                    onPress={() => setModalVisible(true)}
                  >
                    Terms & Conditions
                  </Text>
                </Text>
              </View>

              <TermsAndConditionsModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
              />

              <AppButton
                title={loading ? 'Registering...' : 'Sign Up'}
                onPress={() => {
                  console.log('🔘 Formik handleSubmit triggered');
                  handleSubmit();
                }}
                disabled={loading}
                btnStyles={styles.loginButton}
                textStyle={styles.buttonText}
                IconName="login"
              />
            </View>
          )}
        </Formik>
        <CustomToast
          visible={toastVisible}
          message={toastMessage}
          type={toastType}
          onHide={() => setToastVisible(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
  },
  imageContainer: {
    marginBottom: 40,
    alignItems: 'center',
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
  flex: {
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
    backgroundColor: colors.white,
    flexGrow: 1,
    justifyContent: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  termsText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flexWrap: 'wrap',
    flex: 1,
  },
  link: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  closeButton: {
    position: 'absolute',
    top: 25,
    right: 25,
    zIndex: 999,
    backgroundColor: '#f1f3f5',
  },
});
