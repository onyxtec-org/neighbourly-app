import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import AppText from '../../../components/AppText';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../../../../config/colors';
import { useFocusEffect } from '@react-navigation/native';
import JobListings from '../../../components/JobComponents/JobListings';
import Icon from '../../../components/ImageComponent/IconComponent';
import { useCallback } from 'react';
import { selectJobsByTab } from '../../../../redux/selectors/jobSelector';
import DashboardGrid from '../../../components/DashboardGridComponent';
import { getJobs } from '../../../../redux/slices/jobSlice/jobSlice';
import AppBar from '../../../components/HeaderComponent/AppBar';
import { fetchNotifications } from '../../../../redux/slices/notificationSlice/notificationSlice';
import { fetchCategories } from '../../../../redux/slices/categorySlice/categoriesSlice';
const ProviderHomeScreen = ({ navigation }) => {
  const { myServices } = useSelector(state => state.services);
  const { user: profileUser } = useSelector(state => state.profile);
  const userRole = profileUser?.role;
  const myJobs = useSelector(selectJobsByTab('my_jobs', 'provider'));
  const dispatch = useDispatch();
  console.log('myjobs---', myJobs);
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* AppBar */}
        <AppBar />
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
                }
              },
              {
                title: `To Start → ${jobsByStatus.pending?.count || 0}`,
                backgroundColor: colors.pinkColor,
                onPress: () => {
                  navigation.navigate('ProviderDashboard', {
                    screen: 'Jobs',
                    params: { defaultTab: 'pending' },
                  });
                }
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
                }
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

          <JobListings
            data={myJobs?.jobs || []} // 👈 jobs array from Redux
            emptyMessage="No jobs found."
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
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
  content: { paddingLeft: 8 },
  helpText: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  cardContainer: {
    width: 140,
    height: 160,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardImageWrapper: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.8,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardLabel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },

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
  jobCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  jobService: {
    fontSize: 14,
    color: '#555',
  },
  jobLocation: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
});

export default ProviderHomeScreen;
