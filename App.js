// App.js
import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { getApps, initializeApp } from 'firebase/app';
import AppNavigator from './src/navigation/AppNavigator';
import { firebaseConfig } from './src/config/firebaseConfig';

import { Provider } from 'react-redux';
import store from './src/app/store'; 
export default function App() {
  useEffect(() => {
    const initFirebase = () => {
      if (getApps().length === 0) {
        initializeApp(firebaseConfig);
        console.log('✅ Firebase initialized in App.js');
      } else {
        console.log('✅ Firebase already initialized');
      }
    };

    initFirebase();
    LogBox.ignoreLogs(['AsyncStorage has been extracted']);
  }, []);

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
