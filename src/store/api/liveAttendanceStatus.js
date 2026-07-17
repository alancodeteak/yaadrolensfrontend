/**
 * Pure live-attendance status helpers (no UI/deps) for mapping + filters.
 */

export function resolveLiveAttendanceStatus(row) {
  const isLate = row?.attendance_status === 'late';

  if (row?.clock_in && !row?.clock_out) {
    return isLate ? 'Present (Late)' : 'Present';
  }
  if (row?.clock_in && row?.clock_out) {
    return isLate ? 'Clocked Out (Late)' : 'Clocked Out';
  }
  return 'Absent';
}

export function isLiveOnSiteStatus(status) {
  return status === 'Present' || status === 'Present (Late)';
}

export function matchesLiveAttendanceStatusFilter(employeeStatus, selectedStatus) {
  if (!selectedStatus || selectedStatus === 'All Status') return true;
  if (selectedStatus === 'Present') {
    return employeeStatus === 'Present' || employeeStatus === 'Present (Late)';
  }
  if (selectedStatus === 'Clocked Out') {
    return employeeStatus === 'Clocked Out' || employeeStatus === 'Clocked Out (Late)';
  }
  return employeeStatus === selectedStatus;
}
