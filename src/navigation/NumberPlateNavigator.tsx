import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NumberPlateStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';

// Import actual screen components
import ScanPlateScreen from '../screens/NumberPlateDetection/ScanPlateScreen';
import PlateResultsScreen from '../screens/NumberPlateDetection/PlateResultsScreen';
import PlateHistoryScreen from '../screens/NumberPlateDetection/PlateHistoryScreen';
import VehicleDetailsScreen from '../screens/NumberPlateDetection/VehicleDetailsScreen';

const Stack = createNativeStackNavigator<NumberPlateStackParamList>();

const NumberPlateNavigator = () => {
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
        name="ScanPlate" 
        component={ScanPlateScreen} 
        options={{ title: 'Scan Number Plate' }}
      />
      <Stack.Screen 
        name="PlateResults" 
        component={PlateResultsScreen} 
        options={{ title: 'Plate Results' }}
      />
      <Stack.Screen 
        name="PlateHistory" 
        component={PlateHistoryScreen} 
        options={{ title: 'Plate History' }}
      />
      <Stack.Screen 
        name="VehicleDetails" 
        component={VehicleDetailsScreen} 
        options={{ title: 'Vehicle Details' }}
      />
    </Stack.Navigator>
  );
};

export default NumberPlateNavigator; 