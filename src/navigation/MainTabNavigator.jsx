// // navigation/MainTabNavigator.js
// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import HomeScreen from '../views/screens/Dashboard/HomeScreen';
// import ProfileScreen from '../views/screens/Dashboard/ProfileScreen';
// import ServiceScreen from '../views/screens/Dashboard/ServiceScreen';
// import colors from '../config/colors';

// const Tab = createBottomTabNavigator();

// const MainTabNavigator = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarActiveTintColor: colors.primary,
//         tabBarInactiveTintColor: '#777',
//         tabBarIcon: ({ color, size, focused }) => {
//           let iconName;

//           switch (route.name) {
//             case 'Home':
//               iconName = focused ? 'home' : 'home-outline';
//               break;
//             case 'Services':
//               iconName = focused ? 'construct' : 'construct-outline';
//               break;
//             case 'Bookings':
//               iconName = focused ? 'calendar' : 'calendar-outline';
//               break;
//             case 'Profile':
//               iconName = focused ? 'person' : 'person-outline';
//               break;
//             default:
//               iconName = 'ellipse';
//           }

//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Services" component={ServiceScreen} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />
//     </Tab.Navigator>
//   );
// };

// export default MainTabNavigator;
