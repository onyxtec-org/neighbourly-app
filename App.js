import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator';
import store from './src/redux/store';
import branch from 'react-native-branch';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { requestPermission, getFcmToken } from './src/services/notifications/useNotifications';
import NotificationService from './src/services/notifications/handleNotifications';
import { navigationRef, navigate } from './src/navigation/NavigationService';
import { setDeepLinkParams } from './src/redux/slices/deepLinkSlice';

export default function App() {
  // create notification channel
  const createChannel = async () => {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
  };

  const handleBranchNavigation = (params) => {
    const id = params?.id;
    const type = params?.type;
  
    if (!id || !type) {
      console.warn("❌ Deep link missing id/type:", params);
      return;
    }
  
    if (type === "user") {
      navigate("AccountScreen", { userId: parseInt(id, 10) });
    } else if (type === "group") {
      navigate("GroupScreen", { groupId: id });
    } else {
      console.warn("Unknown deep link type:", type);
    }
  };
  
  

  useEffect(() => {
    // Ignore AsyncStorage warning
    LogBox.ignoreLogs(['AsyncStorage has been extracted']);

    const init = async () => {
      await createChannel();

      const permissionGranted = await requestPermission();
      if (permissionGranted) {
        console.log('✅ Notification permission granted');
        NotificationService.init();
        await getFcmToken();
      } else {
        console.log('❌ Permission denied, skipping FCM setup');
      }
    };

    init();

    // 🔹 Branch deep link subscription
    const unsubscribe = branch.subscribe(({ error, params }) => {
      if (error) {
        console.error('❌ Branch Error:', error);
        return;
      }
    
      console.log("🌐 Raw Branch Params:", JSON.stringify(params, null, 2));
    
      if (params['+clicked_branch_link']) {
        console.log("🌐 Branch deep link:", params);
        store.dispatch(setDeepLinkParams(params)); // ✅ Save to Redux
      }
    });

    // 🔹 Cleanup
    return () => {
      unsubscribe?.();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppNavigator ref={navigationRef} />
      </Provider>
    </GestureHandlerRootView>
  );
}
