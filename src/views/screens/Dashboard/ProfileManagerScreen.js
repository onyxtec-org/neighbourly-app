// import React, {  useState } from 'react';
// import {
//   StyleSheet,
//   SafeAreaView,
// } from 'react-native';
// import AccountScreen from '../../../views/screens/Dashboard/AccountScreen';
// import ProfileScreen from '../../../views/screens/Dashboard/ProfileScreen';

// import ChangePasswordScreen from '../../../views/screens/AuthScreens/ChangePasswordScreen';

// // 🌟 Main App Wrapper
// const ProfileManagerScreen = () => {
//   const [currentScreen, setCurrentScreen] = useState('profile');

//   const navigateTo = (screen) => {
//     setCurrentScreen(screen);
//   };

//   return (
//     <SafeAreaView style={appStyles.safeArea}>
//       {currentScreen === 'profile' && <ProfileScreen navigateTo={navigateTo} />}
//       {currentScreen === 'account' && <AccountScreen navigateTo={navigateTo} />}
//       {currentScreen === 'changePassword' && (
//         <ChangePasswordScreen navigateTo={navigateTo} />
//       )}
//     </SafeAreaView>
//   );
// };




// // Styles for the main App component and common elements
// const appStyles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#F3F4F6', // Light gray background
//   },
// });

// export default ProfileManagerScreen;
