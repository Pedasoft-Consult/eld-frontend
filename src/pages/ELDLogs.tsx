// pages/ELDLogs.tsx
import React, { useState } from 'react';
import { Clock, User, Coffee, Bed, AlertTriangle, Download, Calendar, MapPin, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { StatusBadge } from '../components/shared';
import { ELDLog } from '../types';

const ELDLogs: React.FC = () => {
  const { eldLogs } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedLog, setSelectedLog] = useState<ELDLog | null>(null);

  const LogEntry: React.FC<{ log: ELDLog }> = ({ log }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{new Date(log.date).toLocaleDateString()}</h3>
          <p className="text-gray-600">Trip #{log.tripId}</p>
        </div>
        <StatusBadge status={log.status} type="log" />
      </div>

      {/* Hours Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Driving</span>
          </div>
          <p className="text-lg font-semibold text-blue-900">{log.drivingHours}h</p>
          <div className="w-full bg-blue-200 rounded-full h-1 mt-1">
            <div
              className="bg-blue-600 h-1 rounded-full"
              style={{ width: `${(log.drivingHours / 11) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">On Duty</span>
          </div>
          <p className="text-lg font-semibold text-green-900">{log.onDutyHours}h</p>
          <div className="w-full bg-green-200 rounded-full h-1 mt-1">
            <div
              className="bg-green-600 h-1 rounded-full"
              style={{ width: `${(log.onDutyHours / 14) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Coffee className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-800">Off Duty</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{log.offDutyHours}h</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Bed className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Sleeper</span>
          </div>
          <p className="text-lg font-semibold text-purple-900">{log.sleeperBerthHours}h</p>
        </div>
      </div>

      {/* Duty Status Timeline */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-3">Duty Status Changes</h4>
        <div className="space-y-2">
          {log.dutyStatusChanges.slice(0, 3).map((change, index: number) => (
            <div key={change.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  change.status === 'driving' ? 'bg-blue-500' :
                  change.status === 'on_duty' ? 'bg-green-500' :
                  change.status === 'off_duty' ? 'bg-gray-500' :
                  'bg-purple-500'
                }`}></div>
                <span className="text-sm font-medium capitalize">{change.status.replace('_', ' ')}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{change.timestamp}</p>
                <p className="text-xs text-gray-500">{change.location}</p>
              </div>
            </div>
          ))}
          {log.dutyStatusChanges.length > 3 && (
            <button
              onClick={() => setSelectedLog(log)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all {log.dutyStatusChanges.length} status changes
            </button>
          )}
        </div>
      </div>

      {/* Rest Breaks */}
      {log.restBreaks.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-3">Rest Breaks</h4>
          <div className="space-y-2">
            {log.restBreaks.map((restBreak, index: number) => (
              <div key={restBreak.id} className="bg-blue-50 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-blue-900 capitalize">
                      {restBreak.type.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-blue-700">{restBreak.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-blue-900">{restBreak.duration} min</p>
                    <p className="text-xs text-blue-700">{restBreak.startTime} - {restBreak.endTime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Violations */}
      {log.violations.length > 0 && (
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <h4 className="font-medium text-red-800">HOS Violations</h4>
          </div>
          <div className="space-y-2">
            {log.violations.map((violation, index: number) => (
              <div key={index} className="bg-white rounded p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-red-800">{violation.description}</p>
                    <p className="text-sm text-red-600">Type: {violation.type.replace('_', ' ')}</p>
                    <p className="text-xs text-red-500">{new Date(violation.timestamp).toLocaleString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    violation.severity === 'violation' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {violation.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => setSelectedLog(log)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Date Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">ELD Logs</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* ELD Logs List */}
      <div className="space-y-6">
        {eldLogs.map(log => (
          <LogEntry key={log.id} log={log} />
        ))}
      </div>

      {/* Detailed Log Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">ELD Log Details - {new Date(selectedLog.date).toLocaleDateString()}</h2>
              <button
                onClick={() => setSelectedLog(null)}
                >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Complete Duty Status Changes */}
              <div>
                <h3 className="font-semibold mb-4">Complete Duty Status Timeline</h3>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>

                  <div className="space-y-4">
                    {selectedLog.dutyStatusChanges.map((change, index: number) => (
                      <div key={change.id} className="relative flex items-center space-x-4">
                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                          change.status === 'driving' ? 'bg-blue-500' :
                          change.status === 'on_duty' ? 'bg-green-500' :
                          change.status === 'off_duty' ? 'bg-gray-500' :
                          'bg-purple-500'
                        }`}>
                          {change.status === 'driving' ? <Clock className="w-4 h-4 text-white" /> :
                           change.status === 'on_duty' ? <User className="w-4 h-4 text-white" /> :
                           change.status === 'off_duty' ? <Coffee className="w-4 h-4 text-white" /> :
                           <Bed className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium capitalize">{change.status.replace('_', ' ')}</p>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <MapPin className="w-3 h-3" />
                                <span>{change.location}</span>
                              </div>
                              {change.odometer && (
                                <p className="text-xs text-gray-500">Odometer: {change.odometer.toLocaleString()} mi</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{change.timestamp}</p>
                              {index < selectedLog.dutyStatusChanges.length - 1 && (
                                <p className="text-xs text-gray-500">
                                  Duration: 2h 30m
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Daily Summary Chart */}
              <div>
                <h3 className="font-semibold mb-4">Daily Hours Breakdown</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center h-8 mb-4">
                    <div
                      className="bg-blue-500 h-full flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(selectedLog.drivingHours / 24) * 100}%` }}
                    >
                      {selectedLog.drivingHours > 1 && `${selectedLog.drivingHours}h`}
                    </div>
                    <div
                      className="bg-green-500 h-full flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${((selectedLog.onDutyHours - selectedLog.drivingHours) / 24) * 100}%` }}
                    >
                      {(selectedLog.onDutyHours - selectedLog.drivingHours) > 1 && `${selectedLog.onDutyHours - selectedLog.drivingHours}h`}
                    </div>
                    <div
                      className="bg-gray-400 h-full flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(selectedLog.offDutyHours / 24) * 100}%` }}
                    >
                      {selectedLog.offDutyHours > 1 && `${selectedLog.offDutyHours}h`}
                    </div>
                    <div
                      className="bg-purple-500 h-full flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(selectedLog.sleeperBerthHours / 24) * 100}%` }}
                    >
                      {selectedLog.sleeperBerthHours > 1 && `${selectedLog.sleeperBerthHours}h`}
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Driving ({selectedLog.drivingHours}h)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>On Duty ({selectedLog.onDutyHours - selectedLog.drivingHours}h)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-400 rounded"></div>
                      <span>Off Duty ({selectedLog.offDutyHours}h)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded"></div>
                      <span>Sleeper ({selectedLog.sleeperBerthHours}h)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ELDLogs;
