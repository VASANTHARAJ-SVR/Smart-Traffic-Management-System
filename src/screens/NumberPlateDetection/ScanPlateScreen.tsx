import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NumberPlateStackParamList } from '../../navigation/types';
import { Surface, Button, IconButton, ActivityIndicator, Portal, Modal } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import ScreenWithSidebar from '../../components/ScreenWithSidebar';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';
import { Divider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import GlassmorphicCard from '../../components/GlassmorphicCard';

type Props = NativeStackScreenProps<NumberPlateStackParamList, 'ScanPlate'>;

const { width, height } = Dimensions.get('window');

const ScanPlateScreen = ({ navigation }: Props) => {
  const { theme, isDarkMode } = useTheme();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  const scanTips = [
    {
      icon: 'car-brake-alert',
      title: 'Position Correctly',
      description: 'Hold camera 1-2 meters from the plate'
    },
    {
      icon: 'brightness-5',
      title: 'Good Lighting',
      description: 'Ensure plate is well-lit and clear'
    },
    {
      icon: 'camera-timer',
      title: 'Stay Steady',
      description: 'Keep the device stable while scanning'
    },
    {
      icon: 'crop-free',
      title: 'Full Frame',
      description: 'Entire plate should be visible'
    }
  ];

  React.useEffect(() => {
    // Rotate through tips every 5 seconds
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % scanTips.length);
    }, 5000);
    
    return () => clearInterval(tipInterval);
  }, []);

  const handleScanComplete = useCallback((licensePlate: string) => {
    navigation.navigate('PlateResults', { licensePlate });
  }, [navigation]);

  React.useEffect(() => {
    if (isScanning) {
      // Simulate scan progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      
      // Auto-complete scan after 5 seconds for demo
      setTimeout(() => {
        clearInterval(progressInterval);
        setScanProgress(100);
        setIsScanning(false);
        handleScanComplete('KA-01-AB-1234');
      }, 5000);
      
      return () => clearInterval(progressInterval);
    }
  }, [isScanning, handleScanComplete]);

  const handlePhotoUpload = async () => {
    try {
      // Request permission to access media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant permission to access your photos to upload license plate images.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Start scanning with the selected image
        setIsScanning(true);
        setScanProgress(0);
        
        // Simulate processing the uploaded image
        // In a real app, you would send this image to your backend for processing
        setTimeout(() => {
          setScanProgress(100);
          setIsScanning(false);
          handleScanComplete('KA-01-AB-1234');
        }, 5000);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        'Error',
        'Failed to pick image. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    setScanProgress(0);
  };

  return (
    <ScreenWithSidebar
      title="Number Plate Scanner"
      navigation={navigation}
      notificationCount={3}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <LinearGradient
        colors={[
          isDarkMode ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          isDarkMode ? 'rgba(18, 18, 18, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        ]}
        style={styles.gradientBackground}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animatable.View 
            animation="fadeIn" 
            duration={800}
            style={styles.scannerContainer}
          >
            <View style={styles.scannerHeader}>
              <TouchableOpacity
                onPress={() => setShowTutorial(true)}
                style={[styles.helpPill, { backgroundColor: theme.primary + '15' }]}
              >
                <MaterialCommunityIcons
                  name="help-circle-outline"
                  size={16}
                  color={theme.primary}
                  style={styles.helpIcon}
                />
                <Text style={[styles.helpText, { color: theme.primary }]}>
                  How to Scan
                </Text>
              </TouchableOpacity>
            </View>

            <GlassmorphicCard
              style={styles.uploadCard}
              intensity="high"
              animation="fadeIn"
              delay={100}
              gradientColors={isDarkMode 
                ? ['rgba(67, 97, 238, 0.2)', 'rgba(26, 32, 44, 0.6)']
                : ['rgba(235, 244, 255, 0.4)', 'rgba(230, 255, 250, 0.4)']}
            >
              <View style={styles.uploadContent}>
                <View style={[
                  styles.uploadIconContainer, 
                  { 
                    backgroundColor: isDarkMode 
                      ? 'rgba(67, 97, 238, 0.15)' 
                      : 'rgba(67, 97, 238, 0.1)',
                    borderWidth: 1,
                    borderColor: isDarkMode 
                      ? 'rgba(67, 97, 238, 0.3)' 
                      : 'rgba(67, 97, 238, 0.2)',
                  }
                ]}>
                  <IconButton
                    icon="image-plus"
                    size={80}
                    iconColor={theme.primary + '90'}
                  />
                </View>
                <Text style={[styles.uploadTitle, { color: theme.text }]}>
                  Upload License Plate Photo
                </Text>
                <Text style={[styles.uploadDescription, { color: theme.textSecondary }]}>
                  Choose a photo from your gallery
                </Text>
                <View style={styles.uploadActions}>
                  <Button
                    mode="contained"
                    onPress={handlePhotoUpload}
                    style={[
                      styles.uploadButton, 
                      { 
                        backgroundColor: theme.primary,
                        borderWidth: 1,
                        borderColor: isDarkMode 
                          ? 'rgba(67, 97, 238, 0.3)' 
                          : 'rgba(67, 97, 238, 0.2)',
                      }
                    ]}
                    icon="image"
                    contentStyle={styles.uploadButtonContent}
                  >
                    Choose Photo
                  </Button>
                </View>
              </View>
            </GlassmorphicCard>
          </Animatable.View>

          <Animatable.View 
            animation="fadeInUp" 
            delay={500}
            style={styles.recentScansContainer}
          >
            <View style={styles.sectionHeader}>
              <Text style={[styles.recentScansTitle, { color: theme.text }]}>
                Recent Scans
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('PlateHistory')}
                style={styles.viewAllButton}
              >
                <Text style={[styles.viewAllText, { color: theme.primary }]}>
                  View All
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={16}
                  color={theme.primary}
                  style={styles.viewAllIcon}
                />
              </TouchableOpacity>
            </View>

            <GlassmorphicCard
              style={styles.recentScansCard}
              intensity="medium"
              animation="fadeInUp"
              delay={600}
            >
              {['MH-02-AB-4321', 'KA-01-MG-7890', 'DL-01-CP-5678'].map((plate, index) => (
                <React.Fragment key={plate}>
                  <TouchableOpacity 
                    style={styles.recentScanItem}
                    onPress={() => navigation.navigate('PlateResults', { licensePlate: plate })}
                  >
                    <View style={styles.plateInfoContainer}>
                      <View style={[styles.plateIconContainer, { backgroundColor: theme.primary + '15' }]}>
                        <IconButton
                          icon="history"
                          size={20}
                          iconColor={theme.primary}
                          style={styles.historyIcon}
                        />
                      </View>
                      <View>
                        <Text style={[styles.plateNumber, { color: theme.text }]}>
                          {plate}
                        </Text>
                        <Text style={[styles.scanTime, { color: theme.textSecondary }]}>
                          Scanned 2 hours ago
                        </Text>
                      </View>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color={theme.textSecondary}
                    />
                  </TouchableOpacity>
                  {index < 2 && <Divider style={[styles.itemDivider, { backgroundColor: theme.border }]} />}
                </React.Fragment>
              ))}
            </GlassmorphicCard>
          </Animatable.View>

          {/* Camera Section at Bottom */}
          <Animatable.View 
            animation="fadeInUp" 
            delay={800}
            style={styles.cameraSection}
          >
            <GlassmorphicCard
              style={styles.cameraOptionContent}
              intensity="high"
              animation="fadeInUp"
              delay={900}
              gradientColors={isDarkMode 
                ? ['rgba(67, 97, 238, 0.2)', 'rgba(26, 32, 44, 0.6)']
                : ['rgba(235, 244, 255, 0.4)', 'rgba(230, 255, 250, 0.4)']}
            >
              <View style={styles.cameraOptionHeader}>
                <Text style={[styles.cameraOptionTitle, { color: theme.text }]}>
                  Camera Option
                </Text>
                <View style={[styles.alphaTag, { backgroundColor: theme.primary + '20' }]}>
                  <Text style={[styles.alphaTagText, { color: theme.primary }]}>
                    ALPHA
                  </Text>
                </View>
              </View>
              
              <View style={styles.cameraActions}>
                <Button
                  mode="contained"
                  onPress={startScanning}
                  style={[styles.cameraButton, { backgroundColor: theme.primary }]}
                  labelStyle={{ color: theme.white }}
                  icon="camera"
                  contentStyle={styles.cameraButtonContent}
                >
                  Use Camera
                </Button>
              </View>
            </GlassmorphicCard>
          </Animatable.View>

          <Portal>
            <Modal
              visible={showTutorial}
              onDismiss={() => setShowTutorial(false)}
              contentContainerStyle={[
                styles.tutorialModal,
                { 
                  backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                  borderColor: theme.border + '40',
                  borderWidth: 1
                }
              ]}
            >
              <View style={styles.tutorialHeader}>
                <Text style={[styles.tutorialTitle, { color: theme.text }]}>
                  How to Scan
                </Text>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => setShowTutorial(false)}
                  iconColor={theme.textSecondary}
                />
              </View>

              <View style={styles.tutorialContent}>
                {scanTips.map((tip, index) => (
                  <Animatable.View
                    key={tip.title}
                    animation="fadeInRight"
                    delay={index * 200}
                    style={[
                      styles.tipCard,
                      { 
                        backgroundColor: isDarkMode ? 'rgba(42, 42, 42, 0.75)' : 'rgba(255, 255, 255, 0.75)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1
                      }
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={tip.icon as any}
                      size={32}
                      color={theme.primary}
                      style={styles.tipIcon}
                    />
                    <View style={styles.tipTextContainer}>
                      <Text style={[styles.tipTitle, { color: theme.text }]}>
                        {tip.title}
                      </Text>
                      <Text style={[styles.tipDescription, { color: theme.textSecondary }]}>
                        {tip.description}
                      </Text>
                    </View>
                  </Animatable.View>
                ))}
              </View>

              <Button
                mode="contained"
                onPress={() => {
                  setShowTutorial(false);
                  startScanning();
                }}
                style={styles.startScanningButton}
              >
                Start Scanning
              </Button>
            </Modal>
          </Portal>
        </ScrollView>
      </LinearGradient>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  content: {
    flex: 1,
  },
  scannerContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  scannerHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  scannerFrame: {
    width: width - 32,
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  cameraViewfinder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    zIndex: 1,
  },
  scanCorners: {
    position: 'absolute',
    top: 30,
    left: 30,
    right: 30,
    bottom: 30,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderWidth: 3,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
  },
  scanStatusContainer: {
    padding: 16,
    alignItems: 'center',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  scanningIndicator: {
    marginBottom: 8,
  },
  scanningText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    width: '80%',
    height: 4,
    borderRadius: 2,
  },
  actionButtons: {
    width: '100%',
    alignItems: 'center',
  },
  scanButton: {
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  scanButtonContent: {
    height: 48,
  },
  tutorialButton: {
    flex: 1,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  recentScansContainer: {
    marginTop: 24,
  },
  recentScansTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  recentScansCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  recentScanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  plateInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIcon: {
    margin: 0,
  },
  plateNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  scanTime: {
    fontSize: 12,
    marginTop: 2,
  },
  itemDivider: {
    height: 1,
  },
  tutorialModal: {
    margin: 20,
    borderRadius: 24,
    padding: 20,
    maxHeight: height * 0.8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
  },
  tutorialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tutorialTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tutorialContent: {
    marginBottom: 20,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipIcon: {
    marginRight: 16,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  startScanningButton: {
    borderRadius: 12,
    marginTop: 8,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 12,
  },
  uploadCard: {
    width: width - 32,
    minHeight: 320,
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 8,
  },
  uploadContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 16,
    paddingBottom: 16,
    zIndex: 2,
  },
  uploadIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 2,
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    zIndex: 2,
  },
  uploadDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    zIndex: 2,
  },
  uploadActions: {
    width: '100%',
    justifyContent: 'center',
    zIndex: 2,
    paddingBottom: 16,
  },
  uploadButton: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  uploadButtonContent: {
    height: 48,
    paddingHorizontal: 24,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  viewAllIcon: {
    marginLeft: 4,
  },
  plateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cameraButton: {
    flex: 1,
    borderRadius: 12,
  },
  helpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  helpIcon: {
    marginRight: 4,
  },
  helpText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cameraSection: {
    marginTop: 24,
    marginBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  cameraOptionContent: {
    borderRadius: 16,
    padding: 16,
  },
  cameraOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cameraOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  alphaTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alphaTagText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cameraActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cameraButtonContent: {
    height: 48,
    paddingHorizontal: 24,
  },
});

export default ScanPlateScreen; 