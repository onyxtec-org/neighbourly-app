import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../../../config';
import { useFocusEffect } from '@react-navigation/native';
import { fetchUserProfile } from '../../../redux/slices/auth/profileSlice'; // <-- Import this
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useState } from 'react';

const AccountScreen = ({ navigation }) => {
  const [imageLoading, setImageLoading] = useState(false);
  const { myServices } = useSelector(state => state.services);
const {
    user: profileUser,

  } = useSelector(state => state.profile);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.profile || {});

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        dispatch(fetchUserProfile(user.id));
      }
    }, [dispatch, user?.id]),
  );
  return (
    <ScrollView style={styles.container}>
      {/* Header with Back Button and Edit Icon */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Details</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('UpdateProfileScreen')}
          style={styles.editButton}
        >
          <Icon name="create-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* User Profile Summary */}
      <View style={styles.profileSummary}>
        <View
          style={{
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={{
              uri: user?.image
                ? `${config.imageURL}${user.image}`
                : 'https://placehold.co/96x96/e0e0e0/000000?text=Profile',
            }}
            style={styles.profileImage}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={e => {
              console.log('❌ Image failed to load');
              console.log('Error:', e.nativeEvent.error);
              setImageLoading(false);
            }}
          />
          {imageLoading && (
            <ActivityIndicator
              size="small"
              color="#000"
              style={{
                position: 'absolute',
                zIndex: 1,
              }}
            />
          )}
        </View>

        <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
      </View>

      {/* Information Cards */}
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <View style={styles.infoRow}>
            <Icon name="mail-outline" size={20} color="#888" />
            <View style={styles.textContainer}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user?.email || '—'}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Icon name="call-outline" size={20} color="#888" />
            <View style={styles.textContainer}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>
                +{user?.country_code || ''} {user?.phone || '—'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Additional Details</Text>
          <View style={styles.infoRow}>
            <Icon name="location-outline" size={20} color="#888" />
            <View style={styles.textContainer}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{user?.location || '—'}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Icon name="briefcase-outline" size={20} color="#888" />
            <View style={styles.textContainer}>
              <Text style={styles.label}>Role</Text>
              <Text style={styles.value}>{user?.role || '—'}</Text>
            </View>
          </View>
        </View>
        {/* My Services Card */}
       {profileUser.role==='provider' && <View style={styles.card}>
          <Text style={styles.cardTitle}>My Services</Text>
          {myServices && myServices.length > 0 ? (
            myServices.map((service, index) => (
              <View key={index}>
                <View style={styles.infoRow}>
                  <Icon name="construct-outline" size={20} color="#888" />
                  <View style={styles.textContainer}>
                    <Text style={styles.value}>
                      {service.name || 'Unnamed Service'}
                    </Text>
                  </View>
                </View>
                {index < myServices.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))
          ) : (
            <View style={styles.infoRow}>
              <Icon name="alert-circle-outline" size={20} color="#888" />
              <View style={styles.textContainer}>
                <Text style={styles.value}>No services found</Text>
              </View>
            </View>
          )}
        </View>}
      </View>
    </ScrollView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 25,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  backButton: {
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    paddingLeft: 10,
  },
  profileSummary: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  textContainer: {
    marginLeft: 15,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888',
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 35,
  },
});
