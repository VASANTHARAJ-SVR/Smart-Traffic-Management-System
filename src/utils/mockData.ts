import { Vehicle, TrafficData, Incident, Violation, StolenVehicle, Document, Challan } from '../types/index';

// Mock vehicles data
export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    licensePlate: 'MH01AB1234',
    make: 'Toyota',
    model: 'Camry',
    color: 'Black',
    year: 2020,
    owner: {
      id: '1',
      name: 'Rahul Sharma',
      licenseNumber: 'DL-1420110012345',
      address: '123 Main Street, Mumbai, Maharashtra',
      phone: '+91 9876543210',
      email: 'rahul.sharma@example.com',
    },
    registrationStatus: 'valid',
    registrationExpiry: '2025-05-15',
    insuranceStatus: 'valid',
    insuranceExpiry: '2023-12-31',
    violations: [],
    stolen: false,
  },
  {
    id: '2',
    licensePlate: 'DL02CD5678',
    make: 'Honda',
    model: 'City',
    color: 'White',
    year: 2019,
    owner: {
      id: '2',
      name: 'Priya Patel',
      licenseNumber: 'MH-0220220054321',
      address: '456 Park Avenue, Delhi',
      phone: '+91 8765432109',
      email: 'priya.patel@example.com',
    },
    registrationStatus: 'expired',
    registrationExpiry: '2022-10-20',
    insuranceStatus: 'expired',
    insuranceExpiry: '2022-11-15',
    violations: [],
    stolen: false,
  },
  {
    id: '3',
    licensePlate: 'KA03EF9012',
    make: 'Maruti Suzuki',
    model: 'Swift',
    color: 'Red',
    year: 2021,
    owner: {
      id: '3',
      name: 'Vikram Singh',
      licenseNumber: 'KA-0320210098765',
      address: '789 Brigade Road, Bangalore, Karnataka',
      phone: '+91 7654321098',
      email: 'vikram.singh@example.com',
    },
    registrationStatus: 'valid',
    registrationExpiry: '2026-03-10',
    insuranceStatus: 'valid',
    insuranceExpiry: '2024-02-28',
    violations: [],
    stolen: false,
  },
  {
    id: '4',
    licensePlate: 'TN04GH3456',
    make: 'Hyundai',
    model: 'Creta',
    color: 'Blue',
    year: 2022,
    owner: {
      id: '4',
      name: 'Ananya Krishnan',
      licenseNumber: 'TN-0420220087654',
      address: '101 Anna Salai, Chennai, Tamil Nadu',
      phone: '+91 6543210987',
      email: 'ananya.k@example.com',
    },
    registrationStatus: 'valid',
    registrationExpiry: '2027-01-25',
    insuranceStatus: 'valid',
    insuranceExpiry: '2023-08-15',
    violations: [],
    stolen: false,
  },
  {
    id: '5',
    licensePlate: 'WB05IJ7890',
    make: 'Tata',
    model: 'Nexon',
    color: 'Grey',
    year: 2020,
    owner: {
      id: '5',
      name: 'Arjun Das',
      licenseNumber: 'WB-0520200076543',
      address: '202 Park Street, Kolkata, West Bengal',
      phone: '+91 5432109876',
      email: 'arjun.das@example.com',
    },
    registrationStatus: 'suspended',
    registrationExpiry: '2025-07-05',
    insuranceStatus: 'valid',
    insuranceExpiry: '2023-06-30',
    violations: [],
    stolen: true,
  },
];

// Mock traffic data
export const mockTrafficData: TrafficData[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      address: 'Bandra-Worli Sea Link, Mumbai',
    },
    density: 'high',
    vehicleCount: 245,
    pedestrianCount: 12,
    averageSpeed: 15,
    incidents: [],
  },
  {
    id: '2',
    timestamp: new Date().toISOString(),
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'Connaught Place, New Delhi',
    },
    density: 'medium',
    vehicleCount: 180,
    pedestrianCount: 85,
    averageSpeed: 25,
    incidents: [],
  },
  {
    id: '3',
    timestamp: new Date().toISOString(),
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      address: 'MG Road, Bangalore',
    },
    density: 'low',
    vehicleCount: 95,
    pedestrianCount: 40,
    averageSpeed: 35,
    incidents: [],
  },
  {
    id: '4',
    timestamp: new Date().toISOString(),
    location: {
      latitude: 13.0827,
      longitude: 80.2707,
      address: 'Anna Salai, Chennai',
    },
    density: 'high',
    vehicleCount: 220,
    pedestrianCount: 65,
    averageSpeed: 18,
    incidents: [],
  },
  {
    id: '5',
    timestamp: new Date().toISOString(),
    location: {
      latitude: 22.5726,
      longitude: 88.3639,
      address: 'Park Street, Kolkata',
    },
    density: 'medium',
    vehicleCount: 150,
    pedestrianCount: 55,
    averageSpeed: 22,
    incidents: [],
  },
];

