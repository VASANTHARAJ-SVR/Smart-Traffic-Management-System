import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DemoStackParamList } from '../navigation/types';
import ScreenWithSidebar from '../components/ScreenWithSidebar';
import * as Animatable from 'react-native-animatable';
import { Surface, Button, IconButton, TextInput, SegmentedButtons } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import TrafficSimulation from '../components/TrafficSimulation';

type Props = NativeStackScreenProps<DemoStackParamList, 'Demo'>;

const { width } = Dimensions.get('window');

const DemoScreen = ({ navigation }: Props) => {
  const { theme, isDarkMode } = useTheme();
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [trafficDensity, setTrafficDensity] = useState('medium');
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [selectedMode, setSelectedMode] = useState('fixed');
  const [metrics, setMetrics] = useState({
    vehiclesPerHour: 0,
    avgWaitTime: 0,
    systemEfficiency: 0,
  });

  // Update metrics periodically
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        vehiclesPerHour: Math.floor(Math.random() * 1000) + 500,
        avgWaitTime: Math.floor(Math.random() * 30) + 10,
        systemEfficiency: Math.floor(Math.random() * 20) + 80,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulationRunning]);

  return (
    <ScreenWithSidebar
      title="Traffic Management Simulation"
      navigation={navigation}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeIn" duration={600}>
          {/* Main Simulation View */}
          <Surface style={[styles.simulationContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={4}>
            <View style={styles.simulationHeader}>
              <Text style={[styles.simulationTitle, { color: theme.text }]}>Traffic Simulation</Text>
              <View style={styles.controls}>
                <IconButton
                  icon={isSimulationRunning ? "pause" : "play"}
                  size={24}
                  onPress={() => setIsSimulationRunning(!isSimulationRunning)}
                  iconColor={theme.primary}
                />
                <IconButton
                  icon="refresh"
                  size={24}
                  onPress={() => {}}
                  iconColor={theme.primary}
                />
              </View>
            </View>

            {/* Simulation Canvas */}
            <View style={[styles.simulationCanvas, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5' }]}>
              <TrafficSimulation
                isRunning={isSimulationRunning}
                speed={simulationSpeed}
                density={trafficDensity as 'light' | 'medium' | 'heavy'}
                mode={selectedMode as 'fixed' | 'adaptive'}
              />
            </View>

            {/* Control Panel */}
            <View style={styles.controlPanel}>
              <Text style={[styles.panelTitle, { color: theme.text }]}>Control Panel</Text>
              
              {/* Mode Selection */}
              <SegmentedButtons
                value={selectedMode}
                onValueChange={setSelectedMode}
                buttons={[
                  { value: 'fixed', label: 'Fixed' },
                  { value: 'adaptive', label: 'Adaptive' },
                ]}
                style={styles.modeSelector}
              />

              {/* Traffic Density Control */}
              <View style={styles.controlSection}>
                <Text style={[styles.controlLabel, { color: theme.text }]}>Traffic Density</Text>
                <SegmentedButtons
                  value={trafficDensity}
                  onValueChange={setTrafficDensity}
                  buttons={[
                    { value: 'light', label: 'Light' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'heavy', label: 'Heavy' },
                  ]}
                  style={styles.densitySelector}
                />
              </View>

              {/* Simulation Speed Control */}
              <View style={styles.controlSection}>
                <Text style={[styles.controlLabel, { color: theme.text }]}>Simulation Speed</Text>
                <Slider
                  value={simulationSpeed}
                  onValueChange={setSimulationSpeed}
                  minimumValue={0.5}
                  maximumValue={3}
                  step={0.1}
                  style={styles.speedSlider}
                  minimumTrackTintColor={theme.primary}
                  maximumTrackTintColor={isDarkMode ? '#3A3A3A' : '#E2E8F0'}
                  thumbTintColor={theme.primary}
                />
                <Text style={[styles.speedValue, { color: theme.textSecondary }]}>
                  {simulationSpeed.toFixed(1)}x
                </Text>
              </View>

              {/* Quick Actions */}
              <View style={styles.quickActions}>
                <Button
                  mode="contained"
                  icon="ambulance"
                  onPress={() => {}}
                  style={[styles.actionButton, { backgroundColor: theme.primary }]}
                >
                  Add Emergency
                </Button>
                <Button
                  mode="contained"
                  icon="car-wrench"
                  onPress={() => {}}
                  style={[styles.actionButton, { backgroundColor: theme.primary }]}
                >
                  Add Roadwork
                </Button>
              </View>
            </View>
          </Surface>

          {/* Metrics Dashboard */}
          <Surface style={[styles.metricsContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : theme.white }]} elevation={4}>
            <Text style={[styles.metricsTitle, { color: theme.text }]}>Performance Metrics</Text>
            <View style={styles.metricsGrid}>
              <View style={[styles.metricCard, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5' }]}>
                <Text style={[styles.metricValue, { color: theme.primary }]}>{metrics.vehiclesPerHour}</Text>
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Vehicles/Hour</Text>
              </View>
              <View style={[styles.metricCard, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5' }]}>
                <Text style={[styles.metricValue, { color: theme.primary }]}>{metrics.avgWaitTime}s</Text>
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Avg Wait Time</Text>
              </View>
              <View style={[styles.metricCard, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5' }]}>
                <Text style={[styles.metricValue, { color: theme.primary }]}>{metrics.systemEfficiency}%</Text>
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>System Efficiency</Text>
              </View>
            </View>
          </Surface>
        </Animatable.View>
      </ScrollView>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  simulationContainer: {
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  simulationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  simulationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
  },
  simulationCanvas: {
    height: width * 0.6,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  controlPanel: {
    marginTop: 16,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modeSelector: {
    marginBottom: 16,
  },
  controlSection: {
    marginBottom: 16,
  },
  controlLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  densitySelector: {
    marginBottom: 16,
  },
  speedSlider: {
    marginBottom: 8,
  },
  speedValue: {
    textAlign: 'center',
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  metricsContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default DemoScreen; 