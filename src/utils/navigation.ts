import { CommonActions } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList, MainTabParamList } from '../navigation/types';

/**
 * Safely navigate to the notifications screen from any navigator
 * @param navigation The navigation object from the screen
 */
export const navigateToNotifications = (navigation: any) => {
  // Try to use the stack navigation first if notifications is in the current stack
  try {
    if (navigation.navigate) {
      // First, check if we can navigate directly
      navigation.navigate('Notifications');
      return;
    }
  } catch (error) {
    // If direct navigation fails, try the root navigation
    console.log('Direct navigation to Notifications failed, trying root navigation');
  }

  // If direct navigation fails, use CommonActions to navigate through the root
  try {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Dashboard',
        params: {
          screen: 'Notifications'
        }
      })
    );
  } catch (error) {
    console.log('Failed to navigate to Notifications', error);
  }
};

/**
 * Safely navigate to the reports screen from any navigator
 * @param navigation The navigation object from the screen
 * @param type The type of report to show (daily, weekly, monthly)
 */
export const navigateToReports = (navigation: any, type: 'daily' | 'weekly' | 'monthly' = 'daily') => {
  // Try to use the stack navigation first if reports is in the current stack
  try {
    if (navigation.navigate) {
      // First, check if we can navigate directly
      navigation.navigate('Reports', { type });
      return;
    }
  } catch (error) {
    // If direct navigation fails, try the root navigation
    console.log('Direct navigation to Reports failed, trying root navigation');
  }

  // If direct navigation fails, use CommonActions to navigate through the root
  try {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Dashboard',
        params: {
          screen: 'Reports',
          params: { type }
        }
      })
    );
  } catch (error) {
    console.log('Failed to navigate to Reports', error);
  }
};

/**
 * Safely navigate to the E-Challan screen from any navigator
 * @param navigation The navigation object from the screen
 */
export const navigateToEChallan = (navigation: any) => {
  try {
    if (navigation.navigate) {
      navigation.navigate('EChallan');
      return;
    }
  } catch (error) {
    console.log('Direct navigation to EChallan failed, trying root navigation');
  }

  try {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Main',
        params: {
          screen: 'EChallan'
        }
      })
    );
  } catch (error) {
    console.log('Failed to navigate to EChallan', error);
  }
};

/**
 * Safely navigate to the vehicle recovery screen from any navigator
 * @param navigation The navigation object from the screen
 */
export const navigateToVehicleRecovery = (navigation: any) => {
  try {
    if (navigation.navigate) {
      navigation.navigate('VehicleRecovery');
      return;
    }
  } catch (error) {
    console.log('Direct navigation to VehicleRecovery failed, trying root navigation');
  }

  try {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Main',
        params: {
          screen: 'Dashboard',
          params: {
            screen: 'VehicleRecovery'
          }
        }
      })
    );
  } catch (error) {
    console.log('Failed to navigate to VehicleRecovery', error);
  }
};

/**
 * Safely navigate to the Settings screen from any navigator
 * @param navigation The navigation object from the screen
 */
export const navigateToSettings = (navigation: any) => {
  try {
    if (navigation.navigate) {
      navigation.navigate('SettingsStack');
      return;
    }
  } catch (error) {
    console.log('Direct navigation to Settings failed, trying root navigation');
  }

  try {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'SettingsStack'
      })
    );
  } catch (error) {
    console.log('Failed to navigate to Settings', error);
  }
};

/**
 * Safely navigate to the AI Chatbot screen from any navigator
 * @param navigation The navigation object from the screen
 */
export const navigateToAIChatbot = (navigation: any) => {
  try {
    if (navigation.navigate) {
      navigation.navigate('AIChatbot');
      return;
    }
  } catch (error) {
    console.log('Direct navigation to AIChatbot failed, trying root navigation');
  }

  try {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Main',
        params: {
          screen: 'Dashboard',
          params: {
            screen: 'AIChatbot'
          }
        }
      })
    );
  } catch (error) {
    console.log('Failed to navigate to AIChatbot', error);
  }
};

export const navigateFromSidebar = (
  navigation: NavigationProp<RootStackParamList>,
  screen: string,
  params?: any
) => {
  // Handle navigation based on screen name
  if (screen === 'VehicleRecoveryStack' || screen === 'EChallanStack' || screen === 'SettingsStack') {
    navigation.dispatch(
      CommonActions.navigate({
        name: screen as keyof RootStackParamList
      })
    );
  } 
  // Special handling for screens in the Dashboard stack
  else if (screen === 'Notifications' || screen === 'Reports') {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Main',
        params: {
          screen: 'Dashboard',
          params: {
            screen,
            ...(params && { params })
          }
        }
      })
    );
  } 
  // Direct navigation to main tabs
  else if (screen === 'Dashboard') {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Main',
        params: {
          screen: 'Dashboard',
          params: {
            screen: 'DashboardHome'
          }
        }
      })
    );
  }
  // Handle Demo screen navigation
  else if (screen === 'Demo') {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Main',
        params: {
          screen: 'More',
          params: {
            screen: 'Demo'
          }
        }
      })
    );
  }
  else {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Main',
        params: {
          screen: screen as keyof MainTabParamList,
          params
        }
      })
    );
  }
}; 