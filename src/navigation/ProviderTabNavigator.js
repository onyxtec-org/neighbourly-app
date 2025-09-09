import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import JobsScreen from '../views/screens/Dashboard/jobScreens/JobsScreen';
import ProfileScreen from '../views/screens/Dashboard/profileScreens/ProfileScreen';
import colors from '../config/colors';
import ProviderNavigator from './ProviderNavigator';
import StageScreen from '../views/screens/Dashboard/StageScreens/StageScreen';
import Icon from '../views/components/ImageComponent/IconComponent';
//import Icon from 'react-native-vector-icons/Ionicons';

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
      <Tab.Screen name="Dashboard" component={ProviderNavigator} />
      {/* <Tab.Screen name="MyServices" component={MyServicesScreen} /> */}
      <Tab.Screen name="Jobs" component={JobsScreen} />
      <Tab.Screen name="Stage" component={StageScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default ProviderTabNavigator;
