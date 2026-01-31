import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  StatusBar, 
  ViewStyle, 
  StyleProp 
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FuturisticHeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  style?: StyleProp<ViewStyle>;
  transparent?: boolean;
  animateTitle?: boolean;
}

const FuturisticHeader: React.FC<FuturisticHeaderProps> = ({
  title,
  subtitle,
  leftIcon = 'arrow-back',
  rightIcon,
  onLeftPress,
  onRightPress,
  style,
  transparent = false,
  animateTitle = false,
}) => {
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: transparent 
            ? 'transparent' 
            : isDarkMode 
              ? 'rgba(18, 18, 18, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)',
          paddingTop: insets.top,
          borderBottomColor: transparent 
            ? 'transparent' 
            : isDarkMode 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.1)',
        },
        style,
      ]}
    >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      <View style={styles.content}>
        {leftIcon && onLeftPress && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onLeftPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={leftIcon as any}
              size={24}
              color={theme.text}
            />
          </TouchableOpacity>
        )}
        
        <View style={styles.titleContainer}>
          {animateTitle ? (
            <Animatable.Text
              animation="fadeIn"
              duration={1000}
              style={[styles.title, { color: theme.text }]}
            >
              {title}
            </Animatable.Text>
          ) : (
            <Text style={[styles.title, { color: theme.text }]}>
              {title}
            </Text>
          )}
          
          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
        
        {rightIcon && onRightPress ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onRightPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={rightIcon as any}
              size={24}
              color={theme.text}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
      
      {/* Animated bottom border */}
      {!transparent && (
        <Animatable.View
          animation="pulse"
          iterationCount="infinite"
          duration={2000}
          style={[
            styles.animatedBorder,
            { backgroundColor: theme.primary }
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: 1,
    zIndex: 100,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  iconPlaceholder: {
    width: 40,
  },
  animatedBorder: {
    height: 2,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

export default FuturisticHeader; 