import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DemoStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';
import DemoScreen from '../screens/DemoScreen';

const Stack = createNativeStackNavigator<DemoStackParamList>();

const DemoNavigator = () => {
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
        name="Demo" 
        component={DemoScreen}
        options={{ title: 'Demo' }}
      />
    </Stack.Navigator>
  );
};

export default DemoNavigator; 