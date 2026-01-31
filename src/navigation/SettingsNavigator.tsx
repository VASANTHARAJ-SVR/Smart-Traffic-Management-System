import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';
import { Platform } from 'react-native';

// Import Settings screen
import SettingsScreen from '../screens/More/SettingsScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

/**
 * Settings Navigator
 * Separated from tab navigation to prevent showing E-Challan tab as active when in Settings
 */
const SettingsNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: theme.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShown: false,
        gestureEnabled: Platform.OS === 'ios',
        gestureDirection: 'horizontal',
        animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        presentation: 'card',
        fullScreenGestureEnabled: true
      }}
    >
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          title: 'Settings',
        }}
      />
    </Stack.Navigator>
  );
};

export default SettingsNavigator; 