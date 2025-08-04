// import React, { useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import ImageInputList from '../../components/FormComponents/imageinpulist';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Formik } from 'formik';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// import * as Yup from 'yup';
// import { useState } from 'react';
// import colors from '../../../config/colors';
// import AppButton from '../../components/AppButton';
// import DropdownTextInput from '../../components/DropdownTextInput'; // ✅ Ensure this component exists
// import CustomTextInput from '../../components/CustomTextInput';
// import { createJob, resetJobState } from '../../../redux/slices/jobSlice'; // ✅ Make sure path is correct

// const validationSchema = Yup.object().shape({
//   title: Yup.string().required('Title is required'),
//   description: Yup.string().required('Description is required'),
//   budget: Yup.string().required('Budget is required'),
//   location: Yup.string().required('Location is required'),
//   startTime: Yup.string().required('Start time is required'),
//   estimated_time: Yup.string().required('Estimated time is required'),
// });

// const JobCreateScreen = ({ navigation, route }) => {
//   const { serviceId, serviceName } = route.params;
//   const dispatch = useDispatch();
//   const [mediaList, setMediaList] = useState([]);
//   const handleAddMedia = file => {
//     setMediaList([...mediaList, file]);
//   };

//   const handleRemoveMedia = fileToRemove => {
//     setMediaList(mediaList.filter(file => file.uri !== fileToRemove.uri));
//   };
//   const [estimatedTime, setEstimatedTime] = useState('');

//   const jobState = useSelector(state => state.job);
//   const { loading, error, success } = jobState;

//   useEffect(() => {
//     console.log('🌀 Job state updated:', jobState);

//     if (success) {
//       alert('✅ Job Created!');
//       dispatch(resetJobState());
//       navigation.goBack();
//     } else if (error) {
//       alert(`❌ ${error}`);
//       dispatch(resetJobState());
//     }
//   }, [success, error, navigation, jobState, dispatch]);

//   const handleSubmit = async values => {
//     const payload = {
//       service_id: serviceId,
//       title: values.title,
//       description: values.description,
//       location: values.location,
//       location_lat: '8878',
//       location_lng: '88787',
//       starts_at: values.startTime,
//       ends_at: values.endTime,
//       estimated_time: values.startTime, // Optional logic
//       budget: parseFloat(values.budget),
//     };

//     console.log('🚀 Submitting job payload:', payload);
//     dispatch(createJob(payload));
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.iconButton}
//         >
//           <Ionicons name="arrow-back" size={24} color={colors.dark} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Create Job</Text>
//         <View style={styles.iconButton} />
//       </View>

//       <Formik
//         initialValues={{
//           title: '',
//           description: '',
//           budget: '',
//           location: '',
//           locationLat: '',
//           locationLng: '',
//           startTime: '',
//           endTime: '',
//         }}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//       >
//         {({
//           handleChange,
//           handleBlur,
//           handleSubmit,
//           values,
//           errors,
//           touched,
//         }) => (
//           <KeyboardAwareScrollView
//             contentContainerStyle={styles.container}
//             enableOnAndroid={true}
//             extraScrollHeight={100}
//             keyboardShouldPersistTaps="handled"
//           >
//             <View style={styles.serviceInfo}>
//               <View style={styles.iconCircle} />
//               <Text style={styles.serviceName}>{serviceName}</Text>
//             </View>

//             <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: -5 }}>
//               Upload Images
//             </Text>
//             <ImageInputList
//               imageUris={mediaList}
//               onAddImage={handleAddMedia}
//               onRemoveImage={handleRemoveMedia}
//             />

//             <CustomTextInput
//               label="Job Title"
//               required
//               value={values.title}
//               onChangeText={handleChange('title')}
//               onBlur={handleBlur('title')}
//               placeholder="Enter job title"
//               error={touched.title && errors.title}
//               showCharCount={true}
//               maxLength={60} // ✅ Add maxLength prop
//             />

//             <CustomTextInput
//               label="Job Description"
//               required
//               multiline
//               value={values.description}
//               onChangeText={handleChange('description')}
//               onBlur={handleBlur('description')}
//               placeholder="Enter job description"
//               error={touched.description && errors.description}
//               style={{ height: 100, textAlignVertical: 'top' }}
//               showCharCount={true}
//               maxLength={500}
//             />
//             <CustomTextInput
//               label="Start Time"
//               required
//               value={values.startTime}
//               onChangeText={handleChange('startTime')}
//               onBlur={handleBlur('startTime')}
//               placeholder="Enter start time (e.g. 2025-08-01)"
//               error={touched.startTime && errors.startTime}
//             />
//             {/* <DropdownTextInput
//   label="Estimated Time"
//   required
//   value={values.estimated_time}          // <-- Formik value
//   onChange={handleChange('estimated_time')} // <-- Formik change handler
//   placeholder="Select estimated time"
//   error={touched.estimated_time && errors.estimated_time}
// /> */}

