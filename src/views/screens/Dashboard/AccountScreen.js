import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import config from '../../../config';
import { useFocusEffect } from '@react-navigation/native';
import { fetchUserProfile } from '../../../redux/slices/auth/profileSlice'; // <-- Import this
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useState } from 'react';
import ZoomableImage from '../../components/ZoomableImage';

const AccountScreen = ({ navigation, route }) => {
  const { userId } = route.params; // user id passed from StageScreen
  console.log('AccountScreen userId:', userId);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const { user: status } = useSelector(state => state.profile); // logged-in user
  const aauthUser = useSelector(state => state.login.user);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        dispatch(fetchUserProfile(userId)).then(res => setProfile(res.payload));
      }
    }, [dispatch, userId]),
  );
  const isAuthUser = aauthUser?.id?.toString() === userId?.toString();
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
        {isAuthUser && (
          <TouchableOpacity
            onPress={() => navigation.navigate('UpdateProfileScreen')}
            style={styles.editButton}
          >
            <Icon name="create-outline" size={24} color="#000" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.profileSummary}>
        <View style={{ alignItems: 'center' }}>
          {status === 'loading' ? (
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={styles.profileImage}
            />
          ) : (
            <ZoomableImage
              uri={
                profile?.image ? `${config.userimageURL}${profile.image}` : null
              }
              placeholderUri="https://placehold.co/96x96/e0e0e0/000000?text=Profile"
              style={styles.profileImage}
            />
          )}
        </View>

        {status === 'loading' ? (
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{ width: 120, height: 20, borderRadius: 8, marginTop: 10 }}
          />
        ) : (
          profile?.name && <Text style={styles.userName}>{profile.name}</Text>
        )}
      </View>

      {/* Information Cards */}
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          {status === 'loading' ? (
            <>
              <ShimmerPlaceholder
                LinearGradient={LinearGradient}
                style={{ height: 20, borderRadius: 6, marginVertical: 10 }}
              />
              <ShimmerPlaceholder
                LinearGradient={LinearGradient}
                style={{ height: 20, borderRadius: 6, marginVertical: 10 }}
              />
            </>
          ) : (
            <>
              {profile?.email && (
                <View style={styles.infoRow}>
                  <Icon name="mail-outline" size={20} color="#888" />
                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{profile.email}</Text>
                  </View>
                </View>
              )}

              {profile?.phone && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.infoRow}>
                    <Icon name="call-outline" size={20} color="#888" />
                    <View style={styles.textContainer}>
                      <Text style={styles.label}>Phone</Text>
                      <Text style={styles.value}>
                        +{profile?.country_code} {profile.phone}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Additional Details</Text>
          <View style={styles.infoRow}>
            <Icon name="location-outline" size={20} color="#888" />
            <View style={styles.textContainer}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{profile?.location || '—'}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Icon name="briefcase-outline" size={20} color="#888" />
            <View style={styles.textContainer}>
              <Text style={styles.label}>Role</Text>
              <Text style={styles.value}>{profile?.role || '—'}</Text>
            </View>
          </View>
        </View>
        {/* My Services Card */}
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
