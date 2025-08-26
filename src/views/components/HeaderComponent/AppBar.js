import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../../config/colors';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectUnreadCount } from '../../../redux/slices/notificationSlice/notificationSlice';

function AppBar(props) {
  const unreadCount = useSelector(selectUnreadCount);
  console.log('unread count',unreadCount);
  
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.locationContainer}>
          <Ionicons name="location-outline" size={24} color={colors.primary} />
          <Text style={styles.locationText}>Your Location</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('NotificationsScreen')}>
          <View style={{ position: 'relative' }}>
            <Ionicons
              name="notifications-outline"
              size={28}
              color={colors.primary}
            />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  appBar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  locationContainer: { flexDirection: 'row', alignItems: 'center' },
  locationText: { marginLeft: 8, fontSize: 16 },

  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default AppBar;
