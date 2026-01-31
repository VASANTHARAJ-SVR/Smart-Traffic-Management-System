import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface GlassmorphicCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  animation?: string;
  duration?: number;
  delay?: number;
  intensity?: 'low' | 'medium' | 'high';
  onPress?: () => void;
  gradientColors?: [string, string];
  decorativeDots?: boolean;
}

const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  style,
  animation = 'fadeIn',
  duration = 500,
  delay = 0,
  intensity = 'medium',
  onPress,
  gradientColors,
  decorativeDots = true,
}) => {
  const { theme, isDarkMode } = useTheme();
  
  // Calculate opacity based on intensity
  const getOpacity = () => {
    switch (intensity) {
      case 'low':
        return isDarkMode ? 0.1 : 0.05;
      case 'medium':
        return isDarkMode ? 0.2 : 0.1;
      case 'high':
        return isDarkMode ? 0.3 : 0.15;
      default:
        return isDarkMode ? 0.2 : 0.1;
    }
  };

  // Calculate blur effect
  const getBlurIntensity = () => {
    switch (intensity) {
      case 'low':
        return { shadowOpacity: 0.1, shadowRadius: 5, blurIntensity: 20 };
      case 'medium':
        return { shadowOpacity: 0.15, shadowRadius: 10, blurIntensity: 40 };
      case 'high':
        return { shadowOpacity: 0.2, shadowRadius: 15, blurIntensity: 60 };
      default:
        return { shadowOpacity: 0.15, shadowRadius: 10, blurIntensity: 40 };
    }
  };

  const blurIntensity = getBlurIntensity();

  // Default gradient colors if not provided
  const defaultGradientColors: [string, string] = isDarkMode 
    ? ['rgba(67, 97, 238, 0.15)', 'rgba(26, 32, 44, 0.5)']
    : ['rgba(235, 244, 255, 0.3)', 'rgba(230, 255, 250, 0.3)'];

  const cardContent = (
    <Animatable.View
      animation={animation}
      duration={duration}
      delay={delay}
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode 
            ? `rgba(30, 30, 30, ${getOpacity()})` 
            : `rgba(255, 255, 255, ${getOpacity()})`,
          borderColor: isDarkMode 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(255, 255, 255, 0.5)',
          shadowColor: theme.shadow,
          shadowOpacity: blurIntensity.shadowOpacity,
          shadowRadius: blurIntensity.shadowRadius,
        },
        style,
      ]}
    >
      {/* Gradient background */}
      <LinearGradient
        colors={gradientColors || defaultGradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      {/* Decorative elements */}
      {decorativeDots && (
        <>
          <View style={[
            styles.decorativeDot,
            {
              top: -20,
              right: -20,
              backgroundColor: isDarkMode ? 'rgba(67, 97, 238, 0.12)' : 'rgba(67, 97, 238, 0.05)',
            }
          ]} />
          <View style={[
            styles.decorativeDot,
            {
              bottom: -30,
              left: -30,
              backgroundColor: isDarkMode ? 'rgba(247, 37, 133, 0.12)' : 'rgba(247, 37, 133, 0.05)',
            }
          ]} />
        </>
      )}

      {/* Blur effect */}
      <BlurView
        intensity={blurIntensity.blurIntensity}
        tint={isDarkMode ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />

      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </Animatable.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.9,
  },
  decorativeDot: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    zIndex: 0,
  },
  content: {
    position: 'relative',
    zIndex: 2,
    flex: 1,
  },
});

export default GlassmorphicCard; 