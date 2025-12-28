import React from 'react';
import { StatusBar } from 'react-native'; // Switched from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppProvider>
          <NavigationContainer>
            {/* Standard React Native StatusBar */}
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <AppNavigator />
          </NavigationContainer>
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}