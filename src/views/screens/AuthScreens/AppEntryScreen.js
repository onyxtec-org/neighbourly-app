import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import colors from '../../../config/colors'; // Ensure this has primary/white/etc.
import StartupSVG from '../../../assets/icons/startup.svg';
import { useDispatch } from 'react-redux';
import { fetchUserProfile } from '../../../redux/slices/authSlice/profileSlice';
import storage from '../../../app/storage';
import { setMyServices } from '../../../redux/slices/servicesSlice/servicesSlice';
import { fetchNotifications } from '../../../redux/slices/notificationSlice/notificationSlice';
import { fetchCategories } from '../../../redux/slices/categorySlice/categoriesSlice';
import AppText from '../../components/AppText';
const AppEntryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const checkLogin = async () => {
      try {
        // Wait 2 seconds to show splash
        await new Promise(resolve => setTimeout(resolve, 2000));
        const user = await storage.getUser();
        const token = await storage.getToken();
        
        console.log('Retrieved token from AsyncStorage:', token);
        console.log('Retrieved user from AsyncStorage:', user);

        if (!token ||
           !user) {
          console.log('No token found → Navigating to Login');
          navigation.replace('Login');
        }
        // else 
        //   if (!user) {
        //   console.log(
        //     'User missing or no account → Navigating to WelcomeScreen',
        //   );
        //   navigation.replace('Welcome');
        // }
         else if (token && user) {
          
          
          
          const result = await dispatch(fetchUserProfile({userId:user.id})); // ✅ Re-hydrate Redux
          dispatch(fetchNotifications())
         
          if (fetchUserProfile.fulfilled.match(result)) {
            dispatch(setMyServices(user.services || []));
            navigation.replace('DashboardRouter');
          } else {
            console.log('Failed to fetch profile:', result.payload);
            navigation.replace('Login'); // or error fallback
          }
        }
      } catch (err) {
        console.log('Error while checking login:', err);
        navigation.replace('Login');
      }
    };

    checkLogin();
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      {/* App Logo */}
      <View style={styles.imageContainer}>
        <StartupSVG width={150} height={150} />
      </View>
      {/* App Name */}
      <AppText style={styles.appName}>Neighbourly</AppText>
      {/* Loader */}
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.loader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  imageContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  loader: {
    marginTop: 20,
  },
});

export default AppEntryScreen;
