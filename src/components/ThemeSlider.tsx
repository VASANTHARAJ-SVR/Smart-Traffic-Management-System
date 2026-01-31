import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { ThemeMode } from '../types';

type ThemeSliderProps = {
  containerStyle?: object;
};

const ThemeSlider = ({ containerStyle }: ThemeSliderProps) => {
  const { theme, isDarkMode, themeMode, setThemeMode } = useTheme();
  
  // Convert theme mode to slider value
  const getSliderValue = (): number => {
    switch (themeMode) {
      case 'light': return 0;
      case 'system': return 1;
      case 'dark': return 2;
      default: return 1; // default to system
    }
  };
  
  // Convert slider value to theme mode
  const handleThemeChange = (value: number) => {
    console.log("ThemeSlider - Changing theme to value:", value);
    const newThemeMode: ThemeMode = 
      value === 0 ? 'light' : 
      value === 1 ? 'system' : 'dark';
    setThemeMode(newThemeMode);
  };
  
  // Get the system theme mode text
  const getSystemThemeText = () => {
    return isDarkMode && themeMode === 'system' 
      ? 'System (Dark)' 
      : !isDarkMode && themeMode === 'system' 
        ? 'System (Light)' 
        : 'System';
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.themeLabelsContainer}>
        <Text style={[styles.themeLabel, { 
          color: getSliderValue() === 0 ? theme.primary : theme.text,
          fontWeight: getSliderValue() === 0 ? 'bold' : 'normal'
        }]}>Light</Text>
        <Text style={[styles.themeLabel, { 
          color: getSliderValue() === 1 ? theme.primary : theme.text,
          fontWeight: getSliderValue() === 1 ? 'bold' : 'normal'
        }]}>{getSystemThemeText()}</Text>
        <Text style={[styles.themeLabel, { 
          color: getSliderValue() === 2 ? theme.primary : theme.text,
          fontWeight: getSliderValue() === 2 ? 'bold' : 'normal'
        }]}>Dark</Text>
      </View>
      
      <View style={styles.themeIconsContainer}>
        <TouchableOpacity 
          style={styles.themeIconButton} 
          onPress={() => handleThemeChange(0)}>
          <IconButton 
            icon="white-balance-sunny" 
            size={30} 
            iconColor={getSliderValue() === 0 ? theme.primary : theme.textSecondary} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.themeIconButton} 
          onPress={() => handleThemeChange(1)}>
          <IconButton 
            icon={isDarkMode && themeMode === 'system' ? "weather-night" : "white-balance-sunny"} 
            size={30} 
            iconColor={getSliderValue() === 1 ? theme.primary : theme.textSecondary} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.themeIconButton} 
          onPress={() => handleThemeChange(2)}>
          <IconButton 
            icon="weather-night" 
            size={30} 
            iconColor={getSliderValue() === 2 ? theme.primary : theme.textSecondary} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.customTrackContainer}>
        <View style={[styles.trackBackground, { backgroundColor: isDarkMode ? '#555' : '#E0E0E0' }]} />
        <View style={[styles.activeTrack, { 
          backgroundColor: theme.primary,
          left: getSliderValue() === 0 ? '0%' : getSliderValue() === 1 ? '33%' : '66%',
          width: '33%'
        }]} />
        {[0, 1, 2].map((position) => (
          <TouchableOpacity
            key={position}
            style={[
              styles.trackPosition,
              {
                backgroundColor: getSliderValue() === position ? theme.primary : isDarkMode ? '#777' : '#CCC',
                transform: [{ scale: getSliderValue() === position ? 1.2 : 0.8 }],
                borderWidth: getSliderValue() === position ? 3 : 0,
                borderColor: isDarkMode ? '#333' : '#FFF',
              }
            ]}
            onPress={() => handleThemeChange(position)}
          />
        ))}
      </View>
      
      <View style={styles.themeCurrentIndicator}>
        <Text style={{ color: theme.textSecondary, textAlign: 'center', marginTop: 8 }}>
          Currently using: <Text style={{ fontWeight: 'bold', color: theme.primary }}>
            {themeMode === 'system' 
              ? `System Default (${isDarkMode ? 'Dark' : 'Light'})`
              : themeMode === 'light' ? 'Light Mode' : 'Dark Mode'}
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  themeLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 4,
  },
  themeIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  themeIconButton: {
    padding: 8,
  },
  customTrackContainer: {
    height: 50,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 8,
  },
  trackBackground: {
    position: 'absolute',
    height: 10,
    left: 10,
    right: 10,
    borderRadius: 5,
  },
  activeTrack: {
    position: 'absolute',
    height: 10,
    borderRadius: 5,
    zIndex: 0,
  },
  trackPosition: {
    width: 30,
    height: 30,
    borderRadius: 15,
    zIndex: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  themeCurrentIndicator: {
    marginTop: 8,
    marginBottom: 4,
  },
});

export default ThemeSlider; 