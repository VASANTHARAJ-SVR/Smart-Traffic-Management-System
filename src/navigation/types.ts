import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Traffic: undefined;
  NumberPlate: undefined;
  Documents: undefined;
  EChallan: undefined;
};

export type DashboardStackParamList = {
  DashboardHome: undefined;
  Notifications: undefined;
  Reports: { type: 'daily' | 'weekly' | 'monthly' };
  IncidentDetails: { id: string };
  VehicleRecovery: undefined;
  AIChatbot: undefined;
};

export type NumberPlateStackParamList = {
  ScanPlate: undefined;
  PlateResults: { licensePlate: string };
  PlateHistory: undefined;
  VehicleDetails: { vehicleId: string };
};

export type TrafficStackParamList = {
  TrafficHome: undefined;
  LiveCameras: undefined;
  TrafficAnalytics: undefined;
  TrafficSignals: undefined;
  NoiseDetection: undefined;
  ParkingAssistance: undefined;
  IncidentReport: undefined;
  ManageTraffic: { locationId: string };
  TrafficSimulation: undefined;
};

export type DocumentStackParamList = {
  DocumentHome: undefined;
  ScanDocument: undefined;
  DocumentDetails: { documentId: string };
  ViolationHistory: { ownerId: string };
};

export type MoreStackParamList = {
  MoreHome: undefined;
  EChallan: undefined;
  VehicleRecovery: undefined;
  Settings: undefined;
  Profile: undefined;
  About: undefined;
  Help: undefined;
  Demo: undefined;
};

export type EChallanStackParamList = {
  EChallanHome: undefined;
  CreateChallan: { vehicleId?: string };
  ChallanDetails: { challanId: string };
  PaymentGateway: { challanId: string; amount: number };
  ChallanHistory: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
};

export type VehicleRecoveryStackParamList = {
  RecoveryHome: undefined;
  SearchVehicle: undefined;
  AddComplaint: undefined;
  ComplaintDetails: { complaintId: string };
  RecoveryAlerts: undefined;
};

export type DemoStackParamList = {
  Demo: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  EChallanStack: NavigatorScreenParams<EChallanStackParamList>;
  VehicleRecoveryStack: NavigatorScreenParams<VehicleRecoveryStackParamList>;
  SettingsStack: NavigatorScreenParams<SettingsStackParamList>;
  DemoStack: NavigatorScreenParams<DemoStackParamList>;
}; 