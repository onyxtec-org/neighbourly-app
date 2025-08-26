import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../views/screens/Dashboard/ConsumerHomeScreen';
import TaskScreen from '../views/screens/Dashboard/JobsScreen';
import ProfileScreen from '../views/screens/Dashboard/ProfileScreen';
import colors from '../config/colors';
import StageScreen from '../views/screens/Dashboard/StageScreen';
import Icon from '../views/components/IconComponent';
const Tab = createBottomTabNavigator();

const ConsumerTabNavigator = () => {
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
              iconName = 'briefcase-outline';
              break;
            case 'Stage':
              iconName = 'albums-outline';
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
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={HomeScreen} />
      <Tab.Screen name="Jobs" component={TaskScreen} />
      <Tab.Screen name="Stage" component={StageScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default ConsumerTabNavigator;
