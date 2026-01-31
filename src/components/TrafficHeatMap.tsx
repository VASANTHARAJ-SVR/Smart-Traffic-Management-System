import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Platform } from 'react-native';

// Dynamic require to prevent web bundling issues
let MapView: any = null;
let Heatmap: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;
let Callout: any = null;

if (Platform.OS !== 'web') {
  const maps = require('react-native-maps');
  MapView = maps.default || maps;
  Heatmap = maps.Heatmap;
  Marker = maps.Marker;
  PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
  Callout = maps.Callout;
}
import { useTheme } from '../context/ThemeContext';
import { TrafficData, Incident } from '../types/index';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import GlassmorphicCard from './GlassmorphicCard';

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

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const TrafficHeatMap: React.FC<TrafficHeatMapProps> = ({
  trafficData,
  incidents = [],
  initialRegion,
  onMarkerPress,
  onCalloutPress,
}) => {
  const { theme, isDarkMode } = useTheme();
  const mapRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  
  // Default region (centered on India)
  const defaultRegion = {
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 20,
    longitudeDelta: 20 * ASPECT_RATIO,
  };
  
  // Format traffic data for heatmap
  const heatmapPoints = trafficData.map(point => ({
    latitude: point.location.latitude,
    longitude: point.location.longitude,
    weight: point.density === 'high' ? 1 : point.density === 'medium' ? 0.7 : 0.4,
  }));
  
  // Get incident icon based on type
  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'accident':
        return 'car-crash';
      case 'congestion':
        return 'car';
      case 'roadblock':
        return 'close-circle';
      case 'construction':
        return 'construct';
      case 'event':
        return 'calendar';
      default:
        return 'alert-circle';
    }
  };
  
  // Get incident color based on severity
  const getIncidentColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return theme.error;
      case 'medium':
        return theme.warning;
      case 'low':
        return theme.info;
      default:
        return theme.primary;
    }
  };
  
  // Animate to a specific region
  const animateToRegion = (latitude: number, longitude: number) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }, 1000);
    }
  };
  
  // Handle map ready
  const handleMapReady = () => {
    setMapReady(true);
  };
  
  return (
    <View style={styles.container}>
      {Platform.OS !== 'web' && MapView ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion || defaultRegion}
          onMapReady={handleMapReady}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass
          showsScale
          showsTraffic={false}
          customMapStyle={isDarkMode ? darkMapStyle : lightMapStyle}
        >
        {mapReady && (
          <Heatmap
            points={heatmapPoints}
            opacity={0.7}
            radius={40}
            gradient={{
              colors: [
                theme.heatMapLow,
                theme.heatMapMedium,
                theme.heatMapHigh,
              ],
              startPoints: [0.2, 0.5, 1],
              colorMapSize: 256,
            }}
          />
        )}
        
        {/* Traffic Markers */}
        {trafficData.map((item) => (
          <Marker
            key={`traffic-${item.id}`}
            coordinate={{
              latitude: item.location.latitude,
              longitude: item.location.longitude,
            }}
            onPress={() => onMarkerPress && onMarkerPress(item)}
          >
            <View style={styles.markerContainer}>
              <View 
                style={[
                  styles.marker, 
                  { 
                    backgroundColor: 
                      item.density === 'high' 
                        ? theme.trafficHigh 
                        : item.density === 'medium' 
                          ? theme.trafficMedium 
                          : theme.trafficLow 
                  }
                ]}
              >
                <Text style={styles.markerText}>
                  {item.vehicleCount}
                </Text>
              </View>
            </View>
            
            <Callout 
              tooltip
              onPress={() => onCalloutPress && onCalloutPress(item)}
            >
              <GlassmorphicCard style={styles.callout}>
                <Text style={[styles.calloutTitle, { color: theme.text }]}>
                  Traffic Density
                </Text>
                <Text style={[styles.calloutSubtitle, { color: theme.textSecondary }]}>
                  {item.location.address}
                </Text>
                <View style={styles.calloutDetails}>
                  <View style={styles.calloutDetail}>
                    <Ionicons name="car" size={16} color={theme.primary} />
                    <Text style={[styles.calloutDetailText, { color: theme.text }]}>
                      {item.vehicleCount} vehicles
                    </Text>
                  </View>
                  <View style={styles.calloutDetail}>
                    <Ionicons name="speedometer" size={16} color={theme.primary} />
                    <Text style={[styles.calloutDetailText, { color: theme.text }]}>
                      {item.averageSpeed} km/h
                    </Text>
                  </View>
                </View>
              </GlassmorphicCard>
            </Callout>
          </Marker>
        ))}
        
        {/* Incident Markers */}
        {incidents.map((incident) => (
          <Marker
            key={`incident-${incident.id}`}
            coordinate={{
              latitude: incident.location.latitude,
              longitude: incident.location.longitude,
            }}
            onPress={() => onMarkerPress && onMarkerPress(incident)}
          >
            <Animatable.View 
              animation="pulse" 
              iterationCount="infinite" 
              duration={2000}
            >
              <View 
                style={[
                  styles.incidentMarker, 
                  { backgroundColor: getIncidentColor(incident.severity) }
                ]}
              >
                <Ionicons 
                  name={getIncidentIcon(incident.type) as any} 
                  size={16} 
                  color="#FFFFFF" 
                />
              </View>
            </Animatable.View>
            
            <Callout 
              tooltip
              onPress={() => onCalloutPress && onCalloutPress(incident)}
            >
              <GlassmorphicCard style={styles.callout}>
                <Text style={[styles.calloutTitle, { color: theme.text }]}>
                  {incident.type.charAt(0).toUpperCase() + incident.type.slice(1)}
                </Text>
                <Text style={[styles.calloutSubtitle, { color: theme.textSecondary }]}>
                  {incident.location.address}
                </Text>
                <Text style={[styles.calloutDescription, { color: theme.text }]}>
                  {incident.description}
                </Text>
                <View style={styles.calloutFooter}>
                  <View 
                    style={[
                      styles.severityBadge, 
                      { backgroundColor: getIncidentColor(incident.severity) }
                    ]}
                  >
                    <Text style={styles.severityText}>
                      {incident.severity.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[styles.calloutTime, { color: theme.textSecondary }]}>
                    {new Date(incident.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
              </GlassmorphicCard>
            </Callout>
          </Marker>
        ))}
        </MapView>
      ) : (
        <View style={[styles.map, { justifyContent: 'center', alignItems: 'center', backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.5)' : 'rgba(240, 240, 240, 0.5)' }]}>
          <Text style={{ color: theme.textSecondary, fontWeight: '500' }}>Interactive maps available on mobile app</Text>
        </View>
      )}
      
      {/* Map Controls */}
      {Platform.OS !== 'web' && (
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: theme.card }]}
          onPress={() => mapRef.current?.animateToRegion(initialRegion || defaultRegion, 1000)}
        >
          <Ionicons name="home" size={20} color={theme.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: theme.card }]}
          onPress={() => mapRef.current?.getCamera().then(camera => 
            mapRef.current?.animateCamera({
              ...camera,
              zoom: (camera.zoom || 10) + 1
            })
          )}
        >
          <Ionicons name="add" size={20} color={theme.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: theme.card }]}
          onPress={() => mapRef.current?.getCamera().then(camera => 
            mapRef.current?.animateCamera({
              ...camera,
              zoom: Math.max((camera.zoom || 10) - 1, 1)
            })
          )}
        >
          <Ionicons name="remove" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>
      )}
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
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  markerText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  incidentMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  callout: {
    width: 200,
    padding: 12,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutSubtitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  calloutDetails: {
    marginTop: 8,
  },
  calloutDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  calloutDetailText: {
    fontSize: 12,
    marginLeft: 8,
  },
  calloutDescription: {
    fontSize: 12,
    marginBottom: 8,
  },
  calloutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  severityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  calloutTime: {
    fontSize: 10,
  },
  controls: {
    position: 'absolute',
    right: 16,
    top: 16,
    alignItems: 'center',
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

// Map styles
const lightMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
];

const darkMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
];

export default TrafficHeatMap; 