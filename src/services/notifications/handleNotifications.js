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

  async handleNotificationRedirection(rawData) {
    try {
      this.stepLog('Redirection invoked with raw data', rawData);

      const data = rawData || {};
      const type = data?.type;
      const jobId = data?.jobId || data?.job_id;
      const offerId = data?.offerId || data?.offer_id;

      // Pull fresh role from Redux every time
      const state = store.getState();
      const userRole = state?.profile?.user?.role || 'consumer';

      this.stepLog('Extracted params', { type, jobId, offerId, userRole });

      switch (type) {
        case 'job_created':
          if (jobId) {
            const params = {
              jobId,
              userRole,
              status: data?.status || 'pending',
              item: data?.item || {},
            };
            this.stepLog('➡️ Navigating to JobDetailsScreen with params', params);
            navigate('JobDetailsScreen', params);
          } else {
            this.stepLog('⚠️ job_created missing jobId – no navigation');
          }
          break;

        case 'offer_created':
          // Navigate to OffersScreen; pass offerId if provided for deep-linking
          if (offerId) {
            const params = { offerId, origin: 'notification' };
            this.stepLog('➡️ Navigating to OffersScreen (specific offer)', params);
            navigate('OffersScreen', params);
          } else {
            this.stepLog('➡️ Navigating to OffersScreen (no specific offerId)');
            navigate('OffersScreen');
          }
          break;

        default:
          this.stepLog('ℹ️ Unknown or missing notification type – no navigation', { type });
          break;
      }
    } catch (error) {
      this.stepLog('❌ Notification redirection error', error);
    }
  },
};

export default NotificationService;
