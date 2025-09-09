import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// Function to pick image from gallery or camera
export const pickImage = (fromCamera = false) => {
  return new Promise((resolve, reject) => {
    const options = {
      mediaType: 'photo', // We only want images
      cameraType: 'back',
      quality: 1,
      includeBase64: false,
      saveToPhotos: true,
    };

    // Choose source: Camera or Gallery
    const method = fromCamera ? launchCamera : launchImageLibrary;

    method(options, response => {
      if (response.didCancel) {
        reject('User cancelled image picker');
      } else if (response.errorCode) {
        reject(response.errorMessage);
      } else {
        resolve(response.assets[0]);
      }
    });
  });
};
