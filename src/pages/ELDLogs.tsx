// pages/ELDLogs.tsx
import React, { useState } from 'react';
import { Clock, User, Coffee, Bed, AlertTriangle, Download, Calendar, MapPin, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { StatusBadge } from '../components/shared';
import { ELDLog } from '../types';

const ELDLogs: React.FC = () => {
  const { eldLogs, user } = useAppContext();
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
          {log.dutyStatusChanges.slice(0, 3).map(change => (
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
            {log.restBreaks.map(restBreak => (
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
            {log.violations.map((violation, index) => (
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

  const DetailedLogModal: React.FC<{ log: ELDLog }> = ({ log }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">ELD Log Details - {new Date(log.date).toLocaleDateString()}</h2>
          <button
            onClick={() => setSelectedLog(null)}
            className="text-gray-400 hover:text-gray-600"
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
                {log.dutyStatusChanges.map((change, index) => (
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
                          {index < log.dutyStatusChanges.length - 1 && (
                            <p className="text-xs text-gray-500">
                              Duration: {calculateDuration(change.timestamp, log.dutyStatusChanges[index + 1]?.timestamp)}
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
                  style={{ width: `${(log.drivingHours / 24) * 100}%` }}
                >
                  {log.drivingHours > 1 && `${log.drivingHours}h`}
                </div>
                <div
                  className="bg-green-500 h-full flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${((log.onDutyHours - log.drivingHours) / 24) * 100}%` }}
                >
                  {(log.onDutyHours - log.drivingHours) > 1 && `${log.onDutyHours - log.drivingHours}h`}
                </div>
                <div
                  className="bg-gray-400 h-full flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${(log.offDutyHours / 24) * 100}%` }}
                >
                  {log.offDutyHours > 1 && `${log.offDutyHours}h`}
                </div>
                <div
                  className="bg-purple-500 h-full flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${(log.sleeperBerthHours / 24) * 100}%` }}
                >
                  {log.sleeperBerthHours > 1 && `${log.sleeperBerthHours}h`}
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Driving ({log.drivingHours}h)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>On Duty ({log.onDutyHours - log.drivingHours}h)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded"></div>
                  <span>Off Duty ({log.offDutyHours}h)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span>Sleeper ({log.sleeperBerthHours}h)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const calculateDuration = (start: string, end?: string): string => {
    if (!end) return '';
    const startTime = new Date(`2024-01-01 ${start}`);
    const endTime = new Date(`2024-01-01 ${end}`);
    const diff = Math.abs(endTime.getTime() - startTime.getTime());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ELD Logs</h1>
          <p className="text-gray-600">Electronic Logging Device records</p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Logs</span>
          </button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">7-Day Compliance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">45</p>
            <p className="text-sm text-gray-600">Hours this period</p>
            <p className="text-xs text-gray-500">out of 70 allowed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">5</p>
            <p className="text-sm text-gray-600">Days remaining</p>
            <p className="text-xs text-gray-500">in current period</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{eldLogs.reduce((acc, log) => acc + log.violations.length, 0)}</p>
            <p className="text-sm text-gray-600">Violations</p>
            <p className="text-xs text-gray-500">this period</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">3</p>
            <p className="text-sm text-gray-600">Compliant days</p>
            <p className="text-xs text-gray-500">in a row</p>
          </div>
        </div>

        {/* Weekly Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Weekly Hours (70-hour/8-day limit)</span>
            <span className="text-sm text-gray-500">45/70 hours</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{ width: `${(45 / 70) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">25 hours remaining this period</p>
        </div>
      </div>

      {/* Recent Violations Alert */}
      {eldLogs.some(log => log.violations.length > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Recent Violations Detected</h3>
          </div>
          <div className="space-y-2">
            {eldLogs
              .filter(log => log.violations.length > 0)
              .slice(0, 2)
              .map(log => (
                <div key={log.id} className="bg-white rounded p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-red-800">{log.date}</p>
                      <p className="text-sm text-red-600">{log.violations.length} violation(s) recorded</p>
                    </div>
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="text-sm text-red-600 hover:text-red-800 underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Logs List */}
      <div className="space-y-6">
        {eldLogs.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No ELD logs found for the selected date</p>
          </div>
        ) : (
          eldLogs.map(log => (
            <LogEntry key={log.id} log={log} />
          ))
        )}
      </div>

      {/* Detailed Log Modal */}
      {selectedLog && <DetailedLogModal log={selectedLog} />}
    </div>
  );
};

export default ELDLogs;