// Mock incidents
export const mockIncidents: Incident[] = [
  {
    id: '1',
    type: 'accident',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      address: 'Bandra-Worli Sea Link, Mumbai',
    },
    description: 'Two-vehicle collision, minor injuries reported',
    status: 'active',
    severity: 'medium',
    reportedBy: 'Officer ID: 12345',
  },
  {
    id: '2',
    type: 'congestion',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'India Gate, New Delhi',
    },
    description: 'Heavy traffic due to political rally',
    status: 'active',
    severity: 'high',
    reportedBy: 'Traffic Control Room',
  },
  {
    id: '3',
    type: 'roadblock',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(), // 2 hours ago
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      address: 'Silk Board Junction, Bangalore',
    },
    description: 'Road closed for metro construction',
    status: 'active',
    severity: 'medium',
    reportedBy: 'BMRCL',
  },
  {
    id: '4',
    type: 'construction',
    timestamp: new Date(Date.now() - 24 * 60 * 60000).toISOString(), // 1 day ago
    location: {
      latitude: 13.0827,
      longitude: 80.2707,
      address: 'Mount Road, Chennai',
    },
    description: 'Road widening project, one lane closed',
    status: 'active',
    severity: 'low',
    reportedBy: 'City Corporation',
  },
  {
    id: '5',
    type: 'event',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
    location: {
      latitude: 22.5726,
      longitude: 88.3639,
      address: 'Salt Lake Stadium, Kolkata',
    },
    description: 'Sports event, expect heavy traffic',
    status: 'active',
    severity: 'medium',
    reportedBy: 'Event Management',
  },
];

// Mock violations
export const mockViolations: Violation[] = [
  {
    id: '1',
    type: 'Speeding',
    date: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(), // 2 days ago
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      address: 'Western Express Highway, Mumbai',
    },
    description: 'Vehicle recorded at 80 km/h in a 60 km/h zone',
    fine: 1000,
    status: 'pending',
    officerId: '1',
    vehicleId: '1',
    evidenceUrls: ['https://example.com/evidence1.jpg'],
  },
  {
    id: '2',
    type: 'Red Light Violation',
    date: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString(), // 5 days ago
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'Connaught Place, New Delhi',
    },
    description: 'Vehicle crossed intersection during red light',
    fine: 1500,
    status: 'paid',
    officerId: '2',
    vehicleId: '2',
    evidenceUrls: ['https://example.com/evidence2.jpg'],
  },
  {
    id: '3',
    type: 'No Parking',
    date: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString(), // 1 day ago
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      address: 'MG Road, Bangalore',
    },
    description: 'Vehicle parked in no-parking zone',
    fine: 500,
    status: 'pending',
    officerId: '3',
    vehicleId: '3',
    evidenceUrls: ['https://example.com/evidence3.jpg'],
  },
  {
    id: '4',
    type: 'Driving without License',
    date: new Date(Date.now() - 10 * 24 * 60 * 60000).toISOString(), // 10 days ago
    location: {
      latitude: 13.0827,
      longitude: 80.2707,
      address: 'Anna Salai, Chennai',
    },
    description: 'Driver unable to produce valid license',
    fine: 2000,
    status: 'disputed',
    officerId: '4',
    vehicleId: '4',
    evidenceUrls: ['https://example.com/evidence4.jpg'],
  },
  {
    id: '5',
    type: 'Overloading',
    date: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(), // 3 days ago
    location: {
      latitude: 22.5726,
      longitude: 88.3639,
      address: 'Howrah Bridge, Kolkata',
    },
    description: 'Commercial vehicle carrying excess load',
    fine: 3000,
    status: 'pending',
    officerId: '5',
    vehicleId: '5',
    evidenceUrls: ['https://example.com/evidence5.jpg'],
  },
];

// Mock stolen vehicles
export const mockStolenVehicles: StolenVehicle[] = [
  {
    id: '1',
    vehicle: mockVehicles[4], // Using the vehicle with id '5' which is marked as stolen
    reportDate: new Date(Date.now() - 7 * 24 * 60 * 60000).toISOString(), // 7 days ago
    reportedBy: 'Arjun Das',
    caseNumber: 'STL-2023-001',
    status: 'active',
    lastSeenLocation: {
      latitude: 22.5726,
      longitude: 88.3639,
      address: 'Park Street, Kolkata',
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60000).toISOString(), // 6 days ago
    },
    description: 'Vehicle stolen from residential parking',
  },
  {
    id: '2',
    vehicle: {
      id: '6',
      licensePlate: 'GJ06KL1234',
      make: 'Mahindra',
      model: 'XUV700',
      color: 'Silver',
      year: 2022,
      owner: {
        id: '6',
        name: 'Rajesh Mehta',
        licenseNumber: 'GJ-0620220065432',
        address: '303 CG Road, Ahmedabad, Gujarat',
        phone: '+91 4321098765',
        email: 'rajesh.m@example.com',
      },
      registrationStatus: 'valid',
      registrationExpiry: '2027-04-15',
      insuranceStatus: 'valid',
      insuranceExpiry: '2024-03-20',
      violations: [],
      stolen: true,
    },
    reportDate: new Date(Date.now() - 14 * 24 * 60 * 60000).toISOString(), // 14 days ago
    reportedBy: 'Rajesh Mehta',
    caseNumber: 'STL-2023-002',
    status: 'active',
    lastSeenLocation: {
      latitude: 23.0225,
      longitude: 72.5714,
      address: 'SG Highway, Ahmedabad',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60000).toISOString(), // 10 days ago
    },
    description: 'Vehicle stolen from shopping mall parking',
  },
];

