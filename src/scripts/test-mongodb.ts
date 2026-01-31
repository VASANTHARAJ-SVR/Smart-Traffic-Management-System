import { connectDB, disconnectDB } from '../config/mongodb';
import TrafficIncident from '../models/TrafficIncident';

// Sample traffic incident data
const sampleIncidents = [
  {
    incidentType: 'accident',
    location: 'MG Road Junction',
    description: 'Two-vehicle collision with minor injuries',
    status: 'active',
    reportedBy: 'Officer Smith',
    severityLevel: 3,
    affectedLanes: 2,
    coordinates: {
      latitude: 12.9716,
      longitude: 77.5946
    }
  },
  {
    incidentType: 'roadblock',
    location: 'Silk Board',
    description: 'Road closed due to political rally',
    status: 'active',
    reportedBy: 'Officer Johnson',
    severityLevel: 4,
    affectedLanes: 4,
    coordinates: {
      latitude: 12.9176,
      longitude: 77.6220
    }
  },
  {
    incidentType: 'traffic jam',
    location: 'Electronic City Flyover',
    description: 'Heavy congestion due to rain',
    status: 'active',
    reportedBy: 'Officer Kumar',
    severityLevel: 4,
    affectedLanes: 3,
    coordinates: {
      latitude: 12.8414,
      longitude: 77.6571
    }
  },
  {
    incidentType: 'construction',
    location: 'Whitefield Main Road',
    description: 'Road repair work in progress',
    status: 'active',
    reportedBy: 'Officer Patel',
    severityLevel: 2,
    affectedLanes: 1,
    coordinates: {
      latitude: 12.9698,
      longitude: 77.7500
    }
  },
  {
    incidentType: 'event',
    location: 'Palace Grounds',
    description: 'Music concert causing additional traffic',
    status: 'active',
    reportedBy: 'Officer Chen',
    severityLevel: 3,
    affectedLanes: 2,
    coordinates: {
      latitude: 13.0146,
      longitude: 77.5920
    }
  }
];

// Function to seed the database with sample incident data
const seedDatabase = async () => {
  try {
    console.log('Seeding database with sample traffic incidents...');

    // Clear existing data
    await TrafficIncident.deleteMany({});
    console.log('Cleared existing traffic incident data');

    // Insert new sample data
    const incidents = await TrafficIncident.insertMany(sampleIncidents);
    console.log(`Successfully inserted ${incidents.length} traffic incidents`);

    // Query to verify the data
    const incidentCount = await TrafficIncident.countDocuments();
    console.log(`Total incidents in database: ${incidentCount}`);

    const activeIncidents = await TrafficIncident.find({ status: 'active' });
    console.log(`Active incidents: ${activeIncidents.length}`);

    // Get one sample incident to display
    const sampleIncident = await TrafficIncident.findOne({}).lean();
    console.log('Sample incident from database:');
    console.log(JSON.stringify(sampleIncident, null, 2));

    return incidents;
  } catch (error: any) {
    console.error(`Error seeding database: ${error.message}`);
    throw error;
  }
};

// Main function
const main = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Seed the database
    await seedDatabase();

    // Disconnect from MongoDB
    await disconnectDB();
    console.log('MongoDB test completed successfully!');
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
  }
};

// Run the main function
main(); 