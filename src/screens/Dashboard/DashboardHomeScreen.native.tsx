import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Avatar, 
  Button, 
  Badge, 
  Divider,
  IconButton,
  Surface,
  Chip,
} from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DashboardStackParamList, MoreStackParamList } from '../../navigation/types';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, MainTabParamList } from '../../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWithSidebar from '../../components/ScreenWithSidebar';
import { 
  navigateToNotifications, 
  navigateToReports, 
  navigateToEChallan, 
  navigateToVehicleRecovery, 
  navigateToSettings 
} from '../../utils/navigation';
import GlassmorphicCard from '../../components/GlassmorphicCard';
import { getTrafficData, TAMBARAM_COORDINATES } from '../../services/mapService';
import type { TrafficData } from '../../services/mapService';
import { MaterialIcons } from '@expo/vector-icons';

// Load map components (native only)
const maps = require('react-native-maps');
let MapView: any = maps.default || maps;
let PROVIDER_GOOGLE: any = maps.PROVIDER_GOOGLE;
let Heatmap: any = maps.Heatmap;
let Marker: any = maps.Marker;

type DashboardScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<DashboardStackParamList, 'DashboardHome'>,
  CompositeNavigationProp<
    StackNavigationProp<MainTabParamList>,
    StackNavigationProp<RootStackParamList>
  >
>;

type Props = NativeStackScreenProps<DashboardStackParamList, 'DashboardHome'>;

const { width } = Dimensions.get('window');

// Local image import
const profileImage = require('../../../assets/pic.png');

