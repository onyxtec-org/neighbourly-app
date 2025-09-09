import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AppText from './../AppText';
const ImagePickerModal = ({ visible, onClose, onImagePicked }) => {
  const handlePickImageFromGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.error(response.errorMessage);
      } else {
        onImagePicked(response.assets[0]);
        onClose(); // close modal after picking
      }
    });
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS - permission handled automatically
  };

  const handlePickImageFromCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    launchCamera({ mediaType: 'photo' }, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.error(response.errorMessage);
      } else {
        onImagePicked(response.assets[0]);
        onClose(); // close modal after picking
      }
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <AppText style={styles.title}>Pick an Image</AppText>

              <TouchableOpacity style={styles.optionButton} onPress={handlePickImageFromGallery}>
                <AppText style={styles.optionText}>Choose from Gallery</AppText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionButton} onPress={handlePickImageFromCamera}>
                <AppText style={styles.optionText}>Use Camera</AppText>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ImagePickerModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  optionButton: {
    width: '100%',
    backgroundColor: '#ecf0f1',
    padding: 12,
    marginVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});