//             <CustomTextInput
//               label="Rate per Hour"
//               required
//               keyboardType="numeric"
//               value={values.budget}
//               onChangeText={handleChange('budget')}
//               onBlur={handleBlur('budget')}
//               placeholder="Enter rate per hour"
//               error={touched.budget && errors.budget}
//             />

//             <CustomTextInput
//               label="Location"
//               required
//               value={values.location}
//               onChangeText={handleChange('location')}
//               onBlur={handleBlur('location')}
//               placeholder="Enter location"
//               error={touched.location && errors.location}
//             />

//             {/* <CustomTextInput
//               label="Estimated Time"
//               required
//               value={values.endTime}
//               onChangeText={handleChange('estimated_time')}
//               onBlur={handleBlur('estimated_time')}
//               placeholder="Enter estimated time (e.g. 2025-08-01)"
//               error={touched.endTime && errors.endTime}
//             /> */}

//             <AppButton
//               title={loading ? 'Creating...' : 'Create Job'}
//               onPress={handleSubmit}
//               disabled={loading}
//               btnStyles={styles.loginButton}
//               textStyle={styles.buttonText}
//               IconName="briefcase"
//             />
//           </KeyboardAwareScrollView>
//         )}
//       </Formik>
//     </SafeAreaView>
//   );
// };

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ImageInputList from '../../components/FormComponents/imageinpulist';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';

import colors from '../../../config/colors';
import AppButton from '../../components/AppButton';
import DropdownTextInput from '../../components/DropdownTextInput'; // Ensure this exists
import CustomTextInput from '../../components/CustomTextInput';
import { createJob, resetJobState } from '../../../redux/slices/jobSlice';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  budget: Yup.string().required('Rate per hour is required'),
  location: Yup.string().required('Location is required'),
  startTime: Yup.string().required('Start time is required'),
  estimated_time: Yup.string().required('Estimated time is required'),
});

const JobCreateScreen = ({ navigation, route }) => {
  const { serviceId, serviceName } = route.params;
  const dispatch = useDispatch();
  const [mediaList, setMediaList] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddMedia = file => {
    setMediaList([...mediaList, file]);
  };

  const handleRemoveMedia = fileToRemove => {
    setMediaList(mediaList.filter(file => file.uri !== fileToRemove.uri));
  };

  const jobState = useSelector(state => state.job);
  const { loading, error, success } = jobState;

  useEffect(() => {
    if (success) {
      alert('✅ Job Created!');
      dispatch(resetJobState());
      navigation.goBack();
    } else if (error) {
      alert(`❌ ${error}`);
      dispatch(resetJobState());
    }
  }, [success, error, dispatch, navigation]);

  const handleSubmit = async values => {
    const payload = {
      service_id: serviceId,
      title: values.title,
      description: values.description,
      location: values.location,
      location_lat: '8878',
      location_lng: '88787',
      starts_at: values.startTime,
      ends_at: values.endTime,
      estimated_time: values.startTime,
      budget: parseFloat(values.budget),
    };

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
          setFieldValue,
        }) => (
          <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            enableOnAndroid
            extraScrollHeight={100}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.serviceInfo}>
              <View style={styles.iconCircle} />
              <Text style={styles.serviceName}>{serviceName}</Text>
            </View>

            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: -5 }}>
              Upload Images
            </Text>

            <ImageInputList
              imageUris={mediaList}
              onAddImage={handleAddMedia}
              onRemoveImage={handleRemoveMedia}
            />

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

            {/* START TIME FIELD WITH CALENDAR ICON */}
            <CustomTextInput
              label="Start Time"
              required
              value={values.startTime}
              onChangeText={handleChange('startTime')}
              onBlur={handleBlur('startTime')}
              placeholder="Select start time"
              error={touched.startTime && errors.startTime}
              rightIcon={<Ionicons name="calendar" size={20} color="#888" />}
              onRightIconPress={() => setShowDatePicker(true)}
            />

            {showDatePicker && (
             <DateTimePicker
             value={values.startTime ? new Date(values.startTime) : new Date()}
             mode="datetime"
             display="default"
             onChange={(event, selectedDate) => {
               setShowDatePicker(false);
           
               if (event.type === 'set' && selectedDate) {
                 const formattedDate = selectedDate
                   .toISOString()
                   .slice(0, 16)
                   .replace('T', ' ');
                 setFieldValue('startTime', formattedDate);
               }
             }}
           />
             
            )}

            <CustomTextInput
              label="Rate per Hour"
              required
              keyboardType="numeric"
              value={values.budget}
              onChangeText={handleChange('budget')}
              onBlur={handleBlur('budget')}
              placeholder="Enter rate per hour"
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

            <AppButton
              title={loading ? 'Creating...' : 'Create Job'}
              onPress={handleSubmit}
              disabled={loading}
              btnStyles={styles.loginButton}
              textStyle={styles.buttonText}
              IconName="briefcase"
            />
          </KeyboardAwareScrollView>
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
