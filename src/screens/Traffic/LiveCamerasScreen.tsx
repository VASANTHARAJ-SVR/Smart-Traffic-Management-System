import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Surface,
  Text,
  Button,
  IconButton,
  Portal,
  Modal,
  Card,
  Avatar,
  Chip,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { useTheme } from '../../context/ThemeContext';
import ScreenWithSidebar from '../../components/ScreenWithSidebar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TrafficStackParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<TrafficStackParamList, 'LiveCameras'>;

// Mock data for camera feeds
const mockCameraFeeds = [
  { id: '1', location: 'MG Road Junction', status: 'Online', type: 'PTZ Camera' },
  { id: '2', location: 'Silk Board Signal', status: 'Online', type: 'Fixed Camera' },
  { id: '3', location: 'Whitefield Main Road', status: 'Offline', type: 'PTZ Camera' },
  { id: '4', location: 'Electronic City', status: 'Online', type: 'Fixed Camera' },
];

const LiveCamerasScreen = ({ navigation }: Props) => {
  const { theme, isDarkMode } = useTheme();
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

  const handleVideoUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        // Here you would handle the video upload to your server/model
        console.log('Video selected:', result.assets[0].uri);
        // TODO: Implement video upload to server/model
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Error uploading video. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Online' ? '#4CAF50' : '#FF0000';
  };

  return (
    <ScreenWithSidebar
      title="Live Cameras"
      navigation={navigation}
      notificationCount={3}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Camera Feed Options */}
        <Animatable.View
          animation="fadeIn"
          duration={600}
          style={styles.container}
        >
          <View style={styles.optionsContainer}>
            <Surface style={[styles.optionCard, {
              backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.7)',
              borderColor: isDarkMode ? 'rgba(67, 97, 238, 0.3)' : 'rgba(255, 255, 255, 0.8)',
            }]}>
              <LinearGradient
                colors={isDarkMode ?
                  ['rgba(67, 97, 238, 0.15)', 'rgba(26, 32, 44, 0.5)'] :
                  ['rgba(235, 244, 255, 0.3)', 'rgba(230, 255, 250, 0.3)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              />
              <IconButton
                icon="video"
                size={32}
                iconColor="#4361EE"
                style={styles.optionIcon}
              />
              <Text style={[styles.optionTitle, { color: theme.text }]}>Live Feed</Text>
              <Text style={[styles.optionDescription, { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : theme.textSecondary }]}>
                Connect to police server for real-time surveillance
              </Text>
              <Button
                mode="contained"
                style={[styles.optionButton, { backgroundColor: '#4361EE' }]}
                labelStyle={{ color: '#FFFFFF' }}
                onPress={() => setSelectedCamera('live')}
              >
                Connect Now
              </Button>
            </Surface>

            <Surface style={[styles.optionCard, {
              backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.7)',
              borderColor: isDarkMode ? 'rgba(67, 97, 238, 0.3)' : 'rgba(255, 255, 255, 0.8)',
            }]}>
              <LinearGradient
                colors={isDarkMode ?
                  ['rgba(67, 97, 238, 0.15)', 'rgba(26, 32, 44, 0.5)'] :
                  ['rgba(235, 244, 255, 0.3)', 'rgba(230, 255, 250, 0.3)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              />
              <IconButton
                icon="upload"
                size={32}
                iconColor="#4361EE"
                style={styles.optionIcon}
              />
              <Text style={[styles.optionTitle, { color: theme.text }]}>Upload Video</Text>
              <Text style={[styles.optionDescription, { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : theme.textSecondary }]}>
                Upload recorded footage for analysis
              </Text>
              <Button
                mode="contained"
                style={[styles.optionButton, { backgroundColor: '#4361EE' }]}
                labelStyle={{ color: '#FFFFFF' }}
                onPress={() => setUploadModalVisible(true)}
              >
                Upload Video
              </Button>
            </Surface>
          </View>

          {/* Active Cameras Section */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Active Cameras</Text>
          </View>

          <View style={styles.camerasGrid}>
            {mockCameraFeeds.map((camera, index) => (
              <Animatable.View
                key={camera.id}
                animation="fadeInUp"
                delay={index * 100}
                style={styles.cameraCardWrapper}
              >
                <Surface style={[styles.cameraCard, {
                  backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.7)',
                  borderColor: isDarkMode ? 'rgba(67, 97, 238, 0.3)' : 'rgba(255, 255, 255, 0.8)',
                }]}>
                  <LinearGradient
                    colors={isDarkMode ?
                      ['rgba(67, 97, 238, 0.15)', 'rgba(26, 32, 44, 0.5)'] :
                      ['rgba(235, 244, 255, 0.3)', 'rgba(230, 255, 250, 0.3)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                  />
                  <View style={styles.cameraHeader}>
                    <Avatar.Icon
                      size={40}
                      icon="cctv"
                      style={{
                        backgroundColor: isDarkMode ? 'rgba(67, 97, 238, 0.1)' : 'rgba(67, 97, 238, 0.1)',
                      }}
                      color="#4361EE"
                    />
                    <Chip
                      style={{
                        backgroundColor: getStatusColor(camera.status) + '20',
                        borderColor: getStatusColor(camera.status),
                      }}
                      textStyle={{ color: getStatusColor(camera.status) }}
                      mode="outlined"
                    >
                      {camera.status}
                    </Chip>
                  </View>
                  <Text style={[styles.cameraLocation, { color: theme.text }]}>
                    {camera.location}
                  </Text>
                  <Text style={[styles.cameraType, { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : theme.textSecondary }]}>
                    {camera.type}
                  </Text>
                  <Button
                    mode="outlined"
                    style={styles.viewButton}
                    labelStyle={{ color: '#4361EE' }}
                    onPress={() => setSelectedCamera(camera.id)}
                  >
                    View Feed
                  </Button>
                </Surface>
              </Animatable.View>
            ))}
          </View>
        </Animatable.View>

        {/* Upload Modal */}
        <Portal>
          <Modal
            visible={isUploadModalVisible}
            onDismiss={() => setUploadModalVisible(false)}
            contentContainerStyle={[styles.modalContainer, {
              backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
            }]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>Upload Video</Text>
            <Text style={[styles.modalDescription, { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : theme.textSecondary }]}>
              Select a video file to upload for analysis
            </Text>
            <Button
              mode="contained"
              style={[styles.modalButton, { backgroundColor: '#4361EE' }]}
              labelStyle={{ color: '#FFFFFF' }}
              onPress={handleVideoUpload}
            >
              Choose Video
            </Button>
            <Button
              mode="outlined"
              style={styles.modalButton}
              onPress={() => setUploadModalVisible(false)}
            >
              Cancel
            </Button>
          </Modal>
        </Portal>
      </ScrollView>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  optionCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  optionIcon: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
    margin: 0,
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  optionButton: {
    borderRadius: 12,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  camerasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  cameraCardWrapper: {
    width: (width - 48) / 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  cameraCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cameraLocation: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cameraType: {
    fontSize: 14,
    marginBottom: 12,
  },
  viewButton: {
    borderRadius: 12,
    borderColor: '#4361EE',
  },
  modalContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 24,
  },
  modalButton: {
    marginBottom: 12,
    borderRadius: 12,
  },
});

export default LiveCamerasScreen; 