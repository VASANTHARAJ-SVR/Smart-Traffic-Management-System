import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MoreStackParamList } from '../../navigation/types';
import ThemeSlider from '../../components/ThemeSlider';
import { 
  Card, 
  Button, 
  Divider, 
  List, 
  Surface, 
  IconButton, 
  Avatar
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import ScreenWithSidebar from '../../components/ScreenWithSidebar';

type Props = NativeStackScreenProps<MoreStackParamList, 'MoreHome'>;
const { width } = Dimensions.get('window');

// Local image import
const profileImage = require('../../../assets/pic.jpeg');

// Mock data
const menuItems = [
  { id: '1', title: 'E-Challan', icon: 'receipt', screen: 'EChallan', description: 'Create and manage e-challans' },
  { id: '2', title: 'Vehicle Recovery', icon: 'car-wrench', screen: 'VehicleRecovery', description: 'Manage vehicle recovery operations' },
  { id: '3', title: 'Settings', icon: 'cog', screen: 'Settings', description: 'App settings and preferences' },
  { id: '4', title: 'Profile', icon: 'account', screen: 'Profile', description: 'View and edit your profile' },
  { id: '5', title: 'About', icon: 'information', screen: 'About', description: 'About the application' },
  { id: '6', title: 'Help', icon: 'help-circle', screen: 'Help', description: 'Get help and support' },
  { id: '7', title: 'Demo', icon: 'test-tube', screen: 'Demo', description: 'Demo screen for testing' },
];

const MoreHomeScreen = ({ navigation }: Props) => {
  const { theme, isDarkMode, themeMode, toggleTheme } = useTheme();

  return (
    <ScreenWithSidebar
      title="More Options"
      navigation={navigation}
      notificationCount={3}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeIn" duration={600}>
          <Surface style={[styles.profileCard, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={4}>
            <View style={styles.profileHeader}>
              <Avatar.Image 
                size={80} 
                source={profileImage} 
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.text }]}>Officer Akhil</Text>
                <Text style={[styles.profileBadge, { color: theme.textSecondary }]}>Badge #12345</Text>
                <Text style={[styles.profileDepartment, { color: theme.textSecondary }]}>Traffic Police Department</Text>
              </View>
            </View>
            <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
            <View style={styles.profileActions}>
              <Button 
                mode="outlined" 
                icon="account-edit" 
                style={[styles.profileButton, { borderColor: theme.primary }]} 
                labelStyle={{ color: theme.primary }}
                onPress={() => navigation.navigate('Profile')}
              >
                Edit Profile
              </Button>
            </View>
            <Text style={[styles.themeTitle, { color: theme.text }]}>App Theme</Text>
            <ThemeSlider containerStyle={{ paddingHorizontal: 0, paddingTop: 0 }} />
          </Surface>
        </Animatable.View>
        
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <Animatable.View 
              key={item.id} 
              animation="fadeInUp" 
              duration={500} 
              delay={index * 100}
            >
              <TouchableOpacity 
                style={[styles.menuItem, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]}
                onPress={() => navigation.navigate(item.screen as any)}
              >
                <View style={[styles.menuIconContainer, { backgroundColor: theme.primary + '20' }]}>
                  <IconButton 
                    icon={item.icon} 
                    size={24} 
                    iconColor={theme.primary}
                  />
                </View>
                <View style={styles.menuContent}>
                  <Text style={[styles.menuTitle, { color: theme.text }]}>{item.title}</Text>
                  <Text style={[styles.menuDescription, { color: theme.textSecondary }]}>{item.description}</Text>
                </View>
                <IconButton 
                  icon="chevron-right" 
                  size={24} 
                  iconColor={theme.textSecondary}
                />
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </View>
        
        <Animatable.View animation="fadeIn" duration={600} delay={600}>
          <Surface style={[styles.supportCard, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={4}>
            <Text style={[styles.supportTitle, { color: theme.text }]}>Need Help?</Text>
            <Text style={[styles.supportText, { color: theme.textSecondary }]}>
              Contact our support team for assistance with the application.
            </Text>
            <Button 
              mode="contained" 
              icon="headset" 
              style={[styles.supportButton, { backgroundColor: theme.primary }]} 
              labelStyle={{ color: theme.white }}
              onPress={() => navigation.navigate('Help')}
            >
              Contact Support
            </Button>
          </Surface>
        </Animatable.View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
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
  profileDepartment: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  menuContainer: {
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  menuIconContainer: {
    borderRadius: 8,
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 14,
  },
  supportCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  supportText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  supportButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  bottomPadding: {
    height: 20,
  },
});

export default MoreHomeScreen; 