import React, { useState } from 'react';
import Card from '../../../common/Card/Card';

const AttendanceRules = () => {
  const [workingHours, setWorkingHours] = useState({
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: 60
  });

  const [gracePeriods, setGracePeriods] = useState({
    lateArrival: 10,
    earlyDeparture: 5,
    breakOvertime: 15
  });

  const [overtimeRules, setOvertimeRules] = useState({
    enabled: true,
    rateMultiplier: 1.5,
    maxHoursPerDay: 4
  });

  const [weekendHolidays, setWeekendHolidays] = useState({
    weekendDays: ['saturday', 'sunday'],
    weekendOvertime: false
  });

  const handleWorkingHoursChange = (field, value) => {
    setWorkingHours(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGracePeriodsChange = (field, value) => {
    setGracePeriods(prev => ({
      ...prev,
      [field]: parseInt(value) || 0
    }));
  };

  const handleOvertimeRulesChange = (field, value) => {
    setOvertimeRules(prev => ({
      ...prev,
      [field]: field === 'enabled' ? value : (field === 'rateMultiplier' ? parseFloat(value) || 0 : parseInt(value) || 0)
    }));
  };

  const handleWeekendHolidaysChange = (field, value) => {
    if (field === 'weekendDays') {
      setWeekendHolidays(prev => ({
        ...prev,
        weekendDays: value
      }));
    } else {
      setWeekendHolidays(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleWeekendDayToggle = (day) => {
    setWeekendHolidays(prev => ({
      ...prev,
      weekendDays: prev.weekendDays.includes(day)
        ? prev.weekendDays.filter(d => d !== day)
        : [...prev.weekendDays, day]
    }));
  };

  const handleSave = () => {
    console.log('Saving attendance rules:', {
      workingHours,
      gracePeriods,
      overtimeRules,
      weekendHolidays
    });
    // TODO: Implement save functionality
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Rules</h1>
        <p className="text-gray-600">Configure attendance policies and rules for your organization</p>
      </div>

      {/* Rules Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Working Hours Card */}
        <Card title="Working Hours">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  type="time"
                  value={workingHours.startTime}
                  onChange={(e) => handleWorkingHoursChange('startTime', e.target.value)}
                  className="block w-full pl-10 pr-20 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-sm text-gray-500 font-medium">{formatTime(workingHours.startTime)}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  type="time"
                  value={workingHours.endTime}
                  onChange={(e) => handleWorkingHoursChange('endTime', e.target.value)}
                  className="block w-full pl-10 pr-20 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-sm text-gray-500 font-medium">{formatTime(workingHours.endTime)}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Break Duration (minutes)
              </label>
              <input
                type="number"
                value={workingHours.breakDuration}
                onChange={(e) => handleWorkingHoursChange('breakDuration', parseInt(e.target.value) || 0)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                min="0"
                max="480"
              />
            </div>
          </div>
        </Card>

        {/* Grace Periods Card */}
        <Card title="Grace Periods">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Late Arrival Grace (minutes)
              </label>
              <input
                type="number"
                value={gracePeriods.lateArrival}
                onChange={(e) => handleGracePeriodsChange('lateArrival', e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                min="0"
                max="60"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Early Departure Grace (minutes)
              </label>
              <input
                type="number"
                value={gracePeriods.earlyDeparture}
                onChange={(e) => handleGracePeriodsChange('earlyDeparture', e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                min="0"
                max="60"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Break Overtime Grace (minutes)
              </label>
              <input
                type="number"
                value={gracePeriods.breakOvertime}
                onChange={(e) => handleGracePeriodsChange('breakOvertime', e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                min="0"
                max="60"
              />
            </div>
          </div>
        </Card>

        {/* Overtime Rules Card */}
        <Card title="Overtime Rules">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">
                Allow employees to work overtime
              </label>
              <button
                onClick={() => handleOvertimeRulesChange('enabled', !overtimeRules.enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  overtimeRules.enabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    overtimeRules.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Overtime Rate Multiplier
              </label>
              <input
                type="number"
                step="0.1"
                value={overtimeRules.rateMultiplier}
                onChange={(e) => handleOvertimeRulesChange('rateMultiplier', e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                min="1.0"
                max="3.0"
                disabled={!overtimeRules.enabled}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Overtime Hours/Day
              </label>
              <input
                type="number"
                value={overtimeRules.maxHoursPerDay}
                onChange={(e) => handleOvertimeRulesChange('maxHoursPerDay', e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                min="0"
                max="12"
                disabled={!overtimeRules.enabled}
              />
            </div>
          </div>
        </Card>

        {/* Weekend & Holidays Card */}
        <Card title="Weekend & Holidays">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Weekend Days
              </label>
              <div className="space-y-3">
                {[
                  { value: 'saturday', label: 'Saturday' },
                  { value: 'sunday', label: 'Sunday' }
                ].map((day) => (
                  <label key={day.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={weekendHolidays.weekendDays.includes(day.value)}
                      onChange={() => handleWeekendDayToggle(day.value)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">{day.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">
                Allow overtime on weekends
              </label>
              <button
                onClick={() => handleWeekendHolidaysChange('weekendOvertime', !weekendHolidays.weekendOvertime)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  weekendHolidays.weekendOvertime ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    weekendHolidays.weekendOvertime ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Save Attendance Rules
        </button>
      </div>
    </div>
  );
};

export default AttendanceRules;
