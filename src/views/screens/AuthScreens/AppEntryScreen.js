import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import colors from '../../../config/colors'; // Ensure this has primary/white/etc.
import StartupSVG from '../../../assets/icons/startup.svg';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../../redux/slices/authSlice/profileSlice';
import storage from '../../../app/storage';
import { setMyServices } from '../../../redux/slices/servicesSlice/servicesSlice';
import { fetchNotifications } from '../../../redux/slices/notificationSlice/notificationSlice';
import AppText from '../../components/AppText';
import { clearDeepLinkParams } from '../../../redux/slices/deepLinkSlice';

const AppEntryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const deepLink = useSelector(state => state.deepLink.params);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const firstTimeUser = await storage.checkFirstTimeUser();
        const user = await storage.getUser();
        const token = await storage.getToken();

        console.log('First Time User:', firstTimeUser);

        if (firstTimeUser === undefined || firstTimeUser === null) {
          navigation.replace('Onboarding',);
          return;
        }

        if (!token || !user) {
          navigation.replace('Login', );
          return;
        }

        const result = await dispatch(fetchUserProfile({ userId: user.id }));
        dispatch(fetchNotifications());

        if (fetchUserProfile.fulfilled.match(result)) {
          dispatch(setMyServices(result.payload.data.services || []));

          // ✅ Agar deep link params hain → wahan navigate karo
          if (deepLink) {
            if (deepLink.type === 'user') {
              navigation.replace('AccountScreen', {
                userId: parseInt(deepLink.id, 10),
              });
            } else if (deepLink.type === 'post') {
              navigation.replace('PostDetails', 
                { postId: parseInt(deepLink.id, 10) });
            }
            dispatch(clearDeepLinkParams()); // reset after navigation
          } else {
            navigation.replace('DashboardRouter' ,{screen: 'Stage',
            }); // normal flow
          }
        } else {
          navigation.replace('Login');
        }
      } catch (err) {
        console.log('Error in AppEntryScreen:', err);

        navigation.replace('Login');
      }
    };

    checkLogin();
  }, [dispatch, navigation, deepLink]);

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
