import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import FuturisticButton from './FuturisticButton';

interface NumberPlateScannerProps {
  onScanComplete: (licensePlate: string) => void;
  onClose?: () => void;
}

const { width } = Dimensions.get('window');

const NumberPlateScanner: React.FC<NumberPlateScannerProps> = ({
  onScanComplete,
  onClose,
}) => {
  const { theme, isDarkMode } = useTheme();
  const [isScanning, setIsScanning] = useState(false);
  
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
        setIsScanning(true);
        await simulateOCRProcessing(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      setIsScanning(false);
    }
  };
  
  // Simulate OCR processing
  const simulateOCRProcessing = async (imageUri: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a random license plate for demo purposes
    // In a real app, this would be the result from the OCR API
    const randomPlates = [
      'MH01AB1234',
      'DL02CD5678',
      'KA03EF9012',
      'TN04GH3456',
      'WB05IJ7890',
      'GJ06KL1234',
    ];
    
    const randomPlate = randomPlates[Math.floor(Math.random() * randomPlates.length)];
    
    // Complete the scan
    setIsScanning(false);
    onScanComplete(randomPlate);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>
          Number Plate Scanner
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Select a photo of a vehicle's number plate to scan
        </Text>
        
        <Animatable.View 
          animation="pulse" 
          iterationCount="infinite" 
          duration={2000}
          style={styles.imagePickerContainer}
        >
          <TouchableOpacity
            style={[styles.imagePickerButton, { 
              backgroundColor: theme.card,
              borderColor: theme.primary 
            }]}
            onPress={pickImage}
            disabled={isScanning}
          >
            {isScanning ? (
              <ActivityIndicator size="large" color={theme.primary} />
            ) : (
              <>
                <Ionicons name="images" size={40} color={theme.primary} />
                <Text style={[styles.buttonText, { color: theme.text }]}>
                  Select Image
                </Text>
              </>
            )}
          </TouchableOpacity>
        </Animatable.View>
        
        {onClose && (
          <FuturisticButton
            title="Close"
            onPress={onClose}
            icon="close"
            variant="danger"
            style={styles.closeButton}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  imagePickerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  imagePickerButton: {
    width: width * 0.8,
    height: width * 0.6,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  buttonText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 16,
  },
});

export default NumberPlateScanner; 