import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';

// Import screens
import DashboardHomeScreen from '../screens/Dashboard/DashboardHomeScreen';
import NotificationsScreen from '../screens/Dashboard/NotificationsScreen';
import ReportsScreen from '../screens/Dashboard/ReportsScreen';
import VehicleRecoveryScreen from '../screens/VehicleRecoveryScreen';
import AIChatbotScreen from '../screens/AIChatbotScreen';

// Placeholder screens
const IncidentDetailsScreen = () => <></>;

const Stack = createNativeStackNavigator<DashboardStackParamList>();

const DashboardNavigator = () => {
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
      }}
    >
      <Stack.Screen 
        name="DashboardHome" 
        component={DashboardHomeScreen} 
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{ title: 'Notifications' }}
      />
      <Stack.Screen 
        name="Reports" 
        component={ReportsScreen} 
        options={{ title: 'Reports' }}
      />
      <Stack.Screen 
        name="IncidentDetails" 
        component={IncidentDetailsScreen} 
        options={{ title: 'Incident Details' }}
      />
      <Stack.Screen 
        name="VehicleRecovery" 
        component={VehicleRecoveryScreen} 
        options={{ title: 'Vehicle Recovery' }}
      />
      <Stack.Screen 
        name="AIChatbot" 
        component={AIChatbotScreen} 
        options={{ title: 'AI Assistant' }}
      />
    </Stack.Navigator>
  );
};

export default DashboardNavigator; 