import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProviderHomeScreen from '../views/screens/Dashboard/ProviderScreens/ProviderHomeScreen';
import ServicesSelectScreen from '../views/screens/Dashboard/ProviderScreens/ServicesSelectScreen';
import { NavigationContainer } from '@react-navigation/native';
const Stack = createNativeStackNavigator();

const ProviderNavigator = () => {
  return (
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="HomeScreen" component={ProviderHomeScreen} />
        <Stack.Screen name="ServicesSelection" component={ServicesSelectScreen} />
      </Stack.Navigator>
  );
};

export default ProviderNavigator;
