export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'officer';
  badgeNumber?: string;
  department?: string;
  profileImage?: string;
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
  color: string;
  year: number;
  owner?: VehicleOwner;
  registrationStatus: 'valid' | 'expired' | 'suspended';
  registrationExpiry?: string;
  insuranceStatus?: 'valid' | 'expired' | 'none';
  insuranceExpiry?: string;
  violations?: Violation[];
  stolen?: boolean;
}

export interface VehicleOwner {
  id: string;
  name: string;
  licenseNumber: string;
  address: string;
  phone: string;
  email?: string;
}

export interface Violation {
  id: string;
  type: string;
  date: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  description: string;
  fine: number;
  status: 'pending' | 'paid' | 'disputed';
  officerId: string;
  vehicleId: string;
  evidenceUrls?: string[];
}

export interface TrafficData {
  id: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  density: 'low' | 'medium' | 'high';
  vehicleCount: number;
  pedestrianCount?: number;
  averageSpeed?: number;
  incidents?: Incident[];
}

export interface Incident {
  id: string;
  type: 'accident' | 'congestion' | 'roadblock' | 'construction' | 'event' | 'other';
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  description: string;
  status: 'active' | 'resolved';
  severity: 'low' | 'medium' | 'high';
  reportedBy?: string;
}

export interface Document {
  id: string;
  type: 'license' | 'registration' | 'insurance' | 'permit' | 'other';
  number: string;
  issuedDate: string;
  expiryDate: string;
  issuedBy: string;
  status: 'valid' | 'expired' | 'suspended';
  ownerId: string;
  vehicleId?: string;
  imageUrl?: string;
}

export interface Challan {
  id: string;
  violationId: string;
  amount: number;
  issuedDate: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'disputed';
  paymentMethod?: string;
  paymentDate?: string;
  receiptNumber?: string;
}

export interface StolenVehicle {
  id: string;
  vehicle: Vehicle;
  reportDate: string;
  reportedBy: string;
  caseNumber: string;
  status: 'active' | 'recovered' | 'closed';
  lastSeenLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
    timestamp: string;
  };
  description?: string;
  recoveryDate?: string;
  recoveryLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface NotificationType {
  id: string;
  type: 'alert' | 'info' | 'warning' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

export type ThemeMode = 'light' | 'dark' | 'system'; 