// pages/RoutePlanner.tsx
import React, { useState } from 'react';
import { Navigation, MapPin, Clock, Fuel, Coffee, Route, Truck, AlertTriangle } from 'lucide-react';

interface RouteOptions {
  origin: string;
  destination: string;
  stops: string[];
  optimizeForHOS: boolean;
  avoidTolls: boolean;
  preferHighways: boolean;
  includeRestStops: boolean;
  maxDrivingHours: number;
  departureTime: string;
}

interface RouteResult {
  distance: number;
  estimatedTime: number; // minutes
  requiredBreaks: Array<{
    time: string;
    duration: number;
    type: string;
    location: string;
  }>;
  fuelStops: Array<{
    location: string;
    distance: number;
  }>;
  restAreas: Array<{
    location: string;
    distance: number;
  }>;
  compliance: {
    hosCompliant: boolean;
    warnings: string[];
    suggestions: string[];
  };
}

const RoutePlanner: React.FC = () => {
  const [routeData, setRouteData] = useState<RouteOptions>({
    origin: '',
    destination: '',
    stops: [],
    optimizeForHOS: true,
    avoidTolls: false,
    preferHighways: true,
    includeRestStops: true,
    maxDrivingHours: 11,
    departureTime: '06:00'
  });

  const [isPlanning, setIsPlanning] = useState<boolean>(false);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);

  const handlePlanRoute = async (): Promise<void> => {
    setIsPlanning(true);

    // Simulate API call for route planning
    setTimeout(() => {
      setRouteResult({
        distance: 350,
        estimatedTime: 390, // minutes
        requiredBreaks: [
          { time: '14:00', duration: 30, type: '30_minute', location: 'Baltimore, MD' }
        ],
        fuelStops: [
          { location: 'Fredericksburg, VA', distance: 125 }
        ],
        restAreas: [
          { location: 'Maryland House Travel Plaza', distance: 180 },
          { location: 'Chesapeake House', distance: 220 }
        ],
        compliance: {
          hosCompliant: true,
          warnings: [],
          suggestions: ['Consider departing 30 minutes earlier to avoid rush hour traffic']
        }
      });
      setIsPlanning(false);
    }, 2000);
  };

  const addStop = (): void => {
    const stopInput = document.getElementById('new-stop') as HTMLInputElement;
    if (stopInput?.value.trim()) {
      setRouteData({
        ...routeData,
        stops: [...routeData.stops, stopInput.value.trim()]
      });
      stopInput.value = '';
    }
  };

  const removeStop = (index: number): void => {
    setRouteData({
      ...routeData,
      stops: routeData.stops.filter((_, i) => i !== index)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      addStop();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Route Planner</h1>
          <p className="text-gray-600">Plan HOS-compliant routes with optimal stops</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Planning Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Route Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter starting location"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={routeData.origin}
                    onChange={(e) => setRouteData({...routeData, origin: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-red-400" />
                  <input
                    type="text"
                    placeholder="Enter destination"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={routeData.destination}
                    onChange={(e) => setRouteData({...routeData, destination: e.target.value})}
                  />
                </div>
              </div>

              {/* Stops */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stops</label>
                {routeData.stops.map((stop, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={stop}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button
                      onClick={() => removeStop(index)}
                      className="px-2 py-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <input
                    id="new-stop"
                    type="text"
                    placeholder="Add a stop"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    onClick={addStop}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                  <input
                    type="time"
                    value={routeData.departureTime}
                    onChange={(e) => setRouteData({...routeData, departureTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Drive Hours</label>
                  <select
                    value={routeData.maxDrivingHours}
                    onChange={(e) => setRouteData({...routeData, maxDrivingHours: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[8, 9, 10, 11].map(hours => (
                      <option key={hours} value={hours}>{hours} hours</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Route Options */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Route Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Optimize for HOS compliance</span>
                  <p className="text-sm text-gray-600">Plan breaks and stops to maintain compliance</p>
                </div>
                <input
                  type="checkbox"
                  checked={routeData.optimizeForHOS}
                  onChange={(e) => setRouteData({...routeData, optimizeForHOS: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Include rest stops</span>
                  <p className="text-sm text-gray-600">Show available rest areas along route</p>
                </div>
                <input
                  type="checkbox"
                  checked={routeData.includeRestStops}
                  onChange={(e) => setRouteData({...routeData, includeRestStops: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="font-medium">Avoid tolls</span>
                <input
                  type="checkbox"
                  checked={routeData.avoidTolls}
                  onChange={(e) => setRouteData({...routeData, avoidTolls: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="font-medium">Prefer highways</span>
                <input
                  type="checkbox"
                  checked={routeData.preferHighways}
                  onChange={(e) => setRouteData({...routeData, preferHighways: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          <button
            onClick={handlePlanRoute}
            disabled={!routeData.origin || !routeData.destination || isPlanning}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isPlanning ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Planning Route...</span>
              </>
            ) : (
              <>
                <Route className="w-4 h-4" />
                <span>Plan Route</span>
              </>
            )}
          </button>
        </div>

        {/* Map and Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map Placeholder */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Route Map</h3>
            </div>
            <div className="h-96 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Interactive map will be displayed here</p>
                <p className="text-sm text-gray-400">Integrate with Mapbox or Google Maps API</p>
              </div>
            </div>
          </div>

          {/* Route Results */}
          {routeResult && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Route Summary</h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center bg-blue-50 rounded-lg p-3">
                    <Route className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-lg font-semibold text-blue-900">{routeResult.distance} mi</p>
                    <p className="text-xs text-blue-700">Total Distance</p>
                  </div>
                  <div className="text-center bg-green-50 rounded-lg p-3">
                    <Clock className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-semibold text-green-900">{Math.floor(routeResult.estimatedTime / 60)}h {routeResult.estimatedTime % 60}m</p>
                    <p className="text-xs text-green-700">Est. Time</p>
                  </div>
                  <div className="text-center bg-yellow-50 rounded-lg p-3">
                    <Coffee className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                    <p className="text-lg font-semibold text-yellow-900">{routeResult.requiredBreaks.length}</p>
                    <p className="text-xs text-yellow-700">Required Breaks</p>
                  </div>
                  <div className="text-center bg-purple-50 rounded-lg p-3">
                    <Fuel className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                    <p className="text-lg font-semibold text-purple-900">{routeResult.fuelStops.length}</p>
                    <p className="text-xs text-purple-700">Fuel Stops</p>
                  </div>
                </div>

                {/* HOS Compliance Status */}
                <div className={`rounded-lg p-4 ${routeResult.compliance.hosCompliant ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center space-x-2">
                    {routeResult.compliance.hosCompliant ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    )}
                    <h4 className={`font-semibold ${routeResult.compliance.hosCompliant ? 'text-green-800' : 'text-red-800'}`}>
                      {routeResult.compliance.hosCompliant ? 'HOS Compliant Route' : 'HOS Compliance Issues'}
                    </h4>
                  </div>
                  {routeResult.compliance.suggestions.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-green-700 mb-1">Suggestions:</p>
                      <ul className="text-sm text-green-600">
                        {routeResult.compliance.suggestions.map((suggestion, index) => (
                          <li key={index}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Required Breaks */}
                <div>
                  <h4 className="font-semibold mb-3">Required Breaks</h4>
                  <div className="space-y-2">
                    {routeResult.requiredBreaks.map((breakItem, index) => (
                      <div key={index} className="flex items-center justify-between bg-yellow-50 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <Coffee className="w-4 h-4 text-yellow-600" />
                          <div>
                            <p className="font-medium text-yellow-800 capitalize">
                              {breakItem.type.replace('_', ' ')} Break
                            </p>
                            <p className="text-sm text-yellow-600">{breakItem.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-yellow-800">{breakItem.duration} min</p>
                          <p className="text-sm text-yellow-600">{breakItem.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fuel Stops */}
                {routeResult.fuelStops.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Recommended Fuel Stops</h4>
                    <div className="space-y-2">
                      {routeResult.fuelStops.map((stop, index) => (
                        <div key={index} className="flex items-center justify-between bg-purple-50 rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <Fuel className="w-4 h-4 text-purple-600" />
                            <div>
                              <p className="font-medium text-purple-800">{stop.location}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-purple-600">{stop.distance} miles</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rest Areas */}
                {routeResult.restAreas.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Rest Areas</h4>
                    <div className="space-y-2">
                      {routeResult.restAreas.map((area, index) => (
                        <div key={index} className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <Truck className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="font-medium text-blue-800">{area.location}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-blue-600">{area.distance} miles</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;
