import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  StatusBar,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NumberPlateStackParamList } from '../../navigation/types';
import FuturisticHeader from '../../components/FuturisticHeader';
import { 
  Card, 
  Button, 
  Divider, 
  List, 
  Surface, 
  IconButton, 
  ProgressBar,
  Chip,
  SegmentedButtons
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import ScreenWithSidebar from '../../components/ScreenWithSidebar';

type Props = NativeStackScreenProps<NumberPlateStackParamList, 'VehicleDetails'>;

const { width } = Dimensions.get('window');

// Mock vehicle data
const mockVehicleData = {
  id: '123',
  make: 'Toyota',
  model: 'Corolla',
  year: '2019',
  color: 'Silver',
  licensePlate: 'ABC-1234',
  vin: 'JT2BF22K1W0123456',
  registrationDate: '2019-05-15',
  registrationExpiry: '2024-05-15',
  owner: {
    name: 'Akhil',
    licenseNumber: 'DL-987654321',
    address: '123 Main Street, Cityville',
    phone: '+1 (555) 123-4567',
    email: 'Akhil.doe@example.com',
    dob: '1985-06-12'
  },
  insurance: {
    provider: 'SafeDrive Insurance',
    policyNumber: 'POL-123456789',
    validUntil: '2024-06-30',
    coverage: 'Comprehensive',
    amount: '₹500,000'
  },
  status: 'Active',
  emissions: 'Passed (2023-02-10)',
  taxStatus: 'Paid',
  taxValidUntil: '2024-03-31',
  fuelType: 'Petrol',
  engineNumber: 'EN12345678',
  chassisNumber: 'CH98765432',
  engineCapacity: '1496 cc',
  seatingCapacity: '5',
  manufacturingDate: 'Jan 2019',
  vehicleClass: 'LMV',
  fitnessUpto: '2029-05-15',
  financier: 'None',
  hypothecatedTo: 'None',
  rcStatus: 'Active',
  blacklisted: false,
  stolen: false,
  recalls: [],
  modifications: [],
  serviceHistory: [
    { date: '2023-01-15', odometer: '25,000 km', service: 'Regular Maintenance', center: 'Toyota Service Center' },
    { date: '2022-07-10', odometer: '20,000 km', service: 'Oil Change, Filter Replacement', center: 'Toyota Service Center' },
    { date: '2022-01-05', odometer: '15,000 km', service: 'Regular Maintenance', center: 'Toyota Service Center' },
    { date: '2021-06-20', odometer: '10,000 km', service: 'Oil Change, Brake Inspection', center: 'Toyota Service Center' },
    { date: '2020-12-12', odometer: '5,000 km', service: 'First Service', center: 'Toyota Service Center' }
  ],
  complianceScore: 98
};

const VehicleDetailsScreen = ({ route, navigation }: Props) => {
  const { theme, isDarkMode } = useTheme();
  const { vehicleId } = route.params;
  const [activeTab, setActiveTab] = useState('details');
  
  // In a real app, we would fetch the vehicle data using the vehicleId
  const vehicleData = mockVehicleData;

  const renderDetailsTab = () => (
    <View style={styles.tabContent}>
      <Animatable.View 
        animation="fadeIn" 
        duration={500}
      >
        <Surface style={[styles.card, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={4}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Registration Information</Text>
          <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
          
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>VIN:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.vin}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Registered:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.registrationDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Expires:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.registrationExpiry}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Emissions:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.emissions}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Tax Status:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.taxStatus}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Tax Valid Until:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.taxValidUntil}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>RC Status:</Text>
            <Text style={[styles.value, { color: vehicleData.rcStatus === 'Active' ? theme.success : theme.error }]}>
              {vehicleData.rcStatus}
            </Text>
          </View>
          
          <View style={styles.statusChips}>
            <Chip 
              mode="outlined" 
              style={[styles.chip, { 
                backgroundColor: vehicleData.blacklisted ? theme.error + '20' : theme.success + '20',
                borderColor: vehicleData.blacklisted ? theme.error : theme.success
              }]}
              textStyle={{ color: vehicleData.blacklisted ? theme.error : theme.success }}
              icon={vehicleData.blacklisted ? "alert-circle" : "check-circle"}
            >
              {vehicleData.blacklisted ? "Blacklisted" : "Not Blacklisted"}
            </Chip>
            
            <Chip 
              mode="outlined" 
              style={[styles.chip, { 
                backgroundColor: vehicleData.stolen ? theme.error + '20' : theme.success + '20',
                borderColor: vehicleData.stolen ? theme.error : theme.success
              }]}
              textStyle={{ color: vehicleData.stolen ? theme.error : theme.success }}
              icon={vehicleData.stolen ? "alert-circle" : "check-circle"}
            >
              {vehicleData.stolen ? "Reported Stolen" : "Not Stolen"}
            </Chip>
          </View>
        </Surface>
      </Animatable.View>
      
      <Animatable.View 
        animation="fadeIn" 
        duration={500}
        delay={100}
      >
        <Surface style={[styles.card, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={4}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Owner Information</Text>
          <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
          
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Name:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.owner.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>License:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.owner.licenseNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Address:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.owner.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Phone:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.owner.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Email:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.owner.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Date of Birth:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.owner.dob}</Text>
          </View>
        </Surface>
      </Animatable.View>
      
      <Animatable.View 
        animation="fadeIn" 
        duration={500}
        delay={200}
      >
        <Surface style={[styles.card, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={4}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Insurance Information</Text>
          <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
          
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Provider:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.insurance.provider}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Policy #:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.insurance.policyNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Valid Until:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.insurance.validUntil}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Coverage:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.insurance.coverage}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Amount:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.insurance.amount}</Text>
          </View>
        </Surface>
      </Animatable.View>
      
      <Animatable.View 
        animation="fadeIn" 
        duration={500}
        delay={300}
      >
        <Surface style={[styles.card, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={4}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Technical Specifications</Text>
          <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
          
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Engine No:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.engineNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Chassis No:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.chassisNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Fuel Type:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.fuelType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Engine Capacity:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.engineCapacity}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Seating:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.seatingCapacity}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Manufactured:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.manufacturingDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Class:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.vehicleClass}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Fitness Until:</Text>
            <Text style={[styles.value, { color: theme.text }]}>{vehicleData.fitnessUpto}</Text>
          </View>
        </Surface>
      </Animatable.View>
    </View>
  );

  const renderServiceTab = () => (
    <View style={styles.tabContent}>
      <Animatable.View 
        animation="fadeIn" 
        duration={500}
      >
        <Surface style={[styles.card, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={4}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Service History</Text>
          <Divider style={[styles.divider, { backgroundColor: theme.divider }]} />
          
          {vehicleData.serviceHistory.map((service, index) => (
            <React.Fragment key={index}>
              <View style={styles.serviceItem}>
                <View style={styles.serviceHeader}>
                  <View style={styles.serviceDate}>
                    <IconButton
                      icon="calendar"
                      size={16}
                      iconColor={theme.primary}
                      style={styles.serviceIcon}
                    />
                    <Text style={[styles.serviceDateText, { color: theme.text }]}>{service.date}</Text>
                  </View>
                  <Text style={[styles.serviceOdometer, { color: theme.textSecondary }]}>
                    {service.odometer}
                  </Text>
                </View>
                
                <View style={styles.serviceDetails}>
                  <Text style={[styles.serviceType, { color: theme.text }]}>{service.service}</Text>
                  <Text style={[styles.serviceCenter, { color: theme.textSecondary }]}>
                    {service.center}
                  </Text>
                </View>
              </View>
              {index < vehicleData.serviceHistory.length - 1 && (
                <Divider style={[styles.serviceDivider, { backgroundColor: theme.divider }]} />
              )}
            </React.Fragment>
          ))}
        </Surface>
      </Animatable.View>
    </View>
  );

  return (
    <ScreenWithSidebar
      title="Vehicle Details"
      navigation={navigation}
      notificationCount={3}
    >
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animatable.View 
          animation="fadeInDown" 
          duration={800}
        >
          <Surface style={[styles.vehicleCard, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={5}>
            <View style={styles.vehicleImageContainer}>
              <Image 
                source={{ uri: 'https://www.motortrend.com/uploads/sites/10/2019/11/2020-toyota-corolla-le-sedan-angular-front.png' }} 
                style={styles.vehicleImage}
                resizeMode="contain"
              />
            </View>
            
            <View style={styles.vehicleHeader}>
              <View style={styles.vehicleInfo}>
                <Text style={[styles.vehicleName, { color: theme.text }]}>
                  {vehicleData.make} {vehicleData.model}
                </Text>
                <Text style={[styles.vehicleYear, { color: theme.textSecondary }]}>
                  {vehicleData.year} • {vehicleData.color}
                </Text>
                <Text style={[styles.licensePlate, { color: theme.primary }]}>
                  {vehicleData.licensePlate}
                </Text>
              </View>
              <View style={styles.statusContainer}>
                <View style={[styles.statusBadge, { backgroundColor: theme.success }]}>
                  <Text style={styles.statusText}>{vehicleData.status}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.complianceContainer}>
              <View style={styles.complianceHeader}>
                <Text style={[styles.complianceTitle, { color: theme.text }]}>
                  Compliance Score
                </Text>
                <Text style={[styles.complianceScore, { color: theme.success }]}>
                  {vehicleData.complianceScore}%
                </Text>
              </View>
              <ProgressBar 
                progress={vehicleData.complianceScore / 100} 
                color={theme.success} 
                style={styles.complianceBar}
              />
            </View>
          </Surface>
        </Animatable.View>
        
        <View style={styles.tabContainer}>
          <SegmentedButtons
            value={activeTab}
            onValueChange={setActiveTab}
            buttons={[
              {
                value: 'details',
                label: 'Details',
                icon: 'information-outline',
                style: { 
                  backgroundColor: activeTab === 'details' ? 
                    (isDarkMode ? '#2C2C2C' : theme.primary + '20') : 
                    'transparent' 
                }
              },
              {
                value: 'service',
                label: 'Service History',
                icon: 'wrench-outline',
                style: { 
                  backgroundColor: activeTab === 'service' ? 
                    (isDarkMode ? '#2C2C2C' : theme.primary + '20') : 
                    'transparent' 
                }
              },
            ]}
            style={styles.segmentedButtons}
          />
        </View>
        
        {activeTab === 'details' ? renderDetailsTab() : renderServiceTab()}
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            style={styles.button}
            icon="file-document-outline"
            onPress={() => navigation.navigate('PlateHistory')}
          >
            View History
          </Button>
        </View>
      </ScrollView>
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
  vehicleCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  vehicleImageContainer: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  vehicleYear: {
    fontSize: 16,
    marginBottom: 4,
  },
  licensePlate: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusContainer: {
    marginLeft: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  complianceContainer: {
    padding: 16,
    paddingTop: 0,
  },
  complianceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  complianceTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  complianceScore: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  complianceBar: {
    height: 8,
    borderRadius: 4,
  },
  tabContainer: {
    marginBottom: 16,
  },
  segmentedButtons: {
    backgroundColor: 'transparent',
  },
  tabContent: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  label: {
    width: 110,
    fontWeight: '600',
  },
  value: {
    flex: 1,
  },
  statusChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
    marginTop: 8,
  },
  serviceItem: {
    marginBottom: 12,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    margin: 0,
    padding: 0,
  },
  serviceDateText: {
    fontWeight: '500',
  },
  serviceOdometer: {
    fontSize: 14,
  },
  serviceDetails: {
    marginLeft: 36,
  },
  serviceType: {
    fontSize: 14,
    marginBottom: 2,
  },
  serviceCenter: {
    fontSize: 12,
  },
  serviceDivider: {
    marginVertical: 12,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    marginBottom: 12,
  },
});

export default VehicleDetailsScreen; 