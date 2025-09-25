// context/AppContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { User, Trip, ELDLog, AppContextType } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// Mock data
export const mockUser: User = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@transport.com',
  cdlNumber: 'CDL123456',
  company: "John Doe's Transportation",
  role: 'driver'
};

export const mockTrips: Trip[] = [
  {
    id: 1,
    origin: 'Richmond, VA',
    destination: 'Newark, NJ',
    driver: 'John Doe',
    driverId: 1,
    status: 'active',
    estimatedHours: 8,
    estimatedMiles: 350,
    startTime: '06:00',
    currentHours: 5.5,
    remainingDrivingHours: 5.5,
    nextBreakRequired: '14:00',
    loads: [{
      id: 1,
      shipper: 'Richmond Manufacturing',
      consignee: 'Newark Distribution',
      commodity: 'Electronics',
      weight: 25000,
      pickupTime: '2024-09-25T06:00:00',
      deliveryTime: '2024-09-25T16:00:00',
      status: 'picked'
    }],
    createdAt: '2024-09-25T05:00:00'
  },
  {
    id: 2,
    origin: 'Baltimore, MD',
    destination: 'Philadelphia, PA',
    driver: 'Jane Smith',
    driverId: 2,
    status: 'planned',
    estimatedHours: 4,
    estimatedMiles: 180,
    startTime: '08:00',
    currentHours: 0,
    remainingDrivingHours: 11,
    nextBreakRequired: '16:00',
    loads: [{
      id: 2,
      shipper: 'Baltimore Steel',
      consignee: 'Philly Construction',
      commodity: 'Steel Beams',
      weight: 40000,
      pickupTime: '2024-09-26T08:00:00',
      deliveryTime: '2024-09-26T14:00:00',
      status: 'pending'
    }],
    createdAt: '2024-09-25T07:00:00'
  }
];

export const mockEldLogs: ELDLog[] = [
  {
    id: 1,
    tripId: 1,
    driverId: 1,
    date: '2024-09-25',
    drivingHours: 10,
    onDutyHours: 12,
    offDutyHours: 10,
    sleeperBerthHours: 2,
    violations: [],
    status: 'compliant',
    dutyStatusChanges: [
      { id: 1, timestamp: '06:00', status: 'on_duty', location: 'Richmond, VA' },
      { id: 2, timestamp: '07:30', status: 'driving', location: 'Fredericksburg, VA' },
      { id: 3, timestamp: '14:00', status: 'off_duty', location: 'Baltimore, MD' }
    ],
    restBreaks: [
      { id: 1, startTime: '14:00', endTime: '14:30', duration: 30, type: '30_minute', location: 'Baltimore, MD' }
    ]
  },
  {
    id: 2,
    tripId: 1,
    driverId: 1,
    date: '2024-09-24',
    drivingHours: 11,
    onDutyHours: 14,
    offDutyHours: 8,
    sleeperBerthHours: 2,
    violations: [{
      id: 1,
      type: '11_hour_driving',
      description: 'Exceeded 11-hour driving limit by 0.5 hours',
      severity: 'violation',
      timestamp: '2024-09-24T19:30:00'
    }],
    status: 'violation',
    dutyStatusChanges: [
      { id: 4, timestamp: '05:00', status: 'on_duty', location: 'Washington, DC' },
      { id: 5, timestamp: '06:00', status: 'driving', location: 'Alexandria, VA' },
      { id: 6, timestamp: '19:30', status: 'off_duty', location: 'Richmond, VA' }
    ],
    restBreaks: []
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(mockTrips[0]);
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [eldLogs, setEldLogs] = useState<ELDLog[]>(mockEldLogs);

  return (
    <AppContext.Provider value={{
      user, setUser,
      currentTrip, setCurrentTrip,
      trips, setTrips,
      eldLogs, setEldLogs
    }}>
      {children}
    </AppContext.Provider>
  );
};
