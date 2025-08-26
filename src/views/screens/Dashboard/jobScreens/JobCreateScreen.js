import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ImageInputList from '../../../components/FormComponents/imageinpulist';
import Ionicons from '../../../components/ImageComponent/IconComponent';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomToast from '../../../components/CustomToast';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomDropdown from '../../../components/customdropdown';
import colors from '../../../../config/colors';
import AppButton from '../../../components/ButtonComponents/AppButton';
import CustomTextInput from '../../../components/CustomTextInput';
import {
  createJob,
  resetJobState,
  getJobs,
} from '../../../../redux/slices/jobSlice/jobSlice';
import AppActivityIndicator from '../../../components/AppActivityIndicator';
import Header from '../../../components/HeaderComponent/Header';
import AppText from '../../../components/AppText';
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    budget: Yup.string().required('Rate per hour is required'),
    location: Yup.string().required('Location is required'),
    startTime: Yup.string().required('Start time is required'),

  estimated_time: Yup.string().required('Estimated time is required'),
  price_type: Yup.string().required('Job type is required'),
  payment_type: Yup.string().required('Payment type is required'),
  custom_estimated_time: Yup.string().when(
    'estimated_time',
    (value, schema) => {
      return value === 'Custom'
        ? schema
            .required('Please enter estimated hours')
            .matches(/^\d+(\.\d{1,2})?$/, 'Enter a valid number')
        : schema.nullable();
    },
  ),

  images: Yup.array()
    .min(1, 'At least one image is required')
    .required('Please add at least one image'),
});

