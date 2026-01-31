import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MoreStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';

// Import actual screen components
import MoreHomeScreen from '../screens/More/MoreHomeScreen';
import EChallanScreen from '../screens/More/EChallanScreen';
import VehicleRecoveryScreen from '../screens/More/VehicleRecoveryScreen';
import DemoScreen from '../screens/DemoScreen';

// Placeholder screens for now (we'll create these later)
const SettingsScreen = () => <></>;
const ProfileScreen = () => <></>;
const AboutScreen = () => <></>;
const HelpScreen = () => <></>;

const Stack = createNativeStackNavigator<MoreStackParamList>();

const MoreNavigator = () => {
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
        headerShown: false, // Hide the default header since we're using custom FuturisticHeader
      }}
    >
      <Stack.Screen 
        name="MoreHome" 
        component={MoreHomeScreen} 
        options={{ title: 'More' }}
      />
      <Stack.Screen 
        name="EChallan" 
        component={EChallanScreen} 
        options={{ title: 'E-Challan' }}
      />
      <Stack.Screen 
        name="VehicleRecovery" 
        component={VehicleRecoveryScreen} 
        options={{ title: 'Vehicle Recovery' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen} 
      />
      <Stack.Screen 
        name="Help" 
        component={HelpScreen} 
      />
      <Stack.Screen 
        name="Demo" 
        component={DemoScreen}
        options={{ title: 'Demo' }}
      />
    </Stack.Navigator>
  );
};

export default MoreNavigator; 