import AsyncStorage from '@react-native-async-storage/async-storage';

const tokenKey = 'authToken';
const userKey = 'authUser';
const fcmToken = 'fcmToken';

// ✅ Token functions
const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem(tokenKey, token);
  } catch (error) {
    console.error('Error storing the auth token', error);
  }
};

const storeFcmToken = async (token) => {
  try {
    await AsyncStorage.setItem(fcmToken, token);
  } catch (error) {
    console.error('Error storing the fcm token', error);
  }
};

const getToken = async () => {
  try {
    return await AsyncStorage.getItem(tokenKey);
  } catch (error) {
    console.error('Error getting the auth token', error);
    return null;
  }
};

const geFcmToken = async () => {
  try {
    return await AsyncStorage.getItem(fcmToken);
  } catch (error) {
    console.error('Error getting the fcm token', error);
    return null;
  }
};
// ✅ User functions
const storeUser = async (user) => {
  try {
    await AsyncStorage.setItem(userKey, JSON.stringify(user));
  } catch (error) {
    console.error('Error storing the user', error);
  }
};

const getUser = async () => {
  try {
    const userJson = await AsyncStorage.getItem(userKey);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting the user', error);
    return null;
  }
};
const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(tokenKey);
    return true;
  } catch (error) {
    console.error('Error removing the auth token', error);
    return false;
  }
};

const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(userKey);
    return true;
  } catch (error) {
    console.error('Error removing the user', error);
    return false;
  }
};

export default {
  storeToken,
  getToken,
  removeToken,
  storeUser,
  getUser,
  removeUser,
  storeFcmToken,
  geFcmToken
};
