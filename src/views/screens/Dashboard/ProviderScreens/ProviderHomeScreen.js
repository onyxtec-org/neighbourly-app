import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../../../../config/colors';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { selectJobsByTab } from '../../../../redux/selectors/jobSelector';
import { getJobs } from '../../../../redux/slices/jobSlice';
import AppBar from '../../../components/AppBar';
const ProviderHomeScreen = ({ navigation }) => {
  const { myServices } = useSelector(state => state.services);
  const myJobs = useSelector(selectJobsByTab('my_jobs', 'provider'));
  const dispatch = useDispatch();

  console.log('myjobs---', myJobs);

  useFocusEffect(
    useCallback(() => {
      if (myServices.length === 0) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'VerifyUser' }],
        });
      }

      dispatch(getJobs());
    }, [myServices, navigation]),
  );

  const renderJob = ({ item }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() =>
        navigation.navigate('JobDetailsScreen', {
          jobId: item.id,
          userRole: 'provider', // ✅ only if available in your job object
          status: 'my_jobs',
          item, // passing the whole job object if needed
        })
      }
    >
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobService}>
        Service: {item.service?.name || 'N/A'}
      </Text>
      <Text style={styles.jobLocation}>📍 {item.location}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Budget: ${item.budget}</Text>
      <Text>Consumer: {item.consumer?.name || 'Unknown'}</Text>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* AppBar */}
        <AppBar />
        {/* My Jobs Section */}
        <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 16 }}>
          <Text style={styles.helpText}>My Jobs</Text>
          {myJobs?.length > 0 ? (
            <FlatList
              data={myJobs}
              keyExtractor={item => item.id.toString()}
              renderItem={renderJob}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <Text>No jobs found.</Text>
          )}
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

  seeAllText: {
    fontSize: 14,
    color: colors.primary,
  },
  categoryHeader: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
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
