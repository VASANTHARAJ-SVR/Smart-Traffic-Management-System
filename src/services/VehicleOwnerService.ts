import { IVehicleOwner } from '../models/VehicleOwner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

// Base URL for API calls
const API_BASE_URL = 'http://localhost:3000/api';
// Path to the exported vehicle owners data file
const VEHICLE_OWNERS_DATA_PATH = FileSystem.documentDirectory + 'vehicle-owners.json';

/**
 * Service for handling vehicle owner data operations
 */
export class VehicleOwnerService {
  
  /**
   * Fetch all vehicle owners
   */
  static async getAllVehicleOwners(): Promise<IVehicleOwner[]> {
    try {
      // First check AsyncStorage for cached data
      const cachedData = await AsyncStorage.getItem('vehicleOwnersData');
      
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      
      // If no cached data, try to load from the exported JSON file
      try {
        const fileExists = await FileSystem.getInfoAsync(VEHICLE_OWNERS_DATA_PATH);
        
        if (fileExists.exists) {
          const fileData = await FileSystem.readAsStringAsync(VEHICLE_OWNERS_DATA_PATH);
          const vehicleOwners = JSON.parse(fileData);
          
          // Cache the data in AsyncStorage for faster access
          await AsyncStorage.setItem('vehicleOwnersData', fileData);
          
          console.log(`Loaded ${vehicleOwners.length} vehicle owners from local file`);
          return vehicleOwners;
        }
      } catch (fileError) {
        console.warn('Error loading from local file:', fileError);
        // Continue to API call if file loading fails
      }
      
      // If no cached data and no local file, make API call
      const response = await fetch(`${API_BASE_URL}/vehicle-owners`);
      if (!response.ok) {
        throw new Error(`Failed to fetch vehicle owners: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the data for offline use
      await AsyncStorage.setItem('vehicleOwnersData', JSON.stringify(data));
      
      return data;
    } catch (error) {
      console.error('Error fetching vehicle owners:', error);
      // Return empty array if error
      return [];
    }
  }
  
  /**
   * Search vehicle owners by registration number
   */
  static async searchByRegistrationNumber(registrationNumber: string): Promise<IVehicleOwner | null> {
    try {
      // For development/demo purposes, we'll use mock data from AsyncStorage
      const cachedData = await AsyncStorage.getItem('vehicleOwnersData');
      
      if (cachedData) {
        const owners = JSON.parse(cachedData) as IVehicleOwner[];
        const owner = owners.find(o => 
          o.vehicle.registrationNumber.toLowerCase() === registrationNumber.toLowerCase() ||
          o.vehicle.numberPlate.toLowerCase() === registrationNumber.toLowerCase()
        );
        
        return owner || null;
      }
      
      // If no cached data, make API call
      const response = await fetch(`${API_BASE_URL}/vehicle-owners/registration/${registrationNumber}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to search vehicle owner: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching vehicle owner:', error);
      return null;
    }
  }
  
  /**
   * Search vehicle owners by license number
   */
  static async searchByLicenseNumber(licenseNumber: string): Promise<IVehicleOwner | null> {
    try {
      // For development/demo purposes, we'll use mock data from AsyncStorage
      const cachedData = await AsyncStorage.getItem('vehicleOwnersData');
      
      if (cachedData) {
        const owners = JSON.parse(cachedData) as IVehicleOwner[];
        const owner = owners.find(o => 
          o.drivingLicense.number.toLowerCase() === licenseNumber.toLowerCase()
        );
        
        return owner || null;
      }
      
      // If no cached data, make API call
      const response = await fetch(`${API_BASE_URL}/vehicle-owners/license/${licenseNumber}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to search vehicle owner: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching vehicle owner:', error);
      return null;
    }
  }
  
  /**
   * Load the exported vehicle owners data from assets into AsyncStorage
   */
  static async loadExportedData(): Promise<boolean> {
    try {
      // In a real app, we would download this file from a server
      // For this demo, we'll copy it from the assets folder to the document directory
      
      // First check if the file already exists in the document directory
      const fileInfo = await FileSystem.getInfoAsync(VEHICLE_OWNERS_DATA_PATH);
      
      if (!fileInfo.exists) {
        // Copy from assets to document directory
        // Note: In a real app, this would be a download from a server
        const assetUri = require('../../assets/data/vehicle-owners.json');
        
        // Create directory if it doesn't exist
        const dirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'data');
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'data', { intermediates: true });
        }
        
        // Read the file content and write to document directory
        const fileContent = JSON.stringify(assetUri);
        await FileSystem.writeAsStringAsync(VEHICLE_OWNERS_DATA_PATH, fileContent);
      }
      
      // Now read the file and store in AsyncStorage
      const fileData = await FileSystem.readAsStringAsync(VEHICLE_OWNERS_DATA_PATH);
      await AsyncStorage.setItem('vehicleOwnersData', fileData);
      
      console.log('Vehicle owners data loaded successfully');
      return true;
    } catch (error) {
      console.error('Error loading exported data:', error);
      return false;
    }
  }
  
  /**
   * Load sample data into AsyncStorage for offline/demo use
   */
  static async loadSampleData(data: IVehicleOwner[]): Promise<void> {
    try {
      await AsyncStorage.setItem('vehicleOwnersData', JSON.stringify(data));
      console.log('Sample vehicle owner data loaded successfully');
    } catch (error) {
      console.error('Error loading sample data:', error);
      throw error;
    }
  }
  
  /**
   * Check if a document is expired
   */
  static isDocumentExpired(expiryDate: Date): boolean {
    return new Date(expiryDate) < new Date();
  }
  
  /**
   * Get document status color
   */
  static getStatusColor(isExpired: boolean): string {
    return isExpired ? '#FF3B30' : '#4CAF50';
  }
  
  /**
   * Format date to readable string
   */
  static formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
} 