// types/index.ts

export interface User {
  id: number;
  name: string;
  email: string;
  cdlNumber: string;
  company: string;
  role: 'driver' | 'dispatcher' | 'admin';
}

export interface Trip {
  id: number;
  origin: string;
  destination: string;
  driver: string;
  driverId: number;
  status: 'active' | 'completed' | 'planned' | 'paused';
  estimatedHours: number;
  estimatedMiles: number;
  startTime: string;
  endTime?: string;
  currentHours: number;
  remainingDrivingHours: number;
  nextBreakRequired: string;
  route?: RoutePoint[];
  loads: Load[];
  createdAt: string;
}

export interface Load {
  id: number;
  shipper: string;
  consignee: string;
  commodity: string;
  weight: number;
  pickupTime: string;
  deliveryTime: string;
  status: 'pending' | 'picked' | 'delivered';
}

export interface RoutePoint {
  id: number;
  address: string;
  lat: number;
  lng: number;
  type: 'origin' | 'destination' | 'rest_stop' | 'fuel' | 'delivery';
  estimatedArrival: string;
}

export interface ELDLog {
  id: number;
  tripId: number;
  driverId: number;
  date: string;
  drivingHours: number;
  onDutyHours: number;
  offDutyHours: number;
  sleeperBerthHours: number;
  violations: HOSViolation[];
  status: 'compliant' | 'violation' | 'warning';
  dutyStatusChanges: DutyStatusChange[];
  restBreaks: RestBreak[];
}

export interface HOSViolation {
  id: number;
  type: '11_hour_driving' | '14_hour_window' | '30_min_break' | '60_70_hour_limit';
  description: string;
  severity: 'warning' | 'violation';
  timestamp: string;
}

export interface DutyStatusChange {
  id: number;
  timestamp: string;
  status: 'driving' | 'on_duty' | 'off_duty' | 'sleeper_berth';
  location: string;
  odometer?: number;
}

export interface RestBreak {
  id: number;
  startTime: string;
  endTime: string;
  duration: number;
  type: '30_minute' | 'sleeper_berth' | '34_hour_restart';
  location: string;
}

export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentTrip: Trip | null;
  setCurrentTrip: (trip: Trip | null) => void;
  trips: Trip[];
  setTrips: (trips: Trip[]) => void;
  eldLogs: ELDLog[];
  setEldLogs: (logs: ELDLog[]) => void;
}
