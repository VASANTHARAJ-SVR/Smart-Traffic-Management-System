import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const ROAD_WIDTH = width * 0.8;
const VEHICLE_SIZE = 24;
const TRAFFIC_LIGHT_SIZE = 16;
const ROAD_MARGIN = 40;
const LANE_WIDTH = 20;
const SIGNAL_TIMING = {
  GREEN: 10000, // 10 seconds
  YELLOW: 2000, // 2 seconds
  RED: 12000,   // 12 seconds (green + yellow of other direction)
};

interface TrafficSimulationProps {
  isRunning: boolean;
  speed: number;
  density: 'light' | 'medium' | 'heavy';
  mode: 'fixed' | 'adaptive';
}

interface Vehicle {
  id: number;
  position: Animated.ValueXY;
  type: 'car' | 'truck' | 'bus';
  direction: 'north' | 'south' | 'east' | 'west';
  lane: 'left' | 'right';
  animation: Animated.CompositeAnimation | null;
  waitingAtLight: boolean;
  targetPosition: { x: number; y: number };
}

interface TrafficLight {
  id: number;
  state: 'red' | 'yellow' | 'green';
  position: { x: number; y: number };
  direction: 'north' | 'south' | 'east' | 'west';
  timer: number;
}

const TrafficSimulation: React.FC<TrafficSimulationProps> = ({
  isRunning,
  speed,
  density,
  mode,
}) => {
  const { theme, isDarkMode } = useTheme();
  const vehicles = useRef<Vehicle[]>([]);
  const animationRefs = useRef<{ [key: number]: Animated.CompositeAnimation }>({});
  const trafficLights = useRef<TrafficLight[]>([
    { id: 1, state: 'red', position: { x: ROAD_WIDTH / 2 - 30, y: ROAD_WIDTH / 2 - 30 }, direction: 'north', timer: 0 },
    { id: 2, state: 'green', position: { x: ROAD_WIDTH / 2 + 30, y: ROAD_WIDTH / 2 - 30 }, direction: 'south', timer: 0 },
    { id: 3, state: 'red', position: { x: ROAD_WIDTH / 2 - 30, y: ROAD_WIDTH / 2 + 30 }, direction: 'east', timer: 0 },
    { id: 4, state: 'green', position: { x: ROAD_WIDTH / 2 + 30, y: ROAD_WIDTH / 2 + 30 }, direction: 'west', timer: 0 },
  ]);

  // Initialize vehicles based on density
  useEffect(() => {
    const vehicleCount = {
      light: 3,
      medium: 6,
      heavy: 9,
    }[density];

    // Stop all existing animations
    Object.values(animationRefs.current).forEach(animation => {
      animation.stop();
    });
    animationRefs.current = {};

    vehicles.current = Array.from({ length: vehicleCount }, (_, index) => ({
      id: index,
      position: new Animated.ValueXY({
        x: Math.random() * ROAD_WIDTH,
        y: Math.random() * ROAD_WIDTH,
      }),
      type: Math.random() > 0.7 ? 'truck' : Math.random() > 0.9 ? 'bus' : 'car',
      direction: ['north', 'south', 'east', 'west'][Math.floor(Math.random() * 4)] as Vehicle['direction'],
      lane: Math.random() > 0.5 ? 'left' : 'right',
      animation: null,
      waitingAtLight: false,
      targetPosition: { x: 0, y: 0 },
    }));
  }, [density]);

  // Calculate position on road based on direction and lane
  const calculateRoadPosition = (direction: Vehicle['direction'], lane: Vehicle['lane'], distance: number = 0) => {
    const centerX = ROAD_WIDTH / 2;
    const centerY = ROAD_WIDTH / 2;
    const offset = lane === 'left' ? -LANE_WIDTH : LANE_WIDTH;
    const junctionBuffer = 40; // Distance from junction where vehicles should wait

    switch (direction) {
      case 'north':
        return { 
          x: centerX + offset, 
          y: Math.max(ROAD_MARGIN, centerY - junctionBuffer - distance) 
        };
      case 'south':
        return { 
          x: centerX + offset, 
          y: Math.min(ROAD_WIDTH - ROAD_MARGIN, centerY + junctionBuffer + distance) 
        };
      case 'east':
        return { 
          x: Math.min(ROAD_WIDTH - ROAD_MARGIN, centerX + junctionBuffer + distance), 
          y: centerY + offset 
        };
      case 'west':
        return { 
          x: Math.max(ROAD_MARGIN, centerX - junctionBuffer - distance), 
          y: centerY + offset 
        };
      default:
        return { x: centerX, y: centerY };
    }
  };

  // Check if vehicle should wait at traffic light
  const shouldWaitAtLight = (vehicle: Vehicle) => {
    const centerX = ROAD_WIDTH / 2;
    const centerY = ROAD_WIDTH / 2;
    const junctionBuffer = 40;

    // Check if vehicle is approaching junction based on direction
    const isApproachingJunction = 
      (vehicle.direction === 'north' && vehicle.targetPosition.y > centerY - junctionBuffer) ||
      (vehicle.direction === 'south' && vehicle.targetPosition.y < centerY + junctionBuffer) ||
      (vehicle.direction === 'east' && vehicle.targetPosition.x < centerX + junctionBuffer) ||
      (vehicle.direction === 'west' && vehicle.targetPosition.x > centerX - junctionBuffer);

    if (!isApproachingJunction) return false;

    // Find relevant traffic light
    const relevantLight = trafficLights.current.find(light => light.direction === vehicle.direction);
    if (!relevantLight) return false;

    // Wait if light is red or yellow
    return relevantLight.state === 'red' || relevantLight.state === 'yellow';
  };

  // Animate vehicles
  useEffect(() => {
    if (!isRunning) {
      Object.values(animationRefs.current).forEach(animation => {
        animation.stop();
      });
      animationRefs.current = {};
      return;
    }

    vehicles.current.forEach((vehicle) => {
      if (animationRefs.current[vehicle.id]) {
        animationRefs.current[vehicle.id].stop();
      }

      // Check if vehicle should wait at light
      const shouldWait = shouldWaitAtLight(vehicle);
      if (shouldWait) {
        vehicle.waitingAtLight = true;
        // Calculate waiting position
        const waitPosition = calculateRoadPosition(vehicle.direction, vehicle.lane, 20);
        vehicle.targetPosition = waitPosition;
      } else {
        vehicle.waitingAtLight = false;
        // Calculate next position on the road
        const nextPosition = calculateRoadPosition(vehicle.direction, vehicle.lane);
        vehicle.targetPosition = nextPosition;
      }

      // Create new animation
      const animation = Animated.sequence([
        Animated.timing(vehicle.position, {
          toValue: vehicle.targetPosition,
          duration: 2000 / speed,
          useNativeDriver: true,
        }),
      ]);

      animationRefs.current[vehicle.id] = animation;

      animation.start(() => {
        if (!vehicle.waitingAtLight) {
          // Change direction and lane only if not waiting at light
          vehicle.direction = ['north', 'south', 'east', 'west'][Math.floor(Math.random() * 4)] as Vehicle['direction'];
          vehicle.lane = Math.random() > 0.5 ? 'left' : 'right';
        }
      });
    });

    return () => {
      Object.values(animationRefs.current).forEach(animation => {
        animation.stop();
      });
      animationRefs.current = {};
    };
  }, [isRunning, speed]);

  // Animate traffic lights with proper timing
  useEffect(() => {
    if (!isRunning) return;

    const updateTrafficLights = () => {
      trafficLights.current = trafficLights.current.map((light) => {
        light.timer += 1000; // Increment timer by 1 second

        // North-South direction
        if (light.direction === 'north' || light.direction === 'south') {
          if (light.state === 'green' && light.timer >= SIGNAL_TIMING.GREEN) {
            return { ...light, state: 'yellow', timer: 0 };
          }
          if (light.state === 'yellow' && light.timer >= SIGNAL_TIMING.YELLOW) {
            return { ...light, state: 'red', timer: 0 };
          }
          if (light.state === 'red' && light.timer >= SIGNAL_TIMING.RED) {
            return { ...light, state: 'green', timer: 0 };
          }
        }
        // East-West direction (opposite of North-South)
        else {
          if (light.state === 'green' && light.timer >= SIGNAL_TIMING.GREEN) {
            return { ...light, state: 'yellow', timer: 0 };
          }
          if (light.state === 'yellow' && light.timer >= SIGNAL_TIMING.YELLOW) {
            return { ...light, state: 'red', timer: 0 };
          }
          if (light.state === 'red' && light.timer >= SIGNAL_TIMING.RED) {
            return { ...light, state: 'green', timer: 0 };
          }
        }
        return light;
      });
    };

    const interval = setInterval(updateTrafficLights, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <View style={styles.container}>
      {/* Roads */}
      <View style={[styles.road, styles.horizontalRoad]} />
      <View style={[styles.road, styles.verticalRoad]} />
      
      {/* Road markings - Center line */}
      <View style={[styles.roadMarking, styles.horizontalMarking]} />
      <View style={[styles.roadMarking, styles.verticalMarking]} />
      
      {/* Road markings - Lane lines */}
      <View style={[styles.laneMarking, styles.leftLaneHorizontal]} />
      <View style={[styles.laneMarking, styles.rightLaneHorizontal]} />
      <View style={[styles.laneMarking, styles.leftLaneVertical]} />
      <View style={[styles.laneMarking, styles.rightLaneVertical]} />
      
      {/* Traffic Lights */}
      {trafficLights.current.map((light) => (
        <View
          key={light.id}
          style={[
            styles.trafficLight,
            {
              left: light.position.x,
              top: light.position.y,
              backgroundColor: light.state === 'red' ? '#FF4444' :
                             light.state === 'yellow' ? '#FFBB33' : '#00C851',
            },
          ]}
        />
      ))}

      {/* Vehicles */}
      {vehicles.current.map((vehicle) => (
        <Animated.View
          key={vehicle.id}
          style={[
            styles.vehicle,
            {
              transform: [
                { translateX: vehicle.position.x },
                { translateY: vehicle.position.y },
                { rotate: vehicle.direction === 'north' ? '0deg' :
                          vehicle.direction === 'south' ? '180deg' :
                          vehicle.direction === 'east' ? '90deg' : '-90deg' },
              ],
              opacity: vehicle.waitingAtLight ? 0.7 : 1,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={
              vehicle.type === 'car' ? 'car' :
              vehicle.type === 'truck' ? 'truck' : 'bus'
            }
            size={VEHICLE_SIZE}
            color={isDarkMode ? '#FFFFFF' : '#000000'}
          />
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ROAD_WIDTH,
    height: ROAD_WIDTH,
    position: 'relative',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    overflow: 'hidden',
  },
  road: {
    position: 'absolute',
    backgroundColor: '#333333',
  },
  horizontalRoad: {
    width: ROAD_WIDTH,
    height: 80,
    top: ROAD_WIDTH / 2 - 40,
  },
  verticalRoad: {
    width: 80,
    height: ROAD_WIDTH,
    left: ROAD_WIDTH / 2 - 40,
  },
  roadMarking: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  horizontalMarking: {
    width: ROAD_WIDTH,
    height: 2,
    top: ROAD_WIDTH / 2 - 1,
  },
  verticalMarking: {
    width: 2,
    height: ROAD_WIDTH,
    left: ROAD_WIDTH / 2 - 1,
  },
  laneMarking: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    opacity: 0.5,
  },
  leftLaneHorizontal: {
    width: ROAD_WIDTH,
    height: 2,
    top: ROAD_WIDTH / 2 - 20,
  },
  rightLaneHorizontal: {
    width: ROAD_WIDTH,
    height: 2,
    top: ROAD_WIDTH / 2 + 20,
  },
  leftLaneVertical: {
    width: 2,
    height: ROAD_WIDTH,
    left: ROAD_WIDTH / 2 - 20,
  },
  rightLaneVertical: {
    width: 2,
    height: ROAD_WIDTH,
    left: ROAD_WIDTH / 2 + 20,
  },
  trafficLight: {
    position: 'absolute',
    width: TRAFFIC_LIGHT_SIZE,
    height: TRAFFIC_LIGHT_SIZE,
    borderRadius: TRAFFIC_LIGHT_SIZE / 2,
    transform: [{ translateX: -TRAFFIC_LIGHT_SIZE / 2 }, { translateY: -TRAFFIC_LIGHT_SIZE / 2 }],
  },
  vehicle: {
    position: 'absolute',
    width: VEHICLE_SIZE,
    height: VEHICLE_SIZE,
    transform: [{ translateX: -VEHICLE_SIZE / 2 }, { translateY: -VEHICLE_SIZE / 2 }],
  },
});

export default TrafficSimulation; 