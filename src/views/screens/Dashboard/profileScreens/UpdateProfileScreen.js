import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CircularImagePicker from '../../../components/ImageComponent/CircularImagePicker';
import CustomTextInput from '../../../components/CustomTextInput';
import AppButton from '../../../components/ButtonComponents/AppButton';
import CrossIconButton from '../../../components/FormComponents/CrossIconButton';
import { fetchUserProfile } from '../../../../redux/slices/authSlice/profileSlice';
import colors from '../../../../config/colors';
import CustomToast from '../../../components/CustomToast';
import config from '../../../../config';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../../../redux/thunks/auth/updateProfileThunk';
import { checkSlug } from '../../../../redux/thunks/auth/registerThunks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PhoneNumberInput from '../../../components/PhoneNumberInput';

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full Name is required'),
  screenName: Yup.string()
    .required('Screen Name is required')
    .min(3, 'Minimum 3 characters')
    .max(20, 'Maximum 20 characters')
    .matches(/^[a-z0-9]+$/, 'Only lowercase letters and numbers allowed'),
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

  const [slugAvailable, setSlugAvailable] = useState(null); // true, false, or null
  const [slugLoading, setSlugLoading] = useState(false);

  const slugTimeout = useRef(null);
const validateScreenName = values => {
  const errors = {};
  if (slugAvailable === false) {
    errors.screenName = 'Screen name is already taken';
  }
  return errors;
};
  const handleProfileUpdate = async values => {
    try {
      setIsSubmitting(true);

      console.log('user id', user?.id);

      const payload = {
        id: user?.id,
        data: {
          fullName: values.fullName,
          email: values.email,
          address: values.address,
          phoneNumber: values.phoneNumber,
          countryCode: values.countryCode,
          profileImage: profileImage,
          slug: values.screenName,
        },
      };

      console.log('payload', payload);

      await dispatch(updateProfile(payload)).unwrap();
      await dispatch(fetchUserProfile({userId:user?.id}));

      setToastMessage('Profile updated successfully');
      setToastType('success');
      setToastVisible(true);

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

  const debounceCheckSlug = (slug, userId) => {
    if (slugTimeout.current) clearTimeout(slugTimeout.current);

    slugTimeout.current = setTimeout(() => {
      if (slug.trim().length < 3) {
        setSlugAvailable(null);
        return;
      }

      setSlugLoading(true);
      dispatch(checkSlug({ slug, user_id: userId || null }))
        .unwrap()
        .then(res => {
          console.log('✅ SLUG CHECK RESPONSE:', res);
          if (res.success && res.statusCode === 200) {
            setSlugAvailable(true);
          } else {
            setSlugAvailable(false);
          }
        })
        .catch(() => {
          setSlugAvailable(false);
        })
        .finally(() => {
          setSlugLoading(false);
        });
    }, 500);
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
              : navigation.navigate('RouterDashboard')
          }
          size={22}
          color="#212529"
          style={styles.closeButton}
        />

        <CircularImagePicker
          onImagePicked={asset => setProfileImage(asset)}
          defaultImageUri={
            user?.image ? `${config.userimageURL}${user.image}` : null
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
          validate={validateScreenName}
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
                onChangeText={text => {
                  handleChange('screenName')(text);
                  setSlugAvailable(null); // reset
                  debounceCheckSlug(text);
                }}
                onBlur={handleBlur('screenName')}
                placeholder="Enter your Screen Name"
                error={touched.screenName && errors.screenName}
                rightIcon={
                  slugLoading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : slugAvailable === true ? (
                    <Ionicons name="checkmark-circle" size={20} color="green" />
                  ) : slugAvailable === false ? (
                    <Ionicons name="close-circle" size={20} color="red" />
                  ) : null
                }
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
                disabled={isSubmitting || slugAvailable === false}
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
  screenNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginLeft: 10,
  },
});
