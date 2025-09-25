// pages/Settings.tsx
import React, { useState } from 'react';
import { User, Bell, Globe, Truck, Shield, Save, Camera, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Settings: React.FC = () => {
  const { user, setUser } = useAppContext();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    notifications: true,
    autoBreakReminders: true,
    violationAlerts: true,
    weeklyReports: false,
    timeZone: 'America/New_York',
    units: 'imperial',
    language: 'en',
    theme: 'light'
  });

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    cdlNumber: user?.cdlNumber || '',
    company: user?.company || '',
    phone: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (user) {
        setUser({
          ...user,
          name: profileData.name,
          email: profileData.email,
          cdlNumber: profileData.cdlNumber,
          company: profileData.company
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const TabButton: React.FC<{ id: string; label: string; icon: React.ReactNode }> = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${
        activeTab === id 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <nav className="space-y-2">
              <TabButton
                id="profile"
                label="Profile"
                icon={<User className="w-5 h-5" />}
              />
              <TabButton
                id="notifications"
                label="Notifications"
                icon={<Bell className="w-5 h-5" />}
              />
              <TabButton
                id="preferences"
                label="Preferences"
                icon={<Globe className="w-5 h-5" />}
              />
              <TabButton
                id="vehicle"
                label="Vehicle Info"
                icon={<Truck className="w-5 h-5" />}
              />
              <TabButton
                id="security"
                label="Security"
                icon={<Shield className="w-5 h-5" />}
              />
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Profile Information</h2>
                <p className="text-sm text-gray-600">Update your personal information and CDL details</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Camera className="w-4 h-4" />
                      <span>Change Photo</span>
                    </button>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CDL Number</label>
                    <input
                      type="text"
                      value={profileData.cdlNumber}
                      onChange={(e) => setProfileData({...profileData, cdlNumber: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter CDL number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter company name"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter address"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                    <input
                      type="text"
                      value={profileData.emergencyContact}
                      onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Emergency contact name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Phone</label>