// Mock documents
export const mockDocuments: Document[] = [
  {
    id: '1',
    type: 'license',
    number: 'DL-1420110012345',
    issuedDate: '2020-05-15',
    expiryDate: '2030-05-14',
    issuedBy: 'Maharashtra RTO',
    status: 'valid',
    ownerId: '1',
    imageUrl: 'https://example.com/license1.jpg',
  },
  {
    id: '2',
    type: 'registration',
    number: 'MH01AB1234',
    issuedDate: '2020-05-15',
    expiryDate: '2025-05-15',
    issuedBy: 'Maharashtra RTO',
    status: 'valid',
    ownerId: '1',
    vehicleId: '1',
    imageUrl: 'https://example.com/registration1.jpg',
  },
  {
    id: '3',
    type: 'insurance',
    number: 'INS-12345-2022',
    issuedDate: '2022-01-01',
    expiryDate: '2023-12-31',
    issuedBy: 'ICICI Lombard',
    status: 'valid',
    ownerId: '1',
    vehicleId: '1',
    imageUrl: 'https://example.com/insurance1.jpg',
  },
  {
    id: '4',
    type: 'license',
    number: 'MH-0220220054321',
    issuedDate: '2018-10-20',
    expiryDate: '2028-10-19',
    issuedBy: 'Delhi RTO',
    status: 'valid',
    ownerId: '2',
    imageUrl: 'https://example.com/license2.jpg',
  },
  {
    id: '5',
    type: 'registration',
    number: 'DL02CD5678',
    issuedDate: '2019-10-20',
    expiryDate: '2022-10-20',
    issuedBy: 'Delhi RTO',
    status: 'expired',
    ownerId: '2',
    vehicleId: '2',
    imageUrl: 'https://example.com/registration2.jpg',
  },
];

// Mock challans
export const mockChallans: Challan[] = [
  {
    id: '1',
    violationId: '1',
    amount: 1000,
    issuedDate: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(), // 2 days ago
    dueDate: new Date(Date.now() + 28 * 24 * 60 * 60000).toISOString(), // 28 days from now
    status: 'pending',
  },
  {
    id: '2',
    violationId: '2',
    amount: 1500,
    issuedDate: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString(), // 5 days ago
    dueDate: new Date(Date.now() + 25 * 24 * 60 * 60000).toISOString(), // 25 days from now
    status: 'paid',
    paymentMethod: 'Credit Card',
    paymentDate: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(), // 3 days ago
    receiptNumber: 'RCP-12345',
  },
  {
    id: '3',
    violationId: '3',
    amount: 500,
    issuedDate: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString(), // 1 day ago
    dueDate: new Date(Date.now() + 29 * 24 * 60 * 60000).toISOString(), // 29 days from now
    status: 'pending',
  },
  {
    id: '4',
    violationId: '4',
    amount: 2000,
    issuedDate: new Date(Date.now() - 10 * 24 * 60 * 60000).toISOString(), // 10 days ago
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60000).toISOString(), // 20 days from now
    status: 'disputed',
  },
  {
    id: '5',
    violationId: '5',
    amount: 3000,
    issuedDate: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(), // 3 days ago
    dueDate: new Date(Date.now() + 27 * 24 * 60 * 60000).toISOString(), // 27 days from now
    status: 'pending',
  },
];

// Helper function to get a vehicle by license plate
export const getVehicleByLicensePlate = (licensePlate: string): Vehicle | undefined => {
  return mockVehicles.find(vehicle => 
    vehicle.licensePlate.toLowerCase() === licensePlate.toLowerCase()
  );
};

// Helper function to get violations by vehicle ID
export const getViolationsByVehicleId = (vehicleId: string): Violation[] => {
  return mockViolations.filter(violation => violation.vehicleId === vehicleId);
};

// Helper function to get documents by owner ID
export const getDocumentsByOwnerId = (ownerId: string): Document[] => {
  return mockDocuments.filter(document => document.ownerId === ownerId);
};

// Helper function to get challans by violation ID
export const getChallanByViolationId = (violationId: string): Challan | undefined => {
  return mockChallans.find(challan => challan.violationId === violationId);
};

// Helper function to check if a vehicle is stolen
export const isVehicleStolen = (licensePlate: string): boolean => {
  const vehicle = getVehicleByLicensePlate(licensePlate);
  return vehicle ? !!vehicle.stolen : false;
};

// Helper function to get stolen vehicle details
export const getStolenVehicleByLicensePlate = (licensePlate: string): StolenVehicle | undefined => {
  return mockStolenVehicles.find(stolenVehicle => 
    stolenVehicle.vehicle.licensePlate.toLowerCase() === licensePlate.toLowerCase()
  );
}; 