import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NumberPlateStackParamList } from '../../navigation/types';
import { 
  Button, 
  Surface, 
  Chip, 
  Divider, 
  IconButton, 
  ProgressBar,
  DataTable
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import ScreenWithSidebar from '../../components/ScreenWithSidebar';

type Props = NativeStackScreenProps<NumberPlateStackParamList, 'PlateResults'>;

const { width } = Dimensions.get('window');

const PlateResultsScreen = ({ route, navigation }: Props) => {
  const { theme, isDarkMode } = useTheme();
  const { licensePlate } = route.params;
  const [isVerified, setIsVerified] = useState(true);
  const [showFullDetails, setShowFullDetails] = useState(false);

  // This would be replaced with actual API call to get vehicle information
  const vehicleInfo = {
    licensePlate,
    owner: 'Akhil',
    model: 'Toyota Corolla',
    year: '2019',
    color: 'Silver',
    status: 'Registered',
    registrationExpiry: '2024-05-15',
    insurance: {
      provider: 'SafeDrive Insurance',
      policyNumber: 'POL-123456789',
      validUntil: '2024-06-30',
      status: 'Valid'
    },
    emissions: {
      status: 'Passed',
      lastTest: '2023-09-25',
      nextDue: '2025-09-25'
    },
    taxPaid: true,
    taxValidUntil: '2024-03-31',
    violations: [
      {
        date: '2023-07-15',
        type: 'Parking Violation',
        location: 'Main Street',
        amount: '₹500',
        paid: true
      },
      {
        date: '2023-05-22',
        type: 'Speeding',
        location: 'Highway 42',
        amount: '₹1,000',
        paid: false
      }
    ]
  };

  return (
    <ScreenWithSidebar
      title={`Plate: ${licensePlate}`}
      navigation={navigation}
      notificationCount={3}
      showReportsButton={true}
    >
      <View style={styles.content}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animatable.View 
            animation="fadeInUp"
            duration={600}
            style={styles.mainCard}
          >
            <Surface style={[styles.plateCard, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={5}>
            
              <View style={styles.plateHeader}>
                <View style={styles.plateNumberContainer}>
                  <Text style={[styles.plateNumberLabel, { color: theme.textSecondary }]}>
                    License Plate
                  </Text>
                  <Text style={[styles.plateNumber, { color: theme.text }]}>
                    {licensePlate}
                  </Text>
                </View>
                
                <View style={[
                  styles.statusIndicator, 
                  { 
                    backgroundColor: isVerified ? 
                      isDarkMode ? '#4CAF5080' : '#4CAF5030' : 
                      isDarkMode ? '#F4433680' : '#F4433630' 
                  }
                ]}>
                  <IconButton
                    icon={isVerified ? "check-circle" : "alert-circle"}
                    iconColor={isVerified ? '#4CAF50' : '#F44336'}
                    size={24}
                  />
                  <Text style={[
                    styles.statusText,
                    { color: isVerified ? '#4CAF50' : '#F44336' }
                  ]}>
                    {isVerified ? 'Verified' : 'Unverified'}
                  </Text>
                </View>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.vehicleInfoContainer}>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                      Vehicle
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.text }]}>
                      {vehicleInfo.model}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                      Year
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.text }]}>
                      {vehicleInfo.year}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                      Owner
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.text }]}>
                      {vehicleInfo.owner}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                      Color
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.text }]}>
                      {vehicleInfo.color}
                    </Text>
                  </View>
                </View>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.complianceContainer}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Compliance Status
                </Text>
                
                <View style={styles.complianceItems}>
                  <View style={styles.complianceItem}>
                    <View style={styles.complianceHeader}>
                      <IconButton
                        icon="shield-car"
                        size={20}
                        iconColor={vehicleInfo.status === 'Registered' ? '#4CAF50' : '#F44336'}
                      />
                      <Text style={[styles.complianceTitle, { color: theme.text }]}>
                        Registration
                      </Text>
                    </View>
                    <Text style={[styles.complianceStatus, { 
                      color: vehicleInfo.status === 'Registered' ? '#4CAF50' : '#F44336' 
                    }]}>
                      {vehicleInfo.status}
                    </Text>
                    <Text style={[styles.complianceExpiry, { color: theme.textSecondary }]}>
                      Expires: {vehicleInfo.registrationExpiry}
                    </Text>
                  </View>
                  
                  <View style={styles.complianceItem}>
                    <View style={styles.complianceHeader}>
                      <IconButton
                        icon="shield-check"
                        size={20}
                        iconColor={vehicleInfo.insurance.status === 'Valid' ? '#4CAF50' : '#F44336'}
                      />
                      <Text style={[styles.complianceTitle, { color: theme.text }]}>
                        Insurance
                      </Text>
                    </View>
                    <Text style={[styles.complianceStatus, { 
                      color: vehicleInfo.insurance.status === 'Valid' ? '#4CAF50' : '#F44336' 
                    }]}>
                      {vehicleInfo.insurance.status}
                    </Text>
                    <Text style={[styles.complianceExpiry, { color: theme.textSecondary }]}>
                      Expires: {vehicleInfo.insurance.validUntil}
                    </Text>
                  </View>
                  
                  <View style={styles.complianceItem}>
                    <View style={styles.complianceHeader}>
                      <IconButton
                        icon="leaf"
                        size={20}
                        iconColor={vehicleInfo.emissions.status === 'Passed' ? '#4CAF50' : '#F44336'}
                      />
                      <Text style={[styles.complianceTitle, { color: theme.text }]}>
                        Emissions
                      </Text>
                    </View>
                    <Text style={[styles.complianceStatus, { 
                      color: vehicleInfo.emissions.status === 'Passed' ? '#4CAF50' : '#F44336' 
                    }]}>
                      {vehicleInfo.emissions.status}
                    </Text>
                    <Text style={[styles.complianceExpiry, { color: theme.textSecondary }]}>
                      Next due: {vehicleInfo.emissions.nextDue}
                    </Text>
                  </View>
                  
                  <View style={styles.complianceItem}>
                    <View style={styles.complianceHeader}>
                      <IconButton
                        icon="cash"
                        size={20}
                        iconColor={vehicleInfo.taxPaid ? '#4CAF50' : '#F44336'}
                      />
                      <Text style={[styles.complianceTitle, { color: theme.text }]}>
                        Road Tax
                      </Text>
                    </View>
                    <Text style={[styles.complianceStatus, { 
                      color: vehicleInfo.taxPaid ? '#4CAF50' : '#F44336' 
                    }]}>
                      {vehicleInfo.taxPaid ? 'Paid' : 'Unpaid'}
                    </Text>
                    <Text style={[styles.complianceExpiry, { color: theme.textSecondary }]}>
                      Valid until: {vehicleInfo.taxValidUntil}
                    </Text>
                  </View>
                </View>
              </View>
            </Surface>
          </Animatable.View>
          
          <Animatable.View 
            animation="fadeInUp"
            delay={300}
            duration={600}
          >
            <Surface style={[styles.violationsCard, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={5}>
              <View style={styles.violationsHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Violations
                </Text>
                <Chip
                  mode="outlined"
                  textStyle={{ color: theme.text }}
                  style={{ borderColor: vehicleInfo.violations.some(v => !v.paid) ? '#F44336' : '#4CAF50' }}
                >
                  {vehicleInfo.violations.some(v => !v.paid) ? 'Pending Payment' : 'All Paid'}
                </Chip>
              </View>
              
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title textStyle={{ color: theme.text }}>Date</DataTable.Title>
                  <DataTable.Title textStyle={{ color: theme.text }}>Violation</DataTable.Title>
                  <DataTable.Title numeric textStyle={{ color: theme.text }}>Amount</DataTable.Title>
                  <DataTable.Title numeric textStyle={{ color: theme.text }}>Status</DataTable.Title>
                </DataTable.Header>
                
                {vehicleInfo.violations.map((violation, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell textStyle={{ color: theme.text }}>{violation.date}</DataTable.Cell>
                    <DataTable.Cell textStyle={{ color: theme.text }}>{violation.type}</DataTable.Cell>
                    <DataTable.Cell numeric textStyle={{ color: theme.text }}>{violation.amount}</DataTable.Cell>
                    <DataTable.Cell 
                      numeric 
                      textStyle={{ 
                        color: violation.paid ? '#4CAF50' : '#F44336',
                        fontWeight: '500'
                      }}
                    >
                      {violation.paid ? 'Paid' : 'Unpaid'}
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </Surface>
          </Animatable.View>
          
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              style={styles.actionButton}
              onPress={() => navigation.navigate('VehicleDetails', { vehicleId: licensePlate })}
            >
              View Full Details
            </Button>
            
            <Button
              mode="outlined"
              style={[styles.actionButton, { marginTop: 12 }]}
              onPress={() => navigation.navigate('PlateHistory')}
            >
              View Scan History
            </Button>
          </View>
        </ScrollView>
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
  },
  scrollContent: {
    padding: 16,
  },
  mainCard: {
    marginTop: 8,
    marginBottom: 16,
  },
  plateCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  plateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  plateNumberContainer: {
    flex: 1,
  },
  plateNumberLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  plateNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontWeight: '600',
    marginRight: 4,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  vehicleInfoContainer: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  complianceContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  complianceItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  complianceItem: {
    width: '48%',
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  complianceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  complianceTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  complianceStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  complianceExpiry: {
    fontSize: 12,
  },
  violationsCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  violationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  actionButton: {
    borderRadius: 8,
  },
});

export default PlateResultsScreen; 