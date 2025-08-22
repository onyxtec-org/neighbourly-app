import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  onMessage,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NavigationService from '../../navigation/NavigationService';
import { normalizeNotificationData } from '../notifications/notificationUtils';
import store from '../../redux/store';
import { incrementUnreadCount } from '../../redux/slices/notificationSlice';

const PENDING_KEY = '@notif_pending_data_v1';
const app = getApp();
const messaging = getMessaging(app);

const safeJson = obj => {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    return String(obj);
  }
};

const resolveNavigateFn = () => {
  const ns = NavigationService || {};
  const fn = ns.navigate || ns.default || ns;
  if (typeof fn === 'function') return fn;
  if (fn && typeof fn.navigate === 'function') return fn.navigate;
  console.warn(
    '[NotificationService] navigate function not found on NavigationService import:',
    Object.keys(ns),
  );
  return null;
};

class NotificationServiceClass {
  constructor() {
    this._inited = false;
    this._notifeeFgSub = null;

    this.init = this.init.bind(this);
    this.handleNotificationRedirection =
      this.handleNotificationRedirection.bind(this);
    this._safeRedirect = this._safeRedirect.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  /* ---------- Persistence helpers ---------- */
  async _savePendingNotification(data) {
    try {
      await AsyncStorage.setItem(PENDING_KEY, safeJson(data));
      console.log('[NotificationService] Saved pending notification');
    } catch (e) {
      console.warn(
        '[NotificationService] Failed saving pending notification',
        e,
      );
    }
  }

  async _getPendingNotification() {
    try {
      const raw = await AsyncStorage.getItem(PENDING_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn(
        '[NotificationService] Failed reading pending notification',
        e,
      );
      return null;
    }
  }

  async _clearPendingNotification() {
    try {
      await AsyncStorage.removeItem(PENDING_KEY);
      console.log('[NotificationService] Cleared pending notification');
    } catch (e) {
      console.warn(
        '[NotificationService] Failed clearing pending notification',
        e,
      );
    }
  }

  /* ---------- Message handlers ---------- */
  handleForegroundMessages() {
    try {
      onMessage(messaging, async remoteMessage => {
        console.log('📥 FCM Message (foreground):', safeJson(remoteMessage));

        // Increment unread count
        store.dispatch(incrementUnreadCount());

        // Show local notification
        try {
          await notifee.displayNotification({
            title: remoteMessage?.notification?.title,
            body: remoteMessage?.notification?.body,
            android: {
              channelId: 'default',
              pressAction: { id: 'default' },
            },
            data: Object.keys(remoteMessage?.data || {}).length
              ? Object.fromEntries(
                  Object.entries(remoteMessage.data).map(([k, v]) => [
                    k,
                    String(v),
                  ]),
                )
              : {},
          });
        } catch (err) {
          console.warn(
            '[NotificationService] displayNotification failed (fg)',
            err,
          );
        }

        // Persist for later redirection
        await this._savePendingNotification(
          remoteMessage?.data || remoteMessage?.notification?.data || {},
        );
      });

      console.log('[NotificationService] Foreground message handler attached');
    } catch (e) {
      console.warn(
        '[NotificationService] Failed to attach foreground handler',
        e,
      );
    }
  }

  handleBackgroundMessages() {
    try {
      setBackgroundMessageHandler(messaging, async remoteMessage => {
        console.log('📥 FCM Message (background):', safeJson(remoteMessage));

        try {
          await notifee.displayNotification({
            title: remoteMessage?.notification?.title,
            body: remoteMessage?.notification?.body,
            android: {
              channelId: 'default',
              pressAction: { id: 'default' },
            },
            data: Object.keys(remoteMessage?.data || {}).length
              ? Object.fromEntries(
                  Object.entries(remoteMessage.data).map(([k, v]) => [
                    k,
                    String(v),
                  ]),
                )
              : {},
          });
        } catch (err) {
          console.warn(
            '[NotificationService] displayNotification failed (bg)',
            err,
          );
        }

        await this._savePendingNotification(
          remoteMessage?.data || remoteMessage?.notification?.data || {},
        );
      });

      console.log('[NotificationService] Background message handler attached');
    } catch (e) {
      console.warn(
        '[NotificationService] Failed to attach background handler',
        e,
      );
    }
  }

  async init() {
    if (this._inited) return;
    this._inited = true;

    console.log('[NotificationService] init() called');

    this.handleForegroundMessages();
    this.handleBackgroundMessages();

    // Foreground tap listener
    this._notifeeFgSub = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        const data =
          detail?.notification?.data || detail?.notification || detail;
        console.log('🔔 Notification tapped (fg):', safeJson(data));
        this._safeRedirect(data);
      }
    });

