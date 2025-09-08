import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import AppText from '../../components/AppText';
import CustomTextInput from '../../components/CustomTextInput';
import AppButton from '../../components/ButtonComponents/AppButton';
import colors from '../../../config/colors';
import authStorage from '../../../app/storage';
import {
  changePassword,
  resetPasswordState,
} from '../../../redux/slices/authSlice/passwordSlice';
import CustomToast from '../../components/CustomToast'; // 🔔 Import your custom toast
import PasswordChecklist from '../../components/PasswordChecklist';
import HeaderWithContainer from '../../components/HeaderComponent/HeaderWithContainer';
const ChangePasswordScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const login = useSelector(state => state.login);
  const userId = login?.user?.id;

  const { loading, success, error } = useSelector(state => state.password);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .matches(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least 1 lowercase letter')
      .matches(/\d/, 'Password must contain at least 1 number')
      .matches(
        /[@$!%*?&]/,
        'Password must contain at least 1 special character',
      )
      .min(8, 'Password must be at least 8 characters long')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const handleChangePassword = async values => {
    try {
      const token = await authStorage.getToken();

      if (!token || !userId) {
        setToastMessage('User not found or not logged in.');
        setToastType('error');
        setToastVisible(true);
        return;
      }

      dispatch(
        changePassword({
          userId,
          token,
          password: values.currentPassword,
          changed_password: values.newPassword,
          changed_password_confirmation: values.confirmPassword,
        }),
      );
    } catch (err) {
      setToastMessage('Failed to read auth token.');
      setToastType('error');
      setToastVisible(true);
    }
  };

  useEffect(() => {
    if (success) {
      setToastMessage('Password changed successfully');
      setToastType('success');
      setToastVisible(true);

      setTimeout(() => {
        dispatch(resetPasswordState());
        navigation.goBack();
      }, 2000);
    }

    if (error) {
      setToastMessage(error);
      setToastType('error');
      setToastVisible(true);
      dispatch(resetPasswordState());
    }
  }, [success, error, dispatch, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithContainer borderColor={colors.black} />
      <AppText style={styles.headerText}>Change Password</AppText>

      <View style={styles.textContainer}>
        <AppText style={styles.instructionText}></AppText>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Formik
              initialValues={{
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleChangePassword}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.formWrapper}>
                  <View>
                    <CustomTextInput
                      label="Current Password"
                      required
                      placeholder="Enter current password"
                      value={values.currentPassword}
                      onChangeText={handleChange('currentPassword')}
                      onBlur={handleBlur('currentPassword')}
                      error={touched.currentPassword && errors.currentPassword}
                      secureTextEntry
                    />

                    <CustomTextInput
                      label="New Password"
                      required
                      showError={false}
                      placeholder="Enter new password"
                      value={values.newPassword}
                      onChangeText={handleChange('newPassword')}
                      onBlur={handleBlur('newPassword')}
                      error={touched.newPassword && errors.newPassword}
                      secureTextEntry
                    />
                    <PasswordChecklist password={values.newPassword} />

                    <CustomTextInput
                      label="Confirm Password"
                      required
                      placeholder="Confirm new password"
                      value={values.confirmPassword}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      error={touched.confirmPassword && errors.confirmPassword}
                      secureTextEntry
                    />
                  </View>
                  <AppButton
                    title={loading ? 'Changing...' : 'Change Password'}
                    onPress={handleSubmit}
                    btnStyles={styles.button}
                    textStyle={styles.buttonText}
                    disabled={loading}
                  />
                </View>
              )}
            </Formik>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {/* ✅ Custom Toast */}
      <CustomToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 32,
     fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
     marginTop: 60,
  },

  textContainer: {
    alignItems: 'center',

   
  }, 
  instructionText: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    color: colors.black,
    paddingHorizontal: 12,
  },
  iconButton: {
    width: 32,
    alignItems: 'center',
  },
scrollViewContent: {
  paddingVertical: 24,
  flexGrow: 1, // ✅ This makes content take full available height
},
  formWrapper: {
    //paddingHorizontal: 20,
     flex: 1,
     justifyContent: 'space-between',
  },
  button: {
    marginTop: 24,
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});

export default ChangePasswordScreen;
