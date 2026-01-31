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
import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TrafficStackParamList } from '../../navigation/types';
import { 
  Card, 
  Button, 
  Divider, 
  List, 
  Surface, 
  IconButton, 
  ProgressBar,
  Chip,
  Avatar
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import ScreenWithSidebar from '../../components/ScreenWithSidebar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';

type TrafficScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<TrafficStackParamList, 'TrafficHome'>,
  CompositeNavigationProp<
    StackNavigationProp<MainTabParamList>,
    StackNavigationProp<RootStackParamList>
  >
>;

interface Props {
  navigation: TrafficScreenNavigationProp;
}

const { width } = Dimensions.get('window');

type QuickAction = {
  icon: string;
  title: string;
  route: keyof TrafficStackParamList | '';
};

// Add ScreenWithSidebar props type
interface ScreenWithSidebarProps {
  children: React.ReactNode;
  title: string;
  navigation: NativeStackNavigationProp<TrafficStackParamList>;
  notificationCount?: number;
}

// Mock data
const trafficHotspots = [
  { id: '1', location: 'MG Road Junction', congestionLevel: 85, incidents: 3 },
  { id: '2', location: 'Silk Board', congestionLevel: 92, incidents: 5 },
  { id: '3', location: 'Whitefield Main Road', congestionLevel: 70, incidents: 2 },
  { id: '4', location: 'Electronic City Flyover', congestionLevel: 65, incidents: 1 },
  { id: '5', location: 'Marathahalli Bridge', congestionLevel: 78, incidents: 4 },
];

const recentIncidents = [
  { 
    id: '1', 
    type: 'Accident', 
    location: 'MG Road', 
    time: '10:30 AM', 
    status: 'Active',
    icon: 'car-emergency'
  },
  { 
    id: '2', 
    type: 'Traffic Jam', 
    location: 'Silk Board', 
    time: '09:15 AM', 
    status: 'Resolved',
    icon: 'traffic-cone'
  },
  { 
    id: '3', 
    type: 'Road Closure', 
    location: 'Whitefield', 
    time: '11:45 AM', 
    status: 'Active',
    icon: 'block-helper'
  },
];

const quickActions: QuickAction[] = [
  { icon: 'cctv', title: 'Cameras', route: 'LiveCameras' },
  { icon: 'chart-line', title: 'Stats', route: 'TrafficAnalytics' },
  { icon: 'traffic-light', title: 'Signals', route: 'TrafficSignals' },
  { icon: 'volume-high', title: 'Noise', route: 'NoiseDetection' },
  { icon: 'parking', title: 'Parking', route: 'ParkingAssistance' },
];

const menuItems = [
  {
    title: 'Live Cameras',
    icon: 'cctv',
    route: 'LiveCameras',
    description: 'Monitor traffic through live camera feeds',
  },
  {
    title: 'Traffic Signals',
    icon: 'traffic-light',
    route: 'TrafficSignals',
    description: 'Control and monitor traffic signals',
  },
  {
    title: 'Traffic Analytics',
    icon: 'chart-bar',
    route: 'TrafficAnalytics',
    description: 'View traffic patterns and analytics',
  },
  {
    title: 'Noise Detection',
    icon: 'volume-high',
    route: 'NoiseDetection',
    description: 'Monitor and analyze noise levels',
  },
  {
    title: 'Parking Assistance',
    icon: 'parking',
    route: 'ParkingAssistance',
    description: 'View and manage parking spots',
  },
  {
    title: 'Report Incident',
    icon: 'alert',
    route: 'IncidentReport',
    description: 'Report traffic incidents',
  },
  {
    title: 'Manage Traffic',
    icon: 'road-variant',
    route: 'ManageTraffic',
    description: 'Manage traffic flow and diversions',
  },
];

const TrafficHomeScreen = ({ navigation }: Props) => {
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

  const getStatusColor = (status: string) => {
    return status === 'Active' ? '#FF0000' : '#4CAF50';
  };

  const getCongestionColor = (level: number) => {
    if (level > 80) return '#FF0000';
    if (level > 60) return '#EF802F';
    return '#4CAF50';
  };

  return (
    <ScreenWithSidebar
      title="Traffic Management"
      navigation={navigation}
      notificationCount={5}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Overview Card with Glassmorphism */}
        <Animatable.View 
          animation="fadeIn" 
          duration={600}
          style={[styles.cardContainer, {
            marginLeft: Math.max(insets.left + 20, 20),
            marginRight: Math.max(insets.right + 20, 20)
          }]}
        >
          <Surface style={[styles.overviewCard, {
            backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.7)',
            borderColor: isDarkMode ? 'rgba(67, 97, 238, 0.3)' : 'rgba(255, 255, 255, 0.8)',
            borderWidth: 1,
          }]} elevation={4}>
            {/* Glass effect gradient */}
            <LinearGradient
              colors={isDarkMode ? 
                ['rgba(67, 97, 238, 0.15)', 'rgba(26, 32, 44, 0.5)'] : 
                ['rgba(235, 244, 255, 0.3)', 'rgba(230, 255, 250, 0.3)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassGradient}
            />
            
            {/* Decorative elements */}
            <View style={[styles.decorativeDot, { 
              top: 15, 
              right: 15,
              backgroundColor: isDarkMode ? 'rgba(67, 97, 238, 0.15)' : 'rgba(67, 97, 238, 0.1)' 
            }]} />
            
            <Text style={[styles.overviewTitle, {
              color: theme.text,
              textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1
            }]}>City Traffic Overview</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.text }]}>78%</Text>
                <Text style={[styles.statLabel, { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : theme.textSecondary }]}>
                  Congestion
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.text }]}>12</Text>
                <Text style={[styles.statLabel, { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : theme.textSecondary }]}>
                  Incidents
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.text }]}>5</Text>
                <Text style={[styles.statLabel, { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : theme.textSecondary }]}>
                  Hotspots
                </Text>
              </View>
            </View>
            
            <Button 
              mode="contained" 
              style={[styles.viewMapButton, {
                backgroundColor: isDarkMode ? '#4361EE' : '#4361EE',
              }]}
              labelStyle={{ color: '#FFFFFF' }}
              onPress={() => {}}
            >
              View Live Map
            </Button>
          </Surface>
        </Animatable.View>
        
        {/* Traffic Hotspots Section */}
        <Animatable.View 
          animation="fadeIn" 
          duration={600} 
          delay={100}
          style={{
            paddingHorizontal: Math.max(insets.left + 20, 20),
          }}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { 
              color: theme.text,
              textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1
            }]}>Traffic Hotspots</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: '#4361EE' }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.hotspotScroll}
          >
            {trafficHotspots.map((hotspot, index) => (
              <Animatable.View 
                key={hotspot.id} 
                animation="fadeInRight" 
                duration={500} 
                delay={index * 100}
                style={styles.hotspotCardWrapper}
              >
                <Surface style={[styles.hotspotCard, { 
                  backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.7)',
                  borderColor: isDarkMode ? 'rgba(67, 97, 238, 0.3)' : 'rgba(255, 255, 255, 0.8)',
                  borderWidth: 1,
                }]} elevation={3}>
                  {/* Glass effect gradient */}
                  <LinearGradient
                    colors={isDarkMode ? 
                      ['rgba(67, 97, 238, 0.15)', 'rgba(26, 32, 44, 0.5)'] : 
                      ['rgba(235, 244, 255, 0.3)', 'rgba(230, 255, 250, 0.3)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.hotspotGradient}
                  />
                  
                  <View style={styles.hotspotHeader}>
                    <Text style={[styles.hotspotLocation, { 
                      color: theme.text,
                      textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                      textShadowOffset: { width: 0.5, height: 0.5 },
                      textShadowRadius: 0.5
                    }]}>{hotspot.location}</Text>
                    <Chip 
                      style={{ 
                        backgroundColor: getCongestionColor(hotspot.congestionLevel) + '20',
                        borderColor: getCongestionColor(hotspot.congestionLevel)
                      }}
                      textStyle={{ color: getCongestionColor(hotspot.congestionLevel) }}
                      mode="outlined"
                    >
                      {hotspot.congestionLevel}%
                    </Chip>
                  </View>
                  
                  <ProgressBar 
                    progress={hotspot.congestionLevel / 100} 
                    color={getCongestionColor(hotspot.congestionLevel)} 
                    style={styles.progressBar}
                  />
                  
                  <View style={styles.hotspotFooter}>
                    <Text style={[styles.incidentsText, { 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : theme.textSecondary 
                    }]}>
                      {hotspot.incidents} Active Incidents
                    </Text>
                    <Button 
                      mode="text" 
                      compact 
                      onPress={() => navigation.navigate('ManageTraffic', { locationId: hotspot.id })}
                      labelStyle={{ color: '#4361EE' }}
                    >
                      Manage
                    </Button>
                  </View>
                </Surface>
              </Animatable.View>
            ))}
          </ScrollView>
        </Animatable.View>
        
        {/* Recent Incidents Section */}
        <Animatable.View 
          animation="fadeIn" 
          duration={600} 
          delay={200}
          style={{
            paddingHorizontal: Math.max(insets.left + 20, 20),
          }}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { 
              color: theme.text,
              textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1
            }]}>Recent Incidents</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: '#4361EE' }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <Surface style={[styles.incidentsCard, { 
            backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.7)',
            borderColor: isDarkMode ? 'rgba(67, 97, 238, 0.3)' : 'rgba(255, 255, 255, 0.8)',
            borderWidth: 1,
          }]} elevation={3}>
            {/* Glass effect gradient */}
            <LinearGradient
              colors={isDarkMode ? 
                ['rgba(67, 97, 238, 0.15)', 'rgba(26, 32, 44, 0.5)'] : 
                ['rgba(235, 244, 255, 0.3)', 'rgba(230, 255, 250, 0.3)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.incidentsGradient}
            />
            
            {recentIncidents.map((incident, index) => (
              <React.Fragment key={incident.id}>
                {index > 0 && <Divider style={[styles.divider, { 
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' 
                }]} />}
                <TouchableOpacity 
                  style={styles.incidentItem}
                  onPress={() => {}}
                >
                  <View style={styles.incidentLeft}>
                    <Avatar.Icon 
                      size={40} 
                      icon={incident.icon}
                      style={{ 
                        backgroundColor: getStatusColor(incident.status) + '20',
                        elevation: 2,
                      }}
                      color={getStatusColor(incident.status)}
                    />
                    <View style={styles.incidentInfo}>
                      <Text style={[styles.incidentType, { 
                        color: theme.text,
                        textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                        textShadowOffset: { width: 0.5, height: 0.5 },
                        textShadowRadius: 0.5
                      }]}>{incident.type}</Text>
                      <Text style={[styles.incidentLocation, { 
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : theme.textSecondary 
                      }]}>
                        {incident.location} • {incident.time}
                      </Text>
                    </View>
                  </View>
                  <Chip 
                    style={{ 
                      backgroundColor: getStatusColor(incident.status) + '20',
                      borderColor: getStatusColor(incident.status)
                    }}
                    textStyle={{ color: getStatusColor(incident.status) }}
                    mode="outlined"
                  >
                    {incident.status}
                  </Chip>
                </TouchableOpacity>
              </React.Fragment>
            ))}
            
            <Button 
              mode="contained" 
              style={[styles.reportButton, { 
                backgroundColor: '#4361EE',
                marginTop: 16,
              }]} 
              labelStyle={{ color: '#FFFFFF' }}
              onPress={() => navigation.navigate('IncidentReport')}
            >
              Report New Incident
            </Button>
          </Surface>
        </Animatable.View>
        
        {/* Quick Actions Section */}
        <Animatable.View 
          animation="fadeIn" 
          duration={600} 
          delay={300}
          style={{
            paddingHorizontal: Math.max(insets.left + 20, 20),
          }}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { 
              color: theme.text,
              textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1
            }]}>Quick Actions</Text>
          </View>
          
          <View style={styles.quickActionsRow}>
            {quickActions.map((action, index) => (
              <Animatable.View
                key={action.title}
                animation="fadeInUp"
                delay={index * 100}
                style={styles.quickActionWrapper}
              >
                <TouchableOpacity 
                  style={[styles.quickActionCard, { 
                    backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.7)',
                    borderColor: isDarkMode ? 'rgba(67, 97, 238, 0.3)' : 'rgba(255, 255, 255, 0.8)',
                    borderWidth: 1,
                  }]}
                  onPress={() => {
                    if (action.route) {
                      navigation.navigate(action.route as any);
                    }
                  }}
                >
                  <LinearGradient
                    colors={isDarkMode ? 
                      ['rgba(67, 97, 238, 0.15)', 'rgba(26, 32, 44, 0.5)'] : 
                      ['rgba(235, 244, 255, 0.3)', 'rgba(230, 255, 250, 0.3)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.quickActionGradient}
                  />
                  <IconButton 
                    icon={action.icon} 
                    size={22}
                    iconColor='#4361EE'
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(67, 97, 238, 0.1)' : 'rgba(67, 97, 238, 0.1)',
                      margin: 0,
                      width: 32,
                      height: 32,
                    }}
                  />
                  <Text style={[styles.quickActionText, { 
                    color: theme.text,
                    textShadowColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    textShadowOffset: { width: 0.5, height: 0.5 },
                    textShadowRadius: 0.5
                  }]}>{action.title}</Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>
        </Animatable.View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingTop: 16,
  },
  cardContainer: {
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  overviewCard: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    position: 'relative',
  },
  glassGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  decorativeDot: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.5,
  },
  overviewTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    zIndex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    zIndex: 1,
    paddingHorizontal: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
  },
  viewMapButton: {
    borderRadius: 12,
    marginTop: 12,
    zIndex: 1,
    height: 48,
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  hotspotScroll: {
    marginBottom: 16,
    paddingBottom: 4,
  },
  hotspotCardWrapper: {
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    width: width * 0.75,
    maxWidth: 320,
  },
  hotspotCard: {
    width: '100%',
    borderRadius: 16,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 160,
  },
  hotspotGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  hotspotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    zIndex: 1,
  },
  hotspotLocation: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 12,
    zIndex: 1,
  },
  hotspotFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    marginTop: 'auto',
  },
  incidentsText: {
    fontSize: 14,
  },
  incidentsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  incidentsGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  incidentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    zIndex: 1,
  },
  incidentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  incidentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  incidentType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  incidentLocation: {
    fontSize: 14,
  },
  divider: {
    width: '92%',
    alignSelf: 'center',
  },
  reportButton: {
    margin: 16,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
    paddingHorizontal: 4,
  },
  quickActionWrapper: {
    width: '47%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  quickActionCard: {
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 50,
    width: '100%',
  },
  quickActionGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 25,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
    zIndex: 1,
  },
  bottomPadding: {
    height: 80,
  },
});

export default TrafficHomeScreen; 