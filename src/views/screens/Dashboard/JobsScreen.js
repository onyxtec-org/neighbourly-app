import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  PixelRatio,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import colors from '../../../config/colors';
import JobListings from '../../components/JobComponents/JobListings';
import { getJobs } from '../../../redux/slices/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectJobsByTab } from '../../../redux/selectors/jobSelector';
import { useNavigation } from '@react-navigation/native';
import CustomToast from '../../components/CustomToast';
import { removeJobById } from '../../../redux/slices/jobSlice';
import { createOffer } from '../../../redux/slices/offerSlice';
import AppActivityIndicator from '../../components/AppActivityIndicator';
import CreateOfferPopup from '../CreateOfferPopup';
import { useRoute } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
const scale = width / 375; // base iPhone 11 width
const normalize = size =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

const providerTabs = [
  { key: 'new', label: 'New Requests' },
  { key: 'pending', label: 'Pending' },
  { key: 'my_jobs', label: 'My Jobs' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];
const consumerTabs = [
  { key: 'pending', label: 'Pending' },
  { key: 'my_jobs', label: 'To Start' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

const JobsScreen = () => {
  const route = useRoute();
const { defaultTab } = route?.params || {};
  
  const { user: profileUser } = useSelector(state => state.profile);
  const userRole = profileUser.role;
const [activeTab, setActiveTab] = useState(() => {
  if (userRole === 'provider') {
    return defaultTab ? defaultTab : providerTabs[0].key;
  }
  return consumerTabs[0].key;
});

useEffect(() => {
  if (defaultTab) {
    setActiveTab(defaultTab);
  }
}, [defaultTab]);
  const [showOffer, setShowOffer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState();
  const [priceType, setPriceType] = useState();

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const navigation = useNavigation();
 
  const dispatch = useDispatch();

  const tabs = userRole === 'provider' ? providerTabs : consumerTabs;
  useFocusEffect(
    useCallback(() => {
      dispatch(getJobs());
      //setLoading(false);
    }, [dispatch]),
  );

  const handleJobPress = (jobId,status,item) => {

    
    navigation.navigate('JobDetailsScreen', { jobId, userRole,status ,item});
  };
  const onInterestedPress = (jobId, priceType) => {
    setJobId(jobId);
    setPriceType(priceType);
    setShowOffer(true);
  };
  const onRejectedPress = (jobId, status) => {
    setLoading(true);
    const payload = {
      job_id: jobId,
      status: status,
    };

    try {
      dispatch(createOffer(payload))
        .unwrap()
        .then(res => {
          if (res?.success) {
            setLoading(false);
            dispatch(removeJobById(jobId));

            showToast('This Job has been rejected.!', 'error');
          } else {
            showToast(res?.message || 'Failed to send offer', 'error');
          }
        });
    } catch (error) {
      showToast('Something went wrong. Please try again.', 'error');
    }
  };
  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };
  // useEffect(() => {
  //   dispatch(getJobs());
  // }, [dispatch]);

  const jobsByStatus = {
    new: useSelector(selectJobsByTab('new', userRole)),
    pending: useSelector(selectJobsByTab('pending', userRole)),
    my_jobs: useSelector(selectJobsByTab('my_jobs', userRole)),
    in_progress: useSelector(selectJobsByTab('in_progress', userRole)),
    completed: useSelector(selectJobsByTab('completed', userRole)),
  };

  const renderJobs = () => {
    const jobData = jobsByStatus[activeTab] || [];
    const emptyMessages = {
      new: 'No new requests',
      pending: 'No pending jobs',
      my_jobs: 'No jobs assigned to you',
      in_progress: 'No in progress jobs',
      completed: 'No completed jobs',
    };
    const tabStatusMapping = {
      new: 'new',
      pending: 'pending', 
      my_jobs: 'my_jobs', 
      in_progress: 'in_progress',
      completed: 'completed',
    };
    return (
      <JobListings
        data={jobData}
        emptyMessage={emptyMessages[activeTab] || 'No jobs'}
        status={tabStatusMapping[activeTab]}
        onJobPress={handleJobPress}
        onInterestedPress={onInterestedPress}
        onRejectedPress={onRejectedPress}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Jobs</Text>
        </View>
      </View>

      {/* Tabs + Content wrapper */}
      <View style={{ flex: 1 }}>
        {/* Tabs */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabContainer}
          >
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  activeTab === tab.key && styles.activeTab,
                ]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.key && styles.activeTabText,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>{renderJobs()}</View>
      </View>

      <CustomToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
      <CreateOfferPopup
        visible={showOffer}
        onClose={() => setShowOffer(false)}
        jobId={jobId}
        priceType={priceType}
        onOfferSent={() => {
          // Trigger refresh immediately after popup closes
          dispatch(getJobs());
        }}
      />
      {loading && <AppActivityIndicator />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    height: normalize(60),
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'relative',
  },
  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    height: normalize(50),
  },

  tabButton: {
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(18),
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: normalize(15),
    color: '#888',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: normalize(16),
    backgroundColor: '#f9f9f9',
    marginTop: 0,
  },
});

export default JobsScreen;
