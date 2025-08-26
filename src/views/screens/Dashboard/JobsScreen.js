import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import colors from '../../../config/colors';
import JobListings from '../../components/JobComponents/JobListings';
import { getJobs } from '../../../redux/slices/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectJobsByStatus } from '../../../redux/selectors/jobSelector';
const JobsScreen = () => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

  const pendingJobs = useSelector(selectJobsByStatus('pending'));
  const inProgressJobs = useSelector(selectJobsByStatus('in_progress'));

  const completedJobs = useSelector(selectJobsByStatus('completed'));

  const renderJobs = () => {
    switch (activeTab) {
      case 'pending':
        return (
          <JobListings data={pendingJobs} emptyMessage={'No pending jobs'} />
        );
      case 'inProgress':
        return (
          <JobListings
            data={inProgressJobs}
            emptyMessage={'No in Progress jobs'}
          />
        );
      case 'completed':
        return (
          <JobListings
            data={completedJobs}
            emptyMessage={'No Completed jobs'}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Jobs</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'pending' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('pending')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'pending' && styles.activeTabText,
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'inProgress' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('inProgress')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'inProgress' && styles.activeTabText,
            ]}
          >
            In Progress
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'completed' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('completed')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'completed' && styles.activeTabText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>{renderJobs()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
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
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
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
    paddingHorizontal: 30,
    backgroundColor: '#f9f9f9',
  },
});

export default JobsScreen;
