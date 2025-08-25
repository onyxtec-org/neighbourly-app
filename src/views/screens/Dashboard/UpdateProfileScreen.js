import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CircularImagePicker from '../../components/CircularImagePicker';
import CustomTextInput from '../../components/CustomTextInput';
import AppButton from '../../components/AppButton';
import CrossIconButton from '../../components/CrossIconButton';
import { fetchUserProfile } from '../../../redux/slices/auth/profileSlice';
import colors from '../../../config/colors';
import CustomToast from '../../components/CustomToast';
import config from '../../../config';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../../redux/thunks/auth/updateProfileThunk';
import PhoneNumberInput from '../../components/PhoneNumberInput'; // Adjust the import path as needed

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full Name is required'),
  screenName: Yup.string().required('Screen Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  address: Yup.string().required('Address is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  countryCode: Yup.string().required('Country code is required'),
});

const UpdateProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.profile);

  const [profileImage, setProfileImage] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileUpdate = async values => {
    try {
      setIsSubmitting(true);

      const payload = {
        id: user?.id,
        data: {
          fullName: values.fullName,
          email: values.email,
          address: values.address,
          phoneNumber: values.phoneNumber,
          countryCode: values.countryCode,
          profileImage: profileImage,
        },
      };

      // 🔄 Update profile
      await dispatch(updateProfile(payload)).unwrap();

      // ✅ Re-fetch profile after successful update
      await dispatch(fetchUserProfile(user?.id));

      // ✅ Show success toast
      setToastMessage('Profile updated successfully');
      setToastType('success');
      setToastVisible(true);

      // ⏳ Wait then go back
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (err) {
      setToastMessage(err?.message || 'Failed to update profile');
      setToastType('error');
      setToastVisible(true);
    } finally {
      setIsSubmitting(false);
    }
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
              : navigation.navigate('Home')
          }
          size={22}
          color="#212529"
          style={styles.closeButton}
        />

        <CircularImagePicker
          onImagePicked={asset => setProfileImage(asset)}
          defaultImageUri={
            user?.image ? `${config.imageURL}${user.image}` : null
          }
        />

        <Formik
          initialValues={{
            fullName: user?.name || '',
            screenName: user.slug || '',
            email: user?.email || '',
            address: user?.location || '',
            phoneNumber: user?.phone || '',
            countryCode: user?.country_code || '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleProfileUpdate}
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
                placeholder="Enter your full name"
                error={touched.fullName && errors.fullName}
              />
              <CustomTextInput
                label="Screen Name"
                required
                value={values.screenName}
                onChangeText={handleChange('screenName')}
                onBlur={handleBlur('screenName')}
                placeholder="Enter your screen name"
                error={touched.screenName && errors.screenName}
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
                label="Address"
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
              <AppButton
                title="Update Profile"
                onPress={handleSubmit}
                btnStyles={styles.loginButton}
                textStyle={styles.buttonText}
                disabled={isSubmitting}
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

      {isSubmitting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default UpdateProfileScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
    backgroundColor: colors.white,
    flexGrow: 1,
    justifyContent: 'center',
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
  closeButton: {
    position: 'absolute',
    top: 25,
    right: 25,
    zIndex: 999,
    backgroundColor: '#f1f3f5',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
