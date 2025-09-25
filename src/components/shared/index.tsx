// components/shared/index.tsx
import React from 'react';
import { Truck, User, Menu, X, LogOut, BarChart3, MapPin, FileText, Navigation, Shield, Settings } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

// Status Badge Component
export const StatusBadge: React.FC<{
  status: string;
  type?: 'trip' | 'log' | 'load'
}> = ({ status, type = 'trip' }) => {
  const getStatusColor = () => {
    if (type === 'log') {
      switch (status) {
        case 'compliant': return 'bg-green-100 text-green-800';
        case 'violation': return 'bg-red-100 text-red-800';
        case 'warning': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else if (type === 'load') {
      switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'picked': return 'bg-blue-100 text-blue-800';
        case 'delivered': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else {
      switch (status) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        case 'planned': return 'bg-yellow-100 text-yellow-800';
        case 'paused': return 'bg-orange-100 text-orange-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Stat Card Component
export const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
}> = ({ icon, title, value, subtitle, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  </div>
);

// Progress Bar Component
export const ProgressBar: React.FC<{
  current: number;
  max: number;
  label: string;
  colorClass?: string;
}> = ({ current, max, label, colorClass = 'bg-blue-600' }) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">{current}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`${colorClass} h-3 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {max > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          Remaining: {Math.max(max - current, 0)} {label.toLowerCase().includes('hour') ? 'hours' : 'units'}
        </p>
      )}
    </div>
  );
};

// Header Component
export const Header: React.FC<{
  setSidebarOpen: (open: boolean) => void
}> = ({ setSidebarOpen }) => {
  const { user } = useAppContext();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700 lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-gray-900">
              Welcome back, {user?.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span>CDL: {user?.cdlNumber}</span>
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

// Sidebar Component
export const Sidebar: React.FC<{
  currentPage: string;
  setCurrentPage: (page: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void
}> = ({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen }) => {
  const { user } = useAppContext();

  const NavButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    page: string;
    badge?: number;
  }> = ({ icon, label, page, badge }) => (
    <button
      onClick={() => {
        setCurrentPage(page);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
        currentPage === page 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      <div className="flex items-center space-x-3">
        {icon}
        <span>{label}</span>
      </div>
      {badge && badge > 0 && (
        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 bg-gray-900">
          <div className="flex items-center space-x-2">
            <Truck className="w-8 h-8 text-blue-500" />
            <span className="text-white font-bold">ELD Planner</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col h-full px-4 py-6 space-y-2">
          <NavButton icon={<BarChart3 className="w-5 h-5" />} label="Dashboard" page="dashboard" />
          <NavButton icon={<MapPin className="w-5 h-5" />} label="Trips" page="trips" badge={1} />
          <NavButton icon={<FileText className="w-5 h-5" />} label="ELD Logs" page="logs" />
          <NavButton icon={<Navigation className="w-5 h-5" />} label="Route Planner" page="routes" />
          <NavButton icon={<Shield className="w-5 h-5" />} label="HOS Compliance" page="compliance" />
          <NavButton icon={<Settings className="w-5 h-5" />} label="Settings" page="settings" />

          <div className="flex-1"></div>

          {/* User Info */}
          <div className="border-t border-gray-700 pt-4">
            <div className="px-4 py-3 text-sm text-gray-300">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.company}</p>
                </div>
              </div>
            </div>
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
