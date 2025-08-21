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
  // Accept multiple shapes: named export, default export, or module itself.
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

    // Bindings (shouldn't be necessary for arrow methods, but explicit for safety)
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
      console.log(
        '[NotificationService] Saved pending notification to AsyncStorage',
      );
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
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch (e) {
        return raw;
      }
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

        // Show local notification via notifee
        try {
          await notifee.displayNotification({
            title: remoteMessage?.notification?.title,
            body: remoteMessage?.notification?.body,
            android: {
              channelId: 'default',
              pressAction: { id: 'default' },
            },
            // notifee expects strings inside data on some platforms
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

        // Persist so if the app is opened later we can redirect
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
      // NOTE: setBackgroundMessageHandler must be registered in the main JS context
      // and may run in headless JS on Android. Keep this minimal.
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

        // Persist the data for later redirection (because background headless can't navigate)
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

    // Attach message handlers
    this.handleForegroundMessages();
    this.handleBackgroundMessages();

    // Foreground tap listener
    this._notifeeFgSub = notifee.onForegroundEvent(({ type, detail }) => {
      try {
        if (type === EventType.PRESS) {
          const data =
            detail?.notification?.data || detail?.notification || detail;
          console.log('🔔 Notification tapped (fg):', safeJson(data));
          this._safeRedirect(data);
        }
      } catch (e) {
        console.warn(
          '[NotificationService] onForegroundEvent handler error',
          e,
        );
      }
    });

    // Background press/listeners: note notifee.onBackgroundEvent should be registered in index.js for some setups
    try {
      notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.PRESS) {
          const data =
            detail?.notification?.data || detail?.notification || detail;
          console.log('🔔 Notification tapped (bg):', safeJson(data));
          // store and attempt redirect when app becomes active
          await this._savePendingNotification(data);
        }
      });
    } catch (e) {
      // If onBackgroundEvent isn't allowed in this context, warn but continue
      console.warn(
        '[NotificationService] onBackgroundEvent registration failed (might need index.js):',
        e,
      );
    }

    // Launched from killed state
    try {
      const initial = await notifee.getInitialNotification();
      if (initial) {
        console.log(
          '🚀 Opened app from quit via notification:',
          safeJson(initial.notification?.data),
        );
        // Try immediate redirect; if navigate not ready this will persist and be handled on active
        await this._safeRedirect(initial.notification?.data);
      }
    } catch (e) {
      console.warn('[NotificationService] getInitialNotification failed', e);
    }

    AppState.addEventListener('change', this.handleAppStateChange);

    // On init also check pending notification (in case we saved from BG earlier)
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
      // When app becomes active, check for pending notification
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
    try {
      if (!data || Object.keys(data).length === 0) {
        console.log(
          '[NotificationService] _safeRedirect called with empty data, ignoring',
        );
        return;
      }
  
      // use helper function
      const normalized = normalizeNotificationData(data);
  
      console.log(
        '[NotificationService] _safeRedirect normalized:',
        safeJson(normalized),
      );
  
      const navFn = resolveNavigateFn();
      if (!navFn) {
        console.log(
          '[NotificationService] navigate function not ready, saving pending and returning',
        );
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
      console.log('[NotificationService] Redirecting based on normalized data:', safeJson(data));
  
      const { type, jobId, offerId, userId } = data;
      const navFn = resolveNavigateFn();
      if (!navFn) {
        console.warn('[NotificationService] Cannot redirect: navigate function is missing');
        return;
      }
  
      let userRole = null;
      try {
        const state = store.getState();
        userRole = state?.profile?.user?.role || userRole;
      } catch (e) {
        console.warn('[NotificationService] Failed to read user role from store', e);
      }
  
      switch (type) {
        case 'job_created':
          if (jobId) {
            navFn('JobDetailsScreen', { jobId, userRole, status: data?.raw?.status || 'new' });
          }
          return;
  
          case 'offer_accepted':
            navFn('JobsScreen', { defaultTab: 'my_jobs' });
            return;
            case 'job_status_updated':
              navFn('JobsScreen', { defaultTab: 'my_jobs' });
              return;
            
              case 'offer_created':
                navFn('OffersScreen', );
                return;
        case 'user_message':
          if (userId) {
            navFn('ChatScreen', { userId });
          }
          return;
  
        default:
          console.log('[NotificationService] Unknown notification type, dumping:', safeJson(data));
          return;
      }
    } catch (error) {
      console.warn('[NotificationService] Notification redirection error:', error);
      throw error;
    }
  }
  
}

const NotificationService = new NotificationServiceClass();
export default NotificationService;
