import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import colors from '../../../config/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const initialSettings = [
  { id: '1', title: 'Email Notifications', enabled: true },
  { id: '2', title: 'Push Notifications', enabled: false },
  { id: '3', title: 'SMS Alerts', enabled: true },
  { id: '4', title: 'Promotional Offers', enabled: false },
  { id: '5', title: 'App Updates', enabled: true },
];

const NotificationSettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState(initialSettings);

  const toggleSwitch = (id) => {
    const updatedSettings = settings.map((setting) =>
      setting.id === id
        ? { ...setting, enabled: !setting.enabled }
        : setting
    );
    setSettings(updatedSettings);
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
      {/* Updated Header */}
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

        {/* Placeholder for right icon to balance the title */}
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
