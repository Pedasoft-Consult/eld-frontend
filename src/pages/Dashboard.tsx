// pages/Dashboard.tsx
import React from 'react';
import { Clock, Timer, Coffee, Route, MapPin, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { StatCard, StatusBadge, ProgressBar } from '../components/shared';

const Dashboard: React.FC = () => {
  const { trips, eldLogs, user } = useAppContext();
  const activeTrip = trips.find(trip => trip.status === 'active');
  const todayLog = eldLogs[0];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Clock className="w-6 h-6 text-blue-600" />}
          title="Driving Hours Today"
          value={`${todayLog?.drivingHours || 0} / 11`}
          subtitle="Hours remaining: 5.5"
          color="bg-blue-100"
        />
        <StatCard
          icon={<Timer className="w-6 h-6 text-green-600" />}
          title="On-Duty Hours"
          value={`${todayLog?.onDutyHours || 0} / 14`}
          subtitle="14-hour window"
          color="bg-green-100"
        />
        <StatCard
          icon={<Coffee className="w-6 h-6 text-yellow-600" />}
          title="Next Break Required"
          value={activeTrip?.nextBreakRequired || 'N/A'}
          subtitle="30-minute break"
          color="bg-yellow-100"
        />
        <StatCard
          icon={<Route className="w-6 h-6 text-purple-600" />}
          title="Weekly Hours"
          value="45 / 70"
          subtitle="8-day period"
          color="bg-purple-100"
        />
      </div>

      {/* HOS Compliance Chart */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Hours of Service - Today</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <ProgressBar
              current={todayLog?.drivingHours || 0}
              max={11}
              label="Driving Hours"
              colorClass="bg-blue-600"
            />

            <ProgressBar
              current={todayLog?.onDutyHours || 0}
              max={14}
              label="On-Duty Hours"
              colorClass="bg-green-600"
            />

            <ProgressBar
              current={45}
              max={70}
              label="Weekly Hours (8-day)"
              colorClass="bg-purple-600"
            />
          </div>
        </div>
      </div>

      {/* Active Trip Card */}
      {activeTrip && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Current Trip</h2>
              <StatusBadge status={activeTrip.status} />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">From: {activeTrip.origin}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium">To: {activeTrip.destination}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-lg font-semibold">{activeTrip.currentHours}/{activeTrip.estimatedHours}h</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="font-semibold">{activeTrip.estimatedMiles} mi</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Started</p>
                  <p className="font-semibold">{activeTrip.startTime}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">ETA</p>
                  <p className="font-semibold">16:30</p>
                </div>
              </div>

              {/* Load Information */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Load Information</h4>
                {activeTrip.loads.map(load => (
                  <div key={load.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{load.commodity}</p>
                        <p className="text-sm text-gray-600">{load.shipper} → {load.consignee}</p>
                        <p className="text-sm text-gray-600">Weight: {load.weight.toLocaleString()} lbs</p>
                      </div>
                      <StatusBadge status={load.status} type="load" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Trip Progress Bar */}
              <div className="pt-4">
                <ProgressBar
                  current={activeTrip.currentHours}
                  max={activeTrip.estimatedHours}
                  label="Trip Progress"
                  colorClass="bg-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Trip started</p>
                <p className="text-xs text-gray-500">Richmond, VA - 06:00 AM</p>
              </div>
              <span className="text-xs text-gray-400">5h ago</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Duty status changed to Driving</p>
                <p className="text-xs text-gray-500">Fredericksburg, VA - 07:30 AM</p>
              </div>
              <span className="text-xs text-gray-400">3.5h ago</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">30-minute break taken</p>
                <p className="text-xs text-gray-500">Baltimore, MD - 14:00 PM</p>
              </div>
              <span className="text-xs text-gray-400">30m ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
