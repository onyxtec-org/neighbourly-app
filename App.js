import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import branch from 'react-native-branch';
import AppNavigator from './src/navigation/AppNavigator';
import store from './src/redux/store';
import { navigationRef, navigate } from './src/navigation/NavigationService';

export default function App() {
  useEffect(() => {
    LogBox.ignoreLogs(['AsyncStorage has been extracted']);

    // if (__DEV__) {
    //   branch.setDebug();
    // }

    const unsubscribe = branch.subscribe(({ error, params }) => {
      if (error) {
        console.error('❌ Branch Error:', error);
        return;
      }

      if (params['+clicked_branch_link']) {
        console.log('✅ Branch Deep Link Params:', params);
        handleBranchNavigation(params);
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  const handleBranchNavigation = (params) => {
    const { id, type } = params;

    if (!type || !id) return;

    if (type === 'user') {
      navigate('UserProfile', { userId: id });
    } else if (type === 'group') {
      navigate('GroupScreen', { groupId: id });
    } else {
      console.warn('Unknown deep link type:', type);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppNavigator ref={navigationRef} />
      </Provider>
    </GestureHandlerRootView>
  );
}
