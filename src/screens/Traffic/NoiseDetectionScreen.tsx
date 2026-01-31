import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Surface,
  Text,
  IconButton,
  ProgressBar,
  Button,
  Chip,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../../context/ThemeContext';
import ScreenWithSidebar from '../../components/ScreenWithSidebar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TrafficStackParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<TrafficStackParamList, 'NoiseDetection'>;

interface NoiseLevel {
  location: string;
  level: number;
  status: 'Normal' | 'Warning' | 'Critical';
  time: string;
}

const NoiseDetectionScreen = ({ navigation }: Props) => {
  const { theme, isDarkMode } = useTheme();
  const [currentNoiseLevel, setCurrentNoiseLevel] = useState(65);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [noiseLevels, setNoiseLevels] = useState<NoiseLevel[]>([
    { location: 'MG Road Junction', level: 85, status: 'Critical', time: '10:30 AM' },
    { location: 'City Center', level: 72, status: 'Warning', time: '10:28 AM' },
    { location: 'Hospital Zone', level: 55, status: 'Normal', time: '10:25 AM' },
    { location: 'School Area', level: 62, status: 'Warning', time: '10:22 AM' },
    { location: 'Residential Block', level: 48, status: 'Normal', time: '10:20 AM' },
  ]);

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        setCurrentNoiseLevel(prev => {
          const change = Math.random() * 10 - 5;
          return Math.min(Math.max(prev + change, 30), 100);
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const getStatusColor = (status: NoiseLevel['status']) => {
    switch (status) {
      case 'Critical':
        return theme.error;
      case 'Warning':
        return theme.warning;
      case 'Normal':
        return theme.success;
    }
  };

  const getNoiseLevelStatus = (level: number): NoiseLevel['status'] => {
    if (level >= 80) return 'Critical';
    if (level >= 65) return 'Warning';
    return 'Normal';
  };

  return (
    <ScreenWithSidebar
      title="Noise Detection"
      navigation={navigation}
      notificationCount={2}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Current Noise Level Card */}
        <Animatable.View
          animation="fadeIn"
          duration={600}
          style={styles.cardContainer}
        >
          <Surface style={[styles.card, {
            backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.7)',
            borderColor: isDarkMode ? 'rgba(67, 97, 238, 0.3)' : 'rgba(255, 255, 255, 0.8)',
            borderWidth: 1,
          }]}>
            <LinearGradient
              colors={isDarkMode ?
                ['rgba(67, 97, 238, 0.15)', 'rgba(26, 32, 44, 0.5)'] :
                ['rgba(235, 244, 255, 0.3)', 'rgba(230, 255, 250, 0.3)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Live Noise Level
              </Text>
              <Chip
                style={[styles.statusChip, {
                  backgroundColor: getStatusColor(getNoiseLevelStatus(currentNoiseLevel)) + '20',
                  borderColor: getStatusColor(getNoiseLevelStatus(currentNoiseLevel)),
                }]}
              >
                <Text style={[styles.statusText, {
                  color: getStatusColor(getNoiseLevelStatus(currentNoiseLevel))
                }]}>
                  {getNoiseLevelStatus(currentNoiseLevel)}
                </Text>
              </Chip>
            </View>

            <Animatable.View
              animation={isMonitoring ? "pulse" : undefined}
              iterationCount="infinite"
              duration={2000}
              style={styles.noiseMeter}
            >
              <Text style={[styles.noiseValue, { color: theme.text }]}>
                {Math.round(currentNoiseLevel)}
              </Text>
              <Text style={[styles.noiseUnit, { color: theme.textSecondary }]}>
                dB
              </Text>
            </Animatable.View>

            <ProgressBar
              progress={currentNoiseLevel / 100}
              color={getStatusColor(getNoiseLevelStatus(currentNoiseLevel))}
              style={styles.progressBar}
            />

            <Button
              mode="contained"
              onPress={() => setIsMonitoring(prev => !prev)}
              style={[styles.monitorButton, {
                backgroundColor: theme.primary
              }]}
            >
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </Button>
          </Surface>
        </Animatable.View>

        {/* Noise Levels List */}
        <Animatable.View
          animation="fadeIn"
          duration={600}
          delay={200}
          style={styles.cardContainer}
        >
          <Surface style={[styles.card, {
            backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.7)',
            borderColor: isDarkMode ? 'rgba(67, 97, 238, 0.3)' : 'rgba(255, 255, 255, 0.8)',
            borderWidth: 1,
          }]}>
            <LinearGradient
              colors={isDarkMode ?
                ['rgba(67, 97, 238, 0.15)', 'rgba(26, 32, 44, 0.5)'] :
                ['rgba(235, 244, 255, 0.3)', 'rgba(230, 255, 250, 0.3)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Recent Measurements
            </Text>

            {noiseLevels.map((noise, index) => (
              <Animatable.View
                key={noise.location}
                animation="fadeInUp"
                delay={index * 100}
                style={styles.noiseItem}
              >
                <View style={styles.noiseItemHeader}>
                  <View style={styles.locationContainer}>
                    <IconButton
                      icon="map-marker"
                      size={20}
                      iconColor={theme.primary}
                      style={styles.locationIcon}
                    />
                    <Text style={[styles.locationText, { color: theme.text }]}>
                      {noise.location}
                    </Text>
                  </View>
                  <Text style={[styles.timeText, { color: theme.textSecondary }]}>
                    {noise.time}
                  </Text>
                </View>

                <View style={styles.noiseItemContent}>
                  <View style={styles.levelContainer}>
                    <Text style={[styles.levelText, { color: theme.text }]}>
                      {noise.level} dB
                    </Text>
                    <ProgressBar
                      progress={noise.level / 100}
                      color={getStatusColor(noise.status)}
                      style={styles.levelProgress}
                    />
                  </View>
                  <Chip
                    style={[styles.statusChip, {
                      backgroundColor: getStatusColor(noise.status) + '20',
                      borderColor: getStatusColor(noise.status),
                    }]}
                  >
                    <Text style={[styles.statusText, { color: getStatusColor(noise.status) }]}>
                      {noise.status}
                    </Text>
                  </Chip>
                </View>
              </Animatable.View>
            ))}
          </Surface>
        </Animatable.View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  noiseMeter: {
    alignItems: 'center',
    marginBottom: 24,
  },
  noiseValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  noiseUnit: {
    fontSize: 20,
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  monitorButton: {
    borderRadius: 8,
  },
  noiseItem: {
    marginBottom: 16,
  },
  noiseItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    margin: 0,
    marginRight: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 14,
  },
  noiseItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelContainer: {
    flex: 1,
    marginRight: 16,
  },
  levelText: {
    fontSize: 14,
    marginBottom: 4,
  },
  levelProgress: {
    height: 4,
    borderRadius: 2,
  },
  statusChip: {
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
});

export default NoiseDetectionScreen; 