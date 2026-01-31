import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Animated, 
  Easing,
  Switch,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import GlassmorphicCard from './GlassmorphicCard';
import * as Animatable from 'react-native-animatable';
import FuturisticButton from './FuturisticButton';

interface TrafficLightControlProps {
  junctionName: string;
  location: string;
  initialMode?: 'auto' | 'manual';
  onModeChange?: (mode: 'auto' | 'manual') => void;
  onLightChange?: (direction: string, color: 'red' | 'yellow' | 'green') => void;
}

interface Direction {
  id: string;
  name: string;
  currentLight: 'red' | 'yellow' | 'green';
  trafficDensity: 'low' | 'medium' | 'high';
  countdown: number;
}

const TrafficLightControl: React.FC<TrafficLightControlProps> = ({
  junctionName,
  location,
  initialMode = 'auto',
  onModeChange,
  onLightChange,
}) => {
  const { theme, isDarkMode } = useTheme();
  const [mode, setMode] = useState<'auto' | 'manual'>(initialMode);
  const [directions, setDirections] = useState<Direction[]>([
    {
      id: 'north',
      name: 'North',
      currentLight: 'red',
      trafficDensity: 'medium',
      countdown: 0,
    },
    {
      id: 'east',
      name: 'East',
      currentLight: 'red',
      trafficDensity: 'high',
      countdown: 0,
    },
    {
      id: 'south',
      name: 'South',
      currentLight: 'green',
      trafficDensity: 'low',
      countdown: 30,
    },
    {
      id: 'west',
      name: 'West',
      currentLight: 'red',
      trafficDensity: 'medium',
      countdown: 0,
    },
  ]);
  
  // Animation values
  const pulseAnim = new Animated.Value(1);
  
  // Start pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  // Auto mode countdown timer
  useEffect(() => {
    if (mode === 'auto') {
      const timer = setInterval(() => {
        setDirections(prevDirections => {
          const newDirections = [...prevDirections];
          
          // Find the direction with green light
          const greenIndex = newDirections.findIndex(d => d.currentLight === 'green');
          
          if (greenIndex !== -1) {
            // Decrease countdown
            newDirections[greenIndex].countdown -= 1;
            
            // If countdown reaches 0, change lights
            if (newDirections[greenIndex].countdown <= 0) {
              // Change current green to yellow
              newDirections[greenIndex].currentLight = 'yellow';
              newDirections[greenIndex].countdown = 5; // Yellow light duration
              
              // Find next direction with highest traffic density
              const nextDirections = [...newDirections];
              nextDirections.splice(greenIndex, 1); // Remove current direction
              
              // Sort by traffic density (high to low)
              nextDirections.sort((a, b) => {
                const densityValues = { high: 3, medium: 2, low: 1 };
                return densityValues[b.trafficDensity] - densityValues[a.trafficDensity];
              });
              
              // Next direction will be the one with highest density
              const nextGreenIndex = newDirections.findIndex(d => d.id === nextDirections[0].id);
              
              // Prepare next green (will be activated when yellow turns red)
              newDirections[nextGreenIndex].countdown = 0; // Will be set when yellow turns red
            }
          } else {
            // Find the direction with yellow light
            const yellowIndex = newDirections.findIndex(d => d.currentLight === 'yellow');
            
            if (yellowIndex !== -1) {
              // Decrease countdown
              newDirections[yellowIndex].countdown -= 1;
              
              // If countdown reaches 0, change yellow to red and find next green
              if (newDirections[yellowIndex].countdown <= 0) {
                // Change current yellow to red
                newDirections[yellowIndex].currentLight = 'red';
                newDirections[yellowIndex].countdown = 0;
                
                // Find next direction to turn green (the one with highest traffic density)
                const nextDirections = [...newDirections];
                nextDirections.splice(yellowIndex, 1); // Remove current direction
                
                // Sort by traffic density (high to low)
                nextDirections.sort((a, b) => {
                  const densityValues = { high: 3, medium: 2, low: 1 };
                  return densityValues[b.trafficDensity] - densityValues[a.trafficDensity];
                });
                
                // Next direction will be the one with highest density
                const nextGreenIndex = newDirections.findIndex(d => d.id === nextDirections[0].id);
                
                // Set next green
                newDirections[nextGreenIndex].currentLight = 'green';
                
                // Set countdown based on traffic density
                switch (newDirections[nextGreenIndex].trafficDensity) {
                  case 'high':
                    newDirections[nextGreenIndex].countdown = 45;
                    break;
                  case 'medium':
                    newDirections[nextGreenIndex].countdown = 30;
                    break;
                  case 'low':
                    newDirections[nextGreenIndex].countdown = 20;
                    break;
                }
                
                // Notify about light change
                if (onLightChange) {
                  onLightChange(
                    newDirections[nextGreenIndex].id,
                    newDirections[nextGreenIndex].currentLight
                  );
                }
              }
            }
          }
          
          return newDirections;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [mode]);
  
  // Handle mode change
  const handleModeChange = (newMode: 'auto' | 'manual') => {
    setMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    }
  };
  
  // Handle manual light change
  const handleManualLightChange = (directionId: string, color: 'red' | 'yellow' | 'green') => {
    if (mode === 'manual') {
      setDirections(prevDirections => {
        const newDirections = [...prevDirections];
        const index = newDirections.findIndex(d => d.id === directionId);
        
        if (index !== -1) {
          // If changing to green, make sure all other directions are red
          if (color === 'green') {
            newDirections.forEach((d, i) => {
              if (i !== index) {
                d.currentLight = 'red';
              }
            });
          }
          
          newDirections[index].currentLight = color;
          
          // Notify about light change
          if (onLightChange) {
            onLightChange(directionId, color);
          }
        }
        
        return newDirections;
      });
    }
  };
  
  // Get traffic density color
  const getDensityColor = (density: string) => {
    switch (density) {
      case 'high':
        return theme.trafficHigh;
      case 'medium':
        return theme.trafficMedium;
      case 'low':
        return theme.trafficLow;
      default:
        return theme.textSecondary;
    }
  };
  
  // Get light color
  const getLightColor = (light: string) => {
    switch (light) {
      case 'red':
        return '#FF0000';
      case 'yellow':
        return '#FFFF00';
      case 'green':
        return '#00FF00';
      default:
        return '#CCCCCC';
    }
  };
  
  // Simulate traffic density change
  const simulateTrafficChange = () => {
    setDirections(prevDirections => {
      const newDirections = [...prevDirections];
      const densities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
      
      // Randomly change traffic density for each direction
      newDirections.forEach(direction => {
        const randomIndex = Math.floor(Math.random() * 3);
        direction.trafficDensity = densities[randomIndex];
      });
      
      return newDirections;
    });
  };
  
  return (
    <GlassmorphicCard style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.junctionName, { color: theme.text }]}>
            {junctionName}
          </Text>
          <Text style={[styles.location, { color: theme.textSecondary }]}>
            {location}
          </Text>
        </View>
        
        <View style={styles.modeContainer}>
          <Text style={[styles.modeLabel, { color: theme.textSecondary }]}>
            {mode === 'auto' ? 'Auto Mode' : 'Manual Mode'}
          </Text>
          <Switch
            value={mode === 'auto'}
            onValueChange={value => handleModeChange(value ? 'auto' : 'manual')}
            trackColor={{ false: theme.error, true: theme.success }}
            thumbColor={theme.white}
          />
        </View>
      </View>
      
      {/* Traffic Lights Grid */}
      <View style={styles.trafficGrid}>
        {directions.map(direction => (
          <View key={direction.id} style={styles.directionContainer}>
            <View style={styles.directionHeader}>
              <Text style={[styles.directionName, { color: theme.text }]}>
                {direction.name}
              </Text>
              <View 
                style={[
                  styles.densityIndicator, 
                  { backgroundColor: getDensityColor(direction.trafficDensity) }
                ]}
              >
                <Text style={styles.densityText}>
                  {direction.trafficDensity.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View style={styles.trafficLightContainer}>
              {/* Red Light */}
              <TouchableOpacity
                style={[
                  styles.light,
                  { 
                    backgroundColor: direction.currentLight === 'red' 
                      ? getLightColor('red') 
                      : 'rgba(255, 0, 0, 0.3)',
                    borderColor: theme.border,
                  }
                ]}
                onPress={() => handleManualLightChange(direction.id, 'red')}
                disabled={mode === 'auto'}
              >
                {direction.currentLight === 'red' && (
                  <Animated.View 
                    style={[
                      styles.lightGlow,
                      {
                        backgroundColor: getLightColor('red'),
                        transform: [{ scale: pulseAnim }],
                      }
                    ]} 
                  />
                )}
              </TouchableOpacity>
              
              {/* Yellow Light */}
              <TouchableOpacity
                style={[
                  styles.light,
                  { 
                    backgroundColor: direction.currentLight === 'yellow' 
                      ? getLightColor('yellow') 
                      : 'rgba(255, 255, 0, 0.3)',
                    borderColor: theme.border,
                  }
                ]}
                onPress={() => handleManualLightChange(direction.id, 'yellow')}
                disabled={mode === 'auto'}
              >
                {direction.currentLight === 'yellow' && (
                  <Animated.View 
                    style={[
                      styles.lightGlow,
                      {
                        backgroundColor: getLightColor('yellow'),
                        transform: [{ scale: pulseAnim }],
                      }
                    ]} 
                  />
                )}
              </TouchableOpacity>
              
              {/* Green Light */}
              <TouchableOpacity
                style={[
                  styles.light,
                  { 
                    backgroundColor: direction.currentLight === 'green' 
                      ? getLightColor('green') 
                      : 'rgba(0, 255, 0, 0.3)',
                    borderColor: theme.border,
                  }
                ]}
                onPress={() => handleManualLightChange(direction.id, 'green')}
                disabled={mode === 'auto'}
              >
                {direction.currentLight === 'green' && (
                  <Animated.View 
                    style={[
                      styles.lightGlow,
                      {
                        backgroundColor: getLightColor('green'),
                        transform: [{ scale: pulseAnim }],
                      }
                    ]} 
                  />
                )}
              </TouchableOpacity>
            </View>
            
            {/* Countdown Timer (only for green or yellow) */}
            {(direction.currentLight === 'green' || direction.currentLight === 'yellow') && (
              <Animatable.Text
                animation="pulse"
                iterationCount="infinite"
                duration={1000}
                style={[
                  styles.countdown, 
                  { 
                    color: direction.currentLight === 'green' 
                      ? getLightColor('green') 
                      : getLightColor('yellow') 
                  }
                ]}
              >
                {direction.countdown}s
              </Animatable.Text>
            )}
          </View>
        ))}
      </View>
      
      {/* Simulate Traffic Button */}
      <FuturisticButton
        title="Simulate Traffic Change"
        icon="refresh"
        onPress={simulateTrafficChange}
        variant="info"
        style={styles.simulateButton}
      />
    </GlassmorphicCard>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  junctionName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 12,
  },
  modeContainer: {
    alignItems: 'flex-end',
  },
  modeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  trafficGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  directionContainer: {
    width: '48%',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  directionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  directionName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  densityIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  densityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  trafficLightContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  light: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  lightGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.5,
  },
  countdown: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  simulateButton: {
    marginTop: 10,
  },
});

export default TrafficLightControl; 