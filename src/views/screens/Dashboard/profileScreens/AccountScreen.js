import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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
import colors from '../../../../config/colors';
import InfoItems from '../../../components/ProfileComponents/InfoItems';
import Seperator from '../../../components/Seperator';
import { generateBranchLink } from '../../../../utils/branchUtils';
import ShareBottomSheet from '../../../components/ShareBottomSheet';
const AccountScreen = ({ navigation, route }) => {
  const { userId } = route.params; // user id passed from StageScreen
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [isShareSheetVisible, setIsShareSheetVisible] = useState(false);
  const [branchLink, setBranchLink] = useState('');
  const { status, user } = useSelector(state => state.profile);
  const { myServices } = useSelector(state => state.services);

  console.log('user----------', user);

  const aauthUser = user?.id ?? null;

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        dispatch(fetchUserProfile({ 
          userId, 
          authId: user?.id ?? null   
        })).then(res => {
          setProfile(res.payload.data);
        });
      }
    }, [dispatch, user?.id, userId]),
  );
  
  const isAuthUser = aauthUser && userId && aauthUser.toString() === userId.toString();

  const handleShareProfile = async () => {
    try {
      const url = await generateBranchLink({
        id: userId,
        type: 'user',
        title: `${profile?.name}'s Profile on Neighbourly`,
        description: `${profile?.name} is inviting you to view their profile`,
      });
      setBranchLink(url);
      setIsShareSheetVisible(true);
    } catch (error) {
      console.error('Error generating Branch link:', error);
    }
  };
  console.log('porfile user', profile);

  return (
    <>
    <ScrollView style={styles.container}>
      {/* Header with Back Button and Edit Icon */}
      <Header
          title="Profile Details"
          bookmark={false}
          onIconPress={() => navigation.navigate('UpdateProfileScreen')}
          icon="create-outline"
          isIcon={!!isAuthUser}
          onSharePress={handleShareProfile}
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
              placeholder={require('../../../../assets/images/profile_icon.jpeg')}
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
          profile?.name && (
            <AppText style={styles.userName}>{profile.name}</AppText>
          )
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
                <InfoItems
                  icon={'mail-outline'}
                  text={profile.email}
                  title={'Email'}
                />
              )}
              {profile?.slug && (
                <InfoItems
                  icon={'person'}
                  text={profile.slug}
                  title={'Screen Name'}
                />
              )}
              {profile?.phone && (
                <>
                  <Seperator color="#f0f0f0" />

                  <InfoItems
                    icon={'call-outline'}
                    text={+profile.phone}
                    title={'Phone'}
                  />
                </>
              )}
            </>
          )}
        </View>

        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Additional Details</AppText>

          <InfoItems
            icon={'location-outline'}
            text={profile?.location || '—'}
            title={'Location'}
          />

          <Seperator color="#f0f0f0" />

          <InfoItems
            icon={'briefcase-outline'}
            text={profile?.role || '—'}
            title={'Role'}
          />
        </View>
        {/* My Services Card */}
        {profile?.role === 'provider' && (
          <View style={styles.card}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <AppText style={styles.cardTitle}>
                {isAuthUser ? 'My Services' : 'Services'}
              </AppText>

              {isAuthUser && (
                <Icon
                  name={'create-outline'}
                  color={colors.black}
                  pressed={true}
                  onPress={() => navigation.navigate('EditServices')}
                />
              )}
            </View>
            {isAuthUser ? (
              // ✅ Show myServices for authenticated user
              myServices && myServices.length > 0 ? (
                myServices.map((service, index) => (
                  <View key={index}>
                    <InfoItems
                      icon={'construct-outline'}
                      text={service.name || 'Unnamed Service'}
                    />
                    {index < myServices.length - 1 && (
                      <Seperator color="#f0f0f0" />
                    )}
                  </View>
                ))
              ) : (
                <View style={styles.infoRow}>
                  <Icon name="alert-circle-outline" size={20} color="#888" />
                  <View style={styles.textContainer}>
                    <AppText style={styles.value}>No services selected</AppText>
                  </View>
                </View>
              )
            ) : // ✅ Show profileServices for other users
            profile.services && profile.services.length > 0 ? (
              profile.services.map((service, index) => (
                <View key={index}>
                  <InfoItems
                    icon={'construct-outline'}
                    text={service.name || 'Unnamed Service'}
                  />
                  {index < profile.services.length - 1 && (
                    <Seperator color="#f0f0f0" />
                  )}
                </View>
              ))
            ) : (
              <View style={styles.infoRow}>
                <Icon name="alert-circle-outline" size={20} color="#888" />
                <View style={styles.textContainer}>
                  <AppText style={styles.value}>
                    This user does not offer any services yet
                  </AppText>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
    <ShareBottomSheet
        url={branchLink}
        onClose={() => setIsShareSheetVisible(false)}
        visible={isShareSheetVisible}
      />
    </>
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
});
