// // components/BottomNavigationBar.js
// import React from 'react';
// import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import colors from '../../../config/colors';

// const tabs = [
//   { name: 'Home', icon: 'home-outline', route: 'Home' },
//   { name: 'Services', icon: 'construct-outline', route: 'Services' },
//   { name: 'Bookings', icon: 'calendar-outline', route: 'Bookings' },
//   { name: 'Profile', icon: 'person-outline', route: 'Profile' },
// ];

// const BottomNavigationBar = ({ state, onTabPress }) => {
//   return (
//     <View style={styles.container}>
//       {tabs.map((tab, index) => {
//         const isActive = state?.index === index;

//         return (
//           <TouchableOpacity
//             key={tab.name}
//             style={styles.tab}
//             onPress={() => onTabPress(tab.route, index)}
//             activeOpacity={0.7}
//           >
//             <Ionicons
//               name={tab.icon}
//               size={24}
//               color={isActive ? colors.primary : '#888'}
//             />
//             <Text
//               style={[
//                 styles.label,
//                 { color: isActive ? colors.primary : '#888' },
//               ]}
//             >
//               {tab.name}
//             </Text>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     borderTopWidth: 1,
//     borderTopColor: '#ddd',
//     backgroundColor: '#fff',
//     paddingVertical: 10,
//     justifyContent: 'space-around',
//   },
//   tab: {
//     alignItems: 'center',
//     paddingHorizontal: 10,
//   },
//   label: {
//     fontSize: 12,
//     marginTop: 4,
//   },
// });

// export default BottomNavigationBar;
