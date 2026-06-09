import React from 'react';
import { Link } from 'react-router-dom';

const MobileDashboard = () => (
  <div className="max-w-2xl mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold text-gray-900 mb-2">Mobile Dashboard</h1>
    <p className="text-gray-600 mb-6">
      Mobile clock-in APIs are not part of the v2 org admin backend. Use the attendance kiosk for
      face-based check-in instead.
    </p>
    <Link to="/admin/dashboard" className="text-blue-600">
      Go to dashboard
    </Link>
  </div>
);

export default MobileDashboard;
