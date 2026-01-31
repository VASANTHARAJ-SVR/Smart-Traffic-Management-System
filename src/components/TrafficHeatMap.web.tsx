import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { TrafficData, Incident } from '../types/index';

interface TrafficHeatMapProps {
  trafficData: TrafficData[];
  incidents?: Incident[];
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onMarkerPress?: (item: TrafficData | Incident) => void;
  onCalloutPress?: (item: TrafficData | Incident) => void;
}

const TrafficHeatMapWeb: React.FC<TrafficHeatMapProps> = ({
  trafficData,
  incidents = [],
  initialRegion,
  onMarkerPress,
  onCalloutPress,
}) => {
  const { theme, isDarkMode } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.map, { justifyContent: 'center', alignItems: 'center', backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.5)' : 'rgba(240, 240, 240, 0.5)' }]}>
        <Text style={{ color: theme.textSecondary, fontWeight: '500', textAlign: 'center' }}>
          Interactive maps available on mobile app
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 16,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default TrafficHeatMapWeb;
