import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
  Appearance,
  ColorSchemeName,
  Image
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MoreStackParamList } from '../../navigation/types';
import { ThemeMode } from '../../types';
import ScreenWithSidebar from '../../components/ScreenWithSidebar';
import ThemeSlider from '../../components/ThemeSlider';
import { 
  List,
  Switch,
  Surface,
  Divider,
  IconButton,
  Avatar,
  Button,
  RadioButton,
  TextInput,
  Snackbar,
  SegmentedButtons
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock data for app version
const APP_VERSION = 'v1.0.0';
const BUILD_NUMBER = '234';

// Local image import
const profileImage = require('../../../assets/pic.jpeg');

type Props = NativeStackScreenProps<MoreStackParamList, 'Settings'>;
const { width } = Dimensions.get('window');

const SettingsScreen = ({ navigation }: Props) => {
  const { theme, isDarkMode, themeMode, setThemeMode, forceSystemTheme, systemIsDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );
  
  // Listen for system theme changes to update our display
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      console.log('SettingsScreen - System theme changed to:', colorScheme);
      setSystemColorScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);
  
  // State for settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [languageCode, setLanguageCode] = useState('en');
  const [fontSize, setFontSize] = useState('medium');
  const [syncFrequency, setSyncFrequency] = useState('15');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Mock languages list
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'kn', name: 'Kannada' },
  ];
  
  // Mock font sizes
  const fontSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ];
  
  const showDialog = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: 'OK' }]);
  };
  
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // In a real app, this would clear the auth state
            showSnackbar('You have been logged out');
            // navigation.navigate('Auth', { screen: 'Login' });
          }
        }
      ]
    );
  };
  
  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all locally cached data. Proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            // In a real app, this would clear cached data
            showSnackbar('Cache cleared successfully');
          }
        }
      ]
    );
  };
  
  // Convert theme mode to slider value
  const getSliderValue = () => {
    switch (themeMode) {
      case 'light': return 0;
      case 'system': return 1;
      case 'dark': return 2;
      default: return 1; // default to system
    }
  };
  
  // Convert slider value to theme mode
  const handleThemeChange = (value: number) => {
    const newThemeMode: ThemeMode = 
      value === 0 ? 'light' : 
      value === 1 ? 'system' : 'dark';
    setThemeMode(newThemeMode);
  };
  
  const isExpoGo = Platform.constants?.reactNativeVersion ? true : false;
  
  return (
    <ScreenWithSidebar
      title="Settings"
      navigation={navigation}
      notificationCount={5}
    >
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent, 
            { paddingBottom: insets.bottom + 20 }
          ]} 
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Section */}
          <Animatable.View 
            animation="fadeIn" 
            duration={500}
            style={styles.sectionContainer}
          >
            <Surface style={[styles.profileSection, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
              <View style={styles.profileContent}>
                <Avatar.Image 
                  size={80} 
                  source={profileImage} 
                  style={styles.profileAvatar}
                />
                <View style={styles.profileInfo}>
                  <Text style={[styles.profileName, { color: theme.text }]}>Officer Akhil</Text>
                  <Text style={[styles.profileBadge, { color: theme.textSecondary }]}>Badge #12345</Text>
                  <Text style={[styles.profileRole, { color: theme.textSecondary }]}>Traffic Police Department</Text>
                </View>
              </View>
              
              <View style={styles.profileActions}>
                <Button 
                  mode="outlined" 
                  icon="account-edit" 
                  onPress={() => navigation.navigate('Profile')}
                  style={styles.profileButton}
                >
                  Edit Profile
                </Button>
              </View>
            </Surface>
          </Animatable.View>
          
          {/* App Preferences Section */}
          <Animatable.View 
            animation="fadeIn" 
            duration={500}
            delay={100}
            style={styles.sectionContainer}
          >
            <Text style={[styles.sectionTitle, { color: theme.text }]}>App Preferences</Text>
            <Surface style={[styles.section, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
              <List.Item
                title="Theme Mode"
                description={`Currently using ${themeMode === 'system' ? `system default (${isDarkMode ? 'dark' : 'light'})` : themeMode} theme`}
                titleStyle={{ color: theme.text }}
                descriptionStyle={{ color: theme.textSecondary }}
                left={props => <List.Icon {...props} icon="theme-light-dark" color={theme.primary} />}
              />
              
              {/* System Theme Status */}
              <View style={styles.systemThemeStatus}>
                <Text style={{ color: theme.textSecondary, textAlign: 'center' }}>
                  System theme detected: <Text style={{ fontWeight: 'bold', color: theme.primary }}>
                    {systemColorScheme || (systemIsDark ? 'dark' : 'light')}
                  </Text>
                </Text>
                <Text style={{ color: theme.textSecondary, textAlign: 'center', fontSize: 12, marginTop: 4 }}>
                  (This is what React Native is detecting from your device)
                </Text>
              </View>
              
              {/* System Theme Override for Expo Go */}
              {!systemColorScheme && (
                <View style={styles.expoSystemOverride}>
                  <Text style={{ 
                    color: theme.textSecondary, 
                    textAlign: 'center', 
                    marginBottom: 10,
                    fontSize: 14,
                    fontWeight: 'bold'
                  }}>
                    System Theme Override
                  </Text>
                  <Text style={{ 
                    color: theme.textSecondary, 
                    textAlign: 'center', 
                    marginBottom: 10,
                    fontSize: 12
                  }}>
                    Set how your system theme should be detected in Expo Go
                  </Text>
                  <View style={styles.overrideButtons}>
                    <Button
                      mode={systemIsDark ? "text" : "contained"}
                      onPress={() => forceSystemTheme(false)}
                      style={[
                        styles.overrideButton,
                        { marginRight: 10 }
                      ]}
                    >
                      Force Light
                    </Button>
                    <Button
                      mode={systemIsDark ? "contained" : "text"}
                      onPress={() => forceSystemTheme(true)}
                      style={styles.overrideButton}
                    >
                      Force Dark
                    </Button>
                  </View>
                </View>
              )}
              
              <ThemeSlider containerStyle={{ paddingTop: 0 }} />
              <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
              
              <List.Accordion
                title="Language"
                description={languages.find(l => l.code === languageCode)?.name}
                titleStyle={{ color: theme.text }}
                descriptionStyle={{ color: theme.textSecondary }}
                left={props => <List.Icon {...props} icon="translate" color={theme.primary} />}
                style={{ backgroundColor: 'transparent' }}
              >
                <RadioButton.Group onValueChange={value => {
                  setLanguageCode(value);
                  showSnackbar('Language changed to ' + languages.find(l => l.code === value)?.name);
                }} value={languageCode}>
                  {languages.map(language => (
                    <RadioButton.Item
                      key={language.code}
                      label={language.name}
                      value={language.code}
                      labelStyle={{ color: theme.text }}
                      color={theme.primary}
                      uncheckedColor={theme.textSecondary}
                    />
                  ))}
                </RadioButton.Group>
              </List.Accordion>
              <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
              
              <List.Accordion
                title="Font Size"
                description={fontSizes.find(f => f.value === fontSize)?.label}
                titleStyle={{ color: theme.text }}
                descriptionStyle={{ color: theme.textSecondary }}
                left={props => <List.Icon {...props} icon="format-size" color={theme.primary} />}
                style={{ backgroundColor: 'transparent' }}
              >
                <RadioButton.Group onValueChange={value => {
                  setFontSize(value);
                  showSnackbar('Font size changed to ' + fontSizes.find(f => f.value === value)?.label);
                }} value={fontSize}>
                  {fontSizes.map(size => (
                    <RadioButton.Item
                      key={size.value}
                      label={size.label}
                      value={size.value}
                      labelStyle={{ color: theme.text }}
                      color={theme.primary}
                      uncheckedColor={theme.textSecondary}
                    />
                  ))}
                </RadioButton.Group>
              </List.Accordion>
            </Surface>
          </Animatable.View>
          
          {/* Notifications Section */}
          <Animatable.View 
            animation="fadeIn" 
            duration={500}
            delay={200}
            style={styles.sectionContainer}
          >
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
            <Surface style={[styles.section, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
              <List.Item
                title="Notifications"
                description="Enable push notifications"
                titleStyle={{ color: theme.text }}
                descriptionStyle={{ color: theme.textSecondary }}
                left={props => <List.Icon {...props} icon="bell" color={theme.primary} />}
                right={props => (
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    color={theme.primary}
                  />
                )}
              />
              <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
              
              <List.Item
                title="Sounds"
                description="Play sounds for notifications"
                titleStyle={{ color: notificationsEnabled ? theme.text : theme.textSecondary }}
                descriptionStyle={{ color: theme.textSecondary }}
                left={props => <List.Icon {...props} icon="volume-high" color={notificationsEnabled ? theme.primary : theme.textSecondary} />}
                right={props => (
                  <Switch
                    value={soundEnabled}
                    onValueChange={setSoundEnabled}
                    disabled={!notificationsEnabled}
                    color={theme.primary}
                  />
                )}
              />
              <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
              
              <List.Item
                title="Vibration"
                description="Vibrate on notifications"
                titleStyle={{ color: notificationsEnabled ? theme.text : theme.textSecondary }}
                descriptionStyle={{ color: theme.textSecondary }}
                left={props => <List.Icon {...props} icon="vibrate" color={notificationsEnabled ? theme.primary : theme.textSecondary} />}
                right={props => (
                  <Switch
                    value={vibrationEnabled}
                    onValueChange={setVibrationEnabled}
                    disabled={!notificationsEnabled}
                    color={theme.primary}
                  />
                )}
              />
            </Surface>
          </Animatable.View>
          
          {/* Security & Privacy Section */}
          <Animatable.View 
            animation="fadeIn" 
            duration={500}
            delay={300}
            style={styles.sectionContainer}
          >
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Security & Privacy</Text>
            <Surface style={[styles.section, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
              <List.Item
                title="Location Services"
                description="Allow app to access your location"
                titleStyle={{ color: theme.text }}
                descriptionStyle={{ color: theme.textSecondary }}
                left={props => <List.Icon {...props} icon="map-marker" color={theme.primary} />}
                right={props => (
                  <Switch
                    value={locationEnabled}
                    onValueChange={setLocationEnabled}
                    color={theme.primary}
                  />
                )}
              />
              <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
              
              <List.Item
                title="Biometric Authentication"
                description="Use fingerprint or face recognition"
                titleStyle={{ color: theme.text }}
                descriptionStyle={{ color: theme.textSecondary }}
                left={props => <List.Icon {...props} icon="fingerprint" color={theme.primary} />}
                right={props => (
                  <Switch
                    value={biometricEnabled}
                    onValueChange={setBiometricEnabled}
                    color={theme.primary}
                  />
                )}
              />
              <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
              
              <List.Item
                title="Change PIN"
                description="Update your security PIN"
                titleStyle={{ color: theme.text }}
                descriptionStyle={{ color: theme.textSecondary }}
                left={props => <List.Icon {...props} icon="lock" color={theme.primary} />}
                right={props => <List.Icon {...props} icon="chevron-right" color={theme.textSecondary} />}
                onPress={() => showDialog('Change PIN', 'PIN change functionality would be implemented here.')}
              />
              <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
              
              <List.Item
                title="Change Password"
                description="Update your account password"
                titleStyle={{ color: theme.text }}
                descriptionStyle={{ color: theme.textSecondary }}
                left={props => <List.Icon {...props} icon="form-textbox-password" color={theme.primary} />}
                right={props => <List.Icon {...props} icon="chevron-right" color={theme.textSecondary} />}
                onPress={() => showDialog('Change Password', 'Password change functionality would be implemented here.')}
              />
            </Surface>
          </Animatable.View>
          
          {/* Data & Sync Section */}
          <Animatable.View 
            animation="fadeIn" 
            duration={500}
            delay={400}
            style={styles.sectionContainer}
          >
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Data & Sync</Text>
            <Surface style={[styles.section, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
              <List.Item
                title="Auto Sync"
                description="Automatically sync data with server"
                titleStyle={{ color: theme.text }}
                descriptionStyle={{ color: theme.textSecondary }}
                left={props => <List.Icon {...props} icon="sync" color={theme.primary} />}
                right={props => (
                  <Switch
                    value={autoSyncEnabled}
                    onValueChange={setAutoSyncEnabled}
                    color={theme.primary}
                  />
                )}
              />
              <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
              
              <List.Item
                title="Sync Frequency"
                description="How often to sync data (in minutes)"
                titleStyle={{ color: autoSyncEnabled ? theme.text : theme.textSecondary }}
                descriptionStyle={{ color: theme.textSecondary }}
                left={props => <List.Icon {...props} icon="timer" color={autoSyncEnabled ? theme.primary : theme.textSecondary} />}
                right={props => (
                  <View style={styles.syncFrequencyContainer}>
                    <TextInput
                      value={syncFrequency}
                      onChangeText={setSyncFrequency}
                      keyboardType="number-pad"
                      disabled={!autoSyncEnabled}
                      style={[styles.syncFrequencyInput, { backgroundColor: 'transparent' }]}
                      theme={{ colors: { primary: theme.primary } }}
                      mode="outlined"
                    />
                  </View>
                )}
              />
              <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
              
              <List.Item
                title="Sync Now"
                description="Manually sync data with server"
                titleStyle={{ color: theme.text }}
                descriptionStyle={{ color: theme.textSecondary }}
                left={props => <List.Icon {...props} icon="cloud-sync" color={theme.primary} />}
                onPress={() => {
                  showSnackbar('Syncing data with server...');
                  // In a real app, this would trigger a sync operation
                }}
              />
              <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
              
              <List.Item
                title="Clear Cache"
                description="Delete temporary files"
                titleStyle={{ color: theme.text }}
                descriptionStyle={{ color: theme.textSecondary }}
                left={props => <List.Icon {...props} icon="broom" color={theme.primary} />}
                onPress={handleClearCache}
              />
            </Surface>
          </Animatable.View>
          
          {/* About & Support Section */}
          <Animatable.View 
            animation="fadeIn" 
            duration={500}
            delay={500}
            style={styles.sectionContainer}
          >
            <Text style={[styles.sectionTitle, { color: theme.text }]}>About & Support</Text>
            <Surface style={[styles.section, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
              <List.Item
                title="App Version"
                description={`${APP_VERSION} (${BUILD_NUMBER})`}
                titleStyle={{ color: theme.text }}
                descriptionStyle={{ color: theme.textSecondary }}
                left={props => <List.Icon {...props} icon="information" color={theme.primary} />}
              />
              <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
              
              <List.Item
                title="Terms of Service"
                description="View the terms of service"
                titleStyle={{ color: theme.text }}
                descriptionStyle={{ color: theme.textSecondary }}
                left={props => <List.Icon {...props} icon="file-document" color={theme.primary} />}
                right={props => <List.Icon {...props} icon="chevron-right" color={theme.textSecondary} />}
                onPress={() => showDialog('Terms of Service', 'Terms of service would be displayed here.')}
              />
              <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
              
              <List.Item
                title="Privacy Policy"
                description="View the privacy policy"
                titleStyle={{ color: theme.text }}
                descriptionStyle={{ color: theme.textSecondary }}
                left={props => <List.Icon {...props} icon="shield-account" color={theme.primary} />}
                right={props => <List.Icon {...props} icon="chevron-right" color={theme.textSecondary} />}
                onPress={() => showDialog('Privacy Policy', 'Privacy policy would be displayed here.')}
              />
              <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
              
              <List.Item
                title="Contact Support"
                description="Get help with the app"
                titleStyle={{ color: theme.text }}
                descriptionStyle={{ color: theme.textSecondary }}
                left={props => <List.Icon {...props} icon="headset" color={theme.primary} />}
                right={props => <List.Icon {...props} icon="chevron-right" color={theme.textSecondary} />}
                onPress={() => showDialog('Contact Support', 'Support contact options would be displayed here.')}
              />
            </Surface>
          </Animatable.View>
          
          {/* Logout Section */}
          <Animatable.View 
            animation="fadeIn" 
            duration={500}
            delay={600}
            style={styles.logoutContainer}
          >
            <Button 
              mode="outlined" 
              icon="logout" 
              onPress={handleLogout}
              style={[styles.logoutButton, { borderColor: theme.error }]}
              labelStyle={{ color: theme.error }}
            >
              Logout
            </Button>
          </Animatable.View>
        </ScrollView>
        
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={[styles.snackbar, { backgroundColor: isDarkMode ? '#2C2C2C' : '#323232' }]}
        >
          {snackbarMessage}
        </Snackbar>
      </View>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 4,
  },
  section: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
  },
  profileSection: {
    borderRadius: 12,
    padding: 16,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileBadge: {
    fontSize: 14,
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 14,
  },
  profileActions: {
    marginTop: 16,
  },
  profileButton: {
    borderRadius: 8,
  },
  syncFrequencyContainer: {
    width: 60,
    marginVertical: 8,
  },
  syncFrequencyInput: {
    height: 40,
    textAlign: 'center',
  },
  logoutContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  logoutButton: {
    borderRadius: 8,
    borderWidth: 1,
  },
  snackbar: {
    bottom: 16,
  },
  systemThemeStatus: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderRadius: 8,
    marginVertical: 8,
  },
  expoSystemOverride: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    marginHorizontal: 16,
  },
  overrideButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  overrideButton: {
    flex: 1,
  },
});

export default SettingsScreen; 