// pages/Trips.tsx
import React, { useState } from 'react';
import { Plus, X, MapPin, Clock, Truck, Edit, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { StatusBadge } from '../components/shared';
import { Trip } from '../types';

const Trips: React.FC = () => {
  const { trips, setTrips } = useAppContext();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter trips by status
  const filteredTrips = filterStatus === 'all'
    ? trips
    : trips.filter(trip => trip.status === filterStatus);

  const TripCard: React.FC<{ trip: Trip }> = ({ trip }) => (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{trip.origin} → {trip.destination}</h3>
          <p className="text-gray-600">Driver: {trip.driver}</p>
          <p className="text-sm text-gray-500">Trip #{trip.id} • Created {new Date(trip.createdAt).toLocaleDateString()}</p>
        </div>
        <StatusBadge status={trip.status} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Start Time</p>
          <p className="font-semibold">{trip.startTime}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Est. Hours</p>
          <p className="font-semibold">{trip.estimatedHours}h</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Distance</p>
          <p className="font-semibold">{trip.estimatedMiles} mi</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Loads</p>
          <p className="font-semibold">{trip.loads.length}</p>
        </div>
      </div>

      {trip.status === 'active' && (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{trip.currentHours}/{trip.estimatedHours} hours</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((trip.currentHours / trip.estimatedHours) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <button
          onClick={() => setSelectedTrip(trip)}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm transition-colors"
        >
          View Details
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors">
          <Edit className="w-4 h-4" />
        </button>
        <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const CreateTripForm: React.FC = () => {
    const [formData, setFormData] = useState({
      origin: '',
      destination: '',
      driver: '',
      startTime: '',
      estimatedHours: 0,
      estimatedMiles: 0
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newTrip: Trip = {
        id: trips.length + 1,
        origin: formData.origin,
        destination: formData.destination,
        driver: formData.driver,
        driverId: 1,
        status: 'planned',
        estimatedHours: formData.estimatedHours,
        estimatedMiles: formData.estimatedMiles,
        startTime: formData.startTime,
        currentHours: 0,
        remainingDrivingHours: 11,
        nextBreakRequired: '16:00',
        loads: [],
        createdAt: new Date().toISOString()
      };

      setTrips([...trips, newTrip]);
      setShowCreateForm(false);
      setFormData({
        origin: '',
        destination: '',
        driver: '',
        startTime: '',
        estimatedHours: 0,
        estimatedMiles: 0
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold">Create New Trip</h2>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                <input
                  type="text"
                  required
                  value={formData.origin}
                  onChange={(e) => setFormData({...formData, origin: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Starting location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <input
                  type="text"
                  required
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Destination"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
                <input
                  type="text"
                  required
                  value={formData.driver}
                  onChange={(e) => setFormData({...formData, driver: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Driver name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Est. Hours</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="11"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({...formData, estimatedHours: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Miles</label>
              <input
                type="number"
                required
                min="1"
                value={formData.estimatedMiles}
                onChange={(e) => setFormData({...formData, estimatedMiles: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Trip
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trips</h1>
          <p className="text-gray-600">Manage and track your trips</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Trip</span>
        </button>
      </div>

      {/* Filter/Status Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        {['all', 'active', 'planned', 'completed', 'paused'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`pb-2 px-1 border-b-2 text-sm font-medium capitalize transition-colors ${
              filterStatus === status
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {status}
            <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              {status === 'all' ? trips.length : trips.filter(t => t.status === status).length}
            </span>
          </button>
        ))}
      </div>

      {/* Trips Grid */}
      <div className="grid gap-6">
        {filteredTrips.length === 0 ? (
          <div className="text-center py-12">
            <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {filterStatus === 'all' ? 'No trips found' : `No ${filterStatus} trips found`}
            </p>
          </div>
        ) : (
          filteredTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))
        )}
      </div>

      {/* Trip Detail Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Trip Details</h2>
              <button
                onClick={() => setSelectedTrip(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Trip Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Trip Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trip ID:</span>
                      <span>#{selectedTrip.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <StatusBadge status={selectedTrip.status} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Driver:</span>
                      <span>{selectedTrip.driver}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance:</span>
                      <span>{selectedTrip.estimatedMiles} miles</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span>{new Date(selectedTrip.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Route</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Origin: {selectedTrip.origin}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span className="text-sm">Destination: {selectedTrip.destination}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Start Time: {selectedTrip.startTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loads */}
              <div>
                <h3 className="font-semibold mb-4">Loads ({selectedTrip.loads.length})</h3>
                {selectedTrip.loads.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No loads assigned to this trip</p>
                ) : (
                  <div className="space-y-3">
                    {selectedTrip.loads.map(load => (
                      <div key={load.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{load.commodity}</p>
                            <p className="text-sm text-gray-600">{load.shipper} → {load.consignee}</p>
                          </div>
                          <StatusBadge status={load.status} type="load" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Weight: </span>
                            <span>{load.weight.toLocaleString()} lbs</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Pickup: </span>
                            <span>{new Date(load.pickupTime).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Edit Trip
                </button>
                {selectedTrip.status === 'planned' && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Start Trip
                  </button>
                )}
                {selectedTrip.status === 'active' && (
                  <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                    Pause Trip
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Trip Modal */}
      {showCreateForm && <CreateTripForm />}
    </div>
  );
};

export default Trips;
