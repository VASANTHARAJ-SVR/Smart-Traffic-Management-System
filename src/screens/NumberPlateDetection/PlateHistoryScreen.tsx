import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  StatusBar,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NumberPlateStackParamList } from '../../navigation/types';
import { 
  Card, 
  Divider, 
  Chip, 
  Button, 
  IconButton, 
  Surface,
  Searchbar,
  Menu
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import ScreenWithSidebar from '../../components/ScreenWithSidebar';

type Props = NativeStackScreenProps<NumberPlateStackParamList, 'PlateHistory'>;

const { width } = Dimensions.get('window');

// Mock data for plate history
const mockHistoryData = [
  {
    id: '1',
    date: '2023-10-15',
    time: '14:30',
    location: 'Main Street, Downtown',
    event: 'Traffic Violation - Speeding',
    officer: 'Officer Johnson',
    details: 'Vehicle was recorded at 75 km/h in a 50 km/h zone',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    status: 'Fine Issued',
    severity: 'high'
  },
  {
    id: '2',
    date: '2023-09-22',
    time: '09:15',
    location: 'Highway 101, North Exit',
    event: 'Routine Check',
    officer: 'Officer Williams',
    details: 'All documents verified and found in order',
    coordinates: { lat: 13.0827, lng: 77.5877 },
    status: 'Cleared',
    severity: 'low'
  },
  {
    id: '3',
    date: '2023-08-05',
    time: '18:45',
    location: 'Central Avenue',
    event: 'Parking Violation',
    officer: 'Officer Davis',
    details: 'Vehicle parked in no-parking zone for over 2 hours',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    status: 'Fine Paid',
    severity: 'medium'
  },
  {
    id: '4',
    date: '2023-07-12',
    time: '11:20',
    location: 'West Boulevard',
    event: 'Vehicle Registration Check',
    officer: 'Officer Thompson',
    details: 'Registration verified during routine traffic stop',
    coordinates: { lat: 12.9698, lng: 77.7499 },
    status: 'Cleared',
    severity: 'low'
  },
  {
    id: '5',
    date: '2023-06-30',
    time: '20:15',
    location: 'Downtown Junction',
    event: 'Red Light Violation',
    officer: 'Officer Martinez',
    details: 'Vehicle crossed intersection after signal turned red',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    status: 'Fine Pending',
    severity: 'high'
  },
  {
    id: '6',
    date: '2023-05-18',
    time: '16:40',
    location: 'East Ring Road',
    event: 'Document Verification',
    officer: 'Officer Wilson',
    details: 'Insurance and pollution certificates verified',
    coordinates: { lat: 13.0298, lng: 77.6632 },
    status: 'Cleared',
    severity: 'low'
  }
];

const PlateHistoryScreen = ({ navigation }: Props) => {
  const { theme, isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(mockHistoryData);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'violations' | 'checks'>('all');

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      filterData(filterType);
    } else {
      const filtered = mockHistoryData.filter(item => 
        item.event.toLowerCase().includes(query.toLowerCase()) ||
        item.location.toLowerCase().includes(query.toLowerCase()) ||
        item.officer.toLowerCase().includes(query.toLowerCase()) ||
        item.status.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const filterData = (type: 'all' | 'violations' | 'checks') => {
    setFilterType(type);
    let filtered = mockHistoryData;
    
    if (type === 'violations') {
      filtered = mockHistoryData.filter(item => 
        item.severity === 'high' || item.severity === 'medium'
      );
    } else if (type === 'checks') {
      filtered = mockHistoryData.filter(item => 
        item.event.includes('Check') || item.event.includes('Verification')
      );
    }
    
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(item => 
        item.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.officer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredData(filtered);
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItem(prevId => prevId === id ? null : id);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return theme.error;
      case 'medium':
        return theme.warning;
      case 'low':
        return theme.success;
      default:
        return theme.info;
    }
  };

  const renderHistoryItem = ({ item }: { item: typeof mockHistoryData[0] }) => {
    const isSelected = selectedItem === item.id;
    
    return (
      <Animatable.View
        animation={isSelected ? "pulse" : "fadeIn"}
        duration={500}
      >
        <Surface 
          style={[
            styles.card, 
            { 
              backgroundColor: isDarkMode ? '#1E1E1E' : theme.white,
              borderLeftColor: getSeverityColor(item.severity),
              borderLeftWidth: 4
            }
          ]} 
          elevation={2}
        >
          <TouchableOpacity 
            onPress={() => toggleItemSelection(item.id)}
            style={styles.cardContent}
          >
            <View style={styles.cardHeader}>
              <View style={styles.dateTimeContainer}>
                <Text style={[styles.date, { color: theme.text }]}>
                  {item.date}
                </Text>
                <Text style={[styles.time, { color: theme.textSecondary }]}>
                  {item.time}
                </Text>
              </View>
              
              <Chip 
                mode="outlined" 
                style={[
                  styles.statusChip, 
                  { 
                    backgroundColor: 
                      item.status === 'Cleared' ? theme.success + '20' :
                      item.status === 'Fine Paid' ? theme.info + '20' :
                      item.status === 'Fine Pending' ? theme.warning + '20' :
                      theme.error + '20',
                    borderColor: 
                      item.status === 'Cleared' ? theme.success :
                      item.status === 'Fine Paid' ? theme.info :
                      item.status === 'Fine Pending' ? theme.warning :
                      theme.error
                  }
                ]}
                textStyle={{ 
                  color: 
                    item.status === 'Cleared' ? theme.success :
                    item.status === 'Fine Paid' ? theme.info :
                    item.status === 'Fine Pending' ? theme.warning :
                    theme.error,
                  fontSize: 12
                }}
              >
                {item.status}
              </Chip>
            </View>
            
            <Text style={[styles.event, { color: theme.text }]}>
              {item.event}
            </Text>
            
            <View style={styles.locationContainer}>
              <IconButton
                icon="map-marker"
                size={16}
                style={styles.locationIcon}
                iconColor={theme.primary}
              />
              <Text style={[styles.location, { color: theme.textSecondary }]}>
                {item.location}
              </Text>
            </View>
            
            <View style={styles.officerContainer}>
              <IconButton
                icon="account-tie"
                size={16}
                style={styles.officerIcon}
                iconColor={theme.primary}
              />
              <Text style={[styles.officer, { color: theme.textSecondary }]}>
                {item.officer}
              </Text>
            </View>
            
            {isSelected && (
              <Animatable.View
                animation="fadeIn"
                duration={300}
              >
                <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
                
                <Text style={[styles.detailsTitle, { color: theme.text }]}>
                  Details:
                </Text>
                <Text style={[styles.details, { color: theme.textSecondary }]}>
                  {item.details}
                </Text>
                
                <View style={styles.actionButtons}>
                  <Button 
                    mode="text" 
                    icon="map" 
                    onPress={() => {}}
                    textColor={theme.primary}
                  >
                    View Location
                  </Button>
                  <Button 
                    mode="text" 
                    icon="file-document-outline" 
                    onPress={() => {}}
                    textColor={theme.primary}
                  >
                    Full Report
                  </Button>
                </View>
              </Animatable.View>
            )}
          </TouchableOpacity>
        </Surface>
      </Animatable.View>
    );
  };

  return (
    <ScreenWithSidebar
      title="Plate History"
      navigation={navigation}
      notificationCount={3}
    >
      <View style={styles.content}>
        <View style={styles.searchFilterContainer}>
          <Searchbar
            placeholder="Search history..."
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={[styles.searchBar, { backgroundColor: isDarkMode ? '#2C2C2C' : '#F5F5F5' }]}
            iconColor={theme.primary}
            inputStyle={{ color: theme.text }}
            placeholderTextColor={theme.textSecondary}
          />
          
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="filter-variant"
                iconColor={theme.primary}
                size={24}
                style={[styles.filterButton, { backgroundColor: isDarkMode ? '#2C2C2C' : '#F5F5F5' }]}
                onPress={() => setMenuVisible(true)}
              />
            }
            contentStyle={{ backgroundColor: isDarkMode ? '#2C2C2C' : theme.white }}
          >
            <Menu.Item 
              onPress={() => {
                filterData('all');
                setMenuVisible(false);
              }} 
              title="All Records"
              titleStyle={{ color: filterType === 'all' ? theme.primary : theme.text }}
              leadingIcon={filterType === 'all' ? "check" : "history"}
            />
            <Menu.Item 
              onPress={() => {
                filterData('violations');
                setMenuVisible(false);
              }} 
              title="Violations Only"
              titleStyle={{ color: filterType === 'violations' ? theme.primary : theme.text }}
              leadingIcon={filterType === 'violations' ? "check" : "alert-circle"}
            />
            <Menu.Item 
              onPress={() => {
                filterData('checks');
                setMenuVisible(false);
              }} 
              title="Routine Checks"
              titleStyle={{ color: filterType === 'checks' ? theme.primary : theme.text }}
              leadingIcon={filterType === 'checks' ? "check" : "clipboard-check"}
            />
          </Menu>
        </View>
        
        <View style={styles.statsContainer}>
          <Surface style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
            <Text style={[styles.statValue, { color: theme.error }]}>
              {mockHistoryData.filter(item => item.severity === 'high').length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Violations</Text>
          </Surface>
          
          <Surface style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
            <Text style={[styles.statValue, { color: theme.success }]}>
              {mockHistoryData.filter(item => item.status === 'Cleared').length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Cleared</Text>
          </Surface>
          
          <Surface style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
            <Text style={[styles.statValue, { color: theme.warning }]}>
              {mockHistoryData.filter(item => item.status === 'Fine Pending').length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Pending</Text>
          </Surface>
        </View>
        
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {filteredData.length} {filteredData.length === 1 ? 'Record' : 'Records'} Found
        </Text>

        <FlatList
          data={filteredData}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchFilterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    borderRadius: 12,
    marginRight: 8,
    elevation: 2,
  },
  filterButton: {
    borderRadius: 12,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: (width - 48) / 3,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dateTimeContainer: {
    flexDirection: 'column',
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
  },
  time: {
    fontSize: 12,
    marginTop: 2,
  },
  statusChip: {
    height: 24,
  },
  event: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationIcon: {
    margin: 0,
    padding: 0,
    width: 20,
    height: 20,
  },
  location: {
    fontSize: 14,
    flex: 1,
  },
  officerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  officerIcon: {
    margin: 0,
    padding: 0,
    width: 20,
    height: 20,
  },
  officer: {
    fontSize: 14,
    flex: 1,
  },
  divider: {
    marginVertical: 12,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  separator: {
    height: 12,
  },
});

export default PlateHistoryScreen; 