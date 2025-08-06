import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ServicesScreen from '../views/screens/Dashboard/ServiceScreen';
import JobsScreen from '../views/screens/Dashboard/JobsScreen';
import ProfileScreen from '../views/screens/Dashboard/ProfileScreen';
import colors from '../config/colors';
import ProviderHomeScreen from '../views/screens/Dashboard/ProviderScreens/ProviderHomeScreen';
import ServicesSelectScreen from '../views/screens/Dashboard/ProviderScreens/ServicesSelectScreen';
const Tab = createBottomTabNavigator();

const ProviderTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'home-outline';
              break;

            case 'Jobs':
              iconName = 'checkmark-done-outline';
              break;
            case 'Notifications':
              iconName = 'notifications-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          paddingBottom: 4,
          height: 60,
        },
      })}
    >
      {/* <Tab.Screen name="Home" component={ProviderHomeScreen} /> */}
      <Tab.Screen name="Dashboard" component={ServicesSelectScreen} />
      <Tab.Screen name="Notifications" component={ServicesScreen} />
      <Tab.Screen name="Jobs" component={JobsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default ProviderTabNavigator;
