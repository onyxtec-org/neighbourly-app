import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from '../../../components/ImageComponent/IconComponent';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import config from '../../../../config';
import { useFocusEffect } from '@react-navigation/native';
import { fetchUserProfile } from '../../../../redux/slices/authSlice/profileSlice'; // <-- Import this
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useState } from 'react';
import ZoomableImage from '../../../components/ImageComponent/ZoomableImage';
import Header from '../../../components/HeaderComponent/Header';
import AppText from '../../../components/AppText';
const AccountScreen = ({ navigation, route }) => {
  const { userId } = route.params; // user id passed from StageScreen
  console.log('AccountScreen userId:', userId);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const { user: status } = useSelector(state => state.profile); // logged-in user
  const aauthUser = useSelector(state => state.login.user);

  console.log('auth user-', aauthUser);

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
    <Header
      title={'Profile Details'}
      bookmark={false}
      onIconPress={() => navigation.navigate('UpdateProfileScreen')}
      icon={'create-outline'}
      isIcon={!!isAuthUser}
    />

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
        profile?.name && <AppText style={styles.userName}>{profile.name}</AppText>
      )}
    </View>

    {/* Information Cards */}
    <View style={styles.content}>
      <View style={styles.card}>
        <AppText style={styles.cardTitle}>Personal Information</AppText>
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
                  <AppText style={styles.label}>Email</AppText>
                  <AppText style={styles.value}>{profile.email}</AppText>
                </View>
              </View>
            )}

            {profile?.phone && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Icon name="call-outline" size={20} color="#888" />
                  <View style={styles.textContainer}>
                    <AppText style={styles.label}>Phone</AppText>
                    <AppText style={styles.value}>
                      +{profile?.country_code} {profile.phone}
                    </AppText>
                  </View>
                </View>
              </>
            )}
          </>
        )}
      </View>

      <View style={styles.card}>
        <AppText style={styles.cardTitle}>Additional Details</AppText>
        <View style={styles.infoRow}>
          <Icon name="location-outline" size={20} color="#888" />
          <View style={styles.textContainer}>
            <AppText style={styles.label}>Location</AppText>
            <AppText style={styles.value}>{profile?.location || '—'}</AppText>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Icon name="briefcase-outline" size={20} color="#888" />
          <View style={styles.textContainer}>
            <AppText style={styles.label}>Role</AppText>
            <AppText style={styles.value}>{profile?.role || '—'}</AppText>
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
