import { getDefaultAvatar } from '../../../utils/avatar';

/** TODO: set false once real attendance data is verified */
export const USE_DUMMY_LIVE_ATTENDANCE = true;

export const DUMMY_SUMMARY = {
  currentlyPresent: 21,
  currentlyAbsent: 2,
  lateArrivalsToday: 3,
  totalEmployees: 26,
};

/** Per-hour clock-in counts (index = hour 0–23) */
export const DUMMY_HOURLY_COUNTS = [
  0, 0, 0, 0, 0, 0,
  1, 4, 9, 12, 7, 5,
  3, 2, 4, 3, 2, 1,
  0, 0, 0, 0, 0, 0,
];

export const DUMMY_LIVE_ACTIVITIES = [
  { id: 'live-1', name: 'Priya Sharma', type: 'IN', event: 'Clocked in', time: '9:02 AM', avatar: getDefaultAvatar('live-1') },
  { id: 'live-2', name: 'Rahul Mehta', type: 'IN', event: 'Clocked in', time: '9:05 AM', avatar: getDefaultAvatar('live-2') },
  { id: 'live-3', name: 'Ananya Patel', type: 'OUT', event: 'Clocked out', time: '1:15 PM', avatar: getDefaultAvatar('live-3') },
  { id: 'live-4', name: 'Vikram Singh', type: 'IN', event: 'Clocked in', time: '9:18 AM', avatar: getDefaultAvatar('live-4') },
  { id: 'live-5', name: 'Sneha Reddy', type: 'IN', event: 'Clocked in', time: '9:22 AM', avatar: getDefaultAvatar('live-5') },
  { id: 'live-6', name: 'Arjun Nair', type: 'OUT', event: 'Clocked out', time: '12:45 PM', avatar: getDefaultAvatar('live-6') },
];
