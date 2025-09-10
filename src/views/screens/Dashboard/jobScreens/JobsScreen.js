import React, { useState, useCallback, useEffect } from 'react';
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
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import colors from '../../../../config/colors';
import JobListings from '../../../components/JobComponents/JobListings';
import {
  getJobs,
  removeJobById,
} from '../../../../redux/slices/jobSlice/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectJobsByTab } from '../../../../redux/selectors/jobSelector';
import CustomToast from '../../../components/CustomToast';
import { createOffer } from '../../../../redux/slices/jobSlice/offerSlice/offerSlice';
import AppActivityIndicator from '../../../components/AppActivityIndicator';
import CreateOfferPopup from '../../../screens/Dashboard/jobScreens/offers/CreateOfferPopup';
import CustomPopup from '../../../components/CustomPopup';
import AppText from '../../../components/AppText';
const { width } = Dimensions.get('window');
const scale = width / 375;
const normalize = size =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

const providerTabs = [
  { key: 'new', label: 'New Requests' },
  { key: 'invited', label: 'Invites' },
  { key: 'pending', label: 'Pending' },
  { key: 'my_jobs', label: 'My Jobs' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];
const consumerTabs = [
  { key: 'pending', label: 'Open' },
  { key: 'invited', label: 'Invited' },
  { key: 'my_jobs', label: 'Scheduled' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'rejected', label: 'Rejected' },
];
const { width: screenWidth } = Dimensions.get('window');

const JobsScreen = () => {
  const route = useRoute();
  const { defaultTab } = route?.params || {};

  const { user: profileUser } = useSelector(state => state.profile);
  const userRole = profileUser?.role;
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
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState();
  const [priceType, setPriceType] = useState();

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupConfig, setPopupConfig] = useState({
    title: '',
    message: '',
    confirmText: '',
    action: null,
    jobId: null,
  });

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const tabs = userRole === 'provider' ? providerTabs : consumerTabs;

  useFocusEffect(
    useCallback(() => {
      dispatch(getJobs());
    }, [dispatch]),
  );

  const handleJobPress = (jobId, status, item) => {
    navigation.navigate('JobDetailsScreen', { jobId, userRole, status, item });
  };

  const onInterestedPress = (jobId, priceType) => {
    // Show CreateOfferPopup directly
    setJobId(jobId);
    setPriceType(priceType);
    setShowOfferPopup(true);
  };

  const onRejectedPress = jobId => {
    // Show confirmation popup before rejecting
    setPopupConfig({
      title: 'Reject Job',
      message:
        'Are you sure you want to reject this job? This action cannot be undone.',
      confirmText: 'Reject',
      action: 'reject',
      jobId,
    });
    setPopupVisible(true);
  };

  const onReinvitePress = item => {
    //console.log('job item', item);

    navigation.navigate('JobCreateScreen', {
      serviceId: item.service_id,
      serviceName: item.service.name,
      jobData: item,
      isReinvite: true,
    });
  };

  const handleConfirmAction = async () => {
    const { action, jobId } = popupConfig;
    setPopupVisible(false);

    if (action === 'reject') {
      setLoading(true);
      const payload = {
        job_id: jobId,
        status: 'rejected',
      };

      try {
        const res = await dispatch(createOffer(payload)).unwrap();
        if (res?.success) {
          setLoading(false);
          dispatch(removeJobById(jobId));
          showToast('This job has been rejected.', 'error');
        } else {
          showToast(res?.message || 'Failed to reject job', 'error');
        }
      } catch (error) {
        showToast('Something went wrong. Please try again.', 'error');
      }
    }
  };

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const jobsByStatus = {
    new: useSelector(selectJobsByTab('new', userRole)),
    pending: useSelector(selectJobsByTab('pending', userRole)),
    my_jobs: useSelector(selectJobsByTab('my_jobs', userRole)),
    in_progress: useSelector(selectJobsByTab('in_progress', userRole)),
    completed: useSelector(selectJobsByTab('completed', userRole)),
    invited: useSelector(selectJobsByTab('invited', userRole)),
    rejected: useSelector(selectJobsByTab('rejected', userRole)),
  };

  const renderJobs = () => {
    const jobData = jobsByStatus[activeTab]?.jobs || [];
    const emptyMessages = {
      new: 'No new requests',
      pending: 'No pending jobs',
      my_jobs: 'No jobs assigned to you',
      in_progress: 'No in progress jobs',
      completed: 'No completed jobs',
      invited: 'No Job invites',
      rejected: 'No rejected invites',
    };
    const tabStatusMapping = {
      new: 'new',
      pending: 'pending',
      my_jobs: 'my_jobs',
      in_progress: 'in_progress',
      completed: 'completed',
      invited: 'invited',
      rejected: 'rejected',
    };

    return (
      <JobListings
        data={jobData}
        emptyMessage={emptyMessages[activeTab] || 'No jobs'}
        status={tabStatusMapping[activeTab]}
        onJobPress={handleJobPress}
        onInterestedPress={onInterestedPress}
        onRejectedPress={onRejectedPress}
        onReinvitePress={onReinvitePress}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <AppText style={styles.headerTitle}>Job Listing</AppText>
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
            {tabs.map(tab => {
              const tabData = jobsByStatus[tab.key].count || 0;

              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tabButton,
                    activeTab === tab.key
                      ? styles.activeTab
                      : styles.inactiveTab,
                  ]}
                  onPress={() => setActiveTab(tab.key)}
                >
                  <AppText
                    style={[
                      styles.tabText,
                      activeTab === tab.key
                        ? styles.activeTabText
                        : styles.inactiveTabText,
                    ]}
                  >
                    {`${tab.label} (${tabData})`}
                  </AppText>
                </TouchableOpacity>
              );
            })}
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
      {/* Create Offer Popup */}
      <CreateOfferPopup
        visible={showOfferPopup}
        onClose={() => setShowOfferPopup(false)}
        jobId={jobId}
        priceType={priceType}
        onOfferSent={() => {
          dispatch(getJobs());
        }}
      />

      {/* Confirmation Popup */}
      <CustomPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        title={popupConfig.title}
        message={popupConfig.message}
        icon={
          popupConfig.action === 'reject'
            ? 'close-circle-outline'
            : 'checkmark-circle-outline'
        }
        iconColor={popupConfig.action === 'reject' ? colors.red : colors.green}
        cancelText="Cancel"
        confirmText={popupConfig.confirmText}
        onCancel={() => setPopupVisible(false)}
        onConfirm={handleConfirmAction}
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
    height: normalize(50),
  },

  tabButton: {
    minWidth: screenWidth * 0.2, // minimum 20% of screen width
    height: screenWidth * 0.1, // 10% of screen width (responsive height)
    borderRadius: (screenWidth * 0.1) / 2, // half of height for pill shape
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: screenWidth * 0.02, // responsive margin
    borderWidth: 2,
    paddingHorizontal: screenWidth * 0.04, // dynamic padding for text-based width
  },
  activeTab: {
    backgroundColor: colors.primary, // primary color
    borderColor: '#fff',
  },
  inactiveTab: {
    backgroundColor: '#fff',
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: screenWidth * 0.03, // responsive font size
    textAlign: 'center',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  inactiveTabText: {
    color: colors.primary,
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: normalize(16),

    marginTop: 0,
  },
});

export default JobsScreen;
