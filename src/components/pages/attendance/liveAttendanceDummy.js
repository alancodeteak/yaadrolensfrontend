import { getDefaultAvatar } from '../../../utils/avatar';

/** Set true only for local UI demos when attendance API returns no rows */
export const USE_DUMMY_LIVE_ATTENDANCE = false;

export const DUMMY_SUMMARY = {
  currentlyPresent: 21,
  currentlyAbsent: 2,
  lateArrivalsToday: 3,
  totalEmployees: 26,
};

/** Per-hour clock-in counts (index = hour 0–23) — legacy bar chart sample */
export const DUMMY_HOURLY_COUNTS = [
  0, 0, 0, 0, 0, 0,
  1, 4, 9, 12, 7, 5,
  3, 2, 4, 3, 2, 1,
  0, 0, 0, 0, 0, 0,
];

function dummyIso(hour, minute = 0) {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

/** Sample clock events for the animated timeline when API returns no rows */
export const DUMMY_CLOCK_EVENTS = [
  { id: 'live-1-in', employeeId: 'live-1', name: 'Priya Sharma', type: 'IN', timestamp: dummyIso(9, 2), avatar: getDefaultAvatar('live-1') },
  { id: 'live-2-in', employeeId: 'live-2', name: 'Rahul Mehta', type: 'IN', timestamp: dummyIso(9, 2), avatar: getDefaultAvatar('live-2') },
  { id: 'live-9-in', employeeId: 'live-9', name: 'Meera Joshi', type: 'IN', timestamp: dummyIso(9, 2), avatar: getDefaultAvatar('live-9') },
  { id: 'live-7-in', employeeId: 'live-7', name: 'Kavya Iyer', type: 'IN', timestamp: dummyIso(10, 8), avatar: getDefaultAvatar('live-7') },
  { id: 'live-4-in', employeeId: 'live-4', name: 'Vikram Singh', type: 'IN', timestamp: dummyIso(9, 18), avatar: getDefaultAvatar('live-4') },
  { id: 'live-5-in', employeeId: 'live-5', name: 'Sneha Reddy', type: 'IN', timestamp: dummyIso(9, 22), avatar: getDefaultAvatar('live-5') },
  { id: 'live-8-in', employeeId: 'live-8', name: 'Dev Kapoor', type: 'IN', timestamp: dummyIso(10, 31), avatar: getDefaultAvatar('live-8') },
  { id: 'live-6-out', employeeId: 'live-6', name: 'Arjun Nair', type: 'OUT', timestamp: dummyIso(12, 45), avatar: getDefaultAvatar('live-6') },
  { id: 'live-3-out', employeeId: 'live-3', name: 'Ananya Patel', type: 'OUT', timestamp: dummyIso(13, 15), avatar: getDefaultAvatar('live-3') },
];

export const DUMMY_LIVE_ACTIVITIES = [
  { id: 'live-1', name: 'Priya Sharma', type: 'IN', event: 'Clocked in', time: '9:02 AM', avatar: getDefaultAvatar('live-1') },
  { id: 'live-2', name: 'Rahul Mehta', type: 'IN', event: 'Clocked in', time: '9:05 AM', avatar: getDefaultAvatar('live-2') },
  { id: 'live-3', name: 'Ananya Patel', type: 'OUT', event: 'Clocked out', time: '1:15 PM', avatar: getDefaultAvatar('live-3') },
  { id: 'live-4', name: 'Vikram Singh', type: 'IN', event: 'Clocked in', time: '9:18 AM', avatar: getDefaultAvatar('live-4') },
  { id: 'live-5', name: 'Sneha Reddy', type: 'IN', event: 'Clocked in', time: '9:22 AM', avatar: getDefaultAvatar('live-5') },
  { id: 'live-6', name: 'Arjun Nair', type: 'OUT', event: 'Clocked out', time: '12:45 PM', avatar: getDefaultAvatar('live-6') },
];
