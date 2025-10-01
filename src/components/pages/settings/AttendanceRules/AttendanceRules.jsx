import React, { useState, useEffect } from 'react';
import Card from '../../../common/Card/Card';
import { useGetAttendanceRulesQuery, useUpdateAttendanceRulesMutation } from '../../../../store/api/settingsApi';
import { toast } from 'react-toastify';

const AttendanceRules = () => {
  // API hooks
  const { data: attendanceRules, isLoading, error, refetch } = useGetAttendanceRulesQuery();
  const [updateAttendanceRules, { isLoading: isUpdating }] = useUpdateAttendanceRulesMutation();

  // Form state
  const [workingHours, setWorkingHours] = useState({
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: 60
  });

  const [gracePeriods, setGracePeriods] = useState({
    lateArrival: 10,
    earlyDeparture: 5
  });

  const [overtimeRules, setOvertimeRules] = useState({
    enabled: true,
    rateMultiplier: 1.5
  });

  const [weekendHolidays, setWeekendHolidays] = useState({
    weekendDays: ['saturday', 'sunday']
  });

  // Load data from API when available
  useEffect(() => {
    if (attendanceRules) {
      // Map API response to form state
      setWorkingHours({
        startTime: attendanceRules.work_start_time || '09:00',
        endTime: attendanceRules.work_end_time || '17:00',
        breakDuration: attendanceRules.break_duration_minutes || 60
      });

      setGracePeriods({
        lateArrival: attendanceRules.late_arrival_grace_minutes || 10,
        earlyDeparture: attendanceRules.early_departure_grace_minutes || 5
      });

      setOvertimeRules({
        enabled: attendanceRules.allow_overtime ?? true,
        rateMultiplier: attendanceRules.overtime_rate_multiplier || 1.5
      });

      setWeekendHolidays({
        weekendDays: attendanceRules.weekend_days || ['saturday', 'sunday']
      });
    }
  }, [attendanceRules]);

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


  const handleWeekendDayToggle = (day) => {
    setWeekendHolidays(prev => ({
      ...prev,
      weekendDays: prev.weekendDays.includes(day)
        ? prev.weekendDays.filter(d => d !== day)
        : [...prev.weekendDays, day]
    }));
  };

  // Form validation
  const validateForm = () => {
    const errors = [];

    // Validate working hours
    if (workingHours.startTime >= workingHours.endTime) {
      errors.push('End time must be after start time');
    }

    if (workingHours.breakDuration < 0 || workingHours.breakDuration > 480) {
      errors.push('Break duration must be between 0 and 480 minutes');
    }

    // Validate grace periods
    if (gracePeriods.lateArrival < 0 || gracePeriods.lateArrival > 60) {
      errors.push('Late arrival grace must be between 0 and 60 minutes');
    }

    if (gracePeriods.earlyDeparture < 0 || gracePeriods.earlyDeparture > 60) {
      errors.push('Early departure grace must be between 0 and 60 minutes');
    }


    // Validate overtime rules
    if (overtimeRules.enabled) {
      if (overtimeRules.rateMultiplier < 1.0 || overtimeRules.rateMultiplier > 3.0) {
        errors.push('Overtime rate multiplier must be between 1.0 and 3.0');
      }

    }

    return errors;
  };

  const handleSave = async () => {
    // Validate form before saving
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    try {
      // Prepare data for API
      const rulesData = {
        work_start_time: workingHours.startTime,
        work_end_time: workingHours.endTime,
        break_duration_minutes: workingHours.breakDuration,
        late_arrival_grace_minutes: gracePeriods.lateArrival,
        early_departure_grace_minutes: gracePeriods.earlyDeparture,
        allow_overtime: overtimeRules.enabled,
        overtime_rate_multiplier: overtimeRules.rateMultiplier,
        weekend_days: weekendHolidays.weekendDays
      };

      await updateAttendanceRules(rulesData).unwrap();
      toast.success('Attendance rules saved successfully!');
      refetch(); // Refresh data from server
    } catch (error) {
      console.error('Failed to save attendance rules:', error);
      toast.error(error?.data?.message || 'Failed to save attendance rules');
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading attendance rules...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Settings</h3>
            <p className="text-gray-600 mb-4">Failed to load attendance rules. Please try again.</p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Rules</h1>
            <p className="text-gray-600">Configure attendance policies and rules for your organization</p>
            {attendanceRules && (
              <div className="mt-2 text-sm text-gray-500">
                Last updated: {new Date(attendanceRules.updated_at || attendanceRules.created_at).toLocaleString()}
              </div>
            )}
          </div>
          {attendanceRules && (
            <div className="flex items-center text-sm text-green-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Settings Loaded
            </div>
          )}
        </div>
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

          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isUpdating}
          className={`px-8 py-3 font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl ${
            isUpdating 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isUpdating ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            'Save Attendance Rules'
          )}
        </button>
      </div>
    </div>
  );
};

export default AttendanceRules;
