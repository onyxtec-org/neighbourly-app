import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectUnreadCount } from '../../../redux/slices/notificationSlice/notificationSlice';
import AppText from './../AppText';
import Icon from './../ImageComponent/IconComponent';
import config from '../../../config';
import LinearGradient from 'react-native-linear-gradient'; // 👈 added

function AppBar() {
  const unreadCount = useSelector(selectUnreadCount);
  const { user } = useSelector(state => state.profile);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        {/* Left side: User Image + Info */}
        <View style={styles.userContainer}>
          {/* 👇 Gradient circular border wrapper */}
          <LinearGradient
            colors={['#8e2de2', '#4a00e0']} // purple gradient
            style={styles.gradientBorder}
          >
            <View style={styles.innerCircle}>
              <Image
                source={
                  user?.image
                    ? { uri: `${config.userimageURL}${user.image}` }
                    : require('../../../assets/images/profile_icon.jpeg')
                }
                style={styles.userImage}
              />
            </View>
          </LinearGradient>

          <View style={styles.userInfo}>
            <View style={styles.usernameRow}>
              <AppText style={styles.username}>
                {user?.name ? `Hello ${user.name}` : 'Hello User'}
              </AppText>
              <Icon
                name="hand-left-outline"
                size={18}
                color="#f4b400"
                style={{ marginLeft: 5 }}
              />
            </View>
            <AppText style={styles.subText}>Assign the task!</AppText>
          </View>
        </View>

        {/* Right side: Notifications */}
        <TouchableOpacity onPress={() => navigation.navigate('NotificationsScreen')}>
          <View style={{ position: 'relative' }}>
            <Icon name="notifications-outline" size={28} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <AppText style={styles.badgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </AppText>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  appBar: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // 👇 NEW styles for gradient + spacing
  gradientBorder: {
    width: 52,
    height: 52,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 48, // slightly smaller to create spacing
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white', // space color
    justifyContent: 'center',
    alignItems: 'center',
  },
  userImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  userInfo: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c2c2c',
  },
  subText: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
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
