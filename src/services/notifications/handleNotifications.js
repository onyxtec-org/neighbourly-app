import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  onMessage,
  setBackgroundMessageHandler,
  getInitialNotification,
} from '@react-native-firebase/messaging';
import notifee, { AuthorizationStatus, EventType } from '@notifee/react-native';
import { AppState } from 'react-native';
import { navigationRef } from '../../../App';
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
    this.handleForegroundMessages();
    this.handleBackgroundMessages();

    const initialNotification = await getInitialNotification();
    // if (initialNotification) {
    //   this.handleNotificationRedirection(initialNotification?.data);
    // }

    AppState.addEventListener('change', this.handleAppStateChange);
  },

  handleAppStateChange(nextAppState) {
    if (nextAppState === 'active') {
      getInitialNotification().then(remoteMessage => {
        if (remoteMessage) {
          console.log('🔁 App opened from background:', remoteMessage);
          NotificationService.handleNotificationRedirection(
            remoteMessage?.data,
          );
        }
      });
    }
  },

  async handleNotificationRedirection(
    data,
    notificationCount,
    setNotificationCount,
  ) {
    if (!navigationRef.isReady()) return;

    try {
      //setNotificationCount(notificationCount-1)

      const user = await RestoreUser();
      //console.log('➡️ Redirection data:', JSON.parse(data.message));

      if (data.leaveRequest) {
        const request = JSON.parse(data.leaveRequest);
        console.log('request------', request);

        this.getPath(
          request.user_id,
          user.id,
          request.status ? request.status : 'pending',
          request,
        );
      }
      if (data.message) {
        const message = JSON.parse(data.message);

        navigationRef.navigate('DashBoard', {
          screen: ' Messages',
          params: {
            screen: 'ViewNotifications',
            params: {
              details: message,
              from: 'pushNotification',
            },
          },
        });
      }
    } catch (error) {
      console.log('erreo', error);
    }
  },
};

export default NotificationService;
