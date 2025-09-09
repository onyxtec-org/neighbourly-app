import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomTextInput from '../../components/CustomTextInput';
import AppButton from '../../components/ButtonComponents/AppButton';
import {
  resetPassword,
  resetResetPasswordState,
} from '../../../redux/slices/authSlice/resetPasswordSlice';
import PasswordChecklist from '../../components/PasswordChecklist';
import AppText from '../../components/AppText';
import colors from '../../../config/colors';
import HeaderWithContainer from '../../components/HeaderComponent/HeaderWithContainer';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .matches(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least 1 lowercase letter')
    .matches(/\d/, 'Password must contain at least 1 number')
    .matches(/[@$!%*?&]/, 'Password must contain at least 1 special character')
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const ResetPasswordScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  // route.params.id should be passed from previous screen
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(state => state.resetPassword);

  useEffect(() => {
    if (success) {
      alert('Password reset successful!');
      navigation.replace('Login');
      dispatch(resetResetPasswordState());
    }

    if (error) {
      alert(error?.message || 'Something went wrong');
    }
  }, [success, error, navigation, dispatch]);

  const handleSubmitPassword = values => {
    dispatch(
      resetPassword({
        id: userId, // 🔁 FIXED HERE
        password: values.password,
        password_confirmation: values.confirmPassword,
      }),
    );
  };

  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <HeaderWithContainer borderColor={colors.black} />
        <AppText style={styles.headerText}>Create New Password</AppText>
        <View style={styles.textContainer}>
          <AppText style={styles.instructionText}>Please enter and confirm your new password.</AppText>
          <AppText style={styles.instructionText}>You will need to login after you reset.</AppText>
        </View>
        <View style={styles.inner}>
          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            onSubmit={handleSubmitPassword}
            validationSchema={validationSchema}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              touched,
              errors,
            }) => (
              <View style={{flex: 1, justifyContent: 'space-between',}}>
                <View>

               
                <CustomTextInput
                  label="Password"
                  required
                  showError={false}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  placeholder="Enter new password"
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
                  placeholder="Confirm new password"
                  secureTextEntry
                  error={touched.confirmPassword && errors.confirmPassword}
                />
                </View> 
                <AppButton
                  title={loading ? 'Resetting...' : 'Reset Password'}
                  onPress={handleSubmit}
                  disabled={loading}
                  btnStyles={styles.button}
                  textStyle={styles.buttonText}
                />
              </View>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
        </SafeAreaView>

  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  inner: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginBottom: 20,
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
  },
   instructionText: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    color: colors.black,
    paddingHorizontal: 12,
  },
  buttonText: {
    fontWeight: 'bold',
    color: colors.white,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
    marginTop: 100,
  },
});
