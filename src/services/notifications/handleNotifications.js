import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  onMessage,
  setBackgroundMessageHandler,
  
} from '@react-native-firebase/messaging';
import notifee, { AuthorizationStatus, EventType } from '@notifee/react-native';
import { AppState } from 'react-native';
import { navigate } from '../../navigation/NavigationService'; // adjust path
import store from '../../redux/store'; // adjust path to your store

const app = getApp();
const messaging = getMessaging(app);

const NotificationService = {
  handleForegroundMessages(
    leaveCount,
    setLeaveCount,
    notificationCount,
    setNotificationCount,
  ) {
    onMessage(messaging, async remoteMessage => {
      console.log('📥 FCM Message (foreground):', remoteMessage);

      await notifee.displayNotification({
        title: remoteMessage?.notification?.title,
        body: remoteMessage?.notification?.body,
        android: {
          channelId: 'default',
          pressAction: {
            id: 'default',
          },
        },
        data: remoteMessage?.data || {},
      });
    });
  },

  handleBackgroundMessages() {
    setBackgroundMessageHandler(messaging, async remoteMessage => {
      console.log('📥 FCM Message (background):', remoteMessage);
      await notifee.displayNotification({
        title: remoteMessage?.notification?.title,
        body: remoteMessage?.notification?.body,
        android: {
          channelId: 'default',
          pressAction: {
            id: 'default',
          },
        },
        data: remoteMessage?.data || {},
      });

      //this.handleNotificationRedirection(remoteMessage?.data);
    });
  },

 
  async init() {
    // prevent multiple registrations
    if (this._inited) return;
    this._inited = true;
  
    this.handleForegroundMessages();
    this.handleBackgroundMessages();
  
    // 1) Listen for taps while app is running (or brought to foreground)
    this._notifeeFgSub = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('🔔 Notification tapped (fg/bg):', detail.notification?.data);
        NotificationService.handleNotificationRedirection(detail.notification?.data);
      }
    });
  
    // 2) Handle taps that launched the app from a killed state
    const initial = await notifee.getInitialNotification();
    if (initial) {
      console.log('🚀 Opened app from quit via notification:', initial.notification?.data);
      this.handleNotificationRedirection(initial.notification?.data);
    }
  
    AppState.addEventListener('change', this.handleAppStateChange);
  },
  
  handleAppStateChange(nextAppState) {
    if (nextAppState === 'active') {
      notifee.getInitialNotification().then(initialNotification => {
        if (initialNotification) {
          console.log('🔁 App opened from background:', initialNotification.notification?.data);
          NotificationService.handleNotificationRedirection(initialNotification.notification?.data);
        }
      });
    }
  },

  async handleNotificationRedirection(data) {
    try {
      console.log('🔀 Redirecting based on notification data:', data);
  
      const jobId = data?.jobId || data?.job_id;
  
      // ✅ Get latest role from Redux state
      const state = store.getState();
      const userRole = state?.profile?.user?.role || 'consumer'; // fallback if not available
  
      if (data?.type === 'job_created' && jobId) {
        navigate('JobDetailsScreen', {
          jobId,
          userRole, // ✅ dynamic role
          status: data?.status || 'pending',
          item: data?.item || {},
        });
      }
    } catch (error) {
      console.log('❌ Notification redirection error:', error);
    }
  }

};

export default NotificationService;
