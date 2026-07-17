/**
 * Node built-in test runner:
 *   node --test src/store/api/liveAttendanceStatus.test.js
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  isLiveOnSiteStatus,
  matchesLiveAttendanceStatusFilter,
  resolveLiveAttendanceStatus,
} from './liveAttendanceStatus.js';

describe('resolveLiveAttendanceStatus', () => {
  it('shows Present when clocked in without clock out', () => {
    assert.equal(
      resolveLiveAttendanceStatus({
        attendance_status: 'present',
        clock_in: '2026-07-17T04:00:00Z',
        clock_out: null,
      }),
      'Present'
    );
  });

  it('shows Present (Late) when late and still clocked in', () => {
    assert.equal(
      resolveLiveAttendanceStatus({
        attendance_status: 'late',
        clock_in: '2026-07-17T05:00:00Z',
        clock_out: null,
      }),
      'Present (Late)'
    );
  });

  it('keeps Present when clock_in exists even if status string is absent', () => {
    assert.equal(
      resolveLiveAttendanceStatus({
        attendance_status: 'absent',
        clock_in: '2026-07-17T04:00:00Z',
        clock_out: null,
      }),
      'Present'
    );
  });

  it('shows Clocked Out when clocked in and out on time', () => {
    assert.equal(
      resolveLiveAttendanceStatus({
        attendance_status: 'present',
        clock_in: '2026-07-17T04:00:00Z',
        clock_out: '2026-07-17T12:00:00Z',
      }),
      'Clocked Out'
    );
  });

  it('shows Clocked Out (Late) when late and clocked out', () => {
    assert.equal(
      resolveLiveAttendanceStatus({
        attendance_status: 'late',
        clock_in: '2026-07-17T05:00:00Z',
        clock_out: '2026-07-17T12:00:00Z',
      }),
      'Clocked Out (Late)'
    );
  });

  it('shows Absent with no punches', () => {
    assert.equal(
      resolveLiveAttendanceStatus({
        attendance_status: 'absent',
        clock_in: null,
        clock_out: null,
      }),
      'Absent'
    );
  });
});

describe('isLiveOnSiteStatus', () => {
  it('treats Present and Present (Late) as on site', () => {
    assert.equal(isLiveOnSiteStatus('Present'), true);
    assert.equal(isLiveOnSiteStatus('Present (Late)'), true);
    assert.equal(isLiveOnSiteStatus('Clocked Out'), false);
    assert.equal(isLiveOnSiteStatus('Clocked Out (Late)'), false);
    assert.equal(isLiveOnSiteStatus('Absent'), false);
  });
});

describe('matchesLiveAttendanceStatusFilter', () => {
  it('Present filter includes Present (Late)', () => {
    assert.equal(matchesLiveAttendanceStatusFilter('Present', 'Present'), true);
    assert.equal(matchesLiveAttendanceStatusFilter('Present (Late)', 'Present'), true);
    assert.equal(matchesLiveAttendanceStatusFilter('Clocked Out', 'Present'), false);
  });

  it('Clocked Out filter includes Clocked Out (Late)', () => {
    assert.equal(matchesLiveAttendanceStatusFilter('Clocked Out', 'Clocked Out'), true);
    assert.equal(matchesLiveAttendanceStatusFilter('Clocked Out (Late)', 'Clocked Out'), true);
    assert.equal(matchesLiveAttendanceStatusFilter('Present', 'Clocked Out'), false);
  });
});
