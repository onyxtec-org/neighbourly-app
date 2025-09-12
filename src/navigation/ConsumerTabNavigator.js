import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import HomeScreen from '../views/screens/Dashboard/consumerScreens/ConsumerHomeScreen';
import TaskScreen from '../views/screens/Dashboard/jobScreens/JobsScreen';
import ProfileScreen from '../views/screens/Dashboard/profileScreens/ProfileScreen';
import colors from '../config/colors';
import StageScreen from '../views/screens/Dashboard/StageScreens/StageScreen';
import DashboardIcon from '../assets/icons/dashboard.svg';
import StageIcon from '../assets/icons/stage.svg';
import JobsIcon from '../assets/icons/jobss.svg';
import ProfileIcon from '../assets/icons/profile.svg';
const Tab = createBottomTabNavigator();

const ConsumerTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Stage"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Stage':
              iconName = 'albums-outline';
              break;
            case 'Dashboard':
              iconName = 'home-outline';
              break;
            case 'Jobs':
              iconName = 'briefcase-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          paddingBottom: 4,
          height: Platform.OS === 'ios' ? 80 : 60, 
        },
      })}
    >
      <Tab.Screen name="Stage" component={StageScreen} />
      <Tab.Screen name="Dashboard" component={HomeScreen} />
      <Tab.Screen name="Jobs" component={TaskScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default ConsumerTabNavigator;
