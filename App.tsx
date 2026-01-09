import React from 'react';
import { RootNavigator } from './src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from './src/context/UserContext';

export default function App() {
  return (
    <UserProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </UserProvider>
  );
}
