// export default CreateStageScreen;
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import MediaPicker from '../../../components/Mediapicker/MediaPicker';
import colors from '../../../../config/colors';
import CustomTextInput from '../../../components/CustomTextInput';
import AppButton from '../../../components/ButtonComponents/AppButton';
import { useDispatch, useSelector } from 'react-redux';
import {
  createPost,
  getPosts,
} from '../../../../redux/slices/stageSlice/postSlice';
import AppText from '../../../components/AppText';
import Header from '../../../components/HeaderComponent/Header';
import CustomDropdown from '../../../components/customdropdown';
const CreateStageScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.post);

  const [media, setMedia] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [serviceValue, setServiceValue] = useState(null);
  const [serviceItems, setServiceItems] = useState([]);
  const {
    myServices,
  } = useSelector(state => state.services);
  useEffect(() => {
    if (myServices?.length > 0) {
      const formattedServices = myServices.map(service => ({
        label: service.name,
        value: service.id,
      }));
      setServiceItems(formattedServices);
    }
  }, [myServices]);
  const handleSubmit = async () => {
    setSubmitted(true);

    if (!title.trim() || !description.trim() || media.length === 0) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', description);
      formData.append('service_id', serviceValue);
      media.forEach((file, index) => {
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

      const response = await dispatch(createPost(formData));

      if (response?.payload?.success) {
        console.log('✅ Post successfully created');
        dispatch(getPosts());
        navigation.goBack();
      } else {
        console.log('❌ Post creation failed:', error || response?.payload);
      }
    } catch (err) {
      console.log('❌ Error in handleSubmit:', err);
    }
  };

  return (
    <>
      {/* Header */}
      <Header title={'Create Post'} bookmark={false} />

      {/* Form */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <MediaPicker onChange={setMedia} />
        {submitted && media.length === 0 && (
          <AppText style={styles.errorText}>
            At least one image/video is required
          </AppText>
        )}
        <CustomDropdown
          label="Select Service"
          open={serviceOpen}
          value={serviceValue}
          items={serviceItems}
          setOpen={setServiceOpen}
          setValue={val => setServiceValue(val)}
          setItems={setServiceItems}
          placeholder="Select service"
          error={submitted && !serviceValue ? 'Service is required' : ''}
          required
          zIndex={3000}
        />
        <CustomTextInput
          label="Title"
          required
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
          maxLength={30}
          showCharCount
          error={submitted && !title.trim() ? 'Title is required' : ''}
        />

        <CustomTextInput
          label="Write your content"
          required
          multiline
          value={description}
          onChangeText={setDescription}
          placeholder="Enter your content here"
          maxLength={500}
          showCharCount
          style={{ height: 170, textAlignVertical: 'top' }}
          error={submitted && !description.trim() ? 'Content is required' : ''}
        />

        <AppButton
          title={loading ? 'Creating...' : 'Create post'}
          onPress={handleSubmit}
          disabled={loading}
          btnStyles={styles.loginButton}
          textStyle={styles.buttonText}
          IconName="briefcase"
        />

        {error && <AppText style={styles.errorText}>❌ {error}</AppText>}
      </ScrollView>
    </>
  );
};

export default CreateStageScreen;
const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
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
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loginButton: {
    backgroundColor: colors.primary,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginBottom: 8,
    marginTop: -6,
  },
});
