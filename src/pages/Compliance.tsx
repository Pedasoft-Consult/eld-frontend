// pages/Compliance.tsx
import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, Coffee, Bed, Calendar } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { StatusBadge, ProgressBar } from '../components/shared';

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  limit: number;
  current: number;
  period: string;
  status: 'compliant' | 'warning' | 'violation';
}

const Compliance: React.FC = () => {
  const { /* eldLogs removed */ } = useAppContext();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'cycle'>('today');

  // Mock compliance data
  const complianceRules: ComplianceRule[] = [
    {
      id: '11-hour',
      name: '11-Hour Driving Rule',
      description: 'Maximum 11 hours of driving after 10 consecutive hours off duty',
      limit: 11,
      current: 5.5,
      period: 'daily',
      status: 'compliant'
    },
    {
      id: '14-hour',
      name: '14-Hour On-Duty Rule',
      description: 'Cannot drive after 14th consecutive hour on duty',
      limit: 14,
      current: 7.5,
      period: 'daily',
      status: 'compliant'
    },
    {
      id: '30-minute',
      name: '30-Minute Break Rule',
      description: '30-minute break required after 8 hours of driving',
      limit: 8,
      current: 5.5,
      period: 'continuous',
      status: 'compliant'
    },
    {
      id: '60-hour',
      name: '60-Hour Rule',
      description: 'Maximum 60 hours on duty in 7 consecutive days',
      limit: 60,
      current: 45,
      period: '7-day',
      status: 'warning'
    },
    {
      id: '70-hour',
      name: '70-Hour Rule',
      description: 'Maximum 70 hours on duty in 8 consecutive days',
      limit: 70,
      current: 45,
      period: '8-day',
      status: 'compliant'
    }
  ];

  const violations = [
    {
      id: 1,
      date: '2024-11-15',
      time: '16:30',
      rule: '11-Hour Driving Rule',
      description: 'Exceeded 11-hour driving limit by 0.5 hours',
      severity: 'violation' as const,
      location: 'Philadelphia, PA'
    },
    {
      id: 2,
      date: '2024-11-12',
      time: '14:00',
      rule: '30-Minute Break Rule',
      description: 'Required break not taken after 8 hours of driving',
      severity: 'warning' as const,
      location: 'Baltimore, MD'
    }
  ];

  // getStatusColor removed as it was unused

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'violation': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HOS Compliance</h1>
          <p className="text-gray-600">Monitor Hours of Service compliance status</p>
        </div>

        {/* Period Selector */}
        <div className="flex space-x-2">
          {(['today', 'week', 'cycle'] as const).map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Compliance Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Compliant Rules</p>
              <p className="text-2xl font-semibold text-gray-900">
                {complianceRules.filter(rule => rule.status === 'compliant').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Warnings</p>
              <p className="text-2xl font-semibold text-gray-900">
                {complianceRules.filter(rule => rule.status === 'warning').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Violations</p>
              <p className="text-2xl font-semibold text-gray-900">
                {complianceRules.filter(rule => rule.status === 'violation').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Rules */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">HOS Rules Status</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {complianceRules.map(rule => (
              <div key={rule.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(rule.status)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                      <p className="text-sm text-gray-600">{rule.description}</p>
                    </div>
                  </div>
                  <StatusBadge status={rule.status} type="log" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{rule.period} limit</span>
                    <span className="text-sm font-medium">
                      {rule.current}/{rule.limit} {rule.id.includes('hour') ? 'hours' : 'hours'}
                    </span>
                  </div>
                  <ProgressBar
                    current={rule.current}
                    max={rule.limit}
                    label=""
                    colorClass={
                      rule.status === 'compliant' ? 'bg-green-600' :
                      rule.status === 'warning' ? 'bg-yellow-600' :
                      'bg-red-600'
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Violations */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Violations & Warnings</h2>
        </div>
        <div className="p-6">
          {violations.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500">No recent violations or warnings</p>
            </div>
          ) : (
            <div className="space-y-4">
              {violations.map(violation => (
                <div key={violation.id} className={`border rounded-lg p-4 ${
                  violation.severity === 'violation' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className={`w-5 h-5 ${
                        violation.severity === 'violation' ? 'text-red-500' : 'text-yellow-500'
                      }`} />
                      <div>
                        <h4 className={`font-semibold ${
                          violation.severity === 'violation' ? 'text-red-800' : 'text-yellow-800'
                        }`}>
                          {violation.rule}
                        </h4>
                        <p className={`text-sm ${
                          violation.severity === 'violation' ? 'text-red-700' : 'text-yellow-700'
                        }`}>
                          {violation.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs mt-2">
                          <span className={
                            violation.severity === 'violation' ? 'text-red-600' : 'text-yellow-600'
                          }>
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {new Date(violation.date).toLocaleDateString()} at {violation.time}
                          </span>
                          <span className={
                            violation.severity === 'violation' ? 'text-red-600' : 'text-yellow-600'
                          }>
                            📍 {violation.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <StatusBadge
                      status={violation.severity}
                      type="log"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <Clock className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium">Take 30-Min Break</span>
            </button>

            <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <Bed className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium">Enter Sleeper Berth</span>
            </button>

            <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <Coffee className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium">Go Off Duty</span>
            </button>

            <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <Shield className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium">Review Rules</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compliance;
