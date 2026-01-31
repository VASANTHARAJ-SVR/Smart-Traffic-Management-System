import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme, Platform, Appearance, Alert, AppState } from 'react-native';
import { colors } from '../theme/colors';
import { ThemeMode } from '../types/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

type ThemeContextType = {
  theme: typeof colors.light;
  themeMode: ThemeMode;
  isDarkMode: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  forceSystemTheme: (isDark: boolean) => void;
  systemIsDark: boolean | null;
};

// Set the default theme to dark mode
const ThemeContext = createContext<ThemeContextType>({
  theme: colors.dark, // Changed from light to dark
  themeMode: 'dark', // Changed from system to dark
  isDarkMode: true, // Changed from false to true
  setThemeMode: () => {},
  toggleTheme: () => {},
  forceSystemTheme: () => {},
  systemIsDark: null,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  // Initialize with dark mode instead of system
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [systemIsDark, setSystemIsDark] = useState<boolean | null>(null);
  const [isExpoGo, setIsExpoGo] = useState<boolean>(false);
  const [manualSystemOverride, setManualSystemOverride] = useState<boolean | null>(null);

  // Debug the current values
  console.log('ThemeContext - Current mode:', themeMode);
  console.log('ThemeContext - useColorScheme() returns:', colorScheme);
  console.log('ThemeContext - Appearance.getColorScheme() returns:', Appearance.getColorScheme());
  console.log('ThemeContext - Detected system theme:', systemIsDark);
  console.log('ThemeContext - Is Expo:', Platform.constants?.reactNativeVersion ? 'Yes' : 'No');
  
  useEffect(() => {
    const isRunningInExpo = Platform.constants?.reactNativeVersion ? true : false;
    setIsExpoGo(isRunningInExpo);
    
    console.log('ThemeContext initialization');
    console.log('Platform info:', Platform.OS, Platform.Version);
    console.log('Running in Expo Go:', isRunningInExpo);
    
    const getInitialTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('themeMode');
        
        // Check if we have a stored manual system theme override
        const storedOverride = await AsyncStorage.getItem('systemThemeOverride');
        if (storedOverride) {
          const parsedOverride = JSON.parse(storedOverride);
          console.log('Found stored system theme override:', parsedOverride);
          setManualSystemOverride(parsedOverride);
          setSystemIsDark(parsedOverride);
        }
        
        if (storedTheme) {
          console.log('Found stored theme mode:', storedTheme);
          setThemeMode(storedTheme as ThemeMode);
        } else {
          console.log('No stored theme found. Using dark mode as default.');
          setThemeMode('dark'); // Changed from system to dark
          // Save the dark mode preference to storage
          try {
            await AsyncStorage.setItem('themeMode', 'dark');
          } catch (error) {
            console.error('Error saving default dark theme:', error);
          }
        }
      } catch (error) {
        console.error('Error reading theme from storage:', error);
        Alert.alert(
          'Theme Error',
          'Failed to load your theme preference. Using dark mode as default.'
        );
        setThemeMode('dark'); // Changed from system to dark
      }
    };

    getInitialTheme();
    
    // Set up listener for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      console.log('System color scheme changed:', newColorScheme);
      if (manualSystemOverride === null) {
        setSystemIsDark(newColorScheme === 'dark');
      }
    });

    // Detect initial system theme
    if (manualSystemOverride === null) {
      const initialColorScheme = Appearance.getColorScheme();
      console.log('Initial system color scheme:', initialColorScheme);
      setSystemIsDark(initialColorScheme === 'dark');
    }

    // Set up listener for app state changes
    const appStateSubscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        console.log('App is active, checking system theme');
        if (manualSystemOverride === null) {
          const currentColorScheme = Appearance.getColorScheme();
          console.log('Current system color scheme:', currentColorScheme);
          setSystemIsDark(currentColorScheme === 'dark');
        }
      }
    });

    return () => {
      subscription.remove();
      appStateSubscription.remove();
    };
  }, [manualSystemOverride]);

  // Manually force the system theme (for Expo Go environments where detection doesn't work)
  const forceSystemTheme = async (isDark: boolean) => {
    console.log(`Forcing system theme to be interpreted as: ${isDark ? 'dark' : 'light'}`);
    setManualSystemOverride(isDark);
    setSystemIsDark(isDark);
    
    try {
      await AsyncStorage.setItem('systemThemeOverride', JSON.stringify(isDark));
      
      // Provide user feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      if (themeMode === 'system') {
        console.log('Since current mode is system, updating active theme to match override');
      }
    } catch (error) {
      console.error('Error saving system theme override:', error);
      Alert.alert(
        'Theme Error',
        'Failed to save your system theme override preference.'
      );
    }
  };

  // Get the current theme based on mode and system preference
  const getTheme = () => {
    if (themeMode === 'light') {
      return colors.light;
    } else if (themeMode === 'dark') {
      return colors.dark;
    } else {
      // Handle system mode
      if (systemIsDark === null) {
        // If systemIsDark is still null (during initialization)
        // Fall back to colorScheme from useColorScheme
        return colorScheme === 'dark' ? colors.dark : colors.light;
      }
      return systemIsDark ? colors.dark : colors.light;
    }
  };

  const isDarkMode = 
    themeMode === 'dark' || 
    (themeMode === 'system' && systemIsDark === true) || 
    (themeMode === 'system' && systemIsDark === null && colorScheme === 'dark');

  const theme = getTheme();

  const toggleTheme = () => {
    console.log('ThemeContext - Toggle theme called, current mode:', themeMode);
    
    if (themeMode === 'dark') {
      console.log('ThemeContext - Switching from dark to system');
      setThemeMode('system');
    } else if (themeMode === 'system') {
      console.log('ThemeContext - Switching from system to light');
      setThemeMode('light');
    } else {
      console.log('ThemeContext - Switching from light to dark');
      setThemeMode('dark');
    }
  };

  const handleSetThemeMode = async (mode: ThemeMode) => {
    console.log(`Setting theme mode to: ${mode}`);
    setThemeMode(mode);
    
    try {
      await AsyncStorage.setItem('themeMode', mode);
      
      // Provide haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error saving theme mode:', error);
      Alert.alert(
        'Theme Error',
        'Failed to save your theme preference.'
      );
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        isDarkMode,
        setThemeMode: handleSetThemeMode,
        toggleTheme,
        forceSystemTheme,
        systemIsDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 