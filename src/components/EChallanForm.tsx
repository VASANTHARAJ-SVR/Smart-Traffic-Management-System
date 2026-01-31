import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import GlassmorphicCard from './GlassmorphicCard';
import FuturisticButton from './FuturisticButton';
import * as ImagePicker from 'expo-image-picker';
import { Vehicle, Violation } from '../types/index';

interface EChallanFormProps {
  vehicle?: Vehicle;
  onSubmit: (challanData: {
    vehicleId: string;
    violationType: string;
    location: string;
    description: string;
    fine: number;
    evidenceUrls: string[];
  }) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

// Violation types with fines
const violationTypes = [
  { id: 'speeding', label: 'Speeding', fine: 1000 },
  { id: 'red_light', label: 'Red Light Violation', fine: 1500 },
  { id: 'no_parking', label: 'No Parking', fine: 500 },
  { id: 'no_helmet', label: 'No Helmet', fine: 1000 },
  { id: 'no_seatbelt', label: 'No Seatbelt', fine: 1000 },
  { id: 'wrong_side', label: 'Driving on Wrong Side', fine: 2000 },
  { id: 'no_license', label: 'Driving without License', fine: 2000 },
  { id: 'no_insurance', label: 'No Insurance', fine: 2000 },
  { id: 'overloading', label: 'Overloading', fine: 3000 },
  { id: 'drunk_driving', label: 'Drunk Driving', fine: 5000 },
  { id: 'dangerous_driving', label: 'Dangerous Driving', fine: 3000 },
  { id: 'using_phone', label: 'Using Phone while Driving', fine: 1500 },
  { id: 'other', label: 'Other Violation', fine: 1000 },
];

const EChallanForm: React.FC<EChallanFormProps> = ({
  vehicle,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { theme } = useTheme();
  const [selectedViolation, setSelectedViolation] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [customFine, setCustomFine] = useState<string>('');
  const [evidenceImages, setEvidenceImages] = useState<string[]>([]);
  
  // Get current location
  const getCurrentLocation = () => {
    // In a real app, this would use the device's GPS
    // For this demo, we'll just set a mock location
    setLocation('Current Location, City');
  };
  
  // Pick image from gallery
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setEvidenceImages([...evidenceImages, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };
  
  // Remove image
  const removeImage = (index: number) => {
    const newImages = [...evidenceImages];
    newImages.splice(index, 1);
    setEvidenceImages(newImages);
  };
  
  // Get fine amount
  const getFineAmount = () => {
    if (!selectedViolation) return 0;
    
    if (selectedViolation === 'other' && customFine) {
      return parseInt(customFine, 10) || 0;
    }
    
    const violation = violationTypes.find(v => v.id === selectedViolation);
    return violation ? violation.fine : 0;
  };
  
  // Handle submit
  const handleSubmit = () => {
    if (!selectedViolation) {
      Alert.alert('Error', 'Please select a violation type');
      return;
    }
    
    if (!location) {
      Alert.alert('Error', 'Please enter the location');
      return;
    }
    
    if (!description) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    
    if (evidenceImages.length === 0) {
      Alert.alert('Error', 'Please add at least one evidence image');
      return;
    }
    
    const fine = getFineAmount();
    if (fine <= 0) {
      Alert.alert('Error', 'Fine amount must be greater than 0');
      return;
    }
    
    onSubmit({
      vehicleId: vehicle?.id || '',
      violationType: selectedViolation,
      location,
      description,
      fine,
      evidenceUrls: evidenceImages,
    });
  };
  
  return (
    <GlassmorphicCard style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Vehicle Info */}
        {vehicle && (
          <View style={styles.vehicleInfoContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Vehicle Information
            </Text>
            
            <View style={styles.vehicleInfo}>
              <View style={styles.vehicleDetail}>
                <Text style={[styles.vehicleDetailLabel, { color: theme.textSecondary }]}>
                  License Plate
                </Text>
                <Text style={[styles.vehicleDetailValue, { color: theme.text }]}>
                  {vehicle.licensePlate}
                </Text>
              </View>
              
              <View style={styles.vehicleDetail}>
                <Text style={[styles.vehicleDetailLabel, { color: theme.textSecondary }]}>
                  Make & Model
                </Text>
                <Text style={[styles.vehicleDetailValue, { color: theme.text }]}>
                  {vehicle.make} {vehicle.model}
                </Text>
              </View>
              
              <View style={styles.vehicleDetail}>
                <Text style={[styles.vehicleDetailLabel, { color: theme.textSecondary }]}>
                  Owner
                </Text>
                <Text style={[styles.vehicleDetailValue, { color: theme.text }]}>
                  {vehicle.owner?.name || 'Unknown'}
                </Text>
              </View>
            </View>
          </View>
        )}
        
        {/* Violation Type */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Violation Type
        </Text>
        
        <View style={styles.violationTypesContainer}>
          {violationTypes.map(violation => (
            <TouchableOpacity
              key={violation.id}
              style={[
                styles.violationTypeButton,
                {
                  backgroundColor: selectedViolation === violation.id 
                    ? theme.primary 
                    : 'rgba(0, 0, 0, 0.05)',
                }
              ]}
              onPress={() => setSelectedViolation(violation.id)}
            >
              <Text 
                style={[
                  styles.violationTypeText,
                  {
                    color: selectedViolation === violation.id 
                      ? theme.white 
                      : theme.text,
                  }
                ]}
              >
                {violation.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Custom Fine (for 'Other' violation) */}
        {selectedViolation === 'other' && (
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              Custom Fine Amount (₹)
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                }
              ]}
              value={customFine}
              onChangeText={setCustomFine}
              placeholder="Enter fine amount"
              placeholderTextColor={theme.textSecondary}
              keyboardType="number-pad"
            />
          </View>
        )}
        
        {/* Location */}
        <View style={styles.inputContainer}>
          <View style={styles.inputLabelContainer}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              Location
            </Text>
            <TouchableOpacity onPress={getCurrentLocation}>
              <Ionicons name="location" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={[
              styles.input,
              { 
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              }
            ]}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter violation location"
            placeholderTextColor={theme.textSecondary}
          />
        </View>
        
        {/* Description */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
            Description
          </Text>
          <TextInput
            style={[
              styles.textArea,
              { 
                color: theme.text,
                borderColor: theme.border,
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              }
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter violation description"
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        {/* Evidence Images */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
            Evidence Images
          </Text>
          
          <View style={styles.imagesContainer}>
            {evidenceImages.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.evidenceImage} />
                <TouchableOpacity
                  style={[styles.removeImageButton, { backgroundColor: theme.error }]}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close" size={16} color={theme.white} />
                </TouchableOpacity>
              </View>
            ))}
            
            <TouchableOpacity
              style={[
                styles.addImageButton,
                { 
                  borderColor: theme.primary,
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                }
              ]}
              onPress={pickImage}
            >
              <Ionicons name="add" size={24} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Fine Amount */}
        <View style={styles.fineContainer}>
          <Text style={[styles.fineLabel, { color: theme.textSecondary }]}>
            Total Fine Amount:
          </Text>
          <Text style={[styles.fineAmount, { color: theme.error }]}>
            ₹{getFineAmount().toLocaleString()}
          </Text>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {onCancel && (
            <FuturisticButton
              title="Cancel"
              onPress={onCancel}
              variant="danger"
              icon="close"
              style={styles.cancelButton}
              disabled={isLoading}
            />
          )}
          
          <FuturisticButton
            title="Issue E-Challan"
            onPress={handleSubmit}
            variant="success"
            icon="receipt"
            loading={isLoading}
            style={styles.submitButton}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </GlassmorphicCard>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  vehicleInfoContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  vehicleInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 12,
  },
  vehicleDetail: {
    marginBottom: 8,
  },
  vehicleDetailLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  vehicleDetailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  violationTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  violationTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  violationTypeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    minHeight: 100,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  evidenceImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  fineLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  fineAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 2,
  },
});

export default EChallanForm; 