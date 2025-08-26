import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,

} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomTextInput from '../../components/CustomTextInput';
import AppButton from '../../components/AppButton';
import {
  resetPassword,
  resetResetPasswordState,
} from '../../../redux/slices/auth/resetPasswordSlice';
import PasswordChecklist from '../../components/PasswordChecklist';
import AppText from '../../components/AppText';
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.inner}>
          <AppText style={styles.title}>Reset Your Password</AppText>

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
              <>
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

                <AppButton
                  title={loading ? 'Resetting...' : 'Reset Password'}
                  onPress={handleSubmit}
                  disabled={loading}
                  btnStyles={styles.button}
                  textStyle={styles.buttonText}
                  IconName="lock-closed"
                />
              </>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#4a90e2',
  },
  buttonText: {
    fontWeight: 'bold',
  },
});
