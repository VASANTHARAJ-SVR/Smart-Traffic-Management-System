import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Image,
  Platform
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MoreStackParamList } from '../../navigation/types';
import ScreenWithSidebar from '../../components/ScreenWithSidebar';
import { 
  TextInput, 
  Button, 
  Divider, 
  List, 
  Surface, 
  IconButton, 
  Avatar,
  DataTable,
  Chip,
  SegmentedButtons,
  Snackbar,
  FAB,
  ProgressBar
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<MoreStackParamList, 'VehicleRecovery'>;
const { width, height } = Dimensions.get('window');

// Mock data for recovered/tracked vehicles
const vehicleData = [
  { 
    id: 'V001', 
    regNo: 'KA-01-AB-1234', 
    make: 'Toyota Corolla', 
    color: 'White', 
    status: 'In Progress', 
    reason: 'Stolen', 
    reportDate: '15 Jul 2023',
    location: 'MG Road, Bangalore',
    coordinates: { latitude: 12.9716, longitude: 77.5946 },
    owner: 'Akhil',
    contact: '+91 98765 43210',
    progress: 65
  },
  { 
    id: 'V002', 
    regNo: 'MH-02-CD-5678', 
    make: 'Honda City', 
    color: 'Silver', 
    status: 'Recovered', 
    reason: 'Towed', 
    reportDate: '12 Jul 2023',
    location: 'Andheri, Mumbai',
    coordinates: { latitude: 19.1136, longitude: 72.8697 },
    owner: 'Jane Smith',
    contact: '+91 87654 32109',
    progress: 100
  },
  { 
    id: 'V003', 
    regNo: 'DL-03-EF-9012', 
    make: 'Hyundai i20', 
    color: 'Red', 
    status: 'Reported', 
    reason: 'Stolen', 
    reportDate: '18 Jul 2023',
    location: 'Connaught Place, Delhi',
    coordinates: { latitude: 28.6329, longitude: 77.2195 },
    owner: 'Rahul Sharma',
    contact: '+91 76543 21098',
    progress: 15
  },
  { 
    id: 'V004', 
    regNo: 'TN-04-GH-3456', 
    make: 'Maruti Swift', 
    color: 'Blue', 
    status: 'Assigned', 
    reason: 'Abandoned', 
    reportDate: '14 Jul 2023',
    location: 'T Nagar, Chennai',
    coordinates: { latitude: 13.0416, longitude: 80.2339 },
    owner: 'Priya Patel',
    contact: '+91 65432 10987',
    progress: 35
  },
];

// Team members mock data
const teamMembers = [
  { id: 'T1', name: 'Officer Kumar', status: 'Available', cases: 2, badge: '#12345' },
  { id: 'T2', name: 'Officer Singh', status: 'On Case', cases: 3, badge: '#67890' },
  { id: 'T3', name: 'Officer Gupta', status: 'Available', cases: 1, badge: '#24680' },
];

const VehicleRecoveryScreen = ({ navigation }: Props) => {
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [fabOpen, setFabOpen] = useState(false);
  
  const filteredVehicles = vehicleData.filter(vehicle => {
    // Apply status filter
    if (filterStatus !== 'all' && vehicle.status !== filterStatus) {
      return false;
    }
    
    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        vehicle.regNo.toLowerCase().includes(query) ||
        vehicle.make.toLowerCase().includes(query) ||
        vehicle.owner.toLowerCase().includes(query) ||
        vehicle.reason.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Recovered': return theme.success;
      case 'In Progress': return theme.primary;
      case 'Assigned': return theme.warning;
      case 'Reported': return theme.error;
      default: return theme.textSecondary;
    }
  };
  
  const handleCreateRecoveryRequest = () => {
    setSnackbarMessage('New recovery request created');
    setSnackbarVisible(true);
    setFabOpen(false);
  };
  
  const handleAssignTeam = () => {
    if (selectedVehicle) {
      setSnackbarMessage(`Team assigned to recover vehicle ${selectedVehicle}`);
      setSnackbarVisible(true);
    }
  };
  
  const handleUpdateStatus = (status: string) => {
    if (selectedVehicle) {
      setSnackbarMessage(`Vehicle ${selectedVehicle} status updated to ${status}`);
      setSnackbarVisible(true);
    }
  };
  
  const renderDashboardTab = () => (
    <View style={styles.dashboardContainer}>
      <Animatable.View 
        animation="fadeIn" 
        duration={500}
      >
        <Surface style={[styles.statsCard, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.error }]}>12</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Reported</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.warning }]}>8</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Assigned</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>15</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>In Progress</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.success }]}>64</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Recovered</Text>
            </View>
          </View>
        </Surface>
        
        <View style={styles.searchFilterContainer}>
          <TextInput
            placeholder="Search by Reg No., Owner, etc."
            value={searchQuery}
            onChangeText={setSearchQuery}
            mode="outlined"
            style={styles.searchInput}
            left={<TextInput.Icon icon="magnify" />}
            right={searchQuery ? <TextInput.Icon icon="close" onPress={() => setSearchQuery('')} /> : null}
            theme={{ colors: { primary: theme.primary } }}
          />
          
          <View style={styles.filterChips}>
            <Chip 
              selected={filterStatus === 'all'} 
              onPress={() => setFilterStatus('all')}
              style={styles.filterChip}
              selectedColor={theme.primary}
            >
              All
            </Chip>
            <Chip 
              selected={filterStatus === 'Reported'} 
              onPress={() => setFilterStatus('Reported')}
              style={styles.filterChip}
              selectedColor={theme.error}
            >
              Reported
            </Chip>
            <Chip 
              selected={filterStatus === 'Assigned'} 
              onPress={() => setFilterStatus('Assigned')}
              style={styles.filterChip}
              selectedColor={theme.warning}
            >
              Assigned
            </Chip>
            <Chip 
              selected={filterStatus === 'In Progress'} 
              onPress={() => setFilterStatus('In Progress')}
              style={styles.filterChip}
              selectedColor={theme.primary}
            >
              In Progress
            </Chip>
            <Chip 
              selected={filterStatus === 'Recovered'} 
              onPress={() => setFilterStatus('Recovered')}
              style={styles.filterChip}
              selectedColor={theme.success}
            >
              Recovered
            </Chip>
          </View>
        </View>
        
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {filteredVehicles.length} Vehicle{filteredVehicles.length !== 1 ? 's' : ''}
        </Text>
        
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => (
            <Animatable.View 
              key={vehicle.id}
              animation="fadeInUp"
              duration={500}
            >
              <Surface 
                style={[
                  styles.vehicleCard, 
                  { 
                    backgroundColor: isDarkMode ? '#1E1E1E' : theme.white,
                    borderLeftColor: getStatusColor(vehicle.status),
                    borderLeftWidth: 4
                  }
                ]} 
                elevation={2}
              >
                <TouchableOpacity
                  style={styles.vehicleCardContent}
                  onPress={() => setSelectedVehicle(selectedVehicle === vehicle.id ? null : vehicle.id)}
                >
                  <View style={styles.vehicleHeader}>
                    <View style={styles.vehicleInfo}>
                      <Text style={[styles.vehicleRegNo, { color: theme.text }]}>{vehicle.regNo}</Text>
                      <Text style={[styles.vehicleDetails, { color: theme.textSecondary }]}>
                        {vehicle.make} • {vehicle.color}
                      </Text>
                    </View>
                    <Chip 
                      mode="outlined"
                      style={{ 
                        backgroundColor: getStatusColor(vehicle.status) + '20',
                        borderColor: getStatusColor(vehicle.status)
                      }}
                      textStyle={{ color: getStatusColor(vehicle.status) }}
                    >
                      {vehicle.status}
                    </Chip>
                  </View>
                  
                  <View style={styles.reasonRow}>
                    <IconButton 
                      icon={vehicle.reason === 'Stolen' ? 'car-off' : vehicle.reason === 'Towed' ? 'car-traction-control' : 'car-wrench'} 
                      size={20}
                      iconColor={theme.primary}
                      style={styles.reasonIcon}
                    />
                    <Text style={[styles.reasonText, { color: theme.text }]}>
                      {vehicle.reason} • Reported on {vehicle.reportDate}
                    </Text>
                  </View>
                  
                  <View style={styles.locationRow}>
                    <IconButton 
                      icon="map-marker" 
                      size={20}
                      iconColor={theme.primary}
                      style={styles.locationIcon}
                    />
                    <Text style={[styles.locationText, { color: theme.text }]}>
                      {vehicle.location}
                    </Text>
                  </View>
                  
                  {vehicle.status !== 'Recovered' && (
                    <View style={styles.progressContainer}>
                      <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                        Recovery Progress:
                      </Text>
                      <View style={styles.progressBarContainer}>
                        <ProgressBar 
                          progress={vehicle.progress / 100} 
                          color={getStatusColor(vehicle.status)} 
                          style={styles.progressBar}
                        />
                        <Text style={[styles.progressPercentage, { color: theme.textSecondary }]}>
                          {vehicle.progress}%
                        </Text>
                      </View>
                    </View>
                  )}
                  
                  {selectedVehicle === vehicle.id && (
                    <Animatable.View
                      animation="fadeIn"
                      duration={300}
                    >
                      <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
                      
                      <View style={styles.vehicleExpandedInfo}>
                        <View style={styles.expandedInfoRow}>
                          <Text style={[styles.expandedInfoLabel, { color: theme.textSecondary }]}>Owner:</Text>
                          <Text style={[styles.expandedInfoValue, { color: theme.text }]}>{vehicle.owner}</Text>
                        </View>
                        <View style={styles.expandedInfoRow}>
                          <Text style={[styles.expandedInfoLabel, { color: theme.textSecondary }]}>Contact:</Text>
                          <Text style={[styles.expandedInfoValue, { color: theme.text }]}>{vehicle.contact}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.actionButtons}>
                        <Button 
                          mode="text" 
                          icon="map" 
                          onPress={() => {
                            setSnackbarMessage(`Viewing location map for ${vehicle.regNo}`);
                            setSnackbarVisible(true);
                          }}
                          textColor={theme.primary}
                        >
                          View on Map
                        </Button>
                        
                        {vehicle.status === 'Reported' && (
                          <Button 
                            mode="text" 
                            icon="account-group" 
                            onPress={handleAssignTeam}
                            textColor={theme.primary}
                          >
                            Assign Team
                          </Button>
                        )}
                        
                        {(vehicle.status === 'Assigned' || vehicle.status === 'In Progress') && (
                          <Button 
                            mode="text" 
                            icon="update" 
                            onPress={() => handleUpdateStatus(vehicle.status === 'Assigned' ? 'In Progress' : 'Recovered')}
                            textColor={theme.primary}
                          >
                            Update Status
                          </Button>
                        )}
                      </View>
                    </Animatable.View>
                  )}
                </TouchableOpacity>
              </Surface>
            </Animatable.View>
          ))
        ) : (
          <Surface style={[styles.emptyCard, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
            <IconButton
              icon="car-off"
              size={48}
              iconColor={theme.primary}
            />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No Vehicles Found</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              Try adjusting your filters or search criteria
            </Text>
          </Surface>
        )}
      </Animatable.View>
    </View>
  );
  
  const renderTeamTab = () => (
    <View style={styles.teamContainer}>
      <Animatable.View 
        animation="fadeIn" 
        duration={500}
      >
        <Surface style={[styles.teamStatsCard, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
          <Text style={[styles.teamStatsTitle, { color: theme.text }]}>Recovery Team Statistics</Text>
          <View style={styles.teamStatsRow}>
            <View style={styles.teamStatItem}>
              <IconButton
                icon="account-group"
                size={24}
                iconColor={theme.primary}
                style={[styles.teamStatIcon, { backgroundColor: theme.primary + '20' }]}
              />
              <Text style={[styles.teamStatValue, { color: theme.text }]}>8</Text>
              <Text style={[styles.teamStatLabel, { color: theme.textSecondary }]}>Total Teams</Text>
            </View>
            <View style={styles.teamStatItem}>
              <IconButton
                icon="account-check"
                size={24}
                iconColor={theme.success}
                style={[styles.teamStatIcon, { backgroundColor: theme.success + '20' }]}
              />
              <Text style={[styles.teamStatValue, { color: theme.text }]}>5</Text>
              <Text style={[styles.teamStatLabel, { color: theme.textSecondary }]}>Available</Text>
            </View>
            <View style={styles.teamStatItem}>
              <IconButton
                icon="account-clock"
                size={24}
                iconColor={theme.warning}
                style={[styles.teamStatIcon, { backgroundColor: theme.warning + '20' }]}
              />
              <Text style={[styles.teamStatValue, { color: theme.text }]}>3</Text>
              <Text style={[styles.teamStatLabel, { color: theme.textSecondary }]}>On Duty</Text>
            </View>
          </View>
        </Surface>
        
        <View style={styles.teamListHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recovery Team Members</Text>
          <TouchableOpacity onPress={() => {
            setSnackbarMessage('Viewing all team members');
            setSnackbarVisible(true);
          }}>
            <Text style={[styles.viewAllText, { color: theme.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {teamMembers.map((member) => (
          <Surface 
            key={member.id}
            style={[styles.teamMemberCard, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} 
            elevation={2}
          >
            <View style={styles.teamMemberContent}>
              <View style={styles.teamMemberLeft}>
                <Avatar.Text 
                  size={50} 
                  label={member.name.split(' ').map(n => n[0]).join('')} 
                  style={{ backgroundColor: member.status === 'Available' ? theme.success + '40' : theme.warning + '40' }}
                  labelStyle={{ color: member.status === 'Available' ? theme.success : theme.warning }}
                />
                <View style={styles.teamMemberInfo}>
                  <Text style={[styles.teamMemberName, { color: theme.text }]}>{member.name}</Text>
                  <Text style={[styles.teamMemberBadge, { color: theme.textSecondary }]}>Badge {member.badge}</Text>
                  <Chip 
                    mode="outlined"
                    style={{ 
                      backgroundColor: member.status === 'Available' ? theme.success + '20' : theme.warning + '20',
                      borderColor: member.status === 'Available' ? theme.success : theme.warning,
                      height: 24,
                      marginTop: 4
                    }}
                    textStyle={{ 
                      color: member.status === 'Available' ? theme.success : theme.warning,
                      fontSize: 12
                    }}
                  >
                    {member.status}
                  </Chip>
                </View>
              </View>
              <View style={styles.teamMemberRight}>
                <Text style={[styles.teamMemberCases, { color: theme.text }]}>{member.cases}</Text>
                <Text style={[styles.teamMemberCasesLabel, { color: theme.textSecondary }]}>Active Cases</Text>
                <IconButton 
                  icon="chevron-right" 
                  size={24}
                  iconColor={theme.textSecondary}
                  onPress={() => {
                    setSnackbarMessage(`Viewing details of ${member.name}`);
                    setSnackbarVisible(true);
                  }}
                />
              </View>
            </View>
          </Surface>
        ))}
        
        <Surface style={[styles.mapPreviewCard, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
          <Text style={[styles.mapTitle, { color: theme.text }]}>Team Locations</Text>
          <View style={styles.mapPlaceholder}>
            <Image 
              source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=12.9716,77.5946&zoom=12&size=600x300&maptype=roadmap&markers=color:red%7C12.9716,77.5946%7C13.0416,80.2339%7C19.1136,72.8697&key=YOUR_API_KEY' }} 
              style={styles.mapImage}
            />
            <View style={styles.mapOverlay}>
              <Button 
                mode="contained" 
                icon="map" 
                onPress={() => {
                  setSnackbarMessage('Opening full map view');
                  setSnackbarVisible(true);
                }}
                style={styles.viewMapButton}
              >
                View Full Map
              </Button>
            </View>
          </View>
        </Surface>
      </Animatable.View>
    </View>
  );

  return (
    <ScreenWithSidebar
      title="Vehicle Recovery"
      navigation={navigation}
      notificationCount={6}
    >
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <SegmentedButtons
            value={activeTab}
            onValueChange={setActiveTab}
            buttons={[
              {
                value: 'dashboard',
                label: 'Vehicles',
                icon: 'car-search',
                style: { 
                  backgroundColor: activeTab === 'dashboard' ? 
                    (isDarkMode ? '#2C2C2C' : theme.primary + '20') : 
                    'transparent' 
                }
              },
              {
                value: 'team',
                label: 'Recovery Teams',
                icon: 'account-group',
                style: { 
                  backgroundColor: activeTab === 'team' ? 
                    (isDarkMode ? '#2C2C2C' : theme.primary + '20') : 
                    'transparent' 
                }
              },
            ]}
            style={styles.segmentedButtons}
          />
        </View>
        
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent, 
            { paddingBottom: insets.bottom + 20 }
          ]} 
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'dashboard' ? renderDashboardTab() : renderTeamTab()}
        </ScrollView>
        
        <FAB.Group
          open={fabOpen}
          visible
          icon={fabOpen ? 'close' : 'plus'}
          actions={[
            {
              icon: 'car-search',
              label: 'New Recovery Request',
              onPress: handleCreateRecoveryRequest,
              style: { backgroundColor: theme.primary },
            },
            {
              icon: 'account-plus',
              label: 'Add Team Member',
              onPress: () => {
                setSnackbarMessage('Adding new team member');
                setSnackbarVisible(true);
                setFabOpen(false);
              },
              style: { backgroundColor: theme.success },
            },
            {
              icon: 'file-document-edit',
              label: 'Create Report',
              onPress: () => {
                setSnackbarMessage('Creating new recovery report');
                setSnackbarVisible(true);
                setFabOpen(false);
              },
              style: { backgroundColor: theme.warning },
            },
          ]}
          onStateChange={({ open }) => setFabOpen(open)}
          fabStyle={{ backgroundColor: theme.primary }}
        />
        
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
  tabContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  segmentedButtons: {
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: 16,
  },
  dashboardContainer: {
    flex: 1,
  },
  statsCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  searchFilterContainer: {
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  vehicleCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  vehicleCardContent: {
    padding: 16,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleRegNo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  vehicleDetails: {
    fontSize: 14,
    marginTop: 2,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reasonIcon: {
    margin: 0,
    marginRight: 4,
  },
  reasonText: {
    fontSize: 14,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIcon: {
    margin: 0,
    marginRight: 4,
  },
  locationText: {
    fontSize: 14,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressText: {
    fontSize: 12,
    marginBottom: 4,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  progressPercentage: {
    marginLeft: 8,
    fontSize: 12,
    width: 36,
    textAlign: 'right',
  },
  divider: {
    marginVertical: 12,
  },
  vehicleExpandedInfo: {
    marginBottom: 12,
  },
  expandedInfoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  expandedInfoLabel: {
    width: 80,
    fontSize: 14,
  },
  expandedInfoValue: {
    flex: 1,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  emptyCard: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  teamContainer: {
    flex: 1,
  },
  teamStatsCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  teamStatsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  teamStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teamStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  teamStatIcon: {
    marginBottom: 8,
  },
  teamStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  teamStatLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  teamListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
  },
  teamMemberCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  teamMemberContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamMemberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  teamMemberInfo: {
    marginLeft: 16,
    flex: 1,
  },
  teamMemberName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  teamMemberBadge: {
    fontSize: 14,
  },
  teamMemberRight: {
    alignItems: 'center',
  },
  teamMemberCases: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  teamMemberCasesLabel: {
    fontSize: 12,
  },
  mapPreviewCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 12,
  },
  mapPlaceholder: {
    height: 200,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  viewMapButton: {
    borderRadius: 8,
  },
  snackbar: {
    bottom: 16,
  },
});

export default VehicleRecoveryScreen; 