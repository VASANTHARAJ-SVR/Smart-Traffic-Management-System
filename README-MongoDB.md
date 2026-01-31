# MongoDB Setup for Traffic Police App

This guide explains how to set up and test the MongoDB connection for the Traffic Police App.

## Prerequisites

1. MongoDB 8.0.5 Community Edition installed and running on localhost:27017
2. Node.js and npm installed

## Configuration

The MongoDB connection is configured using environment variables in the `.env` file:

```
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/traffic_police_db
MONGODB_DB_NAME=traffic_police_db

# Test Database
MONGODB_TEST_DB=traffic_police_test_db

# App Environment
NODE_ENV=development
```

You can modify these settings according to your MongoDB setup.

## Database Structure

The application uses the following database structure:

- **Database**: `traffic_police_db` (configurable in .env)
- **Collections**:
  - `trafficincidents`: Traffic-related incidents reported by officers
  - (Add more collections as they are implemented)

## Test Data

The application includes a test script that creates sample traffic incident data. This script:

1. Connects to the MongoDB server
2. Clears any existing traffic incident data
3. Inserts 5 sample traffic incidents
4. Performs queries to validate the data
5. Displays a sample record

## Running the Test Script

To test your MongoDB connection and seed the database with sample data:

```bash
npm run test-db
```

This will run the script located at `src/scripts/test-mongodb.ts`.

## Troubleshooting

If you encounter any issues with the MongoDB connection:

1. Ensure MongoDB server is running (`mongod` process)
2. Verify the connection string in the `.env` file
3. Check that you have appropriate permissions to access the database
4. If using a different port, update the `MONGODB_URI` in the `.env` file

## Models

The application uses Mongoose for MongoDB object modeling. The available models are:

- `TrafficIncident`: Represents traffic-related incidents (accidents, roadblocks, etc.)

## API Integration

The MongoDB connection and models are integrated with the app's backend services. The database connection is established when the application starts, and is used by various features like:

- Traffic incident reporting and management
- Dashboard statistics
- Traffic congestion tracking

For developers implementing new features, import the relevant models from the `src/models` directory to interact with the database. 