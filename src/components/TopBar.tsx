import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Platform, 
  StatusBar,
} from 'react-native';
import { 
  IconButton, 
  Badge,
  Surface
} from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

type TopBarProps = {
  title: string;
  onMenuPress: () => void;
  onNotificationPress: () => void;
  notificationCount?: number;
  extraActions?: React.ReactNode; // Additional actions to be displayed in the header
};

const TopBar = ({ 
  title, 
  onMenuPress, 
  onNotificationPress, 
  notificationCount = 0,
  extraActions
}: TopBarProps) => {
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Surface style={[
      styles.appHeader,
      { 
        paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 24),
        paddingLeft: Math.max(insets.left + 16, 16),
        paddingRight: Math.max(insets.right + 16, 16),
        backgroundColor: isDarkMode 
          ? 'rgba(26, 26, 26, 0.8)' 
          : 'rgba(255, 255, 255, 0.7)',
        height: Platform.OS === 'ios' ? 60 + insets.top : 72 + insets.top,
        borderBottomColor: isDarkMode 
          ? 'rgba(67, 97, 238, 0.3)' 
          : 'rgba(255, 255, 255, 0.8)',
        borderBottomWidth: 1,
      }
    ]} elevation={isDarkMode ? 4 : 2}>
      {/* Gradient background for glass effect */}
      <LinearGradient
        colors={isDarkMode ? 
          ['rgba(67, 97, 238, 0.15)', 'rgba(26, 32, 44, 0.7)'] : 
          ['rgba(235, 244, 255, 0.5)', 'rgba(230, 255, 250, 0.7)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.appHeaderGradient}
      />
      
      {/* Decorative elements */}
      <View style={[
        styles.decorativeDot, 
        { 
          right: 20, 
          top: insets.top + 10, 
          backgroundColor: isDarkMode ? 'rgba(247, 37, 133, 0.15)' : 'rgba(255, 255, 255, 0.15)' 
        }
      ]} />

      <StatusBar 
        backgroundColor="transparent"
        translucent={true}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
      />
      
      <View style={styles.appHeaderContent}>
        <View style={styles.headerLeft}>
          <IconButton
            icon="menu"
            iconColor={isDarkMode ? theme.text : theme.text}
            size={24}
            onPress={onMenuPress}
            style={[
              styles.menuButton,
              { 
                backgroundColor: isDarkMode 
                  ? 'rgba(67, 97, 238, 0.15)' 
                  : 'rgba(30, 136, 229, 0.1)'
              }
            ]}
          />
          <Text style={[
            styles.appTitle, 
            { 
              color: theme.text,
              textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2 
            }
          ]}>
            {title}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          {extraActions}
          <View style={styles.notificationContainer}>
            <IconButton 
              icon="bell" 
              iconColor={isDarkMode ? theme.text : theme.text}
              size={24}
              onPress={onNotificationPress}
              style={[
                styles.iconButton,
                { 
                  backgroundColor: isDarkMode 
                    ? 'rgba(67, 97, 238, 0.15)' 
                    : 'rgba(30, 136, 229, 0.1)'
                }
              ]}
            />
            {notificationCount > 0 && (
              <Badge 
                visible={true} 
                size={18} 
                style={[
                  styles.notificationBadge,
                  { backgroundColor: isDarkMode ? '#F72585' : '#4361EE' }
                ]}
              >
                {notificationCount}
              </Badge>
            )}
          </View>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  appHeader: {
    justifyContent: 'flex-end',
    elevation: 2,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    zIndex: 1000,
    position: 'relative',
    overflow: 'hidden',
  },
  appHeaderGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.9,
  },
  decorativeDot: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    opacity: 0.7,
    zIndex: 0,
  },
  appHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    zIndex: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.3,
    marginLeft: 8,
  },
  menuButton: {
    margin: 0,
    borderRadius: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    margin: 0,
    borderRadius: 12,
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
});

export default TopBar; 