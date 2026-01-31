import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EChallanStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';

// Import screens
import EChallanHomeScreen from '../screens/EChallan/EChallanHomeScreen';

// Placeholder screens
const CreateChallanScreen = () => <></>;
const ChallanDetailsScreen = () => <></>;
const PaymentGatewayScreen = () => <></>;
const ChallanHistoryScreen = () => <></>;

const Stack = createNativeStackNavigator<EChallanStackParamList>();

const EChallanNavigator = () => {
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
        name="EChallanHome" 
        component={EChallanHomeScreen} 
        options={{ title: 'E-Challan' }}
      />
      <Stack.Screen 
        name="CreateChallan" 
        component={CreateChallanScreen} 
        options={{ title: 'Create Challan' }}
      />
      <Stack.Screen 
        name="ChallanDetails" 
        component={ChallanDetailsScreen} 
        options={{ title: 'Challan Details' }}
      />
      <Stack.Screen 
        name="PaymentGateway" 
        component={PaymentGatewayScreen} 
        options={{ title: 'Payment' }}
      />
      <Stack.Screen 
        name="ChallanHistory" 
        component={ChallanHistoryScreen} 
        options={{ title: 'Challan History' }}
      />
    </Stack.Navigator>
  );
};

export default EChallanNavigator; 