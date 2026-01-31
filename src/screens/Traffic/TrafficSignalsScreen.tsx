import React, { useState, useEffect } from 'react';
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
  Switch,
  SegmentedButtons,
} from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../../context/ThemeContext';
import ScreenWithSidebar from '../../components/ScreenWithSidebar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TrafficStackParamList } from '../../navigation/types';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<TrafficStackParamList, 'TrafficSignals'>;

type SignalState = 'red' | 'yellow' | 'green';
type Direction = 'north' | 'south' | 'east' | 'west';

interface SignalTiming {
  green: number;
  yellow: number;
  red: number;
}

const TrafficSignalsScreen = ({ navigation }: Props) => {
  const { theme, isDarkMode } = useTheme();
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [selectedDirection, setSelectedDirection] = useState<Direction>('north');
  const [signalStates, setSignalStates] = useState<Record<Direction, SignalState>>({
    north: 'red',
    south: 'red',
    east: 'green',
    west: 'green',
  });
  const [timings, setTimings] = useState<Record<Direction, SignalTiming>>({
    north: { green: 30, yellow: 3, red: 30 },
    south: { green: 30, yellow: 3, red: 30 },
    east: { green: 30, yellow: 3, red: 30 },
    west: { green: 30, yellow: 3, red: 30 },
  });
  const [currentPhase, setCurrentPhase] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoMode) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Change phase
            const nextPhase = (currentPhase + 1) % 4;
            setCurrentPhase(nextPhase);
            updateSignalsForPhase(nextPhase);
            return getTimingForPhase(nextPhase);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isAutoMode, currentPhase]);

  const getTimingForPhase = (phase: number): number => {
    switch (phase) {
      case 0: // North-South Green
        return timings.north.green;
      case 1: // North-South Yellow
        return timings.north.yellow;
      case 2: // East-West Green
        return timings.east.green;
      case 3: // East-West Yellow
        return timings.east.yellow;
      default:
        return 30;
    }
  };

  const updateSignalsForPhase = (phase: number) => {
    switch (phase) {
      case 0: // North-South Green
        setSignalStates({
          north: 'green',
          south: 'green',
          east: 'red',
          west: 'red',
        });
        break;
      case 1: // North-South Yellow
        setSignalStates({
          north: 'yellow',
          south: 'yellow',
          east: 'red',
          west: 'red',
        });
        break;
      case 2: // East-West Green
        setSignalStates({
          north: 'red',
          south: 'red',
          east: 'green',
          west: 'green',
        });
        break;
      case 3: // East-West Yellow
        setSignalStates({
          north: 'red',
          south: 'red',
          east: 'yellow',
          west: 'yellow',
        });
        break;
    }
  };

  const handleManualSignalChange = (direction: Direction, state: SignalState) => {
    if (!isAutoMode) {
      setSignalStates(prev => ({
        ...prev,
        [direction]: state,
      }));
    }
  };

  const getSignalColor = (state: SignalState) => {
    switch (state) {
      case 'red':
        return '#FF0000';
      case 'yellow':
        return '#FFAA00';
      case 'green':
        return '#00FF00';
      default:
        return '#333333';
    }
  };

  const renderSignalLight = (color: string, isActive: boolean, state: SignalState) => (
    <View style={[styles.signalLight, { 
      backgroundColor: isActive ? getSignalColor(state) : `${color}40`,
      borderColor: isActive ? getSignalColor(state) : `${color}80`,
      borderWidth: 2,
      shadowColor: isActive ? getSignalColor(state) : 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: isActive ? 0.5 : 0,
      shadowRadius: 8,
      elevation: isActive ? 5 : 0,
    }]} />
  );

  const renderSignal = (direction: Direction) => {
    const currentState = signalStates[direction];
    return (
      <View style={[
        styles.signalContainer,
        direction === 'north' && styles.northSignal,
        direction === 'south' && styles.southSignal,
        direction === 'east' && styles.eastSignal,
        direction === 'west' && styles.westSignal,
      ]}>
        <Surface style={[styles.signalBox, { 
          backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
        }]}>
          {renderSignalLight('#ff0000', currentState === 'red', 'red')}
          {renderSignalLight('#ffaa00', currentState === 'yellow', 'yellow')}
          {renderSignalLight('#00ff00', currentState === 'green', 'green')}
        </Surface>
      </View>
    );
  };

  return (
    <ScreenWithSidebar
      title="Traffic Signals Control"
      navigation={navigation}
      notificationCount={0}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Control Panel */}
        <Animatable.View
          animation="fadeIn"
          duration={600}
          style={styles.controlPanel}
        >
          <Surface style={[styles.controlCard, {
            backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.7)',
          }]}>
            <LinearGradient
              colors={isDarkMode ?
                ['rgba(67, 97, 238, 0.15)', 'rgba(26, 32, 44, 0.5)'] :
                ['rgba(235, 244, 255, 0.3)', 'rgba(230, 255, 250, 0.3)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            
            <View style={styles.controlHeader}>
              <Text style={[styles.controlTitle, { color: theme.text }]}>Signal Control Mode</Text>
              <View style={styles.autoModeContainer}>
                <Text style={[styles.modeLabel, { color: theme.textSecondary }]}>Manual</Text>
                <Switch
                  value={isAutoMode}
                  onValueChange={setIsAutoMode}
                  color={theme.primary}
                />
                <Text style={[styles.modeLabel, { color: theme.textSecondary }]}>Auto</Text>
              </View>
            </View>

            {isAutoMode ? (
              <View style={styles.autoControls}>
                <Text style={[styles.timerText, { color: theme.text }]}>
                  Next Change: {timeRemaining}s
                </Text>
                <View style={styles.phaseIndicator}>
                  <Text style={[styles.phaseText, { color: theme.textSecondary }]}>
                    Current Phase: {
                      currentPhase === 0 ? 'North-South Green' :
                      currentPhase === 1 ? 'North-South Yellow' :
                      currentPhase === 2 ? 'East-West Green' :
                      'East-West Yellow'
                    }
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.manualControls}>
                <SegmentedButtons
                  value={selectedDirection}
                  onValueChange={(value) => setSelectedDirection(value as Direction)}
                  buttons={[
                    { value: 'north', label: 'North' },
                    { value: 'south', label: 'South' },
                    { value: 'east', label: 'East' },
                    { value: 'west', label: 'West' },
                  ]}
                  style={styles.directionButtons}
                />
                <View style={styles.signalButtons}>
                  <Button
                    mode="contained"
                    onPress={() => handleManualSignalChange(selectedDirection, 'red')}
                    style={[styles.signalButton, { backgroundColor: '#FF0000' }]}
                    labelStyle={{ color: 'white' }}
                  >
                    Red
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => handleManualSignalChange(selectedDirection, 'yellow')}
                    style={[styles.signalButton, { backgroundColor: '#FFAA00' }]}
                    labelStyle={{ color: 'white' }}
                  >
                    Yellow
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => handleManualSignalChange(selectedDirection, 'green')}
                    style={[styles.signalButton, { backgroundColor: '#00FF00' }]}
                    labelStyle={{ color: 'black' }}
                  >
                    Green
                  </Button>
                </View>
              </View>
            )}
          </Surface>
        </Animatable.View>

        {/* Intersection Visualization */}
        <Animatable.View
          animation="fadeIn"
          duration={600}
          delay={200}
          style={styles.intersectionContainer}
        >
          <Surface style={[styles.intersectionCard, {
            backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.7)',
          }]}>
            <LinearGradient
              colors={isDarkMode ?
                ['rgba(67, 97, 238, 0.15)', 'rgba(26, 32, 44, 0.5)'] :
                ['rgba(235, 244, 255, 0.3)', 'rgba(230, 255, 250, 0.3)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            
            <View style={styles.intersection}>
              {/* Road Layout */}
              <View style={styles.verticalRoad}>
                <View style={styles.roadLine} />
              </View>
              <View style={styles.horizontalRoad}>
                <View style={styles.roadLine} />
              </View>
              
              {/* Traffic Signals */}
              {renderSignal('north')}
              {renderSignal('south')}
              {renderSignal('east')}
              {renderSignal('west')}
            </View>
          </Surface>
        </Animatable.View>

        {/* Timing Configuration */}
        <Animatable.View
          animation="fadeIn"
          duration={600}
          delay={400}
          style={styles.timingContainer}
        >
          <Surface style={[styles.timingCard, {
            backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.7)',
          }]}>
            <LinearGradient
              colors={isDarkMode ?
                ['rgba(67, 97, 238, 0.15)', 'rgba(26, 32, 44, 0.5)'] :
                ['rgba(235, 244, 255, 0.3)', 'rgba(230, 255, 250, 0.3)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            
            <Text style={[styles.timingTitle, { color: theme.text }]}>Signal Timing Configuration</Text>
            
            {Object.entries(timings).map(([direction, timing]) => (
              <View key={direction} style={styles.timingSection}>
                <Text style={[styles.directionTitle, { color: theme.text }]}>
                  {direction.charAt(0).toUpperCase() + direction.slice(1)}
                </Text>
                <View style={styles.timingControls}>
                  <View style={styles.timingControl}>
                    <Text style={[styles.timingLabel, { color: theme.textSecondary }]}>Green</Text>
                    <Text style={[styles.timingValue, { color: theme.text }]}>{timing.green}s</Text>
                    <Slider
                      value={timing.green}
                      onValueChange={(value: number) => setTimings(prev => ({
                        ...prev,
                        [direction]: { ...prev[direction as Direction], green: value }
                      }))}
                      minimumValue={10}
                      maximumValue={60}
                      step={1}
                      style={[styles.slider, { width: '100%' }]}
                      minimumTrackTintColor={theme.primary}
                      maximumTrackTintColor={theme.textSecondary}
                      thumbTintColor={theme.primary}
                    />
                  </View>
                  <View style={styles.timingControl}>
                    <Text style={[styles.timingLabel, { color: theme.textSecondary }]}>Yellow</Text>
                    <Text style={[styles.timingValue, { color: theme.text }]}>{timing.yellow}s</Text>
                    <Slider
                      value={timing.yellow}
                      onValueChange={(value: number) => setTimings(prev => ({
                        ...prev,
                        [direction]: { ...prev[direction as Direction], yellow: value }
                      }))}
                      minimumValue={2}
                      maximumValue={5}
                      step={1}
                      style={[styles.slider, { width: '100%' }]}
                      minimumTrackTintColor={theme.primary}
                      maximumTrackTintColor={theme.textSecondary}
                      thumbTintColor={theme.primary}
                    />
                  </View>
                </View>
              </View>
            ))}
          </Surface>
        </Animatable.View>
      </ScrollView>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlPanel: {
    padding: 16,
  },
  controlCard: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  controlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  controlTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  autoModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeLabel: {
    marginHorizontal: 8,
  },
  autoControls: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  phaseIndicator: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  phaseText: {
    fontSize: 16,
  },
  manualControls: {
    padding: 16,
  },
  directionButtons: {
    marginBottom: 16,
  },
  signalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  signalButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  intersectionContainer: {
    padding: 16,
  },
  intersectionCard: {
    borderRadius: 16,
    padding: 16,
    aspectRatio: 1,
    overflow: 'hidden',
  },
  intersection: {
    flex: 1,
    position: 'relative',
    aspectRatio: 1,
    backgroundColor: '#2c2c2c',
    borderRadius: 16,
    padding: 20,
  },
  verticalRoad: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '42%',
    width: '16%',
    backgroundColor: '#333',
  },
  horizontalRoad: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '42%',
    height: '16%',
    backgroundColor: '#333',
  },
  roadLine: {
    backgroundColor: '#fff',
    height: '100%',
    width: 2,
    opacity: 0.5,
  },
  signalContainer: {
    position: 'absolute',
    width: 30,
    height: 80,
    zIndex: 2,
  },
  northSignal: {
    top: 20,
    left: '58%',
  },
  southSignal: {
    bottom: 20,
    left: '42%',
  },
  eastSignal: {
    right: 20,
    top: '42%',
    transform: [{ rotate: '90deg' }],
  },
  westSignal: {
    left: 20,
    top: '42%',
    transform: [{ rotate: '270deg' }],
  },
  signalBox: {
    flex: 1,
    borderRadius: 8,
    padding: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  signalLight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    margin: 2,
  },
  timingContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  timingCard: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  timingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timingSection: {
    marginBottom: 16,
  },
  directionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timingControls: {
    gap: 8,
  },
  timingControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timingLabel: {
    width: 60,
  },
  timingValue: {
    width: 40,
    textAlign: 'right',
  },
  slider: {
    flex: 1,
  },
});

export default TrafficSignalsScreen; 