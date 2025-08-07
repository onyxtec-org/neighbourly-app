import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import CustomTextInput from '../../components/CustomTextInput';
import AppButton from '../../components/AppButton';
import colors from '../../../config/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import authStorage from '../../../app/storage';
import { changePassword, resetPasswordState } from '../../../redux/slices/auth/passwordSlice';
import CustomToast from '../../components/CustomToast'; // 🔔 Import your custom toast

const ChangePasswordScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const login = useSelector((state) => state.login);
  const userId = login?.user?.id;

  const { loading, success, error } = useSelector((state) => state.password);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const handleChangePassword = async (values) => {
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
        })
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={styles.iconButton} />
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
                    placeholder="Enter new password"
                    value={values.newPassword}
                    onChangeText={handleChange('newPassword')}
                    onBlur={handleBlur('newPassword')}
                    error={touched.newPassword && errors.newPassword}
                    secureTextEntry
                  />

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
    backgroundColor: '#F3F4F6',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
  },
  iconButton: {
    width: 32,
    alignItems: 'center',
  },
  scrollViewContent: {
    paddingVertical: 24,
  },
  formWrapper: {
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 24,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});

export default ChangePasswordScreen;
