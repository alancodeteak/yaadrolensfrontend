import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import {
  useGetMobileDashboardQuery,
  useGetQuickStatsQuery,
  useGetMobileAttendanceQuery,
  useClockInMobileMutation,
  useClockOutMobileMutation,
  useGetMobileNotificationsQuery,
  useMarkNotificationReadMutation,
  useGetCurrentUserQuery
} from '../../store/api';
import Card from '../../components/common/Card/Card';

const MobileDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState('clock-in');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // API hooks
  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: mobileDashboard, isLoading: dashboardLoading } = useGetMobileDashboardQuery();
  const { data: quickStats, isLoading: statsLoading } = useGetQuickStatsQuery();
  const { data: mobileAttendance, isLoading: attendanceLoading } = useGetMobileAttendanceQuery({
    employee_id: currentUser?.id,
    date: selectedDate
  });
  const { data: notifications, isLoading: notificationsLoading } = useGetMobileNotificationsQuery({
    employee_id: currentUser?.id
  });

  const [clockInMobile, { isLoading: clockingIn }] = useClockInMobileMutation();
  const [clockOutMobile, { isLoading: clockingOut }] = useClockOutMobileMutation();
  const [markNotificationRead, { isLoading: markingRead }] = useMarkNotificationReadMutation();

  const handleClockAction = async (action) => {
    if (!currentUser) {
      toast.error('User not found');
      return;
    }

    try {
      const payload = {
        employee_id: currentUser.id,
        location: 'Mobile App', // In real app, get from GPS
        photo: null // Will be set if camera is used
      };

      if (action === 'clock-in') {
        await clockInMobile(payload).unwrap();
        toast.success('Clocked in successfully!');
      } else {
        await clockOutMobile(payload).unwrap();
        toast.success('Clocked out successfully!');
      }
    } catch (error) {
      console.error('Clock action failed:', error);
      toast.error(error?.data?.message || `Failed to ${action.replace('-', ' ')}`);
    }
  };

  const handleNotificationRead = async (notificationId) => {
    try {
      await markNotificationRead({
        notification_id: notificationId,
        employee_id: currentUser.id
      }).unwrap();
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Mark read failed:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const openCamera = async (mode) => {
    setCameraMode(mode);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      setIsCameraOpen(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // In real implementation, upload photo and then clock in/out
    handleClockAction(cameraMode);
    setIsCameraOpen(false);
  };

  const closeCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const getStatusColor = (status) => {
    const statusConfig = {
      'clocked-in': { color: 'text-green-600', bg: 'bg-green-100' },
      'clocked-out': { color: 'text-gray-600', bg: 'bg-gray-100' },
      'on-break': { color: 'text-yellow-600', bg: 'bg-yellow-100' },
      'absent': { color: 'text-red-600', bg: 'bg-red-100' }
    };
    
    const config = statusConfig[status] || { color: 'text-gray-600', bg: 'bg-gray-100' };
    return `${config.color} ${config.bg}`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mobile Dashboard</h1>
        <p className="text-gray-600 text-sm">
          {formatDate(selectedDate)}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {statsLoading ? '...' : quickStats?.hours_worked || '0.0'}
            </div>
            <div className="text-xs text-gray-500">Hours Today</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {statsLoading ? '...' : quickStats?.attendance_rate || '0'}%
            </div>
            <div className="text-xs text-gray-500">Attendance Rate</div>
          </div>
        </Card>
      </div>

      {/* Clock In/Out Actions */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Clock Actions</h2>
          
          {mobileAttendance?.current_status === 'clocked-in' ? (
            <div className="space-y-3">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">Currently Clocked In</p>
                <p className="text-xs text-green-600">
                  Since: {formatTime(mobileAttendance.clock_in_time)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => openCamera('clock-out')}
                  className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Clock Out
                </button>
                <button
                  onClick={() => handleClockAction('clock-out')}
                  disabled={clockingOut}
                  className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200"
                >
                  {clockingOut ? 'Processing...' : 'Quick Clock Out'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-800">Not Clocked In</p>
                <p className="text-xs text-gray-600">
                  Last: {formatTime(mobileAttendance?.last_clock_out)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => openCamera('clock-in')}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Clock In
                </button>
                <button
                  onClick={() => handleClockAction('clock-in')}
                  disabled={clockingIn}
                  className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200"
                >
                  {clockingIn ? 'Processing...' : 'Quick Clock In'}
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Today's Attendance */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Attendance</h2>
          
          {attendanceLoading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : mobileAttendance ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(mobileAttendance.current_status)}`}>
                    {mobileAttendance.current_status?.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {mobileAttendance.hours_worked || '0.0'}h
                  </p>
                  <p className="text-xs text-gray-500">Hours Worked</p>
                </div>
              </div>

              {mobileAttendance.clock_in_time && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Clock In</p>
                    <p className="text-xs text-gray-500">{formatTime(mobileAttendance.clock_in_time)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {mobileAttendance.clock_in_location || 'Office'}
                    </p>
                    <p className="text-xs text-gray-500">Location</p>
                  </div>
                </div>
              )}

              {mobileAttendance.clock_out_time && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Clock Out</p>
                    <p className="text-xs text-gray-500">{formatTime(mobileAttendance.clock_out_time)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {mobileAttendance.clock_out_location || 'Office'}
                    </p>
                    <p className="text-xs text-gray-500">Location</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance data</h3>
              <p className="mt-1 text-sm text-gray-500">
                No attendance record found for today.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
          
          {notificationsLoading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : notifications?.length > 0 ? (
            <div className="space-y-3">
              {notifications.slice(0, 5).map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 border rounded-lg ${!notification.is_read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <button
                        onClick={() => handleNotificationRead(notification.id)}
                        disabled={markingRead}
                        className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">
                You're all caught up!
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 bg-gray-900 rounded-lg"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <button
                  onClick={capturePhoto}
                  className="px-4 py-2 bg-white text-gray-900 rounded-lg shadow-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Capture
                </button>
                <button
                  onClick={closeCamera}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {cameraMode === 'clock-in' ? 'Take a photo for clock in' : 'Take a photo for clock out'}
            </p>
          </div>
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default MobileDashboard;

