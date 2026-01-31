import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ViewStyle, 
  TextStyle, 
  StyleProp,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';

interface FuturisticButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
  animation?: string;
  animationDuration?: number;
}

const FuturisticButton: React.FC<FuturisticButtonProps> = ({
  title,
  onPress,
  icon,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
  animation = 'pulse',
  animationDuration = 2000,
}) => {
  const { theme, isDarkMode } = useTheme();
  
  // Get button color based on variant
  const getButtonColor = () => {
    switch (variant) {
      case 'primary':
        return theme.primary;
      case 'secondary':
        return theme.secondary;
      case 'success':
        return theme.success;
      case 'danger':
        return theme.error;
      case 'warning':
        return theme.warning;
      case 'info':
        return theme.info;
      default:
        return theme.primary;
    }
  };
  
  // Get button size
  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
          fontSize: 12,
        };
      case 'medium':
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 10,
          fontSize: 14,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 12,
          fontSize: 16,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 10,
          fontSize: 14,
        };
    }
  };
  
  const buttonColor = getButtonColor();
  const buttonSize = getButtonSize();
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: disabled 
            ? theme.disabled 
            : buttonColor,
          paddingVertical: buttonSize.paddingVertical,
          paddingHorizontal: buttonSize.paddingHorizontal,
          borderRadius: buttonSize.borderRadius,
          width: fullWidth ? '100%' : 'auto',
          opacity: disabled ? 0.7 : 1,
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      <View style={styles.contentContainer}>
        {icon && !loading && (
          <Ionicons 
            name={icon as any} 
            size={buttonSize.fontSize + 4} 
            color={theme.white} 
            style={styles.icon} 
          />
        )}
        
        {loading ? (
          <Animatable.View
            animation="rotate"
            easing="linear"
            iterationCount="infinite"
            duration={1000}
          >
            <Ionicons 
              name="reload-outline" 
              size={buttonSize.fontSize + 4} 
              color={theme.white} 
            />
          </Animatable.View>
        ) : (
          <Animatable.Text
            animation={animation}
            iterationCount="infinite"
            duration={animationDuration}
            style={[
              styles.text,
              {
                fontSize: buttonSize.fontSize,
                color: theme.white,
              },
              textStyle,
            ]}
          >
            {title}
          </Animatable.Text>
        )}
      </View>
      
      {/* Glow effect */}
      <View 
        style={[
          styles.glow,
          {
            backgroundColor: buttonColor,
            borderRadius: buttonSize.borderRadius + 5,
            opacity: isDarkMode ? 0.3 : 0.2,
          }
        ]} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icon: {
    marginRight: 8,
  },
  glow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    zIndex: -1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
});

export default FuturisticButton; 