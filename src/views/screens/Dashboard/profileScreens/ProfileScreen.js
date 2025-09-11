import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUserProfile,
  switchUserProfile,
} from '../../../../redux/slices/authSlice/profileSlice';
import ProfileShimmer from '../../../components/shimmerComponent/ProfileShimmer';
import { logoutUser } from '../../../../redux/thunks/auth/logoutThunk';
import {
  setUserRole,
  deleteAccount,
} from '../../../../redux/slices/authSlice/profileSlice';
import CustomToast from '../../../components/CustomToast';
import CustomPopup from '../../../components/CustomPopup';
import config from '../../../../config';
import { CommonActions, useNavigation } from '@react-navigation/native';
import storage from '../../../../app/storage';
import ZoomableImage from '../../../components/ImageComponent/ZoomableImage';
import { setMyServices } from '../../../../redux/slices/servicesSlice/servicesSlice';
import AdvancedLoadingPopup from '../../../components/AdvancedLoadingIndicator';
import AppText from '../../../components/AppText';
import colors from '../../../../config/colors';
const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const nav = useNavigation(); // for logout navigation
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const [logoutPopupVisible, setLogoutPopupVisible] = useState(false);
  const userId = useSelector(state => state.login?.user?.id);
  const loading = useSelector(state => state.login?.loading);

  const {
    user: profileUser,
    status: profileStatus,
    error: profileError,
  } = useSelector(state => state.profile);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const menuItems = [
    'Change Password',
    'Notifications Settings',
    'Delete Account',
    'Support',
    'Privacy Policy',
    'Terms of Service',
  ];

  // If user is a provider, add Edit Services
  if (profileUser?.role === 'provider') {
    menuItems.splice(1, 0, 'Edit Services'); // Insert after Change Password
  }

  useEffect(() => {
    if (userId) {
      console.log('Dispatching fetchUserProfile with userId:', userId);
      dispatch(fetchUserProfile({ userId: userId }));
    } else {
      console.log('Skipped fetching user profile – user ID not available');
    }
  }, [dispatch, userId]);

  const showToast = (msg, type = 'success') => {
    console.log(' Showing toast:', msg);
    setToastMessage(msg);
    setToastType(type);
    setToastVisible(true);
  };

  const handleDeleteAccount = async () => {
    console.log('🗑 Account deletion confirmed');
    setDeletePopupVisible(false);

    try {
      const result = await dispatch(deleteAccount());

      if (deleteAccount.fulfilled.match(result)) {
        // Logout also to clear redux states
        await dispatch(logoutUser());
        const showToast = (msg, type = 'success') => {
          setToastMessage(msg);
          setToastType(type);
          setToastVisible(true);
        };
        showToast('Account deleted successfully', 'success');
        nav.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          }),
        );
      } else {
        throw new Error(result.payload || 'Failed to delete account');
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete account', 'error');
    }
  };

  const handleLogout = () => {
    setLogoutPopupVisible(true);
  };

  const confirmLogout = async () => {
    setLogoutPopupVisible(false);
    setIsLoading(true);
    try {
      const result = await dispatch(logoutUser());
      if (result.payload === 'Logout successful') {
        showToast('Logout successful', 'success');
        setShouldNavigate(true);

        setTimeout(async () => {
          try {
            setIsLoading(false);
            nav.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              }),
            );
            const tokenRemoved = await storage.removeToken();
            const userRemoved = await storage.removeUser();
            if (!tokenRemoved || !userRemoved) {
              throw new Error('Failed to clear local storage');
            }
          } catch (err) {
            console.error('Logout cleanup failed:', err);
            showToast('Something went wrong during logout', 'error');
          }
        }, 0);
      } else {
        setIsLoading(false);
        throw new Error(result.payload || 'Logout failed');
      }
    } catch (err) {
      setIsLoading(false);
      showToast(err.message || 'Logout failed', 'error');
    }
  };

  const handleToastHide = () => {
    setToastVisible(false);

    if (shouldNavigate) {
      setShouldNavigate(false);
    }
  };

  const handleSwitchProfile = async () => {
    const newRole = profileUser?.role === 'provider' ? 'consumer' : 'provider';
    const body = {
      role: newRole,
    };
    try {
      const result = await dispatch(switchUserProfile(body)).unwrap();
      await storage.storeUser(result.user);

      console.log(' Switched profile:', result.user);
      if (result.user.services) {
        dispatch(setMyServices(result.user.services));
      } else {
        dispatch(setMyServices([]));
      }
      dispatch(setUserRole(newRole));
      // Now reset and return to AppEntryScreen
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'AppEntry' }],
        }),
      );
    } catch (error) {
      console.log(' Failed to switch:', error);
    }
  };

  if (loading || profileStatus === 'loading') {
    return <ProfileShimmer />;
  }

  if (profileStatus === 'failed') {
    console.log(' Profile fetch failed:', profileError);
  }

  console.log('profileUser data from redux:', profileUser);

  return (
    <View style={profileStyles.container}>
      <View style={profileStyles.header}>
        <AppText style={profileStyles.headerText}>Profile</AppText>
      </View>

      <ScrollView contentContainerStyle={profileStyles.scrollViewContent}>
        <View style={profileStyles.profileInfoSection}>
          <View style={profileStyles.profileImageContainer}>
            <ZoomableImage
              uri={
                profileUser?.image
                  ? `${config.userimageURL}${profileUser.image}`
                  : null
              }
              placeholder={require('../../../../assets/images/profile_icon.jpeg')}
              style={profileStyles.profileImage}
            />
          </View>
          <AppText style={profileStyles.profileName}>
            {profileUser?.name || 'User'}
          </AppText>
          <TouchableOpacity style={profileStyles.helpFriendsButton}>
            <AppText style={profileStyles.helpFriendsButtonText}>
              🎁 Help Your Friends, Get $10
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={profileStyles.menuSection}>
          <TouchableOpacity
            style={profileStyles.menuItem}
            onPress={() =>
              navigation.navigate('AccountScreen', { userId: profileUser.id })
            }
          >
            <View>
              <AppText style={profileStyles.menuItemText}>
                Profile Details
              </AppText>
              <AppText style={profileStyles.menuItemSubText}>
                {profileUser?.email || 'user@example.com'}
              </AppText>
            </View>
            <AppText style={profileStyles.arrowIcon}>›</AppText>
          </TouchableOpacity>

          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={profileStyles.menuItem}
              onPress={() => {
                if (item === 'Change Password') {
                  navigation.navigate('ChangePasswordScreen');
                } else if (item === 'Notifications Settings') {
                  navigation.navigate('NotificationSettings');
                } else if (item === 'Delete Account') {
                  setDeletePopupVisible(true);
                } else if (item === 'Privacy Policy') {
                  navigation.navigate('PrivacyPolicy');
                } else if (item === 'Terms of Service') {
                  navigation.navigate('TermsandconditionScreen');
                } else if (item === 'Edit Services') {
                  navigation.navigate('EditServices');
                } else {
                  console.log(`${item} pressed`);
                }
              }}
            >
              <AppText style={profileStyles.menuItemText}>{item}</AppText>
              <AppText style={profileStyles.arrowIcon}>›</AppText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={profileStyles.menuSection}>
          <TouchableOpacity
            style={profileStyles.centeredMenuItem}
            onPress={handleSwitchProfile}
          >
            <AppText style={profileStyles.centeredMenuItemText}>
              {profileUser.role === 'provider'
                ? 'Swtich to Consumer'
                : 'Switch to Provider'}
            </AppText>
          </TouchableOpacity>

          <View style={profileStyles.dividerLine} />

          <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
            <TouchableOpacity
              onPress={handleLogout}
              style={{ alignItems: 'center' }}
            >
              <AppText
                style={{ fontSize: 16, fontWeight: '500', color: '#DC2626' }}
              >
                Logout
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <CustomToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={handleToastHide}
      />
      <CustomPopup
        visible={deletePopupVisible}
        onClose={() => setDeletePopupVisible(false)}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        icon="trash-outline"
        iconColor={colors.red}
        cancelText="Cancel"
        confirmText="Delete"
        onCancel={() => setDeletePopupVisible(false)}
        onConfirm={handleDeleteAccount}
      />
      <CustomPopup
        visible={logoutPopupVisible}
        onClose={() => setLogoutPopupVisible(false)}
        title="Logout"
        message="Are you sure you want to logout from your account?"
        icon="log-out-outline"
        iconColor={colors.red}
        cancelText="Cancel"
        confirmText="Logout"
        onCancel={() => setLogoutPopupVisible(false)}
        onConfirm={confirmLogout}
      />

      <AdvancedLoadingPopup visible={isLoading} size={80} />
    </View>
  );
};

// Styles for ProfileScreen
const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Light gray background
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  scrollViewContent: {
    // paddingBottom: 20, // Add some padding at the bottom of the scroll view
  },
  profileInfoSection: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    marginBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileImageContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileName: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2937',
  },
  helpFriendsButton: {
    marginTop: 24,
    width: '90%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderColor: '#22C55E', // Green-500
    borderWidth: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpFriendsButtonText: {
    color: '#16A34A', // Green-600
    fontSize: 14,
    fontWeight: '500',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuItemText: {
    fontSize: 16,
    color: '#1F2937',
  },
  menuItemSubText: {
    fontSize: 13,
    color: '#6B7280', // Gray-500
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 20,
    color: '#9CA3AF', // Gray-400
    fontWeight: 'bold',
  },
  // Already defined styles (keep these)
  centeredMenuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  centeredMenuItemText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },

  dividerLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
});

export default ProfileScreen;
