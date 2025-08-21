import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartupScreen from '../views/screens/AuthScreens/StartupScreen';
import SignupScreen from '../views/screens/AuthScreens/SignupScreen';
import LoginScreen from '../views/screens/AuthScreens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import ForgotPasswordScreen from '../views/screens/AuthScreens/ForgetPasswordScreen';
import AppEntryScreen from '../views/screens/AppEntryScreen';
import OTPScreen from '../views/screens/AuthScreens/OTPScreen';
import WelcomeScreen from '../views/screens/AuthScreens/WelcomeScreen';
import JobCreateScreen from '../views/screens/Dashboard/JobCreateScreen';
import ConsumerTabNavigator from './ConsumerTabNavigator';
import SearchScreen from '../views/screens/Dashboard/SearchScreen'; // Import SearchScreen
import CategoryDetailsScreen from '../views/screens/Dashboard/CategoryDetailsScreen'; // Import CategoryDetailsScreen
import ProfileScreen from '../views/screens/Dashboard/ProfileScreen'; 
import AccountScreen from '../views/screens/Dashboard/AccountScreen'; // Import AccountScreen
import ChangePasswordScreen from '../views/screens/AuthScreens/ChangePasswordScreen';
import ResetPasswordScreen from '../views/screens/AuthScreens/ResetPasswordScreen'; // Import ResetPasswordScreen
import UpdateProfileScreen from '../views/screens/Dashboard/UpdateProfileScreen'; // Import UpdateProfileScreen
import AllCategoriesScreen from '../views/screens/Dashboard/AllCategoriesScreen'; // Import AllCategoriesScreen
import ProviderTabNavigator from './ProviderTabNavigator';
import DashboardRouter from './DashboardRouter';
import NotificationSettingsScreen from '../views/screens/Dashboard/NotificationSettingsScreen'; // Import NotificationSettingsScreen
import PrivacyPolicyScreen from '../views/screens/Dashboard/PrivacyPolicyScreen'; // Import PrivacyPolicyScreen
import TermsandconditionScreen from '../views/screens/Dashboard/TermsandconditionScreen'; // Import TermsandconditionScreen
import JobDetailsScreen from '../views/screens/JobDetailsScreen';
import OfferListScreen from '../views/screens/Dashboard/OffersScreen';
import { navigationRef } from '../navigation/NavigationService'; // adjust path
import JobsScreen from '../views/screens/Dashboard/JobsScreen'; // Import JobsScreen
import StageScreen from '../views/screens/Dashboard/StageScreen'; // Import StageScreen
import CreateStage from '../views/screens/Dashboard/StageScreens/CreateStage';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="AppEntry" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AppEntry" component={AppEntryScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Startup" component={StartupScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} /> 
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> 
        <Stack.Screen name="OTPScreen" component={OTPScreen} />
        <Stack.Screen name="ConsumerDashboard" component={ConsumerTabNavigator} />
        <Stack.Screen name="ProviderDashboard" component={ProviderTabNavigator} />
        <Stack.Screen name="DashboardRouter" component={DashboardRouter} />

        <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="JobCreateScreen" component={JobCreateScreen} />
        <Stack.Screen name="CategoryDetailsScreen" component={CategoryDetailsScreen} />
        {/* <Stack.Screen name="ProfileManager" component={ProfileManagerScreen} /> */}
        
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="AccountScreen" component={AccountScreen} />
        <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
        <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
        <Stack.Screen name="UpdateProfileScreen" component={UpdateProfileScreen} />
        <Stack.Screen name="AllCategoriesScreen" component={AllCategoriesScreen} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="TermsandconditionScreen" component={TermsandconditionScreen} />
        <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />
        <Stack.Screen name="OffersScreen" component={OfferListScreen} />
        <Stack.Screen name="JobsScreen" component={JobsScreen} />
        <Stack.Screen name="StageScreen" component={StageScreen} />
        <Stack.Screen name="CreateStage" component={CreateStage} />




        

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
