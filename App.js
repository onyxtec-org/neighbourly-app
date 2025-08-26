import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator';
import store from './src/redux/store';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { requestPermission,getFcmToken } from './src/services/notifications/useNotifications';
import NotificationService from './src/services/notifications/handleNotifications';
export default function App() {
  //useNotification();

  const createChannel = async () => {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
  };
  useEffect(() => {
  const init = async () => {
    LogBox.ignoreLogs(['AsyncStorage has been extracted']);
    await createChannel();

    const permissionGranted = await requestPermission();
    if (permissionGranted) {
      console.log('grandted');
      
      NotificationService.init();
      await getFcmToken();
    } else {
      console.log('Permission denied, skipping FCM setup');
    }
  };

  init();
}, []);


  const notificationHandler = async () => {
    try {
      const notificationGranted = await requestPermission();

      if (notificationGranted) {
        NotificationService.init();
      } else {
        console.log('Notification permission denied in app,js');
      }
    } catch (err) {
      console.log('Error handling permissions:', err);
    }
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </GestureHandlerRootView>
  );
}
