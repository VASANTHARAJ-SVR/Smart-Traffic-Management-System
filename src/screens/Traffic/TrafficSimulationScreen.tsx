import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TrafficStackParamList } from '../../navigation/types';
import ScreenWithSidebar from '../../components/ScreenWithSidebar';
import { Surface, IconButton, Button, Avatar } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<TrafficStackParamList, 'TrafficSimulation'>;

interface VehicleData {
  id: string;
  type: 'car' | 'bus' | 'truck' | 'bike' | 'rickshaw';
  direction: 'north' | 'south' | 'east' | 'west';
  lane: number;
  position: { x: number; y: number };
  speed: number;
  turning: boolean;
  waitingTime: number;
}

interface SignalState {
  north: 'red' | 'yellow' | 'green';
  south: 'red' | 'yellow' | 'green';
  east: 'red' | 'yellow' | 'green';
  west: 'red' | 'yellow' | 'green';
}

const TrafficSimulationScreen = ({ navigation }: Props) => {
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [signalState, setSignalState] = useState<SignalState>({
    north: 'red',
    south: 'red',
    east: 'green',
    west: 'green'
  });
  const [simulationTime, setSimulationTime] = useState(0);
  const [vehiclesPassed, setVehiclesPassed] = useState(0);
  const [trafficDensity, setTrafficDensity] = useState({
    north: 0,
    south: 0,
    east: 0,
    west: 0
  });

  const animationFrameRef = useRef<number>();
  const lastUpdateTimeRef = useRef<number>(0);

  // Vehicle generation probabilities
  const vehicleTypes = {
    car: { speed: 4, probability: 0.4 },
    bike: { speed: 4.5, probability: 0.2 },
    bus: { speed: 3, probability: 0.15 },
    truck: { speed: 3, probability: 0.15 },
    rickshaw: { speed: 4, probability: 0.1 }
  };

  // Direction distribution
  const directionProbabilities = {
    north: 0.1,
    south: 0.1,
    east: 0.4,
    west: 0.4
  };

  useEffect(() => {
    if (isSimulationRunning) {
      const startTime = performance.now();
      lastUpdateTimeRef.current = startTime;

      const updateSimulation = (currentTime: number) => {
        const deltaTime = (currentTime - lastUpdateTimeRef.current) / 1000;
        lastUpdateTimeRef.current = currentTime;

        // Update simulation time
        setSimulationTime(prev => prev + deltaTime);

        // Update vehicle positions
        setVehicles(prevVehicles => {
          return prevVehicles.map(vehicle => {
            // Update vehicle position based on speed and signal state
            const newPosition = calculateNewPosition(vehicle, deltaTime);
            return {
              ...vehicle,
              position: newPosition,
              waitingTime: isVehicleStopped(vehicle) ? vehicle.waitingTime + deltaTime : 0
            };
          }).filter(vehicle => !isVehicleOutOfBounds(vehicle));
        });

        // Generate new vehicles
        if (Math.random() < 0.1) { // 10% chance each frame to generate a vehicle
          const newVehicle = generateVehicle();
          if (newVehicle) {
            setVehicles(prev => [...prev, newVehicle]);
          }
        }

        // Update traffic signals
        updateTrafficSignals(deltaTime);

        // Calculate traffic density
        calculateTrafficDensity();

        animationFrameRef.current = requestAnimationFrame(updateSimulation);
      };

      animationFrameRef.current = requestAnimationFrame(updateSimulation);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSimulationRunning]);

  const calculateNewPosition = (vehicle: VehicleData, deltaTime: number) => {
    // Implement position calculation based on vehicle direction, speed, and signal state
    return vehicle.position; // Placeholder
  };

  const isVehicleStopped = (vehicle: VehicleData) => {
    // Implement logic to check if vehicle should be stopped
    return false; // Placeholder
  };

  const isVehicleOutOfBounds = (vehicle: VehicleData) => {
    // Implement logic to check if vehicle is out of simulation bounds
    return false; // Placeholder
  };

  const generateVehicle = (): VehicleData | null => {
    // Implement vehicle generation logic
    return null; // Placeholder
  };

  const updateTrafficSignals = (deltaTime: number) => {
    // Implement traffic signal update logic
  };

  const calculateTrafficDensity = () => {
    // Implement traffic density calculation
  };

  return (
    <ScreenWithSidebar
      title="Traffic Simulation"
      navigation={navigation}
      notificationCount={0}
    >
      <View style={styles.container}>
        <View style={styles.simulationContainer}>
          {/* Intersection layout will be implemented here */}
        </View>

        <View style={styles.controlsContainer}>
          <Button
            mode="contained"
            onPress={() => setIsSimulationRunning(!isSimulationRunning)}
            style={styles.controlButton}
          >
            {isSimulationRunning ? 'Pause Simulation' : 'Start Simulation'}
          </Button>
        </View>

        <ScrollView style={styles.statsContainer}>
          <Text style={[styles.statsTitle, { color: theme.text }]}>Simulation Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Time</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {Math.floor(simulationTime)}s
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Vehicles Passed</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{vehiclesPassed}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  simulationContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
  },
  controlsContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  controlButton: {
    marginHorizontal: 8,
  },
  statsContainer: {
    padding: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    padding: 8,
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TrafficSimulationScreen; 