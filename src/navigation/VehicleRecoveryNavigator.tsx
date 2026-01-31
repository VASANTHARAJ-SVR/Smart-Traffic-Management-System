import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VehicleRecoveryStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';
import VehicleRecoveryScreen from '../screens/VehicleRecoveryScreen';

// Placeholder screens
const RecoveryHomeScreen = () => <></>;
const SearchVehicleScreen = () => <></>;
const AddComplaintScreen = () => <></>;
const ComplaintDetailsScreen = () => <></>;
const RecoveryAlertsScreen = () => <></>;

const Stack = createNativeStackNavigator<VehicleRecoveryStackParamList>();

const VehicleRecoveryNavigator = () => {
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
        name="RecoveryHome" 
        component={VehicleRecoveryScreen} 
        options={{ title: 'Vehicle Recovery' }}
      />
      <Stack.Screen 
        name="SearchVehicle" 
        component={SearchVehicleScreen} 
        options={{ title: 'Search Vehicle' }}
      />
      <Stack.Screen 
        name="AddComplaint" 
        component={AddComplaintScreen} 
        options={{ title: 'Add Complaint' }}
      />
      <Stack.Screen 
        name="ComplaintDetails" 
        component={ComplaintDetailsScreen} 
        options={{ title: 'Complaint Details' }}
      />
      <Stack.Screen 
        name="RecoveryAlerts" 
        component={RecoveryAlertsScreen} 
        options={{ title: 'Recovery Alerts' }}
      />
    </Stack.Navigator>
  );
};

export default VehicleRecoveryNavigator; 