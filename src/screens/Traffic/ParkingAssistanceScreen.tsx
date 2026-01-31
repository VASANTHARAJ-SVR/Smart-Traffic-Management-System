import React, { useState } from 'react';
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
  Button,
  Chip,
  Avatar,
  Searchbar,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../../context/ThemeContext';
import ScreenWithSidebar from '../../components/ScreenWithSidebar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TrafficStackParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<TrafficStackParamList, 'ParkingAssistance'>;

interface ParkingSpot {
  id: string;
  name: string;
  location: string;
  totalSpots: number;
  availableSpots: number;
  distance: string;
  rate: string;
}

const ParkingAssistanceScreen = ({ navigation }: Props) => {
  const { theme, isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'available' | 'full'>('all');

  const parkingSpots: ParkingSpot[] = [
    {
      id: '1',
      name: 'Central Mall Parking',
      location: 'MG Road',
      totalSpots: 200,
      availableSpots: 45,
      distance: '0.5 km',
      rate: '₹40/hr',
    },
    {
      id: '2',
      name: 'City Center Basement',
      location: 'Brigade Road',
      totalSpots: 150,
      availableSpots: 0,
      distance: '1.2 km',
      rate: '₹30/hr',
    },
    {
      id: '3',
      name: 'Metro Station Parking',
      location: 'Indiranagar',
      totalSpots: 100,
      availableSpots: 72,
      distance: '2.5 km',
      rate: '₹20/hr',
    },
    {
      id: '4',
      name: 'Hospital Visitor Parking',
      location: 'Residency Road',
      totalSpots: 80,
      availableSpots: 15,
      distance: '3.0 km',
      rate: '₹25/hr',
    },
  ];

  const filteredSpots = parkingSpots.filter(spot => {
    if (selectedFilter === 'available' && spot.availableSpots === 0) return false;
    if (selectedFilter === 'full' && spot.availableSpots > 0) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        spot.name.toLowerCase().includes(query) ||
        spot.location.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage === 0) return theme.error;
    if (percentage < 20) return theme.warning;
    return theme.success;
  };

  return (
    <ScreenWithSidebar
      title="Parking Assistance"
      navigation={navigation}
      notificationCount={0}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Search and Filters */}
        <Animatable.View
          animation="fadeIn"
          duration={600}
          style={styles.searchContainer}
        >
          <Searchbar
            placeholder="Search parking spots..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchBar, {
              backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.7)',
            }]}
            iconColor={theme.primary}
            inputStyle={{ color: theme.text }}
          />

          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'all' && {
                  backgroundColor: theme.primary + '20',
                  borderColor: theme.primary,
                },
              ]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text style={[
                styles.filterText,
                { color: selectedFilter === 'all' ? theme.primary : theme.textSecondary },
              ]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'available' && {
                  backgroundColor: theme.success + '20',
                  borderColor: theme.success,
                },
              ]}
              onPress={() => setSelectedFilter('available')}
            >
              <Text style={[
                styles.filterText,
                { color: selectedFilter === 'available' ? theme.success : theme.textSecondary },
              ]}>
                Available
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'full' && {
                  backgroundColor: theme.error + '20',
                  borderColor: theme.error,
                },
              ]}
              onPress={() => setSelectedFilter('full')}
            >
              <Text style={[
                styles.filterText,
                { color: selectedFilter === 'full' ? theme.error : theme.textSecondary },
              ]}>
                Full
              </Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>

        {/* Parking Spots List */}
        <View style={styles.spotsContainer}>
          {filteredSpots.map((spot, index) => (
            <Animatable.View
              key={spot.id}
              animation="fadeInUp"
              delay={index * 100}
              style={styles.spotCard}
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

                <View style={styles.spotHeader}>
                  <View style={styles.spotInfo}>
                    <Text style={[styles.spotName, { color: theme.text }]}>
                      {spot.name}
                    </Text>
                    <View style={styles.locationContainer}>
                      <IconButton
                        icon="map-marker"
                        size={16}
                        iconColor={theme.primary}
                        style={styles.locationIcon}
                      />
                      <Text style={[styles.locationText, { color: theme.textSecondary }]}>
                        {spot.location}
                      </Text>
                    </View>
                  </View>
                  <Chip
                    style={[styles.availabilityChip, {
                      backgroundColor: getAvailabilityColor(spot.availableSpots, spot.totalSpots) + '20',
                      borderColor: getAvailabilityColor(spot.availableSpots, spot.totalSpots),
                    }]}
                  >
                    <Text style={[styles.availabilityText, {
                      color: getAvailabilityColor(spot.availableSpots, spot.totalSpots),
                    }]}>
                      {spot.availableSpots === 0 ? 'Full' : `${spot.availableSpots} spots`}
                    </Text>
                  </Chip>
                </View>

                <View style={styles.spotDetails}>
                  <View style={styles.detailItem}>
                    <IconButton
                      icon="car-multiple"
                      size={20}
                      iconColor={theme.primary}
                      style={styles.detailIcon}
                    />
                    <Text style={[styles.detailText, { color: theme.text }]}>
                      {spot.totalSpots} Total Spots
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <IconButton
                      icon="map-marker-distance"
                      size={20}
                      iconColor={theme.primary}
                      style={styles.detailIcon}
                    />
                    <Text style={[styles.detailText, { color: theme.text }]}>
                      {spot.distance}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <IconButton
                      icon="currency-inr"
                      size={20}
                      iconColor={theme.primary}
                      style={styles.detailIcon}
                    />
                    <Text style={[styles.detailText, { color: theme.text }]}>
                      {spot.rate}
                    </Text>
                  </View>
                </View>

                <Button
                  mode="contained"
                  onPress={() => {}}
                  style={[styles.navigateButton, {
                    backgroundColor: theme.primary,
                  }]}
                  disabled={spot.availableSpots === 0}
                >
                  Navigate
                </Button>
              </Surface>
            </Animatable.View>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </ScreenWithSidebar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    elevation: 0,
    borderRadius: 12,
    marginBottom: 16,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  spotsContainer: {
    padding: 16,
  },
  spotCard: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  spotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  spotInfo: {
    flex: 1,
    marginRight: 16,
  },
  spotName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
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
    fontSize: 14,
  },
  availabilityChip: {
    borderWidth: 1,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  spotDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    margin: 0,
    marginRight: 4,
  },
  detailText: {
    fontSize: 14,
  },
  navigateButton: {
    borderRadius: 8,
  },
  bottomPadding: {
    height: 20,
  },
});

export default ParkingAssistanceScreen; 