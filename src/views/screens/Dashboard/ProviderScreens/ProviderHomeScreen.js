import React, { useEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import AppText from '../../../components/AppText';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../../../../config/colors';
import { useFocusEffect } from '@react-navigation/native';
import JobListings from '../../../components/JobComponents/JobListings';
import Icon from '../../../components/ImageComponent/IconComponent';
import { selectJobsByTab } from '../../../../redux/selectors/jobSelector';
import DashboardGrid from '../../../components/DashboardGridComponent';
import { getJobs } from '../../../../redux/slices/jobSlice/jobSlice';
import AppBar from '../../../components/HeaderComponent/AppBar';
import { fetchNotifications } from '../../../../redux/slices/notificationSlice/notificationSlice';
import { fetchCategories } from '../../../../redux/slices/categorySlice/categoriesSlice';

// shimmer + animation
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProviderHomeScreen = ({ navigation }) => {
  const { myServices } = useSelector(state => state.services);
  const { user: profileUser } = useSelector(state => state.profile);
  const userRole = profileUser?.role;
  const myJobs = useSelector(selectJobsByTab('my_jobs', 'provider'));
  const dispatch = useDispatch();

  const jobsByStatus = {
    new: useSelector(selectJobsByTab('new', userRole)),
    pending: useSelector(selectJobsByTab('pending', userRole)),
    my_jobs: useSelector(selectJobsByTab('my_jobs', userRole)),
    in_progress: useSelector(selectJobsByTab('in_progress', userRole)),
    completed: useSelector(selectJobsByTab('completed', userRole)),
  };

  useFocusEffect(
    useCallback(() => {
      if (myServices?.length === 0) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'VerifyUser' }],
        });
      }
      dispatch(getJobs());
    }, [dispatch, myServices?.length, navigation]),
  );

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchCategories());
    dispatch(getJobs());
  }, [dispatch]);

  const isJobsLoading = myJobs?.loading; // 👈 make sure your slice sets `loading`

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* AppBar */}
        <AppBar />

        {/* Dashboard Grid */}
        <DashboardGrid
          items={[
            [
              {
                title: `Open → ${jobsByStatus.new?.count || 0}`,
                backgroundColor: colors.purpleColor,
                onPress: () => {
                  navigation.navigate('ProviderDashboard', {
                    screen: 'Jobs',
                    params: { defaultTab: 'new' },
                  });
                },
              },
              {
                title: `To Start → ${jobsByStatus.pending?.count || 0}`,
                backgroundColor: colors.pinkColor,
                onPress: () => {
                  navigation.navigate('ProviderDashboard', {
                    screen: 'Jobs',
                    params: { defaultTab: 'pending' },
                  });
                },
              },
            ],
            [
              {
                title: `In Progress → ${jobsByStatus.in_progress?.count || 0}`,
                backgroundColor: colors.LightBlueColor,
                onPress: () => {
                  navigation.navigate('ProviderDashboard', {
                    screen: 'Jobs',
                    params: { defaultTab: 'in_progress' },
                  });
                },
              },
              {
                title: `Completed → ${jobsByStatus.completed?.count || 0}`,
                backgroundColor: colors.lightgreenishColor,
                onPress: () => {
                  navigation.navigate('ProviderDashboard', {
                    screen: 'Jobs',
                    params: { defaultTab: 'completed' },
                  });
                },
              },
            ],
          ]}
        />

        {/* My Jobs Section */}
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <View style={styles.categoryHeader}>
            {/* Left: Title */}
            <AppText style={styles.helpText}>Upcoming Jobs</AppText>

            {/* Right: See All + Arrow */}
            <TouchableOpacity
              style={styles.seeAllContainer}
              onPress={() =>
                navigation.navigate('ProviderDashboard', {
                  screen: 'Jobs',
                  params: { defaultTab: 'my_jobs' },
                })
              }
              activeOpacity={0.7}
            >
              <AppText style={styles.seeAllText}>See All</AppText>
              <Icon
                name="chevron-forward"
                size={16}
                color={colors.primary}
                style={{ marginLeft: 3 }}
              />
            </TouchableOpacity>
          </View>

          {isJobsLoading ? (
            <FlatList
              data={[1, 2, 3]} // dummy shimmer placeholders
              keyExtractor={(item, index) => index.toString()}
              renderItem={() => (
                <View style={styles.shimmerJobCard}>
                  <ShimmerPlaceHolder style={styles.shimmerLineLarge} />
                  <ShimmerPlaceHolder style={styles.shimmerLineMedium} />
                  <ShimmerPlaceHolder style={styles.shimmerLineSmall} />
                </View>
              )}
            />
          ) : (
            <FlatList
              data={myJobs?.jobs || []}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item, index }) => (
                <Animated.View
                  entering={FadeInDown.delay(index * 120).springify()}
                >
                  <JobListings
                    data={[item]} // 👈 single item at a time
                    emptyMessage=""
                    status="my_jobs"
                    onJobPress={(jobId, status, item) =>
                      navigation.navigate('JobDetailsScreen', {
                        jobId,
                        userRole: 'provider',
                        status,
                        item,
                      })
                    }
                  />
                </Animated.View>
              )}
              ListEmptyComponent={() => (
                <AppText style={{ textAlign: 'center', marginTop: 20 }}>
                  No jobs found.
                </AppText>
              )}
            />
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  helpText: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  categoryHeader: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 14,
  },

  // shimmer styles
  shimmerJobCard: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  shimmerLineLarge: {
    width: '70%',
    height: 16,
    borderRadius: 8,
    marginBottom: 6,
  },
  shimmerLineMedium: {
    width: '50%',
    height: 14,
    borderRadius: 7,
    marginBottom: 6,
  },
  shimmerLineSmall: {
    width: '40%',
    height: 12,
    borderRadius: 6,
  },
});

export default ProviderHomeScreen;
