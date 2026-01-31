import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  KeyboardAvoidingView
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
  Switch,
  SegmentedButtons,
  Snackbar
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<MoreStackParamList, 'EChallan'>;
const { width } = Dimensions.get('window');

// Mock data for violation types
const violationTypes = [
  { id: '1', name: 'Speeding', baseAmount: 1000, points: 3 },
  { id: '2', name: 'Red Light Violation', baseAmount: 1500, points: 4 },
  { id: '3', name: 'Improper Parking', baseAmount: 800, points: 2 },
  { id: '4', name: 'Driving Without License', baseAmount: 2000, points: 5 },
  { id: '5', name: 'No Helmet/Seatbelt', baseAmount: 500, points: 2 },
  { id: '6', name: 'Drunk Driving', baseAmount: 5000, points: 8 },
  { id: '7', name: 'Wrong Way Driving', baseAmount: 1500, points: 4 },
  { id: '8', name: 'Using Mobile While Driving', baseAmount: 1000, points: 3 },
  { id: '9', name: 'Expired Documents', baseAmount: 1000, points: 2 },
];

// Recent challans mock data
const recentChallans = [
  { id: 'CH001', vehicleNo: 'KA-01-AB-1234', date: '22 Jul 2023', amount: '₹1,500', status: 'Paid' },
  { id: 'CH002', vehicleNo: 'MH-02-BC-5678', date: '20 Jul 2023', amount: '₹2,000', status: 'Pending' },
  { id: 'CH003', vehicleNo: 'DL-03-CD-9012', date: '18 Jul 2023', amount: '₹800', status: 'Paid' },
];

