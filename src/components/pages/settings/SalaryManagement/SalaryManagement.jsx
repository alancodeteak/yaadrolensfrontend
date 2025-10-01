import React, { useState, useEffect } from 'react';
import Card from '../../../common/Card/Card';
import { toast } from 'react-toastify';
import {
  useGetSalarySettingsQuery,
  useUpdateSalarySettingsMutation,
  useResetSalarySettingsMutation
} from '../../../../store/api/settingsApi';

const SalaryManagement = () => {
  // API hooks
  const { data: salarySettingsData, isLoading, error } = useGetSalarySettingsQuery();
  const [updateSalarySettings, { isLoading: isSaving }] = useUpdateSalarySettingsMutation();
  const [resetSalarySettings] = useResetSalarySettingsMutation();

  const [salarySettings, setSalarySettings] = useState({
    // Basic Salary Settings
    minimumHourlyRate: 15.00,
    maximumHourlyRate: 100.00,
    defaultHourlyRate: 20.00,
    
    // Overtime Settings
    overtimeMultiplier: 1.5,
    overtimeThreshold: 40, // hours per week
    doubleTimeThreshold: 50, // hours per week
    doubleTimeMultiplier: 2.0,
    
    // Weekend & Holiday Rates
    weekendMultiplier: 1.25,
    holidayMultiplier: 2.0,
    nightShiftMultiplier: 1.15,
    nightShiftStart: '22:00',
    nightShiftEnd: '06:00',
    
    // Deduction Settings
    defaultTaxRate: 0.20,
    socialSecurityRate: 0.062,
    medicareRate: 0.0145,
    defaultDeductions: 0,
    
    // Salary Bands by Position
    salaryBands: [
      { position: 'Junior Developer', minRate: 20.00, maxRate: 35.00, defaultRate: 25.00 },
      { position: 'Senior Developer', minRate: 35.00, maxRate: 60.00, defaultRate: 45.00 },
      { position: 'Team Lead', minRate: 50.00, maxRate: 80.00, defaultRate: 65.00 },
      { position: 'Manager', minRate: 60.00, maxRate: 100.00, defaultRate: 75.00 },
      { position: 'Director', minRate: 80.00, maxRate: 150.00, defaultRate: 100.00 }
    ],
    
    // Benefits & Allowances
    healthInsurance: 200.00,
    dentalInsurance: 50.00,
    visionInsurance: 25.00,
    retirementMatch: 0.05, // 5% of salary
    transportationAllowance: 100.00,
    mealAllowance: 150.00,
    
    // Currency & Formatting
    currency: 'USD',
    currencySymbol: '$',
    decimalPlaces: 2,
    
    // Payroll Settings
    payPeriod: 'bi-weekly', // weekly, bi-weekly, monthly
    payDay: 'Friday',
    firstPayDate: '2024-01-05',
    
    // Auto-calculations
    autoCalculateOvertime: true,
    autoCalculateDeductions: true,
    autoCalculateBenefits: true,
    requireApproval: true,
    approvalThreshold: 1000.00 // amount requiring approval
  });

  // Load settings when API data is available
  useEffect(() => {
    if (salarySettingsData) {
      setSalarySettings(salarySettingsData);
    }
  }, [salarySettingsData]);

  const handleInputChange = (section, field, value) => {
    setSalarySettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const handleSalaryBandChange = (index, field, value) => {
    setSalarySettings(prev => ({
      ...prev,
      salaryBands: (prev.salaryBands || []).map((band, i) => 
        i === index ? { ...band, [field]: parseFloat(value) || 0 } : band
      )
    }));
  };

  const addSalaryBand = () => {
    setSalarySettings(prev => ({
      ...prev,
      salaryBands: [...(prev.salaryBands || []), { 
        position: '', 
        minRate: 0, 
        maxRate: 0, 
        defaultRate: 0 
      }]
    }));
  };

  const removeSalaryBand = (index) => {
    setSalarySettings(prev => ({
      ...prev,
      salaryBands: (prev.salaryBands || []).filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      await updateSalarySettings(salarySettings).unwrap();
      toast.success('Salary settings saved successfully!');
    } catch (error) {
      console.error('Failed to save salary settings:', error);
      toast.error(error?.data?.message || 'Failed to save salary settings');
    }
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all salary settings to default values?')) {
      try {
        await resetSalarySettings().unwrap();
        toast.success('Salary settings reset to default values');
      } catch (error) {
        console.error('Failed to reset salary settings:', error);
        toast.error('Failed to reset salary settings');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Loading salary settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Salary Settings</h3>
          <p className="text-gray-600 mb-4">Failed to load salary settings. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Salary Management</h1>
        <p className="text-gray-600">Configure salary rates, overtime rules, and payroll settings for your organization.</p>
      </div>

      <div className="space-y-8">
        {/* Basic Salary Settings */}
        <Card title="Basic Salary Settings">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Hourly Rate
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={salarySettings.minimumHourlyRate}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, minimumHourlyRate: parseFloat(e.target.value) || 0 }))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Maximum Hourly Rate
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={salarySettings.maximumHourlyRate}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, maximumHourlyRate: parseFloat(e.target.value) || 0 }))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Default Hourly Rate
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={salarySettings.defaultHourlyRate}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, defaultHourlyRate: parseFloat(e.target.value) || 0 }))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Overtime Settings */}
        <Card title="Overtime Settings">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Overtime Multiplier
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={salarySettings.overtimeMultiplier}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, overtimeMultiplier: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">x</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Overtime Threshold (hours/week)
              </label>
              <input
                type="number"
                value={salarySettings.overtimeThreshold}
                onChange={(e) => setSalarySettings(prev => ({ ...prev, overtimeThreshold: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Double Time Threshold (hours/week)
              </label>
              <input
                type="number"
                value={salarySettings.doubleTimeThreshold}
                onChange={(e) => setSalarySettings(prev => ({ ...prev, doubleTimeThreshold: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Double Time Multiplier
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={salarySettings.doubleTimeMultiplier}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, doubleTimeMultiplier: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">x</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Special Rates */}
        <Card title="Special Rates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Weekend Multiplier
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={salarySettings.weekendMultiplier}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, weekendMultiplier: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">x</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Holiday Multiplier
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={salarySettings.holidayMultiplier}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, holidayMultiplier: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">x</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Night Shift Multiplier
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={salarySettings.nightShiftMultiplier}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, nightShiftMultiplier: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">x</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Night Shift Hours
              </label>
              <div className="flex space-x-2">
                <input
                  type="time"
                  value={salarySettings.nightShiftStart}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, nightShiftStart: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="flex items-center text-gray-500">to</span>
                <input
                  type="time"
                  value={salarySettings.nightShiftEnd}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, nightShiftEnd: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Salary Bands by Position */}
        <Card title="Salary Bands by Position">
          <div className="space-y-4">
            {(salarySettings.salaryBands || []).map((band, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={band.position}
                    onChange={(e) => handleSalaryBandChange(index, 'position', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Senior Developer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Min Rate
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={band.minRate}
                      onChange={(e) => handleSalaryBandChange(index, 'minRate', e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Rate
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={band.maxRate}
                      onChange={(e) => handleSalaryBandChange(index, 'maxRate', e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Default Rate
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={band.defaultRate}
                      onChange={(e) => handleSalaryBandChange(index, 'defaultRate', e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => removeSalaryBand(index)}
                    className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            
            <button
              onClick={addSalaryBand}
              className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
            >
              + Add New Salary Band
            </button>
          </div>
        </Card>

        {/* Benefits & Allowances */}
        <Card title="Benefits & Allowances">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Health Insurance (monthly)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={salarySettings.healthInsurance}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, healthInsurance: parseFloat(e.target.value) || 0 }))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dental Insurance (monthly)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={salarySettings.dentalInsurance}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, dentalInsurance: parseFloat(e.target.value) || 0 }))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vision Insurance (monthly)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={salarySettings.visionInsurance}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, visionInsurance: parseFloat(e.target.value) || 0 }))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Retirement Match (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={salarySettings.retirementMatch * 100}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, retirementMatch: parseFloat(e.target.value) / 100 || 0 }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Transportation Allowance (monthly)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={salarySettings.transportationAllowance}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, transportationAllowance: parseFloat(e.target.value) || 0 }))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Meal Allowance (monthly)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={salarySettings.mealAllowance}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, mealAllowance: parseFloat(e.target.value) || 0 }))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Payroll Settings */}
        <Card title="Payroll Settings">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pay Period
              </label>
              <select
                value={salarySettings.payPeriod}
                onChange={(e) => setSalarySettings(prev => ({ ...prev, payPeriod: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pay Day
              </label>
              <select
                value={salarySettings.payDay}
                onChange={(e) => setSalarySettings(prev => ({ ...prev, payDay: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Pay Date
              </label>
              <input
                type="date"
                value={salarySettings.firstPayDate}
                onChange={(e) => setSalarySettings(prev => ({ ...prev, firstPayDate: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Approval Threshold
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={salarySettings.approvalThreshold}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, approvalThreshold: parseFloat(e.target.value) || 0 }))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={salarySettings.autoCalculateOvertime}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, autoCalculateOvertime: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Auto-calculate overtime</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={salarySettings.autoCalculateDeductions}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, autoCalculateDeductions: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Auto-calculate deductions</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={salarySettings.autoCalculateBenefits}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, autoCalculateBenefits: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Auto-calculate benefits</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={salarySettings.requireApproval}
                  onChange={(e) => setSalarySettings(prev => ({ ...prev, requireApproval: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Require approval</span>
              </label>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleReset}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Reset to Defaults
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalaryManagement;
