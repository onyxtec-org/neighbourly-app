import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import colors from '../../../config/colors';
import JobListings from '../../components/JobComponents/JobListings';

const JobsScreen = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const pendingJobs = [
    {
      title: 'Plumbing job',
      description: 'ihsbvjbvbd gbghnhtntnty',
      hour_rate: '$10',
      duration: '2 hours',
      status: 'pending',
      payment_type: 'cash',
    },
    {
      title: 'Cleaning job',
      description: 'ihsbvjbvbd gbghnhtntnty',
      hour_rate: '$20',
      duration: '3 hours',
      status: 'pending',
      payment_type: 'e-pay',
    },
  ];

  const inProgressJobs = [
   
  ];

  const completedJobs = [
    
  ];

  const renderJobs = () => {
    switch (activeTab) {
      case 'pending':
        return <JobListings data={pendingJobs} emptyMessage={'No pending jobs'} />;
      case 'inProgress':
        return <JobListings data={inProgressJobs} emptyMessage={'No in Progress jobs'}/>;
      case 'completed':
        return <JobListings data={completedJobs} emptyMessage={'No Completed jobs'}/>;
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
