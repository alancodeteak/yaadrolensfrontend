import React, { useState } from 'react';
import Card from '../../../common/Card/Card';

const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    mobileNotifications: false
  });

  const handleToggle = (preference) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  return (
    <Card title="Notification preferences" variant="panel">
      <div className="space-y-4">
        {/* Email Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-base font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-500">Receive weekly reports via email</p>
          </div>
          <button
            onClick={() => handleToggle('emailNotifications')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 ${
              preferences.emailNotifications ? 'bg-[#007AFF]' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Mobile Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-base font-medium text-gray-900">Mobile Notifications</h4>
            <p className="text-sm text-gray-500">Receive real-time alerts on your phone</p>
          </div>
          <button
            onClick={() => handleToggle('mobileNotifications')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 ${
              preferences.mobileNotifications ? 'bg-[#007AFF]' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                preferences.mobileNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default NotificationPreferences;
