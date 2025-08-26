import React, { useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AppText from '../../components/AppText';
import NotificationsCard from '../../components/NotificationsCard';
import Header from '../../components/Header';
import AppActivityIndicator from '../../components/AppActivityIndicator';
import Seperator from '../../components/Seperator';
import colors from '../../../config/colors';

import {
  fetchNotifications,
  markAllNotificationsAsRead,
} from '../../../redux/slices/notificationSlice';

function NotificationsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector(state => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <AppText style={styles.emptyText}>
        {loading ? '' : 'No New Notifications'}
      </AppText>
    </View>
  );

  const renderItem = ({ item }) => <NotificationsCard item={item} />;

  const onRefresh = () => {
    dispatch(fetchNotifications());
  };

  const handleMarkAll = async() => {
    const response=await dispatch(markAllNotificationsAsRead());
    console.log('response of mark all',response);
    
  };

  const keyExtractor = useCallback(item => item.id.toString(), []);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Notifications" bookmark={false} />
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        data={notifications}
        refreshing={loading}
        onRefresh={onRefresh}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        maxToRenderPerBatch={10}
        ListEmptyComponent={ListEmptyComponent}
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
              <Seperator />
            </View>
          )
        }
      />
      {/* {loading && <AppActivityIndicator />} */}
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
