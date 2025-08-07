import {MMKV} from 'react-native-mmkv';

const key = 'authToken';
const fcmToken = 'fcm_token';


const secureParams = {
  id: 'mmkv.default',
  encryptionKey: 'my-encryption-key!',
};

const tokenStorage = new MMKV(secureParams);
const fcmStorage = new MMKV(secureParams);

const storeToken = async (authToken, user) => {
  try {
    tokenStorage.set(key, authToken);
    tokenStorage.set(keyUser, JSON.stringify(user));
  } catch (error) {
    console.log('Error storing the auth token', error);
  }
};

const getToken = async () => {
  try {
    return tokenStorage.getString(key);
  } catch (error) {
    console.log('Error getting the auth token', error);
  }
};

const getUser = async () => {
  try {
    return tokenStorage.getString(keyUser);
  } catch (error) {
    console.log('Error getting the auth user', error);
  }
};

const removeToken = async () => {
  try {
    tokenStorage.delete(key);
    tokenStorage.delete(keyUser);
  } catch (error) {
    console.log('Error removing the auth token', error);
  }
};

const storeFcm = async fcm_token => {
  try {
    fcmStorage.set(fcmToken, fcm_token);
  } catch (error) {
    console.log('Error storing fcm token', error);
  }
};
const getFcm = async () => {
  try {
    return fcmStorage.getString(fcmToken);
  } catch (error) {
    console.log('Error getting the auth token', error);
  }
};

const removeFcm = async () => {
  try {
    fcmStorage.delete(fcmToken);
  } catch (error) {
    console.log('Error removing the auth token', error);
  }
};


export default {
  getToken,
  storeToken,
  removeToken,
  getUser,
  storeFcm,
  getFcm,
  removeFcm,
};
