import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  Platform,
  Animated
} from 'react-native';
import { 
  Avatar, 
  Divider, 
  IconButton,
  List
} from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation, NavigationProp, CommonActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { RootStackParamList, MainTabParamList } from '../navigation/types';
import { navigateFromSidebar } from '../utils/navigation';

const { width, height } = Dimensions.get('window');

// Local image import
const profileImage = require('../../assets/pic.png');

type SidebarProps = {
  visible: boolean;
  onClose: () => void;
};

const SIDEBAR_WIDTH = width * 0.8;

const Sidebar = ({ visible, onClose }: SidebarProps) => {
  const { theme, isDarkMode, themeMode, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const translateX = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;
  const [isHidden, setIsHidden] = useState(!visible);

  React.useEffect(() => {
    if (visible) {
      setIsHidden(false);
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -SIDEBAR_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsHidden(true);
      });
    }
  }, [visible, translateX, opacity]);

  if (isHidden) {
    return null;
  }

  const handleNavigation = (screen: string, params?: any) => {
    onClose();
    navigateFromSidebar(navigation, screen, params);
  };

  // Function to get theme button text
  const getThemeSwitchText = () => {
    switch (themeMode) {
      case 'light': return 'Dark Mode';
      case 'dark': return 'System Default';
      case 'system': return 'Light Mode';
      default: return 'Toggle Theme';
    }
  };

  // Function to get theme button icon
  const getThemeSwitchIcon = () => {
    switch (themeMode) {
      case 'light': return 'weather-night';
      case 'dark': return 'cellphone';
      case 'system': return 'white-balance-sunny';
      default: return 'theme-light-dark';
    }
  };

  // Glassmorphism intensity based on theme
  const blurIntensity = isDarkMode ? 15 : 10;
  const glassOpacity = isDarkMode ? 0.5 : 0.7;

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      <Animated.View 
        style={[
          styles.backdrop, 
          { 
            opacity,
            backgroundColor: 'black'
          }
        ]}
        onTouchEnd={onClose}
      />

      {/* Sidebar with BlurView for glassmorphism */}
      <Animated.View 
        style={[
          styles.sidebar, 
          { 
            transform: [{ translateX }],
            width: SIDEBAR_WIDTH,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: 0,
          }
        ]}
      >
        <BlurView 
          intensity={blurIntensity} 
          tint={isDarkMode ? 'dark' : 'light'}
          style={[StyleSheet.absoluteFill, styles.blurView]}
        />
        
        <View style={[
          StyleSheet.absoluteFill, 
          styles.glassBg, 
          { 
            backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.7)' : 'rgba(255, 255, 255, 0.7)',
            borderRightWidth: 1,
            borderRightColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)',
          }
        ]} />

        {/* Header with gradient */}
        <View style={styles.header}>
          <LinearGradient
            colors={isDarkMode ? 
              ['rgba(67, 97, 238, 0.3)', 'rgba(45, 55, 72, 0.3)'] : 
              ['rgba(67, 97, 238, 0.2)', 'rgba(76, 201, 240, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerGradient}
          />
          <View style={styles.headerContent}>
            <Avatar.Image 
              size={70} 
              source={profileImage} 
              style={[styles.avatar, { borderColor: isDarkMode ? '#4361EE' : '#4361EE' }]}
            />
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: theme.text }]}>
                {user?.name || 'Officer Digital Destroyers'}
              </Text>
              <Text style={[styles.userRole, { color: theme.textSecondary }]}>
                {user?.role === 'admin' ? 'Senior Traffic Administrator' : 'Traffic Officer'}
              </Text>
              <TouchableOpacity 
                style={styles.viewProfileButton}
                onPress={() => console.log('Profile not implemented')}
              >
                <LinearGradient
                  colors={['#4361EE', '#4CC9F0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.profileButtonGradient}
                >
                  <Text style={styles.viewProfileText}>View Profile</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView 
          style={styles.menuContainer}
          showsVerticalScrollIndicator={false}
        >
          <List.Section>
            {/* Menu items */}
            <List.Item
              title="Dashboard"
              titleStyle={[styles.menuItemTitle, { color: theme.text }]}
              left={props => (
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(67, 97, 238, 0.1)' }]}>
                  <List.Icon {...props} icon="view-dashboard" color="#4361EE" style={styles.menuIcon} />
                </View>
              )}
              onPress={() => handleNavigation('Dashboard', { screen: 'DashboardHome' })}
              style={styles.menuItem}
            />
            <List.Item
              title="Traffic Management"
              titleStyle={[styles.menuItemTitle, { color: theme.text }]}
              left={props => (
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(72, 149, 239, 0.1)' }]}>
                  <List.Icon {...props} icon="traffic-light" color="#4895EF" style={styles.menuIcon} />
                </View>
              )}
              onPress={() => handleNavigation('Traffic')}
              style={styles.menuItem}
            />
            <List.Item
              title="Number Plate Scanner"
              titleStyle={[styles.menuItemTitle, { color: theme.text }]}
              left={props => (
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(58, 134, 255, 0.1)' }]}>
                  <List.Icon {...props} icon="camera-outline" color="#3A86FF" style={styles.menuIcon} />
                </View>
              )}
              onPress={() => handleNavigation('NumberPlate')}
              style={styles.menuItem}
            />
            <List.Item
              title="Document Verification"
              titleStyle={[styles.menuItemTitle, { color: theme.text }]}
              left={props => (
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(76, 201, 240, 0.1)' }]}>
                  <List.Icon {...props} icon="file-document-outline" color="#4CC9F0" style={styles.menuIcon} />
                </View>
              )}
              onPress={() => handleNavigation('Documents')}
              style={styles.menuItem}
            />
            <List.Item
              title="E-Challan"
              titleStyle={[styles.menuItemTitle, { color: theme.text }]}
              left={props => (
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(76, 201, 240, 0.1)' }]}>
                  <List.Icon {...props} icon="receipt" color="#4CC9F0" style={styles.menuIcon} />
                </View>
              )}
              onPress={() => handleNavigation('EChallan')}
              style={styles.menuItem}
            />
            <List.Item
              title="Demo"
              titleStyle={[styles.menuItemTitle, { color: theme.text }]}
              left={props => (
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 99, 71, 0.1)' }]}>
                  <List.Icon {...props} icon="test-tube" color="#FF6347" style={styles.menuIcon} />
                </View>
              )}
              onPress={() => {
                onClose();
                navigation.dispatch(
                  CommonActions.navigate({
                    name: 'DemoStack'
                  })
                );
              }}
              style={styles.menuItem}
            />
            <List.Item
              title="Vehicle Recovery"
              titleStyle={[styles.menuItemTitle, { color: theme.text }]}
              left={props => (
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(63, 55, 201, 0.1)' }]}>
                  <List.Icon {...props} icon="car-info" color="#3F37C9" style={styles.menuIcon} />
                </View>
              )}
              onPress={() => handleNavigation('VehicleRecoveryStack')}
              style={styles.menuItem}
            />
            <List.Item
              title="Reports"
              titleStyle={[styles.menuItemTitle, { color: theme.text }]}
              left={props => (
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(67, 97, 238, 0.1)' }]}>
                  <List.Icon {...props} icon="chart-bar" color="#4361EE" style={styles.menuIcon} />
                </View>
              )}
              onPress={() => handleNavigation('Reports', { type: 'daily' })}
              style={styles.menuItem}
            />
            <List.Item
              title="Notifications"
              titleStyle={[styles.menuItemTitle, { color: theme.text }]}
              left={props => (
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(247, 37, 133, 0.1)' }]}>
                  <List.Icon {...props} icon="bell" color="#F72585" style={styles.menuIcon} />
                </View>
              )}
              onPress={() => handleNavigation('Notifications')}
              style={styles.menuItem}
            />

            <Divider style={[styles.divider, { backgroundColor: isDarkMode ? 'rgba(45, 55, 72, 0.7)' : 'rgba(226, 232, 240, 0.7)' }]} />

            <List.Item
              title="Settings"
              titleStyle={[styles.menuItemTitle, { color: theme.text }]}
              left={props => (
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(94, 96, 206, 0.1)' }]}>
                  <List.Icon {...props} icon="cog" color="#5E60CE" style={styles.menuIcon} />
                </View>
              )}
              onPress={() => handleNavigation('SettingsStack')}
              style={styles.menuItem}
            />
            <List.Item
              title={getThemeSwitchText()}
              titleStyle={[styles.menuItemTitle, { color: theme.text }]}
              left={props => (
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(67, 97, 238, 0.1)' }]}>
                  <List.Icon {...props} icon={getThemeSwitchIcon()} color="#4361EE" style={styles.menuIcon} />
                </View>
              )}
              onPress={() => toggleTheme()}
              style={styles.menuItem}
            />
            <List.Item
              title="Help & Support"
              titleStyle={[styles.menuItemTitle, { color: theme.text }]}
              left={props => (
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(72, 149, 239, 0.1)' }]}>
                  <List.Icon {...props} icon="help-circle" color="#4895EF" style={styles.menuIcon} />
                </View>
              )}
              onPress={() => console.log('Help not implemented')}
              style={styles.menuItem}
            />

            <Divider style={[styles.divider, { backgroundColor: isDarkMode ? 'rgba(45, 55, 72, 0.7)' : 'rgba(226, 232, 240, 0.7)' }]} />

            <List.Item
              title="Sign Out"
              titleStyle={[styles.menuItemTitle, { color: '#FF3B30' }]}
              left={props => (
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 59, 48, 0.1)' }]}>
                  <List.Icon {...props} icon="logout" color="#FF3B30" style={styles.menuIcon} />
                </View>
              )}
              onPress={signOut}
              style={styles.menuItem}
            />
          </List.Section>
          
          <View style={styles.versionContainer}>
            <Text style={[styles.versionText, { color: theme.textSecondary }]}>
              STM Traffic Police v1.0.0
            </Text>
          </View>
        </ScrollView>

        <TouchableOpacity 
          style={[
            styles.closeButton, 
            { 
              backgroundColor: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
              borderWidth: 1,
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
            }
          ]}
          onPress={onClose}
        >
          <Ionicons name="close" size={24} color={theme.text} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    overflow: 'hidden',
  },
  blurView: {
    overflow: 'hidden',
  },
  glassBg: {
    overflow: 'hidden',
  },
  header: {
    position: 'relative',
    paddingBottom: 16,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 8,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  headerContent: {
    padding: 16,
  },
  avatar: {
    borderWidth: 3,
    marginBottom: 12,
    elevation: 10,
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  userInfo: {
    marginTop: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    marginBottom: 12,
  },
  viewProfileButton: {
    overflow: 'hidden',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  profileButtonGradient: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  viewProfileText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    paddingVertical: 10,
    marginVertical: 2,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: -8,
  },
  menuIcon: {
    margin: 0,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    marginVertical: 12,
    marginHorizontal: 16,
    height: 1,
  },
  versionContainer: {
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 12,
    opacity: 0.7,
  },
  closeButton: {
    position: 'absolute',
    top: 10 + (Platform.OS === 'ios' ? 40 : 0),
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default Sidebar; 