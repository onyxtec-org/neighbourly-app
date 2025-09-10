import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../views/screens/Dashboard/consumerScreens/ConsumerHomeScreen';
import TaskScreen from '../views/screens/Dashboard/jobScreens/JobsScreen';
import ProfileScreen from '../views/screens/Dashboard/profileScreens/ProfileScreen';
import colors from '../config/colors';
import StageScreen from '../views/screens/Dashboard/StageScreens/StageScreen';
import Icon from '../views/components/ImageComponent/IconComponent';
import DashboardIcon from '../assets/icons/dashboard.svg';
import StageIcon from '../assets/icons/stage.svg';
import JobsIcon from '../assets/icons/jobss.svg';
import ProfileIcon from '../assets/icons/profile.svg';
const Tab = createBottomTabNavigator();

const ConsumerTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let IconComponent;

          switch (route.name) {
            case 'Stage':
              IconComponent = StageIcon;
              colors.white;
              break;
            case 'Dashboard':
              IconComponent = DashboardIcon;
              break;
            case 'Jobs':
              IconComponent = JobsIcon;
              colors.white;
              break;
            case 'Profile':
              IconComponent = ProfileIcon;
              colors.white;
              break;
            default:
              IconComponent = DashboardIcon;
          }

          return (
            <IconComponent
              width={size}
              height={size}
              fill={focused ? colors.primary : 'transparent'}
            />
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'black',
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
