import { API_CONFIG } from '../config/api';

export interface TrafficData {
  latitude: number;
  longitude: number;
  weight: number;
  timestamp: number;
}

// Tambaram junction coordinates
export const TAMBARAM_COORDINATES = {
  latitude: 12.9249,
  longitude: 80.1275,
  latitudeDelta: 0.01, // Shows about 1km radius
  longitudeDelta: 0.01
};

export const getTrafficData = async (): Promise<void> => {
  try {
    // In a real implementation, this would fetch traffic data from an API
    console.log('Traffic data fetched for Tambaram junction area');
  } catch (error) {
    console.error('Error fetching traffic data:', error);
  }
}; 