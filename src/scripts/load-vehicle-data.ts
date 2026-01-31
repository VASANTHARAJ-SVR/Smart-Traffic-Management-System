import { connectDB, disconnectDB } from '../config/mongodb';
import VehicleOwner from '../models/VehicleOwner';
import fs from 'fs';
import path from 'path';

/**
 * Script to export vehicle owner data from MongoDB to a JSON file
 * This file can then be imported into the mobile app for offline use
 */
const exportVehicleOwnerData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    
    console.log('Fetching vehicle owner data...');
    const vehicleOwners = await VehicleOwner.find({}).lean();
    
    console.log(`Found ${vehicleOwners.length} vehicle owners`);
    
    // Create data directory if it doesn't exist
    const dataDir = path.resolve(__dirname, '../../assets/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write data to JSON file
    const filePath = path.resolve(dataDir, 'vehicle-owners.json');
    fs.writeFileSync(filePath, JSON.stringify(vehicleOwners, null, 2));
    
    console.log(`Vehicle owner data exported to ${filePath}`);
    
    await disconnectDB();
    console.log('Disconnected from MongoDB');
  } catch (error: any) {
    console.error(`Error exporting vehicle owner data: ${error.message}`);
    process.exit(1);
  }
};

// Run the export function
exportVehicleOwnerData(); 