import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DashboardStackParamList } from '../../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWithSidebar from '../../components/ScreenWithSidebar';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Surface, IconButton } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import GlassmorphicCard from '../../components/GlassmorphicCard';

type Props = NativeStackScreenProps<DashboardStackParamList, 'DashboardHome'>;

const DashboardHomeScreenWeb = ({ navigation: stackNavigation }: Props) => {
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const insets = useSafeAreaInsets();

  const profileImage = require('../../../assets/pic.png');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return currentTime.toLocaleDateString(undefined, options);
  };

  const dashboardItems = [
    {
      title: 'Number Plate Detection',
      icon: 'car',
      color: '#4361EE',
      description: 'Scan and verify vehicle number plates',
      onPress: () => navigation.navigate('NumberPlate' as never),
    },
    {
      title: 'Traffic Management',
      icon: 'traffic-light',
      color: '#3A86FF',
      description: 'Monitor and manage traffic conditions',
      onPress: () => navigation.navigate('Traffic' as never),
    },
    {
      title: 'Document Verification',
      icon: 'file-document-outline',
      color: '#4895EF',
      description: 'Verify driver and vehicle documents',
      onPress: () => navigation.navigate('Documents' as never),
    },
    {
      title: 'E-Challan',
      icon: 'receipt',
      color: '#4CC9F0',
      description: 'Issue and manage traffic violation tickets',
      onPress: () => {},
    },
    {
      title: 'Vehicle Recovery',
      icon: 'car-info',
      color: '#7209B7',
      description: 'Track and recover stolen vehicles',
      onPress: () => {},
    },
    {
      title: 'Vehicle Search',
      icon: 'camera-outline',
      color: '#3F37C9',
      description: 'Search for vehicle details',
      onPress: () => navigation.navigate('NumberPlate' as never),
    },
    {
      title: 'Reports',
      icon: 'chart-bar',
      color: '#4361EE',
      description: 'View traffic and violation reports',
      onPress: () => {},
    },
    {
      title: 'Settings',
      icon: 'cog',
      color: '#5E60CE',
      description: 'Configure app preferences',
      onPress: () => {},
    },
  ];

  return (
    <ScreenWithSidebar 
      title="STM Traffic Police"
      navigation={stackNavigation}
      notificationCount={8}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <Animatable.View 
          animation="fadeIn"
          duration={800}
          style={[
            styles.profileCardContainer,
            { 
              marginLeft: Math.max(insets.left + 20, 20),
              marginRight: Math.max(insets.right + 20, 20)
            }
          ]}
        >
          <Surface 
            style={[
              styles.profileCard, 
              { 
                backgroundColor: isDarkMode 
                  ? 'rgba(26, 26, 26, 0.8)' 
                  : 'rgba(255, 255, 255, 0.7)',
                borderColor: isDarkMode 
                  ? 'rgba(67, 97, 238, 0.3)' 
                  : 'rgba(255, 255, 255, 0.8)'
              }
            ]} 
            elevation={4}
          >
            <LinearGradient
              colors={isDarkMode ? 
                ['rgba(67, 97, 238, 0.15)', 'rgba(26, 32, 44, 0.5)'] : 
                ['rgba(235, 244, 255, 0.3)', 'rgba(230, 255, 250, 0.3)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileGradient}
            />
            
            <View style={styles.profileContent}>
              <Avatar.Image 
                size={75} 
                source={profileImage} 
                style={[styles.profileAvatar, { 
                  borderColor: isDarkMode ? '#5A67D8' : '#4361EE',
                  borderWidth: 3,
                }]}
              />
              <View style={styles.profileInfo}>
                <Text style={[styles.greeting, { 
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.75)' : theme.textSecondary,
                  fontWeight: '500'
                }]}>
                  {getGreeting()}
                </Text>
                <Text style={[styles.userName, { 
                  color: theme.text,
                }]}>
                  Vasanth and team
                </Text>
                <Text style={[styles.userRole, { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : theme.textSecondary }]}>
                  {user?.role === 'admin' ? 'Senior Traffic Administrator' : 'Traffic Officer'}
                </Text>
              </View>
            </View>
            
            <View style={styles.profileFooter}>
              <Text style={[styles.date, { 
                color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : theme.textSecondary,
                fontWeight: '500'
              }]}>
                {formatDate()}
              </Text>
            </View>
          </Surface>
        </Animatable.View>

        {/* Dashboard Items Grid */}
        <View style={[styles.gridContainer, { 
          paddingLeft: Math.max(insets.left + 16, 16), 
          paddingRight: Math.max(insets.right + 16, 16) 
        }]}>
          <Text style={[styles.gridTitle, { 
            color: theme.text,
          }]}>
            Quick Access
          </Text>
          <View style={styles.grid}>
            {dashboardItems.map((item, index) => (
              <Animatable.View
                key={index}
                animation="fadeInUp"
                delay={index * 50}
                style={styles.gridItem}
              >
                <TouchableOpacity 
                  style={[styles.gridItemButton, { 
                    backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                    borderColor: item.color,
                  }]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[`${item.color}20`, `${item.color}10`]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gridItemGradient}
                  />
                  <Avatar.Icon 
                    size={40} 
                    icon={item.icon} 
                    color="#FFFFFF"
                    style={{ 
                      backgroundColor: item.color,
                      marginBottom: 8,
                    }}
                  />
                  <Text style={[styles.gridItemTitle, { color: theme.text }]}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  profileCardContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  profileCard: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 16,
  },
  profileGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 12,
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 12,
  },
  profileFooter: {
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(200, 200, 200, 0.2)',
  },
  date: {
    fontSize: 12,
  },
  gridContainer: {
    marginVertical: 16,
  },
  gridTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
  },
  gridItemButton: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  gridItemGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  gridItemTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default DashboardHomeScreenWeb;
