// pages/Compliance.tsx
import React, { useState } from 'react';
import { Clock, Timer, Calendar, AlertTriangle, CheckCircle, Coffee, Shield, TrendingUp, Book } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ProgressBar } from '../components/shared';

const Compliance: React.FC = () => {
  const { eldLogs } = useAppContext();
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const todayLog = eldLogs[0];

  const complianceRules = [
    {
      id: '11_hour_driving',
      title: '11-Hour Driving Limit',
      description: 'May drive a maximum of 11 hours after 10 consecutive hours off duty.',
      current: todayLog?.drivingHours || 0,
      limit: 11,
      status: (todayLog?.drivingHours || 0) <= 11 ? 'compliant' : 'violation',
      icon: <Clock className="w-5 h-5" />,
      color: 'blue'
    },
    {
      id: '14_hour_window',
      title: '14-Hour Duty Window',
      description: 'May not drive beyond the 14th consecutive hour after coming on duty, following 10 consecutive hours off duty.',
      current: todayLog?.onDutyHours || 0,
      limit: 14,
      status: (todayLog?.onDutyHours || 0) <= 14 ? 'compliant' : 'violation',
      icon: <Timer className="w-5 h-5" />,
      color: 'green'
    },
    {
      id: '30_min_break',
      title: '30-Minute Break Rule',
      description: 'Must take a 30-minute break when you have driven for a period of 8 cumulative hours without at least a 30-minute interruption.',
      current: 1,
      limit: 1,
      status: 'compliant',
      icon: <Coffee className="w-5 h-5" />,
      color: 'yellow'
    },
    {
      id: '70_hour_limit',
      title: '70-Hour/8-Day Limit',
      description: 'May not drive after 70 hours on duty in 8 consecutive days. May restart after taking 34 or more consecutive hours off duty.',
      current: 45,
      limit: 70,
      status: 45 <= 70 ? 'compliant' : 'violation',
      icon: <Calendar className="w-5 h-5" />,
      color: 'purple'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'violation': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-600';
      case 'warning': return 'bg-yellow-600';
      case 'violation': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const RuleCard: React.FC<{ rule: any }> = ({ rule }) => (
    <div
      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => setSelectedRule(selectedRule === rule.id ? null : rule.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-${rule.color}-100 rounded-lg flex items-center justify-center`}>
            <div className={`text-${rule.color}-600`}>
              {rule.icon}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{rule.title}</h3>
            <p className="text-sm text-gray-600">{rule.current}/{rule.limit} {rule.id.includes('hour') ? 'hours' : 'breaks'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {rule.status === 'compliant' ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          )}
          <span className={`text-sm font-medium ${getStatusColor(rule.status)} capitalize`}>
            {rule.status}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(rule.status)}`}
            style={{ width: `${Math.min((rule.current / rule.limit) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Used: {rule.current}</span>
          <span>Remaining: {Math.max(rule.limit - rule.current, 0)}</span>
        </div>
      </div>

      {selectedRule === rule.id && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-700">{rule.description}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">HOS Compliance</h1>
        <p className="text-gray-600">Hours of Service regulation compliance dashboard</p>
      </div>

      {/* Overall Compliance Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Overall Compliance Status</h2>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-green-600 font-medium">Compliant</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">
              {complianceRules.filter(rule => rule.status === 'compliant').length}
            </p>
            <p className="text-sm text-gray-600">Rules Compliant</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">0</p>
            <p className="text-sm text-gray-600">Warnings</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">
              {eldLogs.reduce((acc, log) => acc + log.violations.length, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Violations</p>
          </div>
        </div>
      </div>

      {/* Current Status Rules */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Current Compliance Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {complianceRules.map(rule => (
            <RuleCard key={rule.id} rule={rule} />
          ))}
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Weekly Compliance Trend</h2>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* Weekly Hours Progress */}
            <div>
              <ProgressBar
                current={45}
                max={70}
                label="Weekly Hours (70-hour/8-day limit)"
                colorClass="bg-purple-600"
              />
            </div>

            {/* Daily Average */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-sm text-blue-600 font-medium">Avg Daily Drive</p>
                <p className="text-lg font-semibold text-blue-900">7.2h</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-sm text-green-600 font-medium">Avg On-Duty</p>
                <p className="text-lg font-semibold text-green-900">9.8h</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 text-center">
                <p className="text-sm text-yellow-600 font-medium">Breaks Taken</p>
                <p className="text-lg font-semibold text-yellow-900">100%</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <p className="text-sm text-purple-600 font-medium">Compliance Rate</p>
                <p className="text-lg font-semibold text-purple-900">98%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HOS Rules Reference */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <Book className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">HOS Rules Quick Reference</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-blue-900">Property-Carrying Drivers</h4>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• 11 hours driving after 10 consecutive hours off</li>
                  <li>• 14 hours on-duty window</li>
                  <li>• 30-minute break after 8 hours driving</li>
                  <li>• 60/70 hours in 7/8 consecutive days</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-green-900">Rest Requirements</h4>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• 10 consecutive hours off duty</li>
                  <li>• 34-hour restart option</li>
                  <li>• Sleeper berth provisions available</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium text-yellow-900">Short-Haul Exceptions</h4>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• 150 air-mile radius (CDL drivers)</li>
                  <li>• 14-hour duty period</li>
                  <li>• Return to work location daily</li>
                  <li>• Time records required</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-purple-900">Adverse Conditions</h4>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• Up to 2 additional driving hours</li>
                  <li>• Must be unexpected conditions</li>
                  <li>• Proper documentation required</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Violations */}
      {eldLogs.some(log => log.violations.length > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Recent Violations</h3>
          </div>
          <div className="space-y-3">
            {eldLogs
              .filter(log => log.violations.length > 0)
              .slice(0, 3)
              .map(log => (
                <div key={log.id} className="bg-white rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-red-800">{log.date}</p>
                      <div className="mt-2 space-y-1">
                        {log.violations.map((violation, index) => (
                          <div key={index} className="text-sm">
                            <p className="text-red-700 font-medium">{violation.description}</p>
                            <p className="text-red-600">Type: {violation.type.replace('_', ' ')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                      {log.violations.length} violation{log.violations.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Compliance;
