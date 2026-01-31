import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useAuth } from '../context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../context/ThemeContext';

// Import navigators
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import EChallanNavigator from './EChallanNavigator';
import VehicleRecoveryNavigator from './VehicleRecoveryNavigator';
import SettingsNavigator from './SettingsNavigator';
import DemoNavigator from './DemoNavigator';

// Import screens
import LoadingScreen from '../screens/LoadingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { isSignedIn, isLoading } = useAuth();
  const { theme, isDarkMode } = useTheme();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer
      theme={{
        dark: isDarkMode,
        colors: {
          primary: theme.primary,
          background: theme.background,
          card: theme.card,
          text: theme.text,
          border: theme.border,
          notification: theme.notification,
        },
        fonts: {
          regular: {
            fontFamily: '',
            fontWeight: '400',
          },
          medium: {
            fontFamily: '',
            fontWeight: '500',
          },
          bold: {
            fontFamily: '',
            fontWeight: '700',
          },
          heavy: {
            fontFamily: '',
            fontWeight: '900',
          },
        },
      }}
    >
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="EChallanStack" component={EChallanNavigator} />
            <Stack.Screen name="VehicleRecoveryStack" component={VehicleRecoveryNavigator} />
            <Stack.Screen name="SettingsStack" component={SettingsNavigator} />
            <Stack.Screen name="DemoStack" component={DemoNavigator} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator; 