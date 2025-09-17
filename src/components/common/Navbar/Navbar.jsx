import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', current: location.pathname === '/admin/dashboard' },
    { name: 'Employees', href: '/admin/employees', current: location.pathname === '/admin/employees' },
    { name: 'Payroll', href: '/admin/payroll', current: location.pathname === '/admin/payroll' },
    { name: 'Attendance', href: '/admin/attendance', current: location.pathname === '/admin/attendance' },
    { name: 'Reports', href: '/admin/reports', current: location.pathname === '/admin/reports' },
    { name: 'Settings', href: '/admin/settings', current: location.pathname === '/admin/settings' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Company Name */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">YaadroLens</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  item.current
                    ? 'text-blue-600 bg-blue-50 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <button className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5z" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white font-medium text-sm">A</span>
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">Admin</span>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                    Profile
                  </a>
                  <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                    Settings
                  </a>
                  <hr className="my-2 border-gray-100" />
                  <a href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
