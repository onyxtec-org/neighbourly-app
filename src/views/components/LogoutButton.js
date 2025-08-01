
// import React, { useState } from 'react';
// import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
// import { useDispatch } from 'react-redux';
// import { useNavigation, CommonActions } from '@react-navigation/native';
// import { logoutUser } from '../../redux/thunks/auth/logoutThunk';
// import CustomToast from '../components/CustomToast';

// const LogoutButton = () => {
//   const dispatch = useDispatch();
//   const navigation = useNavigation();

//   const [toastVisible, setToastVisible] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastType, setToastType] = useState('success');
//   const [shouldNavigate, setShouldNavigate] = useState(false);

//   const showToast = (msg, type = 'success') => {
//     console.log('✅ Showing toast:', msg);
//     setToastMessage(msg);
//     setToastType(type);
//     setToastVisible(true);
//   };

//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               const result = await dispatch(logoutUser());

//               if (logoutUser.fulfilled.match(result)) {
//                 showToast(result.payload || 'Logout successful', 'success');
//                 setShouldNavigate(true); // defer navigation
//               } else {
//                 throw new Error(result.payload || 'Logout failed');
//               }
//             } catch (err) {
//               showToast(err.message || 'Logout failed', 'error');
//             }
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   const handleToastHide = () => {
//     setToastVisible(false);

//     if (shouldNavigate) {
//       setShouldNavigate(false); // reset
//       navigation.dispatch(
//         CommonActions.reset({
//           index: 0,
//           routes: [{ name: 'Login' }],
//         })
//       );
//     }
//   };

//   return (
//     <>
//       <TouchableOpacity style={styles.button} onPress={handleLogout}>
//         <Text style={styles.text}>Logout</Text>
//       </TouchableOpacity>
//       <CustomToast
//         visible={toastVisible}
//         message={toastMessage}
//         type={toastType}
//         onHide={handleToastHide}
//       />
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#DC2626', // Red-600
//   },
// });

// export default LogoutButton;
