import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import storage from '../../../../app/storage';
import colors from '../../../../config/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { setEmailNotifications } from '../../../../redux/slices/notificationSlice/notficationSlice';

const initialSettings = [
  { id: 'email_notifications', title: 'Email Notifications', enabled: true },
];

const NotificationSettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState(initialSettings);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const user = await storage.getUser();
        if (user) {
          setSettings((prevSettings) =>
            prevSettings.map((setting) =>
              setting.id === 'email_notifications'
                ? { ...setting, enabled: !!user.email_notifications_enabled }
                : setting
            )
          );
        }
      } catch (err) {
        console.log('Error while loading settings:', err);
      }
    };

    loadUserSettings();
  }, []);

  const toggleSwitch = async (id) => {
    const updatedSettings = settings.map((setting) =>
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    );

    const toggled = updatedSettings.find((s) => s.id === id);
    const body = { email_notifications_enabled: toggled.enabled ? 1 : 0 };

    setSettings(updatedSettings);

    try {
      const response = await dispatch(setEmailNotifications(body));
      console.log('Notification settings updated:', response.data);

      // ✅ Update local storage user object
      const user = await storage.getUser();
      if (user) {
        await storage.storeUser({
          ...user,
          email_notifications_enabled: toggled.enabled,
        });
      }
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      setSettings(settings); // revert if failed
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.settingItem}>
      <Text style={styles.settingText}>{item.title}</Text>
      <Switch
        value={item.enabled}
        onValueChange={() => toggleSwitch(item.id)}
        trackColor={{ false: '#ccc', true: colors.primary }}
        thumbColor={item.enabled ? colors.primary : '#f4f3f4'}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconWrapper}
        >
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle}>Notification Settings</Text>
        </View>

        <View style={styles.iconWrapper} />
      </View>

      <FlatList
        data={settings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

export default NotificationSettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  iconWrapper: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#1F2937',
  },
  flatListContent: {
    paddingBottom: 20,
  },
});
