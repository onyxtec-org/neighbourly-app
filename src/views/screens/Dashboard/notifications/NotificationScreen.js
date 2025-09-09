import React, { useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import AppText from '../../../components/AppText';
import NotificationsCard from '../../../components/NotificationComponents/NotificationsCard';
import Header from '../../../components/HeaderComponent/Header';
import Seperator from '../../../components/Seperator';
import colors from '../../../../config/colors';

import {
  fetchNotifications,
  markAllNotificationsAsRead,
} from '../../../../redux/slices/notificationSlice/notificationSlice';

function NotificationsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector(state => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // ✅ Group notifications into sections: "New" (unread) and "Older" (read)
  const sections = useMemo(() => {
    const newNotifications = notifications.filter(n => !n.read_at);
    const olderNotifications = notifications.filter(n => n.read_at);
  console.log('older notificationss', notifications);

    const result = [];
    if (newNotifications.length > 0) {
      result.push({ title: 'New', data: newNotifications });
    }
    if (olderNotifications.length > 0) {
      result.push({ title: 'Older', data: olderNotifications });
    }
    return result;
  }, [notifications]);

  
  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <AppText style={styles.emptyText}>
        {loading ? '' : 'No Notifications'}
      </AppText>
    </View>
  );

  const renderItem = ({ item }) => <NotificationsCard item={item} />;

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <AppText style={styles.sectionHeaderText}>{title}</AppText>
    </View>
  );

  const onRefresh = () => {
    dispatch(fetchNotifications());
  };

  const handleMarkAll = async () => {
    const response = await dispatch(markAllNotificationsAsRead());
    console.log('response of mark all', response);
  };

  const keyExtractor = useCallback(item => item.id.toString(), []);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Notifications" bookmark={false} />
      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={ListEmptyComponent}
        refreshing={loading}
        onRefresh={onRefresh}
        contentContainerStyle={{ flexGrow: 1 }}
        ListHeaderComponent={
          notifications.length > 0 && (
            <View>
              <TouchableOpacity
                style={styles.markAllReadContainer}
                onPress={handleMarkAll}
              >
                <AppText style={styles.markAllReadButton}>
                  Mark all as read
                </AppText>
              </TouchableOpacity>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  markAllReadContainer: {
    alignItems: 'flex-end',
    paddingVertical: hp('1%'),
    paddingHorizontal: 20,
  },
  markAllReadButton: {
    color: colors.primary,
    fontWeight: '500',
  },
  sectionHeader: {
    backgroundColor: colors.light,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 17,
    color: colors.medium,
  },
});

export default NotificationsScreen;
