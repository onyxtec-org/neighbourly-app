import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import JobsScreen from '../views/screens/Dashboard/JobsScreen';
import ProfileScreen from '../views/screens/Dashboard/ProfileScreen';
import colors from '../config/colors';
import ProviderNavigator from './ProviderNavigator';
import MyServicesScreen from '../views/screens/Dashboard/ProviderScreens/MyServicesScreen';
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
            case 'MyServices':
              iconName = 'construct-outline';
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
      <Tab.Screen name="Dashboard" component={ProviderNavigator} />
      <Tab.Screen name="MyServices" component={MyServicesScreen} />
      <Tab.Screen name="Jobs" component={JobsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default ProviderTabNavigator;
