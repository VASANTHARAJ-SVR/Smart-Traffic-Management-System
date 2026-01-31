import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DocumentStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';

// Import actual screen components
import DocumentHomeScreen from '../screens/Document/DocumentHomeScreen';

// Placeholder screens for now (we'll create these later)
const ScanDocumentScreen = () => <></>;
const DocumentDetailsScreen = () => <></>;
const ViolationHistoryScreen = () => <></>;

const Stack = createNativeStackNavigator<DocumentStackParamList>();

const DocumentNavigator = () => {
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
        name="DocumentHome" 
        component={DocumentHomeScreen} 
        options={{ title: 'Documents' }}
      />
      <Stack.Screen 
        name="ScanDocument" 
        component={ScanDocumentScreen} 
        options={{ title: 'Scan Document' }}
      />
      <Stack.Screen 
        name="DocumentDetails" 
        component={DocumentDetailsScreen} 
        options={{ title: 'Document Details' }}
      />
      <Stack.Screen 
        name="ViolationHistory" 
        component={ViolationHistoryScreen} 
        options={{ title: 'Violation History' }}
      />
    </Stack.Navigator>
  );
};

export default DocumentNavigator; 