const EChallanScreen = ({ navigation }: Props) => {
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('issue');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [selectedViolations, setSelectedViolations] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [remarks, setRemarks] = useState('');
  const [evidenceAdded, setEvidenceAdded] = useState(false);
  const [showViolations, setShowViolations] = useState(false);
  const [step, setStep] = useState(1);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const resetForm = () => {
    setVehicleNumber('');
    setDriverName('');
    setDriverLicense('');
    setSelectedViolations([]);
    setLocation('');
    setRemarks('');
    setEvidenceAdded(false);
    setStep(1);
  };
  
  const totalAmount = selectedViolations.reduce((sum, id) => {
    const violation = violationTypes.find(v => v.id === id);
    return sum + (violation ? violation.baseAmount : 0);
  }, 0);
  
  const totalPoints = selectedViolations.reduce((sum, id) => {
    const violation = violationTypes.find(v => v.id === id);
    return sum + (violation ? violation.points : 0);
  }, 0);
  
  const handleAddViolation = (id: string) => {
    if (selectedViolations.includes(id)) {
      setSelectedViolations(selectedViolations.filter(v => v !== id));
    } else {
      setSelectedViolations([...selectedViolations, id]);
    }
  };
  
  const handleAddEvidence = () => {
    // In a real app, this would open the camera or file picker
    setEvidenceAdded(true);
    setSnackbarMessage('Evidence photo added successfully');
    setSnackbarVisible(true);
  };
  
  const handleVehicleLookup = () => {
    if (vehicleNumber.trim()) {
      // Mock vehicle lookup - in a real app, this would fetch from an API
      setDriverName('Akhil');
      setDriverLicense('DL-98765432');
      setSnackbarMessage('Vehicle details fetched successfully');
      setSnackbarVisible(true);
    } else {
      setSnackbarMessage('Please enter a vehicle number');
      setSnackbarVisible(true);
    }
  };
  
  const handleIssueEChallan = () => {
    // Validate form
    if (!vehicleNumber || !driverName || selectedViolations.length === 0 || !location) {
      setSnackbarMessage('Please fill all required fields');
      setSnackbarVisible(true);
      return;
    }
    
    // In a real app, this would submit to an API
    setSnackbarMessage('E-Challan issued successfully');
    setSnackbarVisible(true);
    
    // Reset form after submission
    setTimeout(() => {
      resetForm();
      setActiveTab('history');
    }, 1500);
  };
  
  const renderIssueForm = () => (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.formContainer}
    >
      <Animatable.View 
        animation="fadeIn" 
        duration={500}
      >
        {step === 1 && (
          <>
            <Surface style={[styles.formSection, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Vehicle & Driver Details</Text>
              <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
              
              <View style={styles.inputRow}>
                <TextInput
                  label="Vehicle Number"
                  value={vehicleNumber}
                  onChangeText={setVehicleNumber}
                  mode="outlined"
                  style={styles.input}
                  autoCapitalize="characters"
                  right={
                    <TextInput.Icon 
                      icon="magnify" 
                      onPress={handleVehicleLookup}
                      forceTextInputFocus={false}
                    />
                  }
                  theme={{ colors: { primary: theme.primary } }}
                />
              </View>
              
              <View style={styles.inputRow}>
                <TextInput
                  label="Driver Name"
                  value={driverName}
                  onChangeText={setDriverName}
                  mode="outlined"
                  style={styles.input}
                  theme={{ colors: { primary: theme.primary } }}
                />
              </View>
              
              <View style={styles.inputRow}>
                <TextInput
                  label="Driver License Number"
                  value={driverLicense}
                  onChangeText={setDriverLicense}
                  mode="outlined"
                  style={styles.input}
                  theme={{ colors: { primary: theme.primary } }}
                />
              </View>
              
              <View style={styles.inputRow}>
                <TextInput
                  label="Location"
                  value={location}
                  onChangeText={setLocation}
                  mode="outlined"
                  style={styles.input}
                  right={
                    <TextInput.Icon 
                      icon="map-marker" 
                      onPress={() => {
                        // In a real app, this would get current location
                        setLocation('MG Road, Bangalore');
                        setSnackbarMessage('Current location added');
                        setSnackbarVisible(true);
                      }}
                      forceTextInputFocus={false}
                    />
                  }
                  theme={{ colors: { primary: theme.primary } }}
                />
              </View>
              
              <View style={styles.buttonRow}>
                <Button 
                  mode="contained" 
                  onPress={() => setStep(2)}
                  style={styles.button}
                  disabled={!vehicleNumber || !driverName || !location}
                >
                  Next
                </Button>
              </View>
            </Surface>
          </>
        )}
        
        {step === 2 && (
          <>
            <Surface style={[styles.formSection, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Violation Details</Text>
              <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
              
              <TouchableOpacity 
                style={[styles.violationSelector, { borderColor: theme.border }]}
                onPress={() => setShowViolations(!showViolations)}
              >
                <View style={styles.violationSelectorContent}>
                  <Text style={[styles.violationSelectorText, { color: theme.text }]}>
                    {selectedViolations.length === 0 
                      ? 'Select Violations' 
                      : `${selectedViolations.length} Violation${selectedViolations.length > 1 ? 's' : ''} Selected`}
                  </Text>
                  <IconButton 
                    icon={showViolations ? "chevron-up" : "chevron-down"} 
                    size={24} 
                    iconColor={theme.primary}
                  />
                </View>
                
                {showViolations && (
                  <Animatable.View 
                    animation="fadeIn" 
                    duration={300}
                    style={styles.violationsList}
                  >
                    {violationTypes.map((violation) => (
                      <TouchableOpacity 
                        key={violation.id}
                        style={[
                          styles.violationItem, 
                          selectedViolations.includes(violation.id) && { 
                            backgroundColor: theme.primary + '20' 
                          }
                        ]}
                        onPress={() => handleAddViolation(violation.id)}
                      >
                        <View style={styles.violationInfo}>
                          <Text style={[styles.violationName, { color: theme.text }]}>{violation.name}</Text>
                          <Text style={[styles.violationDetails, { color: theme.textSecondary }]}>
                            Fine: ₹{violation.baseAmount} | Points: {violation.points}
                          </Text>
                        </View>
                        {selectedViolations.includes(violation.id) && (
                          <IconButton 
                            icon="check-circle" 
                            size={24} 
                            iconColor={theme.primary}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </Animatable.View>
                )}
              </TouchableOpacity>
              
              <View style={styles.summaryContainer}>
                {selectedViolations.length > 0 && (
                  <Animatable.View 
                    animation="fadeIn" 
                    duration={500}
                  >
                    <Text style={[styles.summaryTitle, { color: theme.text }]}>Summary</Text>
                    
                    <View style={styles.summaryContent}>
                      {selectedViolations.map(id => {
                        const violation = violationTypes.find(v => v.id === id);
                        if (violation) {
                          return (
                            <View key={violation.id} style={styles.summaryRow}>
                              <Text style={[styles.summaryViolation, { color: theme.text }]}>{violation.name}</Text>
                              <Text style={[styles.summaryAmount, { color: theme.text }]}>₹{violation.baseAmount}</Text>
                            </View>
                          );
                        }
                        return null;
                      })}
                      
                      <Divider style={[styles.summaryDivider, { backgroundColor: theme.divider }]} />
                      
                      <View style={styles.summaryTotalRow}>
                        <View>
                          <Text style={[styles.summaryTotal, { color: theme.text }]}>Total Amount</Text>
                          <Text style={[styles.pointsText, { color: theme.warning }]}>
                            {totalPoints} Point{totalPoints !== 1 ? 's' : ''} on License
                          </Text>
                        </View>
                        <Text style={[styles.summaryTotalAmount, { color: theme.error }]}>₹{totalAmount}</Text>
                      </View>
                    </View>
                  </Animatable.View>
                )}
              </View>
              
              <View style={styles.inputRow}>
                <TextInput
                  label="Remarks"
                  value={remarks}
                  onChangeText={setRemarks}
                  mode="outlined"
                  style={styles.input}
                  multiline
                  numberOfLines={3}
                  theme={{ colors: { primary: theme.primary } }}
                />
              </View>
              
              <View style={styles.evidenceContainer}>
                <Text style={[styles.evidenceTitle, { color: theme.text }]}>Evidence</Text>
                <TouchableOpacity 
                  style={[styles.evidenceButton, { 
                    borderColor: theme.border,
                    backgroundColor: evidenceAdded ? theme.primary + '10' : 'transparent'
                  }]}
                  onPress={handleAddEvidence}
                >
                  {evidenceAdded ? (
                    <View style={styles.evidenceAdded}>
                      <IconButton 
                        icon="check-circle" 
                        size={24} 
                        iconColor={theme.success}
                      />
                      <Text style={[styles.evidenceText, { color: theme.success }]}>
                        Evidence Added
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.evidenceUpload}>
                      <IconButton 
                        icon="camera" 
                        size={24} 
                        iconColor={theme.primary}
                      />
                      <Text style={[styles.evidenceText, { color: theme.primary }]}>
                        Add Photo Evidence
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              
              <View style={styles.buttonRow}>
                <Button 
                  mode="outlined" 
                  onPress={() => setStep(1)}
                  style={[styles.button, styles.backButton]}
                >
                  Back
                </Button>
                <Button 
                  mode="contained" 
                  onPress={handleIssueEChallan}
                  style={styles.button}
                  disabled={selectedViolations.length === 0}
                >
                  Issue E-Challan
                </Button>
              </View>
            </Surface>
          </>
        )}
      </Animatable.View>
    </KeyboardAvoidingView>
  );
  
  const renderHistoryTab = () => (
    <View style={styles.historyContainer}>
      <Animatable.View 
        animation="fadeIn" 
        duration={500}
      >
        <Surface style={[styles.statsCard, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>128</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Issued This Month</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.success }]}>₹124,500</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Amount</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>87%</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Collection Rate</Text>
            </View>
          </View>
        </Surface>
        
        <View style={styles.recentHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recently Issued E-Challans</Text>
          <TouchableOpacity>
            <Text style={[styles.viewAllText, { color: theme.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <Surface style={[styles.tableCard, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Challan ID</DataTable.Title>
              <DataTable.Title>Vehicle No.</DataTable.Title>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title numeric>Amount</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
            </DataTable.Header>
            
            {recentChallans.map((challan) => (
              <DataTable.Row key={challan.id} onPress={() => {
                setSnackbarMessage(`Viewing details of challan ${challan.id}`);
                setSnackbarVisible(true);
              }}>
                <DataTable.Cell textStyle={{ color: theme.text }}>{challan.id}</DataTable.Cell>
                <DataTable.Cell textStyle={{ color: theme.text }}>{challan.vehicleNo}</DataTable.Cell>
                <DataTable.Cell textStyle={{ color: theme.text }}>{challan.date}</DataTable.Cell>
                <DataTable.Cell numeric textStyle={{ color: theme.text }}>{challan.amount}</DataTable.Cell>
                <DataTable.Cell>
                  <Chip 
                    mode="flat" 
                    style={{ 
                      backgroundColor: challan.status === 'Paid' ? theme.success + '20' : theme.warning + '20',
                    }}
                    textStyle={{ 
                      color: challan.status === 'Paid' ? theme.success : theme.warning,
                      fontSize: 12
                    }}
                    compact
                  >
                    {challan.status}
                  </Chip>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Surface>
        
        <Surface style={[styles.filtersCard, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={2}>
          <Text style={[styles.filterTitle, { color: theme.text }]}>Quick Filters</Text>
          <View style={styles.filterChips}>
            <Chip 
              style={[styles.filterChip, { backgroundColor: theme.primary + '20' }]} 
              textStyle={{ color: theme.primary }}
              onPress={() => {}}
            >
              Today
            </Chip>
            <Chip 
              style={styles.filterChip} 
              onPress={() => {}}
            >
              This Week
            </Chip>
            <Chip 
              style={styles.filterChip} 
              onPress={() => {}}
            >
              Pending
            </Chip>
            <Chip 
              style={styles.filterChip} 
              onPress={() => {}}
            >
              Paid
            </Chip>
          </View>
          
          <Button 
            mode="contained" 
            icon="filter-variant" 
            onPress={() => {}}
            style={styles.advancedFilterButton}
          >
            Advanced Filters
          </Button>
        </Surface>
      </Animatable.View>
    </View>
  );

  return (
    <ScreenWithSidebar
      title="E-Challan Management"
      navigation={navigation}
      notificationCount={4}
    >
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <SegmentedButtons
            value={activeTab}
            onValueChange={setActiveTab}
            buttons={[
              {
                value: 'issue',
                label: 'Issue E-Challan',
                style: { 
                  backgroundColor: activeTab === 'issue' ? 
                    (isDarkMode ? '#2C2C2C' : theme.primary + '20') : 
                    'transparent' 
                }
              },
              {
                value: 'history',
                label: 'History & Reports',
                style: { 
                  backgroundColor: activeTab === 'history' ? 
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
          {activeTab === 'issue' ? renderIssueForm() : renderHistoryTab()}
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
  formContainer: {
    flex: 1,
  },
  formSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  inputRow: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
  },
  backButton: {
    marginRight: 8,
  },
  violationSelector: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  violationSelectorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  violationSelectorText: {
    fontSize: 16,
  },
  violationsList: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  violationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  violationInfo: {
    flex: 1,
  },
  violationName: {
    fontSize: 16,
    fontWeight: '500',
  },
  violationDetails: {
    fontSize: 14,
    marginTop: 2,
  },
  summaryContainer: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryContent: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryViolation: {
    flex: 1,
    fontSize: 14,
  },
  summaryAmount: {
    fontSize: 14,
    fontWeight: '500',
  },
  summaryDivider: {
    marginVertical: 8,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pointsText: {
    fontSize: 12,
    marginTop: 2,
  },
  summaryTotalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  evidenceContainer: {
    marginBottom: 16,
  },
  evidenceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  evidenceButton: {
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: 'dashed',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  evidenceUpload: {
    alignItems: 'center',
  },
  evidenceAdded: {
    alignItems: 'center',
  },
  evidenceText: {
    fontSize: 14,
    marginTop: 4,
  },
  historyContainer: {
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
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  viewAllText: {
    fontSize: 14,
  },
  tableCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  filtersCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  advancedFilterButton: {
    borderRadius: 8,
  },
  snackbar: {
    bottom: 16,
  },
});

export default EChallanScreen; 