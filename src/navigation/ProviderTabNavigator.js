import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ServicesScreen from '../views/screens/Dashboard/ServiceScreen';
import TaskScreen from '../views/screens/Dashboard/TaskScreen';
import ProfileScreen from '../views/screens/Dashboard/ProfileScreen';
import colors from '../config/colors';
import ProviderHomeScreen from '../views/screens/Dashboard/ProviderHomeScreen';

const Tab = createBottomTabNavigator();

const ProviderTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'Services':
              iconName = 'construct-outline';
              break;
            case 'MyTasks':
              iconName = 'checkmark-done-outline';
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
      <Tab.Screen name="Home" component={ProviderHomeScreen} />
      <Tab.Screen name="MyServices" component={ServicesScreen} />
      <Tab.Screen name="MyTasks" component={TaskScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default ProviderTabNavigator;
