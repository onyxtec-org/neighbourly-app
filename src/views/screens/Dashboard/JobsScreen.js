import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import colors from '../../../config/colors';
import JobListings from '../../components/JobComponents/JobListings';
import { getJobs } from '../../../redux/slices/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectJobsByStatus } from '../../../redux/selectors/jobSelector';

const tabs = [
  { key: 'new', label: 'New Requests' },
  { key: 'pending', label: 'Pending' },
  { key: 'my_jobs', label: 'My Jobs' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

const JobsScreen = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('new');

  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

  const jobsByStatus = {
    new: useSelector(selectJobsByStatus('new')),
    pending: useSelector(selectJobsByStatus('pending')),
    my_jobs: useSelector(selectJobsByStatus('my_jobs')),
    in_progress: useSelector(selectJobsByStatus('in_progress')),
    completed: useSelector(selectJobsByStatus('completed')),
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

    return (
      <JobListings
        data={jobData}
        emptyMessage={emptyMessages[activeTab] || 'No jobs'}
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
    <View >
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
    <View style={styles.contentContainer}>
      {renderJobs()}
    </View>
  </View>
</SafeAreaView>


  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    height: 60,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
tabContainer: {
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderBottomColor: '#e0e0e0',
  height: 50, 
},

  tabButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
    marginTop:0
  },
});

export default JobsScreen;
