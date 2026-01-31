import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TrafficStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';

// Import actual screen components
import TrafficHomeScreen from '../screens/Traffic/TrafficHomeScreen';
import LiveCamerasScreen from '../screens/Traffic/LiveCamerasScreen';
import TrafficAnalyticsScreen from '../screens/Traffic/TrafficAnalyticsScreen';
import TrafficSignalsScreen from '../screens/Traffic/TrafficSignalsScreen';
import NoiseDetectionScreen from '../screens/Traffic/NoiseDetectionScreen';
import ParkingAssistanceScreen from '../screens/Traffic/ParkingAssistanceScreen';

// Placeholder screens for now (we'll create these later)
const IncidentReportScreen = () => <></>;
const ManageTrafficScreen = () => <></>;

const Stack = createNativeStackNavigator<TrafficStackParamList>();

const TrafficNavigator = () => {
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
        name="TrafficHome" 
        component={TrafficHomeScreen} 
        options={{ title: 'Traffic Management' }}
      />
      <Stack.Screen 
        name="LiveCameras" 
        component={LiveCamerasScreen} 
        options={{ title: 'Live Cameras' }}
      />
      <Stack.Screen 
        name="TrafficAnalytics" 
        component={TrafficAnalyticsScreen} 
        options={{ title: 'Traffic Analytics' }}
      />
      <Stack.Screen 
        name="TrafficSignals" 
        component={TrafficSignalsScreen} 
        options={{ title: 'Traffic Signals' }}
      />
      <Stack.Screen 
        name="NoiseDetection" 
        component={NoiseDetectionScreen} 
        options={{ title: 'Noise Detection' }}
      />
      <Stack.Screen 
        name="ParkingAssistance" 
        component={ParkingAssistanceScreen} 
        options={{ title: 'Parking Assistance' }}
      />
      <Stack.Screen 
        name="IncidentReport" 
        component={IncidentReportScreen} 
        options={{ title: 'Report Incident' }}
      />
      <Stack.Screen 
        name="ManageTraffic" 
        component={ManageTrafficScreen} 
        options={{ title: 'Manage Traffic' }}
      />
    </Stack.Navigator>
  );
};

export default TrafficNavigator; 