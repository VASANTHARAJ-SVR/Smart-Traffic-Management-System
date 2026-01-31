import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicleOwner extends Document {
  // Personal Information
  name: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: Date;
  contactNumber: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  
  // Vehicle Information
  vehicle: {
    registrationNumber: string;
    numberPlate: string;
    make: string;
    model: string;
    year: number;
    color: string;
    chassisNumber: string;
    engineNumber: string;
    fuelType: string;
    vehicleClass: string;
    seatingCapacity: number;
    isCommercial: boolean;
  };
  
  // License Information
  drivingLicense: {
    number: string;
    issueDate: Date;
    expiryDate: Date;
    isExpired: boolean;
    category: string[];
    issuingAuthority: string;
  };
  
  // Registration Information
  registration: {
    certificateNumber: string;
    issueDate: Date;
    expiryDate: Date;
    isExpired: boolean;
    registeredOwner: string;
    registeredAddress: string;
    registrationAuthority: string;
  };
  
  // Insurance Information
  insurance: {
    provider: string;
    policyNumber: string;
    type: string;
    issueDate: Date;
    expiryDate: Date;
    isExpired: boolean;
    coverageAmount: number;
  };
  
  // Permits (if applicable)
  permits: [{
    type: string;
    permitNumber: string;
    issueDate: Date;
    expiryDate: Date;
    isExpired: boolean;
    issuingAuthority: string;
    jurisdiction: string[];
  }];
  
  // Commercial Vehicle Details (if applicable)
  commercialDetails: {
    permitType: string;
    businessName: string;
    gstNumber: string;
    operationRoutes: string[];
    permitNumber: string;
    permitIssueDate: Date;
    permitExpiryDate: Date;
    isPermitExpired: boolean;
  };
  
  // Violations History
  violations: [{
    violationType: string;
    date: Date;
    location: string;
    penaltyAmount: number;
    isPaid: boolean;
    officerName: string;
    description: string;
    caseNumber: string;
    points: number;
  }];
  
  // Pollution Certificate
  pollutionCertificate: {
    certificateNumber: string;
    issueDate: Date;
    expiryDate: Date;
    isExpired: boolean;
    issuingCenter: string;
  };
  
  // Fitness Certificate (mostly for commercial vehicles)
  fitnessCertificate: {
    certificateNumber: string;
    issueDate: Date;
    expiryDate: Date;
    isExpired: boolean;
    issuingAuthority: string;
  };
  
  // Additional Information
  remarks: string;
  blacklisted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleOwnerSchema: Schema = new Schema({
  // Personal Information
  name: { 
    type: String, 
    required: true 
  },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'other'],
    required: true 
  },
  dateOfBirth: { 
    type: Date, 
    required: true 
  },
  contactNumber: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String,
    required: true 
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  
  // Vehicle Information
  vehicle: {
    registrationNumber: { type: String, required: true, unique: true },
    numberPlate: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    chassisNumber: { type: String, required: true },
    engineNumber: { type: String, required: true },
    fuelType: { type: String, required: true },
    vehicleClass: { type: String, required: true },
    seatingCapacity: { type: Number, required: true },
    isCommercial: { type: Boolean, default: false }
  },
  
  // License Information
  drivingLicense: {
    number: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    isExpired: { type: Boolean, required: true },
    category: [{ type: String, required: true }],
    issuingAuthority: { type: String, required: true }
  },
  
  // Registration Information
  registration: {
    certificateNumber: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    isExpired: { type: Boolean, required: true },
    registeredOwner: { type: String, required: true },
    registeredAddress: { type: String, required: true },
    registrationAuthority: { type: String, required: true }
  },
  
  // Insurance Information
  insurance: {
    provider: { type: String, required: true },
    policyNumber: { type: String, required: true },
    type: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    isExpired: { type: Boolean, required: true },
    coverageAmount: { type: Number, required: true }
  },
  
  // Permits (if applicable)
  permits: [{
    type: { type: String, required: true },
    permitNumber: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    isExpired: { type: Boolean, required: true },
    issuingAuthority: { type: String, required: true },
    jurisdiction: [{ type: String, required: true }]
  }],
  
  // Commercial Vehicle Details (if applicable)
  commercialDetails: {
    permitType: { type: String },
    businessName: { type: String },
    gstNumber: { type: String },
    operationRoutes: [{ type: String }],
    permitNumber: { type: String },
    permitIssueDate: { type: Date },
    permitExpiryDate: { type: Date },
    isPermitExpired: { type: Boolean }
  },
  
  // Violations History
  violations: [{
    violationType: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    penaltyAmount: { type: Number, required: true },
    isPaid: { type: Boolean, required: true },
    officerName: { type: String, required: true },
    description: { type: String, required: true },
    caseNumber: { type: String, required: true },
    points: { type: Number, required: true }
  }],
  
  // Pollution Certificate
  pollutionCertificate: {
    certificateNumber: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    isExpired: { type: Boolean, required: true },
    issuingCenter: { type: String, required: true }
  },
  
  // Fitness Certificate (mostly for commercial vehicles)
  fitnessCertificate: {
    certificateNumber: { type: String },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    isExpired: { type: Boolean },
    issuingAuthority: { type: String }
  },
  
  // Additional Information
  remarks: { type: String, default: '' },
  blacklisted: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<IVehicleOwner>('VehicleOwner', VehicleOwnerSchema); 