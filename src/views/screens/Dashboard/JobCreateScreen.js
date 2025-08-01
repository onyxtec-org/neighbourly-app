import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';
import * as Yup from 'yup';

import colors from '../../../config/colors';
import AppButton from '../../components/AppButton';
import CustomTextInput from '../../components/CustomTextInput';
import { createJob, resetJobState } from '../../../redux/slices/jobSlice'; // ✅ Make sure path is correct

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  budget: Yup.string().required('Budget is required'),
  location: Yup.string().required('Location is required'),
  locationLat: Yup.string().required('Latitude is required'),
  locationLng: Yup.string().required('Longitude is required'),
  startTime: Yup.string().required('Start time is required'),
  endTime: Yup.string().required('End time is required'),
});

const JobCreateScreen = ({ navigation, route }) => {
  const { serviceId, serviceName } = route.params;
  const dispatch = useDispatch();

  const jobState = useSelector(state => state.job);
  const { loading, error, success } = jobState;

  useEffect(() => {
    console.log('🌀 Job state updated:', jobState);

    if (success) {
      alert('✅ Job Created!');
      dispatch(resetJobState());
      navigation.goBack();
    } else if (error) {
      alert(`❌ ${error}`);
      dispatch(resetJobState());
    }
  }, [success, error, navigation, jobState, dispatch]);

  const handleSubmit = async values => {
    const payload = {
      service_id: serviceId,
      title: values.title,
      description: values.description,
      location: values.location,
      location_lat: parseFloat(values.locationLat),
      location_lng: parseFloat(values.locationLng),
      starts_at: values.startTime,
      ends_at: values.endTime,
      estimated_time: values.startTime, // Optional logic
      budget: parseFloat(values.budget),
    };

    console.log('🚀 Submitting job payload:', payload);
    dispatch(createJob(payload));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Job</Text>
        <View style={styles.iconButton} />
      </View>

      <Formik
        initialValues={{
          title: '',
          description: '',
          budget: '',
          location: '',
          locationLat: '',
          locationLng: '',
          startTime: '',
          endTime: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.serviceInfo}>
              <View style={styles.iconCircle} />
              <Text style={styles.serviceName}>{serviceName}</Text>
            </View>

            <CustomTextInput
              label="Job Title"
              required
              value={values.title}
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              placeholder="Enter job title"
              error={touched.title && errors.title}
            />

            <CustomTextInput
              label="Job Description"
              required
              multiline
              value={values.description}
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              placeholder="Enter job description"
              error={touched.description && errors.description}
              style={{ height: 100, textAlignVertical: 'top' }}
            />

            <CustomTextInput
              label="Budget (PKR)"
              required
              keyboardType="numeric"
              value={values.budget}
              onChangeText={handleChange('budget')}
              onBlur={handleBlur('budget')}
              placeholder="Enter budget"
              error={touched.budget && errors.budget}
            />

            <CustomTextInput
              label="Location"
              required
              value={values.location}
              onChangeText={handleChange('location')}
              onBlur={handleBlur('location')}
              placeholder="Enter location"
              error={touched.location && errors.location}
            />

            <CustomTextInput
              label="Latitude"
              required
              keyboardType="numeric"
              value={values.locationLat}
              onChangeText={handleChange('locationLat')}
              onBlur={handleBlur('locationLat')}
              placeholder="Enter latitude"
              error={touched.locationLat && errors.locationLat}
            />

            <CustomTextInput
              label="Longitude"
              required
              keyboardType="numeric"
              value={values.locationLng}
              onChangeText={handleChange('locationLng')}
              onBlur={handleBlur('locationLng')}
              placeholder="Enter longitude"
              error={touched.locationLng && errors.locationLng}
            />

            <CustomTextInput
              label="Start Time"
              required
              value={values.startTime}
              onChangeText={handleChange('startTime')}
              onBlur={handleBlur('startTime')}
              placeholder="Enter start time (e.g. 2025-08-01 10:00:00)"
              error={touched.startTime && errors.startTime}
            />

            <CustomTextInput
              label="End Time"
              required
              value={values.endTime}
              onChangeText={handleChange('endTime')}
              onBlur={handleBlur('endTime')}
              placeholder="Enter end time (e.g. 2025-08-01 14:00:00)"
              error={touched.endTime && errors.endTime}
            />

            <AppButton
              title={loading ? 'Creating...' : 'Create Job'}
              onPress={handleSubmit}
              disabled={loading}
              btnStyles={styles.loginButton}
              textStyle={styles.buttonText}
              IconName="briefcase"
            />
          </ScrollView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
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
  container: {
    padding: 16,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  submitText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default JobCreateScreen;
