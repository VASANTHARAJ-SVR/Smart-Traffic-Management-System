import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Vehicle } from '../types/index';
import { Ionicons } from '@expo/vector-icons';
import GlassmorphicCard from './GlassmorphicCard';
import * as Animatable from 'react-native-animatable';

interface VehicleDetailsCardProps {
  vehicle: Vehicle;
  onViewDocuments?: () => void;
  onViewViolations?: () => void;
  onIssueChallan?: () => void;
}

const VehicleDetailsCard: React.FC<VehicleDetailsCardProps> = ({
  vehicle,
  onViewDocuments,
  onViewViolations,
  onIssueChallan,
}) => {
  const { theme } = useTheme();
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return theme.success;
      case 'expired':
        return theme.error;
      case 'suspended':
        return theme.warning;
      default:
        return theme.textSecondary;
    }
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Check if vehicle is stolen
  const isStolen = vehicle.stolen;
  
  return (
    <GlassmorphicCard style={styles.container}>
      {/* Stolen Vehicle Alert */}
      {isStolen && (
        <Animatable.View 
          animation="flash" 
          iterationCount="infinite" 
          duration={1000}
          style={[styles.stolenAlert, { backgroundColor: theme.error }]}
        >
          <Ionicons name="alert-circle" size={20} color={theme.white} />
          <Text style={styles.stolenAlertText}>STOLEN VEHICLE</Text>
        </Animatable.View>
      )}
      
      {/* Vehicle Basic Info */}
      <View style={styles.header}>
        <View style={styles.licensePlateContainer}>
          <Text style={[styles.licensePlateLabel, { color: theme.textSecondary }]}>
            License Plate
          </Text>
          <Text style={[styles.licensePlate, { color: theme.text }]}>
            {vehicle.licensePlate}
          </Text>
        </View>
        
        <View style={styles.vehicleIconContainer}>
          <Ionicons 
            name="car" 
            size={40} 
            color={isStolen ? theme.error : theme.primary} 
          />
          <Text style={[styles.vehicleColor, { color: theme.textSecondary }]}>
            {vehicle.color}
          </Text>
        </View>
      </View>
      
      {/* Vehicle Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Make
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {vehicle.make}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Model
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {vehicle.model}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Year
            </Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {vehicle.year}
            </Text>
          </View>
        </View>
        
        {/* Owner Info */}
        {vehicle.owner && (
          <View style={styles.ownerContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Owner Information
            </Text>
            
            <View style={styles.ownerDetails}>
              <View style={styles.ownerDetail}>
                <Ionicons name="person" size={16} color={theme.primary} />
                <Text style={[styles.ownerDetailText, { color: theme.text }]}>
                  {vehicle.owner.name}
                </Text>
              </View>
              
              <View style={styles.ownerDetail}>
                <Ionicons name="card" size={16} color={theme.primary} />
                <Text style={[styles.ownerDetailText, { color: theme.text }]}>
                  {vehicle.owner.licenseNumber}
                </Text>
              </View>
              
              <View style={styles.ownerDetail}>
                <Ionicons name="call" size={16} color={theme.primary} />
                <Text style={[styles.ownerDetailText, { color: theme.text }]}>
                  {vehicle.owner.phone}
                </Text>
              </View>
            </View>
          </View>
        )}
        
        {/* Registration & Insurance Status */}
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <Text style={[styles.statusLabel, { color: theme.textSecondary }]}>
              Registration
            </Text>
            <View style={styles.statusValueContainer}>
              <View 
                style={[
                  styles.statusDot, 
                  { backgroundColor: getStatusColor(vehicle.registrationStatus) }
                ]} 
              />
              <Text 
                style={[
                  styles.statusValue, 
                  { color: getStatusColor(vehicle.registrationStatus) }
                ]}
              >
                {vehicle.registrationStatus.toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.statusDate, { color: theme.textSecondary }]}>
              Expires: {formatDate(vehicle.registrationExpiry)}
            </Text>
          </View>
          
          <View style={styles.statusItem}>
            <Text style={[styles.statusLabel, { color: theme.textSecondary }]}>
              Insurance
            </Text>
            <View style={styles.statusValueContainer}>
              <View 
                style={[
                  styles.statusDot, 
                  { 
                    backgroundColor: vehicle.insuranceStatus 
                      ? getStatusColor(vehicle.insuranceStatus) 
                      : theme.textSecondary 
                  }
                ]} 
              />
              <Text 
                style={[
                  styles.statusValue, 
                  { 
                    color: vehicle.insuranceStatus 
                      ? getStatusColor(vehicle.insuranceStatus) 
                      : theme.textSecondary 
                  }
                ]}
              >
                {vehicle.insuranceStatus ? vehicle.insuranceStatus.toUpperCase() : 'UNKNOWN'}
              </Text>
            </View>
            <Text style={[styles.statusDate, { color: theme.textSecondary }]}>
              Expires: {formatDate(vehicle.insuranceExpiry)}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {onViewDocuments && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.primary }]}
            onPress={onViewDocuments}
          >
            <Ionicons name="document-text" size={20} color={theme.white} />
            <Text style={styles.actionButtonText}>Documents</Text>
          </TouchableOpacity>
        )}
        
        {onViewViolations && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.warning }]}
            onPress={onViewViolations}
          >
            <Ionicons name="warning" size={20} color={theme.white} />
            <Text style={styles.actionButtonText}>Violations</Text>
          </TouchableOpacity>
        )}
        
        {onIssueChallan && (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.error }]}
            onPress={onIssueChallan}
          >
            <Ionicons name="receipt" size={20} color={theme.white} />
            <Text style={styles.actionButtonText}>Issue Challan</Text>
          </TouchableOpacity>
        )}
      </View>
    </GlassmorphicCard>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  stolenAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  stolenAlertText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  licensePlateContainer: {
    flex: 1,
  },
  licensePlateLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  licensePlate: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  vehicleIconContainer: {
    alignItems: 'center',
  },
  vehicleColor: {
    fontSize: 12,
    marginTop: 4,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  ownerContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ownerDetails: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 12,
  },
  ownerDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ownerDetailText: {
    marginLeft: 8,
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginHorizontal: 4,
  },
  statusLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statusValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusDate: {
    fontSize: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,
  },
});

export default VehicleDetailsCard; 