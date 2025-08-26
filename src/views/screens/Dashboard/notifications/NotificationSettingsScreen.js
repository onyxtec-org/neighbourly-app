import React, { useState, useEffect } from 'react';
import {
  View,
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
import AppText from '../../../components/AppText';
import Header from '../../../components/HeaderComponent/Header';
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
      <AppText style={styles.settingText}>{item.title}</AppText>
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
      <Header title={'Notification Settings'} bookmark={false}/>
      

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
