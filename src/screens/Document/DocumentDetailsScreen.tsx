import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Surface,
  Text,
  Chip,
  Divider,
  IconButton,
  Button,
  Avatar,
} from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DocumentStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { VehicleOwnerService } from '../../services/VehicleOwnerService';
import { IVehicleOwner } from '../../models/VehicleOwner';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenWithSidebar from '../../components/ScreenWithSidebar';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<DocumentStackParamList, 'DocumentDetails'>;

const DocumentDetailsScreen = ({ route, navigation }: Props) => {
  const { theme, isDarkMode } = useTheme();
  const [vehicleOwner, setVehicleOwner] = useState<IVehicleOwner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicleOwnerData();
  }, []);

  const loadVehicleOwnerData = async () => {
    try {
      const owners = await VehicleOwnerService.getAllVehicleOwners();
      if (owners.length > 0) {
        // For demo, just show the first owner. In real app, use route.params.documentId
        setVehicleOwner(owners[0]);
      }
    } catch (error) {
      console.error('Error loading vehicle owner data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (isExpired: boolean) => {
    return isExpired ? theme.error : theme.success;
  };

  const formatDate = (date: Date) => {
    return VehicleOwnerService.formatDate(date);
  };

  if (loading) {
    return (
      <ScreenWithSidebar title="Document Details" navigation={navigation}>
        <View style={styles.loadingContainer}>
          <Text>Loading document details...</Text>
        </View>
      </ScreenWithSidebar>
    );
  }

  if (!vehicleOwner) {
    return (
      <ScreenWithSidebar title="Document Details" navigation={navigation}>
        <View style={styles.loadingContainer}>
          <Text>No document details found</Text>
        </View>
      </ScreenWithSidebar>
    );
  }

  return (
    <ScreenWithSidebar title="Document Details" navigation={navigation}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Owner Information Card */}
        <Animatable.View animation="fadeIn" duration={600}>
          <Surface style={[styles.card, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]}>
            <View style={styles.ownerHeader}>
              <Avatar.Text 
                size={60} 
                label={vehicleOwner.name.split(' ').map(n => n[0]).join('')} 
                style={{ backgroundColor: theme.primary }}
              />
              <View style={styles.ownerInfo}>
                <Text style={[styles.ownerName, { color: theme.text }]}>{vehicleOwner.name}</Text>
                <Text style={[styles.ownerDetails, { color: theme.textSecondary }]}>
                  {vehicleOwner.address.city}, {vehicleOwner.address.state}
                </Text>
                <Text style={[styles.ownerContact, { color: theme.textSecondary }]}>
                  {vehicleOwner.contactNumber}
                </Text>
              </View>
            </View>
          </Surface>
        </Animatable.View>

        {/* Vehicle Information */}
        <Animatable.View animation="fadeIn" duration={600} delay={200}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Vehicle Information</Text>
          </View>
          <Surface style={[styles.card, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]}>
            <View style={styles.vehicleInfo}>
              <Text style={[styles.vehicleNumber, { color: theme.text }]}>
                {vehicleOwner.vehicle.registrationNumber}
              </Text>
              <Text style={[styles.vehicleDetails, { color: theme.textSecondary }]}>
                {vehicleOwner.vehicle.make} {vehicleOwner.vehicle.model} ({vehicleOwner.vehicle.year})
              </Text>
              <Chip 
                style={[styles.chip, { backgroundColor: vehicleOwner.vehicle.isCommercial ? 
                  theme.warning + '20' : theme.success + '20' }]}
                textStyle={{ color: vehicleOwner.vehicle.isCommercial ? theme.warning : theme.success }}
              >
                {vehicleOwner.vehicle.isCommercial ? 'Commercial' : 'Private'}
              </Chip>
            </View>
          </Surface>
        </Animatable.View>

        {/* Documents Section */}
        <Animatable.View animation="fadeIn" duration={600} delay={400}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Documents</Text>
          </View>

          {/* License */}
          <Surface style={[styles.card, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]}>
            <View style={styles.documentHeader}>
              <IconButton icon="card-account-details" size={24} iconColor={theme.primary} />
              <Text style={[styles.documentTitle, { color: theme.text }]}>Driving License</Text>
              <Chip 
                style={[styles.statusChip, { 
                  backgroundColor: getStatusColor(vehicleOwner.drivingLicense.isExpired) + '20' 
                }]}
                textStyle={{ color: getStatusColor(vehicleOwner.drivingLicense.isExpired) }}
              >
                {vehicleOwner.drivingLicense.isExpired ? 'Expired' : 'Valid'}
              </Chip>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.documentDetails}>
              <Text style={[styles.documentNumber, { color: theme.text }]}>
                {vehicleOwner.drivingLicense.number}
              </Text>
              <Text style={[styles.documentDates, { color: theme.textSecondary }]}>
                Valid from: {formatDate(new Date(vehicleOwner.drivingLicense.issueDate))}
              </Text>
              <Text style={[styles.documentDates, { color: theme.textSecondary }]}>
                Valid until: {formatDate(new Date(vehicleOwner.drivingLicense.expiryDate))}
              </Text>
            </View>
          </Surface>

          {/* Registration */}
          <Surface style={[styles.card, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]}>
            <View style={styles.documentHeader}>
              <IconButton icon="car" size={24} iconColor={theme.primary} />
              <Text style={[styles.documentTitle, { color: theme.text }]}>Registration Certificate</Text>
              <Chip 
                style={[styles.statusChip, { 
                  backgroundColor: getStatusColor(vehicleOwner.registration.isExpired) + '20' 
                }]}
                textStyle={{ color: getStatusColor(vehicleOwner.registration.isExpired) }}
              >
                {vehicleOwner.registration.isExpired ? 'Expired' : 'Valid'}
              </Chip>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.documentDetails}>
              <Text style={[styles.documentNumber, { color: theme.text }]}>
                {vehicleOwner.registration.certificateNumber}
              </Text>
              <Text style={[styles.documentDates, { color: theme.textSecondary }]}>
                Registered on: {formatDate(new Date(vehicleOwner.registration.issueDate))}
              </Text>
              <Text style={[styles.documentDates, { color: theme.textSecondary }]}>
                Valid until: {formatDate(new Date(vehicleOwner.registration.expiryDate))}
              </Text>
            </View>
          </Surface>

          {/* Insurance */}
          <Surface style={[styles.card, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]}>
            <View style={styles.documentHeader}>
              <IconButton icon="shield-check" size={24} iconColor={theme.primary} />
              <Text style={[styles.documentTitle, { color: theme.text }]}>Insurance</Text>
              <Chip 
                style={[styles.statusChip, { 
                  backgroundColor: getStatusColor(vehicleOwner.insurance.isExpired) + '20' 
                }]}
                textStyle={{ color: getStatusColor(vehicleOwner.insurance.isExpired) }}
              >
                {vehicleOwner.insurance.isExpired ? 'Expired' : 'Valid'}
              </Chip>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.documentDetails}>
              <Text style={[styles.documentNumber, { color: theme.text }]}>
                {vehicleOwner.insurance.policyNumber}
              </Text>
              <Text style={[styles.documentInfo, { color: theme.textSecondary }]}>
                Provider: {vehicleOwner.insurance.provider}
              </Text>
              <Text style={[styles.documentDates, { color: theme.textSecondary }]}>
                Valid until: {formatDate(new Date(vehicleOwner.insurance.expiryDate))}
              </Text>
            </View>
          </Surface>

          {/* Pollution Certificate */}
          <Surface style={[styles.card, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]}>
            <View style={styles.documentHeader}>
              <IconButton icon="leaf" size={24} iconColor={theme.primary} />
              <Text style={[styles.documentTitle, { color: theme.text }]}>Pollution Certificate</Text>
              <Chip 
                style={[styles.statusChip, { 
                  backgroundColor: getStatusColor(vehicleOwner.pollutionCertificate.isExpired) + '20' 
                }]}
                textStyle={{ color: getStatusColor(vehicleOwner.pollutionCertificate.isExpired) }}
              >
                {vehicleOwner.pollutionCertificate.isExpired ? 'Expired' : 'Valid'}
              </Chip>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.documentDetails}>
              <Text style={[styles.documentNumber, { color: theme.text }]}>
                {vehicleOwner.pollutionCertificate.certificateNumber}
              </Text>
              <Text style={[styles.documentInfo, { color: theme.textSecondary }]}>
                Center: {vehicleOwner.pollutionCertificate.issuingCenter}
              </Text>
              <Text style={[styles.documentDates, { color: theme.textSecondary }]}>
                Valid until: {formatDate(new Date(vehicleOwner.pollutionCertificate.expiryDate))}
              </Text>
            </View>
          </Surface>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button 
              mode="contained"
              style={[styles.actionButton, { backgroundColor: theme.primary }]}
              onPress={() => navigation.navigate('ViolationHistory', { ownerId: vehicleOwner._id as string })}
            >
              View Violations
            </Button>
            <Button 
              mode="outlined"
              style={styles.actionButton}
              onPress={() => navigation.goBack()}
            >
              Back to Documents
            </Button>
          </View>
        </Animatable.View>
      </ScrollView>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  ownerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  ownerName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ownerDetails: {
    fontSize: 14,
    marginBottom: 2,
  },
  ownerContact: {
    fontSize: 14,
  },
  sectionHeader: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  vehicleInfo: {
    alignItems: 'center',
  },
  vehicleNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  vehicleDetails: {
    fontSize: 16,
    marginBottom: 8,
  },
  chip: {
    borderRadius: 20,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  statusChip: {
    borderRadius: 20,
  },
  divider: {
    marginVertical: 12,
  },
  documentDetails: {
    marginTop: 8,
  },
  documentNumber: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  documentInfo: {
    fontSize: 14,
    marginBottom: 4,
  },
  documentDates: {
    fontSize: 14,
    marginBottom: 4,
  },
  actionButtons: {
    marginTop: 24,
    marginBottom: 32,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 8,
  },
});

export default DocumentDetailsScreen; 