const JobCreateScreen = ({ navigation, route }) => {
  const { serviceId, serviceName } = route.params;
  const dispatch = useDispatch();
  const [jobTypeOpen, setJobTypeOpen] = useState(false);
  const [jobTypeValue, setJobTypeValue] = useState('per_hour');
  const [paymentTypeOpen, setPaymentTypeOpen] = useState(false);
  const [paymentTypeValue, setPaymentTypeValue] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerField, setPickerField] = useState('');
  const [tempDate, setTempDate] = useState(new Date());
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleAddMedia = (file, setFieldValue) => {
    setMediaList(prevList => {
      const newList = [...prevList, file];
      setFieldValue('images', newList);
      return newList;
    });
  };
  const parseDate = dateStr => {
    // Expects "DD/MM/YYYY HH:mm"
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes);
  };

  const handleRemoveMedia = (fileToRemove, setFieldValue) => {
    const updatedList = mediaList.filter(file => file.uri !== fileToRemove.uri);
    setMediaList(updatedList);
    setFieldValue('images', updatedList);
  };
  const [jobTypeItems, setJobTypeItems] = useState([
    { label: 'Fixed', value: 'fixed' },
    { label: 'Per Hour', value: 'per_hour' },
  ]);
  const [paymentTypeItems, setPaymentTypeItems] = useState([
    { label: 'Cash', value: 'cash' },
    { label: 'E-Payment', value: 'e-payment' },
  ]);
  const jobState = useSelector(state => state.job);
  const { loading, error, success } = jobState;

  const handleSubmit = async values => {
    setHasSubmitted(true);
    try {
      console.log('📤 Submitting Job with values:', values);

      const formData = new FormData();

      const finalEstimatedTime =
        values.estimated_time === 'Custom'
          ? values.custom_estimated_time
          : values.estimated_time;

      const rate = parseFloat(values.budget);
      // const noOfHours = parseFloat(values.no_of_hours || 1);

      // Append form fields
      formData.append('service_id', serviceId);
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('location', values.location);
      formData.append('location_lat', '40.7128'); // ⚠️ Replace with dynamic value
      formData.append('location_lng', '-74.0060'); // ⚠️ Replace with dynamic value
      // formData.append('starts_at', values.startTime);
      const startDate = parseDate(values.startTime);
      formData.append(
        'starts_at',
        startDate.toISOString().slice(0, 19).replace('T', ' '),
      );
      formData.append('ends_at', '2026-01-01 00:00:00');

      formData.append('price_type', jobTypeValue);
      formData.append('no_of_hours', finalEstimatedTime);
      formData.append('rate', rate.toString());
      formData.append('payment_type', paymentTypeValue);

      console.log('🧾 Form Data Before Media:', {
        service_id: serviceId,
        title: values.title,
        description: values.description,
        location: values.location,
        location_lat: '40.7128',
        location_lng: '-74.0060',
        starts_at: values.startTime,
        ends_at: '2026-01-01 00:00:00',
        // no_of_hours: values.no_of_hours,
        price_type: jobTypeValue,
        no_of_hours: finalEstimatedTime,
        rate: rate,
        // budget: budget,
        payment_type: paymentTypeValue,
      });

      mediaList.forEach((file, index) => {
        const uri = file.uri;
        const name = uri.split('/').pop() || `media_${index}`;
        const ext = name.split('.').pop();
        const isVideo = ext === 'mp4';
        const type = isVideo ? 'video/mp4' : `image/${ext}`;

        formData.append('attachments[]', {
          uri,
          name,
          type,
        });
      });

      console.log('🚀 Dispatching job creation...');
      const reponse = await dispatch(createJob(formData));

      if (reponse.payload.success) {
        console.log('✅ Job successfully created.');

        setToastMessage('Job Created!');
        setToastType('success');
        setToastVisible(true);
        dispatch(getJobs());

        setTimeout(() => {
          dispatch(resetJobState());
          navigation.pop();
        }, 1200);
      } else if (error) {
        console.log('❌ Job creation error received from state:', error);

        const message =
          error?.toString() || 'Job creation failed. Please try again.';
        setToastMessage(`❌ ${message}`);
        setToastType('error');
        setToastVisible(true);

        setTimeout(() => {
          dispatch(resetJobState());
        }, 1500);
      }
    } catch (error) {
      console.log('❌ Error in handleSubmit:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={'Create Job'} bookmark={false} />

      <Formik
        initialValues={{
          title: '',
          description: '',
          budget: '',
          location: '',
          locationLat: '',
          locationLng: '',
          startTime: '',
          payment_type: '',
          price_type: 'per_hour',
          estimated_time: '',
          custom_estimated_time: '',
          images: [],
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setTouched }) => {
          const touchedFields = {
            title: true,
            description: true,
            budget: true,
            location: true,
            startTime: true,
            estimated_time: true,
            price_type: true,
            payment_type: true,
            no_of_hours: true,
            images: true,
          };

          if (values.estimated_time === 'Custom') {
            touchedFields.custom_estimated_time = true;
          }

          setTouched(touchedFields);
          handleSubmit(values);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
        }) => (
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.serviceInfo}>
              <View style={styles.iconCircle} />
              <AppText style={styles.serviceName}>{serviceName}</AppText>
            </View>

            <AppText
              style={{ fontSize: 16, fontWeight: '600', marginBottom: -5 }}
            >
              Upload Images
            </AppText>

            <ImageInputList
              imageUris={mediaList}
              onAddImage={file => handleAddMedia(file, setFieldValue)}
              onRemoveImage={file => handleRemoveMedia(file, setFieldValue)}
            />
            {touched.images && errors.images && (
              <AppText style={{ color: 'red', marginBottom: 10 }}>
                {errors.images}
              </AppText>
            )}
            <View style={{ marginTop: 10 }} />
            <CustomTextInput
              label="Job Title"
              required
              value={values.title}
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              placeholder="Enter job title"
              error={touched.title && errors.title}
              showCharCount
              maxLength={60}
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
              showCharCount
              maxLength={500}
            />

            <CustomDropdown
              label="Pricing Type"
              open={jobTypeOpen}
              value={jobTypeValue}
              items={jobTypeItems}
              setOpen={o => {
                setJobTypeOpen(o);
                setPaymentTypeOpen(false);
              }}
              setValue={val => {
                setJobTypeValue(val);
                setFieldValue('price_type', val); // set in Formik
                if (val === 'fixed') {
                  setFieldValue('no_of_hours', ''); // clear hours if not needed
                }
              }}
              setItems={setJobTypeItems}
              placeholder="Select job type"
              required
              zIndex={3000}
            />

            <TouchableOpacity
              onPress={() => {
                setPickerField('startTime');
                setShowDatePicker(true); // Start with date
              }}
            >
              <CustomTextInput
                label="Start Time"
                required
                value={values.startTime}
                editable={false}
                placeholder="Select date & time"
                rightIcon={<Ionicons name="calendar" size={20} color="#888" />}
                error={touched.startTime && errors.startTime}
              />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="calendar"
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (event.type === 'set' && selectedDate) {
                    setTempDate(selectedDate);
                    setShowTimePicker(true); // Next, show time picker
                  }
                }}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={tempDate}
                mode="time"
                display="clock"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (event.type === 'set' && selectedTime) {
                    const combined = new Date(
                      tempDate.getFullYear(),
                      tempDate.getMonth(),
                      tempDate.getDate(),
                      selectedTime.getHours(),
                      selectedTime.getMinutes(),
                    );

                    const formatted = combined
                      .toLocaleString('en-GB', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })
                      .replace(',', '');

                    setFieldValue(pickerField, formatted);
                  }
                }}
              />
            )}

            <AppText style={styles.label}>
              Estimated Time <AppText style={{ color: 'red' }}>*</AppText>
            </AppText>

            <View style={styles.optionContainer}>
              {[
                '1 hour',
                '2 hours',
                '3 hours',
                '4 hours',
                '5 hours',
                'Custom',
              ].map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    (option === 'Custom'
                      ? values.estimated_time === 'Custom'
                      : values.estimated_time === parseFloat(option)) &&
                      styles.selectedOption,
                  ]}
                  onPress={() => {
                    if (option !== 'Custom') {
                      const numericValue = parseFloat(option);
                      setFieldValue('estimated_time', numericValue);
                      setFieldValue('custom_estimated_time', '');
                    } else {
                      setFieldValue('estimated_time', 'Custom');
                    }
                    setTimeout(
                      () => setFieldTouched('estimated_time', true),
                      0,
                    );
                  }}
                >
                  <AppText
                    style={[
                      styles.optionText,
                      (option === 'Custom'
                        ? values.estimated_time === 'Custom'
                        : values.estimated_time === parseFloat(option)) &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {option}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>

            {touched.estimated_time && errors.estimated_time && (
              <AppText style={{ color: 'red', marginBottom: 10 }}>
                {errors.estimated_time}
              </AppText>
            )}

            {values.estimated_time === 'Custom' && (
              <CustomTextInput
                label="Custom Estimated Time (in hours)"
                required
                keyboardType="numeric"
                value={values.custom_estimated_time}
                onChangeText={text =>
                  setFieldValue('custom_estimated_time', text)
                }
                onBlur={() => {
                  handleBlur('custom_estimated_time');
                  setFieldTouched('custom_estimated_time', true);
                }}
                placeholder="e.g., 3.5"
                error={
                  touched.custom_estimated_time && errors.custom_estimated_time
                }
              />
            )}

            <CustomTextInput
              label={jobTypeValue === 'fixed' ? 'Amount' : 'Rate per Hour'}
              required
              keyboardType="numeric"
              value={values.budget}
              onChangeText={handleChange('budget')}
              onBlur={handleBlur('budget')}
              placeholder={
                jobTypeValue === 'fixed'
                  ? 'Enter your amount'
                  : 'Enter rate per hour'
              }
              error={touched.budget && errors.budget}
            />

            <CustomDropdown
              label="Payment Type"
              open={paymentTypeOpen}
              value={paymentTypeValue}
              items={paymentTypeItems}
              setOpen={o => {
                setPaymentTypeOpen(o);
                setJobTypeOpen(false);
              }}
              setValue={val => {
                setPaymentTypeValue(val);
                setFieldValue('payment_type', val);
              }}
              setItems={setPaymentTypeItems}
              placeholder="Select payment type"
              error={touched.payment_type && errors.payment_type}
              required
              zIndex={2000}
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

      <CustomToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />

      {loading && <AppActivityIndicator />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  container: {
    padding: 16,
    paddingBottom: 15,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    // fontWeight: '600',
    fontSize: 14,
    color: '#333',
    marginTop: 0,
    marginBottom: 0,
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
    marginTop: 10,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    color: '#444',
  },
  selectedOptionText: {
    color: '#fff',
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