const DashboardHomeScreen = ({ navigation: stackNavigation }: Props) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeIncidents, setActiveIncidents] = useState(5);
  const [pendingTasks, setPendingTasks] = useState(3);
  const insets = useSafeAreaInsets();
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const mapRef = useRef<any>(null);

  // Mock weather data
  const [weatherData] = useState({
    temperature: 32,
    condition: 'Sunny',
    icon: 'weather-sunny',
    humidity: 65,
    windSpeed: '12 km/h'
  });

  // Live alerts data - would come from an API in a real application
  const liveAlerts = [
    { 
      id: 1, 
      type: 'Accident', 
      location: 'MG Road', 
      time: '5 min ago', 
      severity: 'high',
      icon: 'car-emergency'
    },
    { 
      id: 2, 
      type: 'Traffic Jam', 
      location: 'Silk Board', 
      time: '12 min ago', 
      severity: 'medium',
      icon: 'traffic-cone'
    },
    { 
      id: 3, 
      type: 'Road Closure', 
      location: 'Indiranagar', 
      time: '30 min ago', 
      severity: 'medium',
      icon: 'block-helper'
    },
    { 
      id: 4, 
      type: 'VIP Movement', 
      location: 'Vidhana Soudha', 
      time: '45 min ago', 
      severity: 'low',
      icon: 'shield-crown'
    },
  ];
  
  // Heat map data - representing traffic density points for Tambaram junction
  const heatmapPoints = [
    { latitude: 12.9249, longitude: 80.1275, weight: 90 }, // Tambaram Junction center - heavy traffic
    { latitude: 12.9259, longitude: 80.1285, weight: 85 }, // Northeast of junction
    { latitude: 12.9239, longitude: 80.1285, weight: 80 }, // Southeast of junction
    { latitude: 12.9239, longitude: 80.1265, weight: 75 }, // Southwest of junction 
    { latitude: 12.9259, longitude: 80.1265, weight: 85 }, // Northwest of junction
    { latitude: 12.9269, longitude: 80.1275, weight: 70 }, // North of junction
    { latitude: 12.9249, longitude: 80.1295, weight: 65 }, // East of junction
    { latitude: 12.9229, longitude: 80.1275, weight: 60 }, // South of junction
    { latitude: 12.9249, longitude: 80.1255, weight: 55 }, // West of junction
  ];
  
  // Traffic control items
  const trafficControls = [
    {
      title: 'Signal Controls',
      icon: 'traffic-light',
      color: '#4361EE',
      onPress: () => {}
    },
    {
      title: 'Camera Feeds',
      icon: 'cctv',
      color: '#3A86FF',
      onPress: () => {}
    },
    {
      title: 'Road Blocks',
      icon: 'block-helper',
      color: '#F72585',
      onPress: () => {}
    },
    {
      title: 'Diversion Plan',
      icon: 'directions-fork',
      color: '#7209B7',
      onPress: () => {}
    },
  ];
  
  // Dark map style for Google Maps
  const darkMapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#181818"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1b1b1b"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#2c2c2c"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8a8a8a"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#373737"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3c3c3c"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#4e4e4e"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3d3d3d"
        }
      ]
    }
  ];

  // Light map style for Google Maps
  const lightMapStyle: any[] = [];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Initial traffic data fetch
    const fetchTrafficData = async () => {
      try {
        await getTrafficData();
      } catch (error) {
        console.error('Error fetching initial traffic data:', error);
      }
    };
    fetchTrafficData();

    // Set up interval for real-time updates (every 30 seconds)
    const interval = setInterval(() => {
      getTrafficData();
    }, 30000);

    return () => clearInterval(interval);
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
      onPress: () => navigation.navigate('NumberPlate'),
      badge: 0,
    },
    {
      title: 'Traffic Management',
      icon: 'traffic-light',
      color: '#3A86FF',
      description: 'Monitor and manage traffic conditions',
      onPress: () => navigation.navigate('Traffic'),
      badge: 2,
    },
    {
      title: 'Document Verification',
      icon: 'file-document-outline',
      color: '#4895EF',
      description: 'Verify driver and vehicle documents',
      onPress: () => navigation.navigate('Documents'),
      badge: 0,
    },
    {
      title: 'E-Challan',
      icon: 'receipt',
      color: '#4CC9F0',
      description: 'Issue and manage traffic violation tickets',
      onPress: () => navigateToEChallan(navigation),
      badge: 3,
    },
    {
      title: 'Vehicle Recovery',
      icon: 'car-info',
      color: '#7209B7',
      description: 'Track and recover stolen vehicles',
      onPress: () => navigateToVehicleRecovery(navigation),
      badge: 1,
    },
    {
      title: 'Vehicle Search',
      icon: 'camera-outline',
      color: '#3F37C9',
      description: 'Search for vehicle details',
      onPress: () => navigation.navigate('NumberPlate'),
      badge: 0,
    },
    {
      title: 'Reports',
      icon: 'chart-bar',
      color: '#4361EE',
      description: 'View traffic and violation reports',
      onPress: () => navigateToReports(stackNavigation),
      badge: 0,
    },
    {
      title: 'Settings',
      icon: 'cog',
      color: '#5E60CE',
      description: 'Configure app preferences',
      onPress: () => navigateToSettings(navigation),
      badge: 0,
    },
  ];

  // Mock data for quick stats
  const quickStats = [
    { title: 'Violations Today', value: 23, icon: 'alert-circle', color: '#4361EE' },
    { title: 'Vehicles Scanned', value: 156, icon: 'car-connected', color: '#3A86FF' },
    { title: 'Fines Collected', value: '₹12,500', icon: 'cash', color: '#4895EF' },
    { title: 'Traffic Alerts', value: 7, icon: 'bell-ring', color: '#4CC9F0' },
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
        {/* Profile Card with Glassmorphism */}
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
            {/* Gradient background for the glass effect */}
            <LinearGradient
              colors={isDarkMode ? 
                ['rgba(67, 97, 238, 0.15)', 'rgba(26, 32, 44, 0.5)'] : 
                ['rgba(235, 244, 255, 0.3)', 'rgba(230, 255, 250, 0.3)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileGradient}
            />
            
            {/* Decorative elements for the glass effect */}
            <View style={[
              styles.glassDot, 
              { 
                top: 15, 
                right: 15,
                backgroundColor: isDarkMode ? 'rgba(247, 37, 133, 0.15)' : 'rgba(255, 255, 255, 0.15)' 
              }
            ]} />
            <View style={[
              styles.glassHighlight, 
              { 
                top: -20, 
                left: -20, 
                backgroundColor: isDarkMode ? 'rgba(67, 97, 238, 0.12)' : 'rgba(255, 255, 255, 0.08)' 
              }
            ]} />
            <View style={[
              styles.glassHighlight, 
              { 
                bottom: -30, 
                right: -30, 
                backgroundColor: isDarkMode ? 'rgba(67, 97, 238, 0.08)' : 'rgba(255, 255, 255, 0.08)' 
              }
            ]} />
            
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
                  textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 1
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
              
              <View style={styles.weatherContainer}>
                <Avatar.Icon 
                  size={28} 
                  icon={weatherData.icon} 
                  color={isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#4361EE'} 
                  style={[styles.weatherIcon, { 
                    backgroundColor: 'transparent',
                  }]}
                />
                <View style={styles.weatherInfo}>
                  <Text style={[styles.weatherTemp, { 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : theme.text,
                    textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    textShadowOffset: { width: 0.5, height: 0.5 },
                    textShadowRadius: 1
                  }]}>
                    {weatherData.temperature}°C
                  </Text>
                  <Text style={[styles.weatherCondition, { 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : theme.textSecondary 
                  }]}>
                    {weatherData.condition}
                  </Text>
                </View>
              </View>
            </View>
          </Surface>
        </Animatable.View>

        {/* Live Alerts Section */}
        <View style={[styles.sectionHeader, { 
          paddingLeft: Math.max(insets.left + 20, 20), 
          paddingRight: Math.max(insets.right + 20, 20),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 8,
        }]}>
          <Text style={[styles.sectionTitle, { 
            color: theme.text,
            textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 1
          }]}>
            Live Alerts
          </Text>
          <View style={styles.alertCountContainer}>
            <Text style={[styles.alertCount, { color: theme.textSecondary }]}>
              {liveAlerts.length} Alerts
            </Text>
            <IconButton
              icon="bell"
              size={20}
              iconColor={theme.textSecondary}
              onPress={() => navigation.navigate('Notifications')}
            />
          </View>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.alertsScrollContainer, { 
            paddingLeft: Math.max(insets.left + 16, 16), 
            paddingRight: Math.max(insets.right + 16, 16) 
          }]}
        >
          {liveAlerts.map((alert, index) => (
            <Animatable.View 
              key={index}
              animation="fadeInUp"
              delay={index * 100}
              style={styles.alertCardWrapper}
            >
              <GlassmorphicCard
                style={styles.alertCard}
                intensity="high"
                animation="fadeInUp"
                delay={index * 100}
                gradientColors={isDarkMode 
                  ? [
                      alert.severity === 'high' ? 'rgba(247, 37, 133, 0.2)' :
                      alert.severity === 'medium' ? 'rgba(239, 128, 47, 0.2)' :
                      'rgba(67, 97, 238, 0.2)',
                      'rgba(26, 32, 44, 0.6)'
                    ]
                  : [
                      alert.severity === 'high' ? 'rgba(247, 37, 133, 0.1)' :
                      alert.severity === 'medium' ? 'rgba(239, 128, 47, 0.1)' :
                      'rgba(67, 97, 238, 0.1)',
                      'rgba(255, 255, 255, 0.4)'
                    ]}
              >
                {/* Alert content */}
                <View style={[
                  styles.alertIndicator,
                  { backgroundColor: alert.severity === 'high' ? '#FF0000' : 
                    alert.severity === 'medium' ? '#EF802F' : '#4361EE' }
                ]} />
                <View style={styles.alertContent}>
                  <Avatar.Icon 
                    size={38} 
                    icon={alert.icon} 
                    color="#FFFFFF"
                    style={{ 
                      backgroundColor: 
                        alert.severity === 'high' ? '#FF0000' : 
                        alert.severity === 'medium' ? '#EF802F' : 
                        '#4361EE',
                      marginRight: 12,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 2,
                    }}
                  />
                  <View style={styles.alertTextContent}>
                    <Text style={[styles.alertType, { 
                      color: theme.text,
                      fontWeight: '600',
                      textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                      textShadowOffset: { width: 0.5, height: 0.5 },
                      textShadowRadius: 0.5
                    }]}>
                      {alert.type}
                    </Text>
                    <Text style={[styles.alertLocation, { 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : theme.textSecondary 
                    }]}>
                      {alert.location}
                    </Text>
                    <Text style={[styles.alertTime, { 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : theme.textSecondary 
                    }]}>
                      {alert.time}
                    </Text>
                  </View>
                </View>
              </GlassmorphicCard>
            </Animatable.View>
          ))}
          <Animatable.View animation="fadeIn" delay={400} style={styles.viewMoreAlertWrapper}>
            <TouchableOpacity 
              style={[styles.viewMoreAlert, {
                backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.5)' : 'rgba(255, 255, 255, 0.4)',
                borderColor: isDarkMode ? 'rgba(67, 97, 238, 0.3)' : 'rgba(67, 97, 238, 0.2)',
                borderWidth: 1,
                borderRadius: 16,
                borderStyle: 'dashed'
              }]} 
              onPress={() => {}}
            >
              <IconButton icon="arrow-right" size={24} iconColor={isDarkMode ? '#4361EE' : '#4361EE'} />
              <Text style={{ color: isDarkMode ? '#4361EE' : '#4361EE', fontWeight: '500' }}>View All</Text>
            </TouchableOpacity>
          </Animatable.View>
        </ScrollView>
        
        {/* Traffic Map Section */}
        <View style={[styles.mapSectionHeader, { 
          paddingLeft: Math.max(insets.left + 20, 20), 
          paddingRight: Math.max(insets.right + 20, 20) 
        }]}>
          <Text style={[styles.sectionTitle, { 
            color: theme.text,
            textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 1
          }]}>
            Traffic Heatmap
          </Text>
          <IconButton
            icon="arrow-expand"
            size={24}
            iconColor={theme.primary}
            onPress={() => {}}
            style={{ margin: -4 }}
          />
        </View>
        
        <Animatable.View 
          animation="fadeIn"
          duration={800}
          style={[
            styles.mapContainer,
            { 
              marginLeft: Math.max(insets.left + 20, 20),
              marginRight: Math.max(insets.right + 20, 20)
            }
          ]}
        >
          <Surface style={[styles.mapCard, { 
            backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.7)',
            borderColor: isDarkMode ? 'rgba(67, 97, 238, 0.3)' : 'rgba(255, 255, 255, 0.8)',
            borderWidth: 1,
          }]} elevation={4}>
            {/* Glass effect for map card */}
            <LinearGradient
              colors={isDarkMode ? 
                ['rgba(67, 97, 238, 0.15)', 'rgba(26, 32, 44, 0.5)'] : 
                ['rgba(235, 244, 255, 0.3)', 'rgba(230, 255, 250, 0.3)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mapGradient}
            />
            
            {/* Decorative elements */}
            <View style={[
              styles.mapDecorativeDot, 
              { 
                top: -20, 
                right: -20,
                backgroundColor: isDarkMode ? 'rgba(67, 97, 238, 0.12)' : 'rgba(67, 97, 238, 0.05)' 
              }
            ]} />
            <View style={[
              styles.mapDecorativeDot, 
              { 
                bottom: -30, 
                left: -30,
                backgroundColor: isDarkMode ? 'rgba(58, 134, 255, 0.12)' : 'rgba(58, 134, 255, 0.05)' 
              }
            ]} />
            
            {Platform.OS !== 'web' && MapView ? (
              <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                showsMyLocationButton
                showsTraffic={true}
                showsBuildings
                showsIndoors
                showsPointsOfInterest
                showsCompass
                showsScale
                initialRegion={{
                  latitude: TAMBARAM_COORDINATES.latitude,
                  longitude: TAMBARAM_COORDINATES.longitude,
                  latitudeDelta: TAMBARAM_COORDINATES.latitudeDelta,
                  longitudeDelta: TAMBARAM_COORDINATES.longitudeDelta,
                }}
                customMapStyle={isDarkMode ? darkMapStyle : lightMapStyle}
                onMapReady={() => {
                  console.log('Map is ready');
                  getTrafficData();
                }}
                onRegionChangeComplete={(region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number }) => {
                  console.log('Region changed:', region);
                }}
              >
                {/* Traffic markers */}
                <Marker
                  coordinate={{
                    latitude: TAMBARAM_COORDINATES.latitude + 0.0005,
                    longitude: TAMBARAM_COORDINATES.longitude + 0.0005,
                  }}
                  title="Traffic Congestion"
                  description="Heavy traffic reported"
                  pinColor="#FF3B30"
                >
                  <View style={styles.markerContainer}>
                    <MaterialIcons name="traffic" size={24} color="#FF3B30" />
                  </View>
                </Marker>

                <Marker
                  coordinate={{
                    latitude: TAMBARAM_COORDINATES.latitude - 0.0005,
                    longitude: TAMBARAM_COORDINATES.longitude - 0.0005,
                  }}
                  title="Road Work"
                  description="Road construction in progress"
                  pinColor="#FF9500"
                >
                  <View style={styles.markerContainer}>
                    <MaterialIcons name="construction" size={24} color="#FF9500" />
                  </View>
                </Marker>
              </MapView>
            ) : (
              <View style={[styles.map, { justifyContent: 'center', alignItems: 'center', backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.5)' : 'rgba(240, 240, 240, 0.5)' }]}>
                <Text style={{ color: theme.textSecondary, fontWeight: '500' }}>Interactive maps available on mobile app</Text>
              </View>
            )}
            <View style={styles.mapControls}>
              <Chip
                mode="outlined"
                selected={true}
                selectedColor="#4361EE"
                style={{ 
                  marginRight: 8, 
                  backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1,
                }}
                textStyle={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                onPress={() => {}}
              >
                Traffic
              </Chip>
              <Chip
                mode="outlined"
                selected={false}
                style={{ 
                  marginRight: 8, 
                  backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1,
                }}
                textStyle={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                onPress={() => {}}
              >
                Incidents
              </Chip>
              <Chip
                mode="outlined"
                selected={false}
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1,
                }}
                textStyle={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                onPress={() => {}}
              >
                Patrols
              </Chip>
            </View>
          </Surface>
        </Animatable.View>
        
        {/* Traffic Controls Section */}
        <View style={[styles.sectionHeader, { 
          paddingLeft: Math.max(insets.left + 20, 20), 
          paddingRight: Math.max(insets.right + 20, 20) 
        }]}>
          <Text style={[styles.sectionTitle, { 
            color: theme.text,
            textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 1
          }]}>
            Traffic Controls
          </Text>
        </View>
        
        <View style={[styles.trafficControlsContainer, { 
          paddingLeft: Math.max(insets.left + 20, 20), 
          paddingRight: Math.max(insets.right + 20, 20) 
        }]}>
          {trafficControls.map((control, index) => (
            <Animatable.View 
              key={index}
              animation="fadeInUp"
              delay={index * 100}
              style={styles.controlButtonWrapper}
            >
              <TouchableOpacity 
                style={[styles.controlButton, { 
                  backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.7)',
                  borderColor: isDarkMode ? `rgba(${parseInt(control.color.slice(1, 3), 16)}, ${parseInt(control.color.slice(3, 5), 16)}, ${parseInt(control.color.slice(5, 7), 16)}, 0.3)` : 'rgba(255, 255, 255, 0.8)',
                  borderWidth: 1,
                }]}
                onPress={control.onPress}
                activeOpacity={0.7}
              >
                {/* Glass effect for control buttons */}
                <LinearGradient
                  colors={isDarkMode ? 
                    [`rgba(${parseInt(control.color.slice(1, 3), 16)}, ${parseInt(control.color.slice(3, 5), 16)}, ${parseInt(control.color.slice(5, 7), 16)}, 0.15)`, 
                     'rgba(26, 32, 44, 0.5)'] : 
                    [`rgba(${parseInt(control.color.slice(1, 3), 16)}, ${parseInt(control.color.slice(3, 5), 16)}, ${parseInt(control.color.slice(5, 7), 16)}, 0.05)`, 
                     'rgba(255, 255, 255, 0.5)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.controlButtonGradient}
                />
                
                {/* Decorative dot */}
                <View style={[
                  styles.controlDecorativeDot, 
                  { 
                    backgroundColor: `rgba(${parseInt(control.color.slice(1, 3), 16)}, ${parseInt(control.color.slice(3, 5), 16)}, ${parseInt(control.color.slice(5, 7), 16)}, 0.15)` 
                  }
                ]} />
                
                <Avatar.Icon 
                  size={50} 
                  icon={control.icon} 
                  color="#FFFFFF"
                  style={{ 
                    backgroundColor: control.color,
                    marginBottom: 12,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                    elevation: 4,
                    zIndex: 1,
                  }}
                />
                <Text style={[styles.controlButtonText, { 
                  color: theme.text,
                  textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                  textShadowOffset: { width: 0.5, height: 0.5 },
                  textShadowRadius: 0.5,
                  zIndex: 1,
                }]}>{control.title}</Text>
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </View>

        {/* Status Cards with Glassmorphism */}
        <View style={[styles.statusCardsContainer, { paddingLeft: Math.max(insets.left + 16, 16), paddingRight: Math.max(insets.right + 16, 16) }]}>
          <Animatable.View 
            animation="fadeInLeft"
            duration={800}
            style={styles.statusCardWrapper}
          >
            <Surface style={[styles.statusCard, { 
              backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.7)',
              borderColor: isDarkMode ? 'rgba(67, 97, 238, 0.3)' : 'rgba(255, 255, 255, 0.8)',
              borderWidth: 1,
            }]} elevation={3}>
              {/* Gradient background for glass effect */}
              <LinearGradient
                colors={isDarkMode ? 
                  ['rgba(67, 97, 238, 0.15)', 'rgba(67, 97, 238, 0.05)'] : 
                  ['rgba(67, 97, 238, 0.05)', 'rgba(67, 97, 238, 0.02)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.statusGradient, { borderLeftColor: '#4361EE' }]}
              />
              
              <View style={[styles.statusIndicator, { backgroundColor: '#4361EE' }]} />
              <View style={styles.statusContent}>
                <Text style={[styles.statusValue, { 
                  color: theme.text,
                  textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 1
                }]}>{activeIncidents}</Text>
                <Text 
                  style={[styles.statusLabel, { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : theme.textSecondary }]}
                  numberOfLines={1}
                >
                  Active Incidents
                </Text>
              </View>
              <Avatar.Icon 
                size={40} 
                icon="alert-circle" 
                color="#FFFFFF"
                style={{ 
                  backgroundColor: '#4361EE',
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  marginRight: 5,
                  zIndex: 1,
                }}
              />
            </Surface>
          </Animatable.View>
          
          <Animatable.View 
            animation="fadeInRight"
            duration={800}
            style={styles.statusCardWrapper}
          >
            <Surface style={[styles.statusCard, { 
              backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.7)',
              borderColor: isDarkMode ? 'rgba(67, 97, 238, 0.3)' : 'rgba(255, 255, 255, 0.8)',
              borderWidth: 1,
            }]} elevation={3}>
              {/* Gradient background for glass effect */}
              <LinearGradient
                colors={isDarkMode ? 
                  ['rgba(58, 134, 255, 0.1)', 'rgba(58, 134, 255, 0.05)'] : 
                  ['rgba(58, 134, 255, 0.05)', 'rgba(58, 134, 255, 0.02)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.statusGradient, { borderLeftColor: '#3A86FF' }]}
              />
            
              <View style={[styles.statusIndicator, { backgroundColor: '#3A86FF' }]} />
              <View style={styles.statusContent}>
                <Text style={[styles.statusValue, { 
                  color: theme.text,
                  textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 1
                }]}>{pendingTasks}</Text>
                <Text style={[styles.statusLabel, { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : theme.textSecondary }]}>Pending Tasks</Text>
              </View>
              <Avatar.Icon 
                size={40} 
                icon="clipboard-list" 
                color="#FFFFFF"
                style={{ 
                  backgroundColor: '#3A86FF',
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                }}
              />
            </Surface>
          </Animatable.View>
        </View>

        {/* Quick Stats Title */}
        <View style={[styles.sectionHeader, { 
          paddingLeft: Math.max(insets.left + 20, 20), 
          paddingRight: Math.max(insets.right + 20, 20) 
        }]}>
          <Text style={[styles.sectionTitle, { 
            color: theme.text,
            textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 1
          }]}>
            Today's Overview
          </Text>
        </View>
        
        {/* Quick Stats with Glassmorphism */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.statsScrollContainer, { 
            paddingLeft: Math.max(insets.left + 16, 16), 
            paddingRight: Math.max(insets.right + 16, 16) 
          }]}
        >
          {quickStats.map((stat, index) => (
            <Animatable.View 
              key={index}
              animation="fadeInUp"
              delay={index * 100}
              style={styles.statCardWrapper}
            >
              <GlassmorphicCard
                style={styles.statCard}
                intensity="medium"
                animation="fadeInUp"
                delay={index * 100}
                gradientColors={isDarkMode 
                  ? [
                      `rgba(${parseInt(stat.color.slice(1, 3), 16)}, ${parseInt(stat.color.slice(3, 5), 16)}, ${parseInt(stat.color.slice(5, 7), 16)}, 0.2)`,
                      'rgba(26, 32, 44, 0.6)'
                    ]
                  : [
                      `rgba(${parseInt(stat.color.slice(1, 3), 16)}, ${parseInt(stat.color.slice(3, 5), 16)}, ${parseInt(stat.color.slice(5, 7), 16)}, 0.1)`,
                      'rgba(255, 255, 255, 0.4)'
                    ]}
              >
                {/* Stat content */}
                <View style={styles.statContent}>
                  <Text style={[styles.statValue, { color: theme.text }]}>
                    {stat.value}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                    {stat.title}
                  </Text>
                </View>
              </GlassmorphicCard>
            </Animatable.View>
          ))}
        </ScrollView>

        {/* Quick Actions Title */}
        <View style={[styles.sectionHeader, { 
          paddingLeft: Math.max(insets.left + 20, 20), 
          paddingRight: Math.max(insets.right + 20, 20) 
        }]}>
          <Text style={[styles.sectionTitle, { 
            color: theme.text,
            textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 1
          }]}>
            Quick Actions
          </Text>
        </View>

        <View style={[styles.cardGrid, { 
          paddingLeft: Math.max(insets.left + 20, 20), 
          paddingRight: Math.max(insets.right + 20, 20) 
        }]}>
          {dashboardItems.map((item, index) => (
            <Animatable.View 
              key={index}
              animation="fadeInUp"
              delay={index * 50}
              style={styles.cardContainer}
            >
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={item.onPress}
                style={styles.cardTouchable}
              >
                <Surface style={[styles.card, { 
                  backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : theme.white,
                  shadowColor: isDarkMode ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
                  borderColor: isDarkMode ? `rgba(${parseInt(item.color.slice(1, 3), 16)}, ${parseInt(item.color.slice(3, 5), 16)}, ${parseInt(item.color.slice(5, 7), 16)}, 0.3)` : 'rgba(255, 255, 255, 0.8)',
                  borderWidth: isDarkMode ? 1 : 0,
                }]} elevation={isDarkMode ? 2 : 2}>
                  {/* Gradient accent for card */}
                  <LinearGradient
                    colors={[
                      isDarkMode ? `rgba(${parseInt(item.color.slice(1, 3), 16)}, ${parseInt(item.color.slice(3, 5), 16)}, ${parseInt(item.color.slice(5, 7), 16)}, 0.12)` : 'transparent',
                      isDarkMode ? 'rgba(26, 26, 26, 0)' : 'transparent'
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.cardGradient}
                  />
                  <View style={styles.cardHeader}>
                    <Avatar.Icon 
                      size={50} 
                      icon={item.icon} 
                      color="#FFFFFF"
                      style={{ 
                        backgroundColor: item.color,
                        marginBottom: 4
                      }}
                    />
                    {item.badge > 0 && (
                      <Badge 
                        visible={true} 
                        size={20} 
                        style={[styles.cardBadge, { backgroundColor: '#4361EE' }]}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </View>
                  <Title 
                    style={[styles.cardTitle, { color: theme.text }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.title}
                  </Title>
                  <Paragraph 
                    style={[styles.cardDescription, { color: theme.textSecondary }]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {item.description}
                  </Paragraph>
                </Surface>
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </View>
        
        {/* Recent Activity Title */}
        <View style={[styles.sectionHeader, { 
          paddingLeft: Math.max(insets.left + 20, 20), 
          paddingRight: Math.max(insets.right + 20, 20) 
        }]}>
          <Text style={[styles.sectionTitle, { 
            color: theme.text,
            textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 1
          }]}>
            Recent Activity
          </Text>
        </View>
        
        {/* Recent Activity Card with Glassmorphism */}
        <GlassmorphicCard
          style={[styles.activityCard, { 
            marginLeft: Math.max(insets.left + 20, 20), 
            marginRight: Math.max(insets.right + 20, 20)
          }]}
          intensity="high"
          animation="fadeInUp"
          delay={800}
          gradientColors={isDarkMode 
            ? ['rgba(67, 97, 238, 0.2)', 'rgba(26, 32, 44, 0.6)']
            : ['rgba(235, 244, 255, 0.4)', 'rgba(230, 255, 250, 0.4)']}
        >
          {/* Activity content */}
          <View style={styles.activityHeader}>
            <Text style={[styles.activityTitle, { color: theme.text }]}>
              Recent Activity
            </Text>
          </View>
          {[1, 2, 3].map((_, index) => (
            <React.Fragment key={index}>
              <View style={styles.activityItem}>
                <Avatar.Icon 
                  size={42} 
                  icon={index === 0 ? "car-info" : index === 1 ? "file-document" : "receipt"} 
                  color="#FFFFFF"
                  style={{ 
                    backgroundColor: index === 0 ? '#4361EE' : index === 1 ? '#4895EF' : '#3A86FF',
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    zIndex: 1,
                    marginRight: 5,
                  }}
                />
                <View style={styles.activityContent}>
                  <Text 
                    style={[styles.activityTitle, { 
                      color: theme.text,
                      textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                      textShadowOffset: { width: 0.5, height: 0.5 },
                      textShadowRadius: 0.5
                    }]}
                    numberOfLines={2}
                  >
                    {index === 0 ? "Vehicle KA-01-AB-1234 scanned" : 
                     index === 1 ? "License verified for akhil" : 
                     "Fine issued for illegal parking"}
                  </Text>
                  <Text style={[styles.activityTime, { color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : theme.textSecondary }]}>
                    {index === 0 ? "10 minutes ago" : 
                     index === 1 ? "45 minutes ago" : 
                     "2 hours ago"}
                  </Text>
                </View>
                <IconButton 
                  icon="chevron-right" 
                  iconColor={isDarkMode ? 'rgba(255, 255, 255, 0.5)' : theme.textSecondary}
                  size={24}
                  onPress={() => {}}
                  style={{padding: 0, margin: 0, marginLeft: 4}}
                />
              </View>
              {index < 2 && (
                <Divider 
                  style={[
                    styles.divider, 
                    { backgroundColor: isDarkMode ? 'rgba(45, 55, 72, 0.6)' : 'rgba(226, 232, 240, 0.6)' }
                  ]} 
                />
              )}
            </React.Fragment>
          ))}
          <Button 
            mode="text" 
            onPress={() => {}}
            style={styles.viewAllButton}
            textColor='#4361EE'
          >
            View All Activity
          </Button>
        </GlassmorphicCard>
        
        {/* Bottom padding to account for bottom inset (notch, home indicator) */}
        <View style={{ height: insets.bottom }} />
      </ScrollView>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  profileCardContainer: {
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  profileCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  profileGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.9,
    borderRadius: 20,
  },
  glassDot: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 0,
  },
  glassHighlight: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 0,
  },
  profileContent: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 24,
    alignItems: 'center',
    zIndex: 1,
  },
  profileAvatar: {
    marginRight: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 2,
  },
  profileInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  userRole: {
    fontSize: 14,
    letterSpacing: 0.2,
  },
  date: {
    fontSize: 14,
    letterSpacing: 0.5,
    textAlign: 'left',
  },
  profileFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    zIndex: 1,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  weatherIcon: {
    marginRight: 4,
  },
  weatherInfo: {
    flexDirection: 'column',
  },
  weatherTemp: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
  },
  weatherCondition: {
    fontSize: 12,
    marginTop: -2,
  },
  statusCardsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statusCardWrapper: {
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    height: 90,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    height: 90,
    position: 'relative',
  },
  statusGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.9,
    borderLeftWidth: 4,
    zIndex: 0,
  },
  statusIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    zIndex: 1,
  },
  statusContent: {
    flex: 1,
    marginLeft: 12,
    zIndex: 1,
    marginRight: 8,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  statusLabel: {
    fontSize: 14,
    letterSpacing: 0.2,
    marginTop: 2,
    flexWrap: 'wrap',
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 16,
  },
  mapSectionHeader: {
    marginTop: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  statsScrollContainer: {
    paddingBottom: 16,
    paddingTop: 8,
  },
  statCardWrapper: {
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    elevation: 3,
  },
  statCard: {
    width: 160,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statContent: {
    padding: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: (width - 48) / 2,
    marginBottom: 16,
    height: 160,
  },
  cardTouchable: {
    height: '100%',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    opacity: 0.7,
    zIndex: 0,
  },
  cardHeader: {
    position: 'relative',
    marginBottom: 8,
    zIndex: 1,
    alignItems: 'center',
  },
  cardBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 4,
    zIndex: 1,
    paddingHorizontal: 6,
    width: '100%',
  },
  cardDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    zIndex: 1,
    paddingHorizontal: 4,
    width: '100%',
  },
  activityCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 24,
  },
  activityHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingVertical: 18,
    zIndex: 1,
  },
  activityContent: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
    justifyContent: 'center',
  },
  activityTime: {
    fontSize: 13,
    letterSpacing: 0.2,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    width: '88%',
    alignSelf: 'center',
  },
  viewAllButton: {
    marginVertical: 12,
    alignSelf: 'center',
    paddingVertical: 4,
  },
  alertsScrollContainer: {
    paddingBottom: 12,
    paddingTop: 2,
    flexDirection: 'row',
  },
  alertCardWrapper: {
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  alertCard: {
    width: 300,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  alertIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  alertContent: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
    zIndex: 1,
  },
  alertTextContent: {
    flex: 1,
  },
  alertType: {
    fontSize: 15,
    marginBottom: 4,
  },
  alertLocation: {
    fontSize: 13,
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 12,
  },
  viewMoreAlertWrapper: {
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  viewMoreAlert: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
    width: 110,
  },
  mapContainer: {
    height: 220,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginBottom: 16,
  },
  mapCard: {
    borderRadius: 20,
    overflow: 'hidden',
    height: '100%',
    position: 'relative',
  },
  mapGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.9,
    zIndex: 0,
  },
  mapDecorativeDot: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    zIndex: 0,
  },
  map: {
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  mapControls: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    zIndex: 2,
  },
  trafficControlsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  controlButtonWrapper: {
    width: '48%',
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  controlButton: {
    height: 120,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  controlButtonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.9,
    zIndex: 0,
  },
  controlDecorativeDot: {
    position: 'absolute',
    bottom: -25,
    right: -25,
    width: 70,
    height: 70,
    borderRadius: 35,
    zIndex: 0,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  alertCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertCount: {
    marginRight: 4,
    fontSize: 14,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DashboardHomeScreen; 