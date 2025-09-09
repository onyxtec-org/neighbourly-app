import { getApp } from '@react-native-firebase/app';
import { getMessaging, getToken } from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import storage from '../../app/storage';

import notifee, { AuthorizationStatus } from '@notifee/react-native';

export const requestPermission = async () => {
  try {
      const settings = await notifee.requestPermission();

  if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
    console.log('Notification permission granted!!!');
    return true;
  } else {
    console.log('Notification permission denied');
    return false;
  }
  } catch (error) {
    console.log('erorrrrrr----',error);
    
  }

};

export const getFcmToken = async () => {
  try {

   
    const app = getApp();
    const messaging = getMessaging(app);
    const token = await getToken(messaging);  

    if (token) {
      console.log('FCM Token:', token);
      storage.storeFcmToken(token);
    } else {
      console.log('Failed to get FCM token');
    }
  } catch (error) {
    console.log('Failed to get token:', error);
  }
};

// export const useNotification = () => {
//   useEffect(() => {
//     getFcmToken();
//   }, []);
// };