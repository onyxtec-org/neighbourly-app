import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../../redux/slices/auth/profileSlice';
import { logoutUser } from '../../../redux/thunks/auth/logoutThunk';
import CustomToast from '../../components/CustomToast';
import CustomPopup from '../../components/CustomPopup';
import colors from '../../../config/colors';
import config from '../../../config';
import { CommonActions, useNavigation } from '@react-navigation/native';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const nav = useNavigation(); // for logout navigation
  const [deletePopupVisible, setDeletePopupVisible] = useState(false);
  const handleDeleteAccount = () => {
    console.log('🗑 Account deletion confirmed');
    setDeletePopupVisible(false);
    // Dispatch delete thunk or navigate here
  };
  
  const login = useSelector(state => state.login);
  const {
    user: profileUser,
    status: profileStatus,
    error: profileError,
  } = useSelector(state => state.profile);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const showToast = (msg, type = 'success') => {
    console.log('✅ Showing toast:', msg);
    setToastMessage(msg);
    setToastType(type);
    setToastVisible(true);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await dispatch(logoutUser());

              if (logoutUser.fulfilled.match(result)) {
                showToast(result.payload || 'Logout successful', 'success');
                setShouldNavigate(true);
              } else {
                throw new Error(result.payload || 'Logout failed');
              }
            } catch (err) {
              showToast(err.message || 'Logout failed', 'error');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleToastHide = () => {
    setToastVisible(false);

    if (shouldNavigate) {
      setShouldNavigate(false);
      nav.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    }
  };

  useEffect(() => {
    if (login?.user?.id) {
      console.log(
        '📦 Dispatching fetchUserProfile with userId:',
        login.user.id,
      );
      dispatch(fetchUserProfile(login.user.id));
    } else {
      console.log('🚫 Skipped fetching user profile – user ID not available');
    }
  }, [dispatch, login.user?.id]);

  if (login.loading || profileStatus === 'loading') {
    console.log('⏳ Loading state active');
    return (
      <View style={profileStyles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (profileStatus === 'failed') {
    console.log('❌ Profile fetch failed:', profileError);
  }

  console.log('✅ profileUser data from redux:', profileUser);

  return (
    <View style={profileStyles.container}>
      <View style={profileStyles.header}>
        <Text style={profileStyles.headerText}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={profileStyles.scrollViewContent}>
        <View style={profileStyles.profileInfoSection}>
          <View style={profileStyles.profileImageContainer}>
            <Image
              source={{
                uri: profileUser?.image
                  ? `${config.imageURL}${profileUser.image}`
                  : 'https://placehold.co/96x96/e0e0e0/000000?text=Profile',
              }}
              style={profileStyles.profileImage}
              onLoadStart={() => console.log('📤 Loading image...')}
              onLoad={() => console.log('✅ Image loaded successfully')}
              onError={e => {
                console.log('❌ Image failed to load');
                console.log('Error:', e.nativeEvent.error);
                console.log(
                  'Image URL attempted:',
                  `${config.imageURL}${profileUser?.image}`,
                );
              }}
            />
          </View>
          <Text style={profileStyles.profileName}>
            {profileUser?.name || 'User'}
          </Text>
          <TouchableOpacity style={profileStyles.helpFriendsButton}>
            <Text style={profileStyles.helpFriendsButtonText}>
              🎁 Help Your Friends, Get $10
            </Text>
          </TouchableOpacity>
        </View>

        <View style={profileStyles.menuSection}>
          <TouchableOpacity
            style={profileStyles.menuItem}
            onPress={() => navigation.navigate('AccountScreen')}
          >
            <View>
              <Text style={profileStyles.menuItemText}>Profile Details</Text>
              <Text style={profileStyles.menuItemSubText}>
                {profileUser?.email || 'user@example.com'}
              </Text>
            </View>
            <Text style={profileStyles.arrowIcon}>›</Text>
          </TouchableOpacity>

          {[
            'Change Password',
            'Notifications Settings',
            'Delete Account',
            'Payment',
            'Support',
            'Privacy Policy',
            'Terms of Service',
          ].map((item, index) => (
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
                }else if (item === 'Privacy Policy') {
                  navigation.navigate('PrivacyPolicy');
                } else if (item === 'Terms of Service') {
                  navigation.navigate('TermsandconditionScreen');
                } else {
                  console.log(`${item} pressed`);
                }
              }}
            >
              <Text style={profileStyles.menuItemText}>{item}</Text>
              <Text style={profileStyles.arrowIcon}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={profileStyles.menuSection}>
          <TouchableOpacity style={profileStyles.centeredMenuItem}>
            <Text style={profileStyles.centeredMenuItemText}>
              Become Tasker
            </Text>
          </TouchableOpacity>

          <View style={profileStyles.dividerLine} />

          <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
            <TouchableOpacity onPress={handleLogout} style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '500', color: '#DC2626' }}>
                Logout
              </Text>
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
  iconColor="#DC2626"
  cancelText="Cancel"
  confirmText="Delete"
  onCancel={() => setDeletePopupVisible(false)}
  onConfirm={handleDeleteAccount}
/>
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
    marginBottom: 10,
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