    // Background press
    try {
      notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.PRESS) {
          const data =
            detail?.notification?.data || detail?.notification || detail;
          console.log('🔔 Notification tapped (bg):', safeJson(data));
          await this._savePendingNotification(data);
        }
      });
    } catch (e) {
      console.warn(
        '[NotificationService] onBackgroundEvent registration failed:',
        e,
      );
    }

    // Opened from killed state
    try {
      const initial = await notifee.getInitialNotification();
      if (initial) {
        console.log(
          '🚀 Opened app from quit via notification:',
          safeJson(initial.notification?.data),
        );
        await this._safeRedirect(initial.notification?.data);
      }
    } catch (e) {
      console.warn('[NotificationService] getInitialNotification failed', e);
    }

    AppState.addEventListener('change', this.handleAppStateChange);

    const pending = await this._getPendingNotification();
    if (pending) {
      console.log(
        '[NotificationService] Found pending notification on init:',
        safeJson(pending),
      );
      await this._safeRedirect(pending);
    }

    console.log('[NotificationService] init() finished');
  }

  handleAppStateChange(nextAppState) {
    if (nextAppState === 'active') {
      this._getPendingNotification()
        .then(async initialNotification => {
          if (initialNotification) {
            console.log(
              '[NotificationService] App became active with pending:',
              safeJson(initialNotification),
            );
            await this._safeRedirect(initialNotification);
            await this._clearPendingNotification();
          }
        })
        .catch(e =>
          console.warn('[NotificationService] AppState check error', e),
        );
    }
  }

  async _safeRedirect(data) {
    if (!data || Object.keys(data).length === 0) return;

    try {
      const normalized = normalizeNotificationData(data);
      const navFn = resolveNavigateFn();

      if (!navFn) {
        await this._savePendingNotification(data);
        return;
      }

      await this.handleNotificationRedirection(normalized);
      await this._clearPendingNotification();
    } catch (e) {
      console.warn('[NotificationService] _safeRedirect error', e);
      await this._savePendingNotification(data);
    }
  }

  async handleNotificationRedirection(data) {
    try {
      const { type, job_id, offerId, userId, raw } = data;
      const navFn = resolveNavigateFn();
      if (!navFn) return;

      let userRole = null;
      try {
        const state = store.getState();
        userRole = state?.profile?.user?.role || userRole;
      } catch (e) {
        console.warn(
          '[NotificationService] Failed to read user role from store',
          e,
        );
      }

      switch (type) {
        case 'job_created':
          if (job_id) {
            navFn('JobDetailsScreen', {
              jobId: job_id,
              userRole,
              status: 'new',
            });
          }
          return;

        case 'offer_accepted':
          userRole === 'provider'
            ? navFn('ProviderDashboard', {
                screen: 'Jobs',
                params: { defaultTab: 'my_jobs' },
              })
            : navFn('ConsumerDashboard', {
                screen: 'Jobs',
                params: { defaultTab: 'my_jobs' },
              });
          return;

        case 'job_status_updated':
          userRole === 'provider'
            ? navFn('ProviderDashboard', {
                screen: 'Jobs',
                params: { defaultTab: raw.job_status },
              })
            : navFn('ConsumerDashboard', {
                screen: 'Jobs',
                params: { defaultTab: raw.job_status },
              });
          return;

        case 'offer_created':
          navFn('JobDetailsScreen', {
            jobId: job_id,
            userRole,
            status: 'pending',
          });
          return;

        case 'user_message':
          if (userId) {
            navFn('ChatScreen', { userId });
          }
          return;

        default:
          console.log(
            '[NotificationService] Unknown notification type:',
            safeJson(data),
          );
          return;
      }
    } catch (error) {
      console.warn(
        '[NotificationService] Notification redirection error:',
        error,
      );
      throw error;
    }
  }
}

const NotificationService = new NotificationServiceClass();
export default NotificationService;
