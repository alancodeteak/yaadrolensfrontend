import { describe, it, expect } from 'vitest';
import {
  isLiveOnSiteStatus,
  matchesLiveAttendanceStatusFilter,
  resolveLiveAttendanceStatus,
} from './liveAttendanceStatus.js';

describe('resolveLiveAttendanceStatus', () => {
  it('shows Present when clocked in without clock out', () => {
    expect(
      resolveLiveAttendanceStatus({
        attendance_status: 'present',
        clock_in: '2026-07-17T04:00:00Z',
        clock_out: null,
      })
    ).toBe('Present');
  });

  it('shows Present (Late) when late and still clocked in', () => {
    expect(
      resolveLiveAttendanceStatus({
        attendance_status: 'late',
        clock_in: '2026-07-17T05:00:00Z',
        clock_out: null,
      })
    ).toBe('Present (Late)');
  });

  it('keeps Present when clock_in exists even if status string is absent', () => {
    expect(
      resolveLiveAttendanceStatus({
        attendance_status: 'absent',
        clock_in: '2026-07-17T04:00:00Z',
        clock_out: null,
      })
    ).toBe('Present');
  });

  it('shows Clocked Out when clocked in and out on time', () => {
    expect(
      resolveLiveAttendanceStatus({
        attendance_status: 'present',
        clock_in: '2026-07-17T04:00:00Z',
        clock_out: '2026-07-17T12:00:00Z',
      })
    ).toBe('Clocked Out');
  });

  it('shows Clocked Out (Late) when late and clocked out', () => {
    expect(
      resolveLiveAttendanceStatus({
        attendance_status: 'late',
        clock_in: '2026-07-17T05:00:00Z',
        clock_out: '2026-07-17T12:00:00Z',
      })
    ).toBe('Clocked Out (Late)');
  });

  it('shows Absent with no punches', () => {
    expect(
      resolveLiveAttendanceStatus({
        attendance_status: 'absent',
        clock_in: null,
        clock_out: null,
      })
    ).toBe('Absent');
  });

  it('shows Scheduled off when shift is off and no punch', () => {
    expect(
      resolveLiveAttendanceStatus({
        attendance_status: 'shift_off',
        is_shift_off: true,
        clock_in: null,
        clock_out: null,
      })
    ).toBe('Scheduled off');
  });
});

describe('isLiveOnSiteStatus', () => {
  it('treats Present and Present (Late) as on site', () => {
    expect(isLiveOnSiteStatus('Present')).toBe(true);
    expect(isLiveOnSiteStatus('Present (Late)')).toBe(true);
    expect(isLiveOnSiteStatus('Clocked Out')).toBe(false);
    expect(isLiveOnSiteStatus('Clocked Out (Late)')).toBe(false);
    expect(isLiveOnSiteStatus('Absent')).toBe(false);
  });
});

describe('matchesLiveAttendanceStatusFilter', () => {
  it('Present filter includes Present (Late)', () => {
    expect(matchesLiveAttendanceStatusFilter('Present', 'Present')).toBe(true);
    expect(matchesLiveAttendanceStatusFilter('Present (Late)', 'Present')).toBe(true);
    expect(matchesLiveAttendanceStatusFilter('Clocked Out', 'Present')).toBe(false);
  });

  it('Clocked Out filter includes Clocked Out (Late)', () => {
    expect(matchesLiveAttendanceStatusFilter('Clocked Out', 'Clocked Out')).toBe(true);
    expect(matchesLiveAttendanceStatusFilter('Clocked Out (Late)', 'Clocked Out')).toBe(true);
    expect(matchesLiveAttendanceStatusFilter('Present', 'Clocked Out')).toBe(false);
  });
});
