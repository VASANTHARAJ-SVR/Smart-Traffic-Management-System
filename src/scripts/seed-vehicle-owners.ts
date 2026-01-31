import { connectDB, disconnectDB } from '../config/mongodb';
import VehicleOwner from '../models/VehicleOwner';
import mongoose from 'mongoose';

// Helper function to generate random date within a range
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to check if a date is expired
const isExpired = (date: Date): boolean => {
  return date < new Date();
};

// Helper function to generate random number between min and max (inclusive)
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to randomly select an item from an array
const randomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper function to generate random boolean with probability
const randomBoolean = (probability = 0.5): boolean => {
  return Math.random() < probability;
};

// Helper function to generate a random string of specified length
const randomString = (length: number, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Helper function to generate a random vehicle registration number
const generateRegistrationNumber = (): string => {
  const states = ['KA', 'MH', 'TN', 'AP', 'TS', 'KL', 'DL', 'GJ', 'HR', 'UP', 'RJ', 'MP'];
  const district = randomInt(1, 99).toString().padStart(2, '0');
  const series = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const number = randomInt(1, 9999).toString().padStart(4, '0');
  
  return `${randomItem(states)}-${district}-${series}-${number}`;
};

// Helper function to generate a random license number
const generateLicenseNumber = (): string => {
  const states = ['KA', 'MH', 'TN', 'AP', 'TS', 'KL', 'DL', 'GJ', 'HR', 'UP', 'RJ', 'MP'];
  const randomNumbers = randomInt(10000000, 99999999).toString();
  return `${randomItem(states)}${randomInt(10, 99)}${randomInt(10000000, 99999999)}`;
};

// Helper function to generate a random policy number
const generatePolicyNumber = (): string => {
  return `POL-${randomString(8)}-${randomInt(1000, 9999)}`;
};

// Helper function to generate a random certificate number
const generateCertificateNumber = (prefix: string): string => {
  return `${prefix}-${randomString(6)}-${randomInt(1000, 9999)}`;
};

// Helper function to generate a random case number for violations
const generateCaseNumber = (): string => {
  return `CASE-${randomString(4)}-${randomInt(1000, 9999)}-${new Date().getFullYear()}`;
};

// Helper function to generate a random GST number
const generateGSTNumber = (): string => {
  const states = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const pan = randomString(10, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
  const z = randomString(1, '0123456789');
  const checksum = randomString(1, '0123456789');
  
  return `${randomItem(states)}${pan}${z}${checksum}`;
};

// Generate 75 vehicle owner records
const generateVehicleOwners = (count: number) => {
  const vehicleOwners = [];
  
  // Sample data arrays
  const firstNames = ['Rahul', 'Priya', 'Amit', 'Neha', 'Vikram', 'Anjali', 'Rajesh', 'Sunita', 'Sanjay', 'Meera', 'Arjun', 'Pooja', 'Anil', 'Kavita', 'Deepak', 'Ananya', 'Suresh', 'Divya', 'Ravi', 'Shweta'];
  const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Joshi', 'Verma', 'Reddy', 'Nair', 'Iyer', 'Mehta', 'Agarwal', 'Desai', 'Kapoor', 'Malhotra', 'Bose', 'Chatterjee', 'Rao', 'Menon', 'Pillai'];
  const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi', 'Indore', 'Bhopal', 'Nagpur'];
  const states = ['Karnataka', 'Maharashtra', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Kerala', 'Delhi', 'Gujarat', 'Haryana', 'Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh'];
  const vehicleMakes = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota', 'Ford', 'Volkswagen', 'Renault', 'Kia', 'MG', 'Skoda', 'Nissan', 'Jeep', 'Mercedes-Benz', 'BMW', 'Audi'];
  const vehicleModels: Record<string, string[]> = {
    'Maruti Suzuki': ['Swift', 'Baleno', 'Dzire', 'WagonR', 'Alto', 'Ertiga', 'Vitara Brezza', 'Celerio', 'Ciaz', 'S-Presso'],
    'Hyundai': ['i10', 'i20', 'Venue', 'Creta', 'Verna', 'Aura', 'Alcazar', 'Tucson', 'Kona', 'Grand i10'],
    'Tata': ['Tiago', 'Nexon', 'Altroz', 'Harrier', 'Safari', 'Tigor', 'Punch', 'Hexa', 'Bolt', 'Zest'],
    'Mahindra': ['XUV700', 'Thar', 'Scorpio', 'XUV300', 'Bolero', 'Marazzo', 'KUV100', 'TUV300', 'Alturas G4', 'XUV500'],
    'Honda': ['City', 'Amaze', 'WR-V', 'Jazz', 'Civic', 'CR-V', 'Accord', 'Brio', 'Mobilio', 'BR-V'],
    'Toyota': ['Innova', 'Fortuner', 'Glanza', 'Urban Cruiser', 'Camry', 'Vellfire', 'Yaris', 'Etios', 'Corolla', 'Land Cruiser'],
    'Ford': ['EcoSport', 'Figo', 'Aspire', 'Endeavour', 'Freestyle', 'Mustang', 'Fiesta', 'Focus', 'Escape', 'Explorer'],
    'Volkswagen': ['Polo', 'Vento', 'Taigun', 'T-Roc', 'Tiguan', 'Passat', 'Jetta', 'Ameo', 'Golf', 'Beetle'],
    'Renault': ['Kwid', 'Triber', 'Kiger', 'Duster', 'Captur', 'Lodgy', 'Fluence', 'Pulse', 'Scala', 'Koleos'],
    'Kia': ['Seltos', 'Sonet', 'Carnival', 'Carens', 'Rio', 'Sportage', 'Sorento', 'Soul', 'Forte', 'Optima'],
    'MG': ['Hector', 'Astor', 'ZS EV', 'Gloster', 'Hector Plus', 'MG3', 'MG5', 'MG6', 'HS', 'Marvel R'],
    'Skoda': ['Kushaq', 'Slavia', 'Octavia', 'Superb', 'Kodiaq', 'Rapid', 'Fabia', 'Karoq', 'Yeti', 'Scala'],
    'Nissan': ['Magnite', 'Kicks', 'GT-R', 'X-Trail', 'Terrano', 'Sunny', 'Micra', 'Patrol', 'Juke', 'Qashqai'],
    'Jeep': ['Compass', 'Wrangler', 'Meridian', 'Cherokee', 'Grand Cherokee', 'Renegade', 'Gladiator', 'Commander', 'Wagoneer', 'Avenger'],
    'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'AMG GT', 'EQC'],
    'BMW': ['3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X7', 'Z4', 'i4', 'iX'],
    'Audi': ['A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'e-tron', 'RS5', 'RS7', 'TT']
  };
  const colors = ['White', 'Black', 'Silver', 'Grey', 'Red', 'Blue', 'Brown', 'Green', 'Yellow', 'Orange', 'Purple', 'Maroon', 'Beige', 'Gold', 'Bronze'];
  const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid', 'LPG'];
  const vehicleClasses = ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Luxury', 'Sports', 'Convertible', 'Coupe', 'Wagon', 'Van', 'Truck', 'Bus'];
  const insuranceProviders = ['ICICI Lombard', 'HDFC ERGO', 'Bajaj Allianz', 'New India Assurance', 'Tata AIG', 'Reliance General', 'SBI General', 'National Insurance', 'Oriental Insurance', 'United India Insurance'];
  const insuranceTypes = ['Third Party', 'Comprehensive', 'Zero Depreciation', 'Own Damage', 'Personal Accident Cover'];
  const permitTypes = ['All India Tourist Permit', 'State Carriage Permit', 'Contract Carriage Permit', 'Goods Carriage Permit', 'Private Service Vehicle Permit', 'National Permit'];
  const violationTypes = ['Speeding', 'Red Light Violation', 'Illegal Parking', 'Driving Without License', 'Driving Without Insurance', 'Overloading', 'Drunk Driving', 'Using Mobile While Driving', 'Not Wearing Seat Belt', 'Dangerous Driving', 'Wrong Side Driving', 'No Helmet', 'Expired Documents', 'Defective Number Plate', 'Noise Pollution'];
  const officerNames = ['Officer Kumar', 'Officer Singh', 'Officer Sharma', 'Officer Patel', 'Officer Reddy', 'Officer Gupta', 'Officer Joshi', 'Officer Nair', 'Officer Mehta', 'Officer Verma'];
  const issuingAuthorities = ['RTO Bangalore', 'RTO Mumbai', 'RTO Delhi', 'RTO Chennai', 'RTO Hyderabad', 'RTO Kolkata', 'RTO Pune', 'RTO Ahmedabad', 'RTO Jaipur', 'RTO Lucknow'];
  const pollutionCenters = ['Pollution Check Center 1', 'Pollution Check Center 2', 'Pollution Check Center 3', 'Pollution Check Center 4', 'Pollution Check Center 5'];
  const licenseCategories = ['LMV', 'HMV', 'MCWG', 'MCWOG', 'TRANS', 'HPMV', 'HGMV'];
  const businessNames = ['Express Logistics', 'City Cabs', 'Metro Tours & Travels', 'Highway Carriers', 'Urban Movers', 'Speedy Delivery', 'Safe Ride', 'Green Transport', 'Royal Travels', 'Prime Logistics'];
  
  for (let i = 0; i < count; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const name = `${firstName} ${lastName}`;
    const gender = randomItem(['male', 'female', 'other']);
    const dateOfBirth = randomDate(new Date(1960, 0, 1), new Date(2000, 0, 1));
    
    const city = randomItem(cities);
    const state = randomItem(states);
    
    const isCommercial = randomBoolean(0.3); // 30% chance of being commercial
    
    const vehicleMake = randomItem(vehicleMakes);
    const vehicleModel = randomItem(vehicleModels[vehicleMake]);
    const vehicleYear = randomInt(2000, 2023);
    const color = randomItem(colors);
    const fuelType = randomItem(fuelTypes);
    const vehicleClass = randomItem(vehicleClasses);
    
    // Generate license details
    const licenseIssueDate = randomDate(new Date(2010, 0, 1), new Date(2022, 0, 1));
    const licenseExpiryDate = new Date(licenseIssueDate);
    licenseExpiryDate.setFullYear(licenseIssueDate.getFullYear() + randomInt(5, 20));
    const licenseIsExpired = isExpired(licenseExpiryDate);
    
    // Generate registration details
    const registrationIssueDate = randomDate(new Date(vehicleYear, 0, 1), new Date(vehicleYear + 1, 0, 1));
    const registrationExpiryDate = new Date(registrationIssueDate);
    registrationExpiryDate.setFullYear(registrationIssueDate.getFullYear() + 15); // 15 years validity
    const registrationIsExpired = isExpired(registrationExpiryDate);
    
    // Generate insurance details
    const insuranceIssueDate = randomDate(new Date(2022, 0, 1), new Date(2023, 0, 1));
    const insuranceExpiryDate = new Date(insuranceIssueDate);
    insuranceExpiryDate.setFullYear(insuranceIssueDate.getFullYear() + 1); // 1 year validity
    const insuranceIsExpired = isExpired(insuranceExpiryDate);
    
    // Generate pollution certificate details
    const pollutionIssueDate = randomDate(new Date(2022, 6, 1), new Date(2023, 0, 1));
    const pollutionExpiryDate = new Date(pollutionIssueDate);
    pollutionExpiryDate.setMonth(pollutionIssueDate.getMonth() + 6); // 6 months validity
    const pollutionIsExpired = isExpired(pollutionExpiryDate);
    
    // Generate fitness certificate details (for commercial vehicles)
    let fitnessCertificate = null;
    if (isCommercial) {
      const fitnessIssueDate = randomDate(new Date(2022, 0, 1), new Date(2023, 0, 1));
      const fitnessExpiryDate = new Date(fitnessIssueDate);
      fitnessExpiryDate.setFullYear(fitnessIssueDate.getFullYear() + 2); // 2 years validity
      const fitnessIsExpired = isExpired(fitnessExpiryDate);
      
      fitnessCertificate = {
        certificateNumber: generateCertificateNumber('FIT'),
        issueDate: fitnessIssueDate,
        expiryDate: fitnessExpiryDate,
        isExpired: fitnessIsExpired,
        issuingAuthority: randomItem(issuingAuthorities)
      };
    }
    
    // Generate commercial details (if applicable)
    let commercialDetails = null;
    if (isCommercial) {
      const permitIssueDate = randomDate(new Date(2021, 0, 1), new Date(2022, 0, 1));
      const permitExpiryDate = new Date(permitIssueDate);
      permitExpiryDate.setFullYear(permitIssueDate.getFullYear() + 5); // 5 years validity
      const permitIsExpired = isExpired(permitExpiryDate);
      
      commercialDetails = {
        permitType: randomItem(permitTypes),
        businessName: randomItem(businessNames),
        gstNumber: generateGSTNumber(),
        operationRoutes: [
          `${randomItem(cities)} - ${randomItem(cities)}`,
          `${randomItem(cities)} - ${randomItem(cities)}`
        ],
        permitNumber: `PERMIT-${randomString(6)}`,
        permitIssueDate: permitIssueDate,
        permitExpiryDate: permitExpiryDate,
        isPermitExpired: permitIsExpired
      };
    }
    
    // Generate permits (0-2 permits)
    const permits = [];
    const numPermits = isCommercial ? randomInt(1, 2) : randomInt(0, 1);
    
    for (let j = 0; j < numPermits; j++) {
      const permitIssueDate = randomDate(new Date(2021, 0, 1), new Date(2022, 0, 1));
      const permitExpiryDate = new Date(permitIssueDate);
      permitExpiryDate.setFullYear(permitIssueDate.getFullYear() + randomInt(1, 5));
      const permitIsExpired = isExpired(permitExpiryDate);
      
      permits.push({
        type: randomItem(permitTypes),
        permitNumber: `PERMIT-${randomString(6)}`,
        issueDate: permitIssueDate,
        expiryDate: permitExpiryDate,
        isExpired: permitIsExpired,
        issuingAuthority: randomItem(issuingAuthorities),
        jurisdiction: [randomItem(states), randomItem(states)]
      });
    }
    
    // Generate violations (0-5 violations)
    const violations = [];
    const numViolations = randomInt(0, 5);
    
    for (let j = 0; j < numViolations; j++) {
      const violationDate = randomDate(new Date(2020, 0, 1), new Date());
      const violationType = randomItem(violationTypes);
      let penaltyAmount = 0;
      
      // Set penalty amount based on violation type
      switch (violationType) {
        case 'Speeding':
          penaltyAmount = randomInt(500, 2000);
          break;
        case 'Red Light Violation':
          penaltyAmount = randomInt(1000, 5000);
          break;
        case 'Drunk Driving':
          penaltyAmount = randomInt(10000, 15000);
          break;
        case 'Driving Without License':
          penaltyAmount = randomInt(5000, 10000);
          break;
        default:
          penaltyAmount = randomInt(500, 5000);
      }
      
      violations.push({
        violationType: violationType,
        date: violationDate,
        location: `${randomItem(cities)}, ${randomItem(states)}`,
        penaltyAmount: penaltyAmount,
        isPaid: randomBoolean(0.7), // 70% chance of being paid
        officerName: randomItem(officerNames),
        description: `Violation of traffic rules: ${violationType}`,
        caseNumber: generateCaseNumber(),
        points: randomInt(1, 5)
      });
    }
    
    // Create vehicle owner object
    const vehicleOwner = {
      // Personal Information
      name: name,
      gender: gender,
      dateOfBirth: dateOfBirth,
      contactNumber: `+91${randomInt(7000000000, 9999999999)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInt(1, 999)}@gmail.com`,
      address: {
        street: `${randomInt(1, 999)}, ${randomItem(['Main', 'Cross', 'Avenue', 'Street', 'Road'])} ${randomInt(1, 20)}`,
        city: city,
        state: state,
        postalCode: `${randomInt(100000, 999999)}`
      },
      
      // Vehicle Information
      vehicle: {
        registrationNumber: generateRegistrationNumber(),
        numberPlate: generateRegistrationNumber(),
        make: vehicleMake,
        model: vehicleModel,
        year: vehicleYear,
        color: color,
        chassisNumber: `CHASSIS${randomString(10, '0123456789')}`,
        engineNumber: `ENGINE${randomString(10, '0123456789')}`,
        fuelType: fuelType,
        vehicleClass: vehicleClass,
        seatingCapacity: randomInt(2, 8),
        isCommercial: isCommercial
      },
      
      // License Information
      drivingLicense: {
        number: generateLicenseNumber(),
        issueDate: licenseIssueDate,
        expiryDate: licenseExpiryDate,
        isExpired: licenseIsExpired,
        category: [randomItem(licenseCategories), randomItem(licenseCategories)],
        issuingAuthority: randomItem(issuingAuthorities)
      },
      
      // Registration Information
      registration: {
        certificateNumber: generateCertificateNumber('RC'),
        issueDate: registrationIssueDate,
        expiryDate: registrationExpiryDate,
        isExpired: registrationIsExpired,
        registeredOwner: name,
        registeredAddress: `${randomInt(1, 999)}, ${randomItem(['Main', 'Cross', 'Avenue', 'Street', 'Road'])} ${randomInt(1, 20)}, ${city}, ${state}`,
        registrationAuthority: randomItem(issuingAuthorities)
      },
      
      // Insurance Information
      insurance: {
        provider: randomItem(insuranceProviders),
        policyNumber: generatePolicyNumber(),
        type: randomItem(insuranceTypes),
        issueDate: insuranceIssueDate,
        expiryDate: insuranceExpiryDate,
        isExpired: insuranceIsExpired,
        coverageAmount: randomInt(100000, 5000000)
      },
      
      // Permits
      permits: permits,
      
      // Commercial Details
      commercialDetails: commercialDetails,
      
      // Violations
      violations: violations,
      
      // Pollution Certificate
      pollutionCertificate: {
        certificateNumber: generateCertificateNumber('PUC'),
        issueDate: pollutionIssueDate,
        expiryDate: pollutionExpiryDate,
        isExpired: pollutionIsExpired,
        issuingCenter: randomItem(pollutionCenters)
      },
      
      // Fitness Certificate
      fitnessCertificate: fitnessCertificate,
      
      // Additional Information
      remarks: randomBoolean(0.2) ? 'Previous history of multiple violations' : '',
      blacklisted: randomBoolean(0.05) // 5% chance of being blacklisted
    };
    
    vehicleOwners.push(vehicleOwner);
  }
  
  return vehicleOwners;
};

// Function to seed the database with vehicle owners
const seedVehicleOwners = async (count: number) => {
  try {
    console.log(`Seeding database with ${count} vehicle owners...`);
    
    // Clear existing data
    await VehicleOwner.deleteMany({});
    console.log('Cleared existing vehicle owner data');
    
    // Generate and insert vehicle owners
    const vehicleOwners = generateVehicleOwners(count);
    const insertedOwners = await VehicleOwner.insertMany(vehicleOwners);
    console.log(`Successfully inserted ${insertedOwners.length} vehicle owners`);
    
    // Query to verify the data
    const ownerCount = await VehicleOwner.countDocuments();
    console.log(`Total vehicle owners in database: ${ownerCount}`);
    
    const commercialVehicles = await VehicleOwner.countDocuments({ 'vehicle.isCommercial': true });
    console.log(`Commercial vehicles: ${commercialVehicles}`);
    
    const expiredLicenses = await VehicleOwner.countDocuments({ 'drivingLicense.isExpired': true });
    console.log(`Expired licenses: ${expiredLicenses}`);
    
    const expiredInsurance = await VehicleOwner.countDocuments({ 'insurance.isExpired': true });
    console.log(`Expired insurance: ${expiredInsurance}`);
    
    const expiredPollution = await VehicleOwner.countDocuments({ 'pollutionCertificate.isExpired': true });
    console.log(`Expired pollution certificates: ${expiredPollution}`);
    
    const blacklisted = await VehicleOwner.countDocuments({ blacklisted: true });
    console.log(`Blacklisted vehicle owners: ${blacklisted}`);
    
    // Get one sample owner to display
    const sampleOwner = await VehicleOwner.findOne({}).lean();
    console.log('Sample vehicle owner from database:');
    console.log(JSON.stringify(sampleOwner, null, 2));
    
    return insertedOwners;
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
    
    // Seed the database with 75 vehicle owners
    await seedVehicleOwners(75);
    
    // Disconnect from MongoDB
    await disconnectDB();
    console.log('Vehicle owner data seeding completed successfully!');
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
  }
};

// Run the main function
main(); 