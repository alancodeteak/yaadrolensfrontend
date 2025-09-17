import React, { useState } from 'react';
import Card from '../../../common/Card/Card';

const CameraDeviceManagement = () => {
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [globalSettings, setGlobalSettings] = useState({
    networkSubnet: '',
    autoReconnect: true
  });

  // Mock data for camera devices
  const devices = [
    {
      id: 1,
      name: 'Main Entrance',
      deviceId: 'CAM-001',
      status: 'Online',
      lastActivity: '2 min ago',
      todayScans: 127,
      ipAddress: '192.168.1.101',
      location: 'Main Entrance',
      icon: 'green'
    },
    {
      id: 2,
      name: 'Office Floor 1',
      deviceId: 'CAM-002',
      status: 'Online',
      lastActivity: '5 min ago',
      todayScans: 89,
      ipAddress: '192.168.1.102',
      location: 'Office Floor 1',
      icon: 'blue'
    },
    {
      id: 3,
      name: 'Parking Area',
      deviceId: 'CAM-003',
      status: 'Offline',
      lastActivity: '2 hours ago',
      todayScans: 45,
      ipAddress: '192.168.1.103',
      location: 'Parking Area',
      icon: 'red'
    },
    {
      id: 4,
      name: 'Conference Room',
      deviceId: 'CAM-004',
      status: 'Online',
      lastActivity: '1 min ago',
      todayScans: 23,
      ipAddress: '192.168.1.104',
      location: 'Conference Room',
      icon: 'green'
    },
    {
      id: 5,
      name: 'Cafeteria',
      deviceId: 'CAM-005',
      status: 'Offline',
      lastActivity: '1 hour ago',
      todayScans: 67,
      ipAddress: '192.168.1.105',
      location: 'Cafeteria',
      icon: 'red'
    },
    {
      id: 6,
      name: 'Reception Desk',
      deviceId: 'CAM-006',
      status: 'Online',
      lastActivity: '3 min ago',
      todayScans: 156,
      ipAddress: '192.168.1.106',
      location: 'Reception Desk',
      icon: 'blue'
    }
  ];

  const locations = ['All Locations', 'Main Entrance', 'Office Floor 1', 'Parking Area', 'Conference Room', 'Cafeteria', 'Reception Desk'];

  // Filter devices based on selected location
  const filteredDevices = selectedLocation === 'All Locations' 
    ? devices 
    : devices.filter(device => device.location === selectedLocation);

  const handleAddDevice = () => {
    setEditingDevice(null);
    setIsModalOpen(true);
  };

  const handleConfigureDevice = (device) => {
    console.log('Configure device:', device);
    // TODO: Implement configure functionality
  };

  const handleTestDevice = (device) => {
    console.log('Test device:', device);
    // TODO: Implement test functionality
  };

  const handleReconnectDevice = (device) => {
    console.log('Reconnect device:', device);
    // TODO: Implement reconnect functionality
  };

  const handleGlobalSettingsChange = (field, value) => {
    setGlobalSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving global settings:', globalSettings);
    // TODO: Implement save functionality
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Online': 'bg-green-50 text-green-700 ring-1 ring-green-200',
      'Offline': 'bg-red-50 text-red-700 ring-1 ring-red-200',
      'Maintenance': 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200'
    };

    return (
      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-50 text-gray-700 ring-1 ring-gray-200'}`}>
        {status}
      </span>
    );
  };

  const getDeviceIcon = (icon, status) => {
    const iconColors = {
      green: status === 'Online' ? 'text-green-500' : 'text-green-400',
      blue: status === 'Online' ? 'text-blue-500' : 'text-blue-400',
      red: status === 'Online' ? 'text-red-500' : 'text-red-400'
    };

    return (
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColors[icon]} bg-gray-50`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
    );
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Camera Device Management</h1>
        <p className="text-gray-600">Manage attendance terminals and camera devices</p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
        <button
          onClick={handleAddDevice}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Device
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Location Filter */}
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Refresh Button */}
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Status
          </button>
        </div>
      </div>

      {/* Device Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredDevices.map((device) => (
          <Card key={device.id} variant="flat">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                {getDeviceIcon(device.icon, device.status)}
                <div className="text-right">
                  <h3 className="text-lg font-semibold text-gray-900">{device.name}</h3>
                  <p className="text-sm text-gray-500">{device.deviceId}</p>
                </div>
              </div>

              <div className="mb-4">
                {getStatusBadge(device.status)}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Activity:</span>
                  <span className="text-gray-900">{device.lastActivity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Today's Scans:</span>
                  <span className="text-gray-900">{device.todayScans}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">IP Address:</span>
                  <span className="text-gray-900 font-mono">{device.ipAddress}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleConfigureDevice(device)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Configure
                </button>
                {device.status === 'Online' ? (
                  <button
                    onClick={() => handleTestDevice(device)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Test
                  </button>
                ) : (
                  <button
                    onClick={() => handleReconnectDevice(device)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Re-connect
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Global Device Settings */}
      <Card title="Global Device Settings">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Network Configuration
            </label>
            <input
              type="text"
              value={globalSettings.networkSubnet}
              onChange={(e) => handleGlobalSettingsChange('networkSubnet', e.target.value)}
              placeholder="Network subnet (e.g., 192.168.1.0/24)"
              className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Enable Auto-reconnect
              </label>
              <p className="text-sm text-gray-500">Automatically try to reconnect to offline devices</p>
            </div>
            <button
              onClick={() => handleGlobalSettingsChange('autoReconnect', !globalSettings.autoReconnect)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                globalSettings.autoReconnect ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  globalSettings.autoReconnect ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSaveSettings}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Save Device Settings
        </button>
      </div>

      {/* Add/Edit Device Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingDevice ? 'Edit Device' : 'Add New Device'}
              </h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Device Name
                  </label>
                  <input
                    type="text"
                    defaultValue={editingDevice?.name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter device name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Device ID
                  </label>
                  <input
                    type="text"
                    defaultValue={editingDevice?.deviceId || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter device ID"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IP Address
                  </label>
                  <input
                    type="text"
                    defaultValue={editingDevice?.ipAddress || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter IP address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    defaultValue={editingDevice?.location || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select location</option>
                    {locations.filter(loc => loc !== 'All Locations').map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    {editingDevice ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraDeviceManagement;
