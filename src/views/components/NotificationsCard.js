import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { useSelector } from 'react-redux';
import AppText from './AppText';
import Seperator from './Seperator';
import colors from '../../config/colors';
import { markNotificationAsRead } from '../../redux/slices/notificationSlice';
function NotificationsCard({ item }) {
  const { user: profileUser } = useSelector(state => state.profile);
  console.log('notification---', item);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const read = !!item.read_at; // 👈 always use redux state, not local state

  const handlePress = () => {
    if (!read) {
      dispatch(markNotificationAsRead(item.id)); // redux updates slice
    }

    // Navigate based on notification type
    if (item.type.includes('NewJobNotification')) {
      navigation.navigate('JobDetailsScreen', {
        jobId: item.data.job_id,
        userRole: profileUser.role,
        status: 'new',
        item: {},
      });
    } else if (item.type.includes('OfferAcceptedNotification')) {
      navigation.navigate('JobsScreen', { defaultTab: 'my_jobs' });
    } else if (item.type.includes('JobStatusUpdatedNotification')) {
      navigation.navigate('JobsScreen', { defaultTab: item.data.status });
    }
  };

  const str = item.type;

  // Extract class name after last backslash
  const className = str.split('\\').pop(); // "JobStatusUpdatedNotification"

  // Remove "Notification" suffix
  const withoutSuffix = className.replace(/Notification$/, ''); // "JobStatusUpdated"

  // Split CamelCase into words
  const readable = withoutSuffix.replace(/([a-z])([A-Z])/g, '$1 $2'); // "Job Status Updated"

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.container,
          { backgroundColor: read ? colors.white : colors.lightGray }, // color updates correctly
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.row}>
          <View style={styles.textWrapper}>
            <AppText style={styles.title}>
              {readable === 'Job Status Updated'
                ? `${readable} to ${item.data.status}`
                : readable}
            </AppText>

            {item.data.title && (
              <AppText style={styles.subtitle}>{item.data.title}</AppText>
            )}
          </View>

          <View style={styles.rightWrapper}>
            <AppText style={styles.timestamp}>
              {moment(item.created_at).format('MMM D, YYYY • h:mm A')}
            </AppText>
            {!read && <View style={styles.unreadDot} />}
          </View>
        </View>
      </TouchableOpacity>
      <Seperator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // spread left & right
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    paddingRight: 10, // avoid overlap with right content
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  rightWrapper: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    color: colors.medium,
    marginBottom: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    marginTop: 2,
  },
});

export default NotificationsCard;
