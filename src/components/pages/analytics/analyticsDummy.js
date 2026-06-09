/** TODO: set false once real analytics data is verified */
export const USE_DUMMY_ANALYTICS = true;

const DUMMY_EMPLOYEES = [
  { employee_id: 'd1', employee_code: 'EMP-001', name: 'Priya Sharma', days_present: 18, late_count: 4, incomplete_days: 1, total_hours: 142.5 },
  { employee_id: 'd2', employee_code: 'EMP-002', name: 'Rahul Mehta', days_present: 20, late_count: 2, incomplete_days: 0, total_hours: 158.0 },
  { employee_id: 'd3', employee_code: 'EMP-003', name: 'Ananya Patel', days_present: 19, late_count: 1, incomplete_days: 0, total_hours: 151.2 },
  { employee_id: 'd4', employee_code: 'EMP-004', name: 'Vikram Singh', days_present: 17, late_count: 5, incomplete_days: 2, total_hours: 136.0 },
  { employee_id: 'd5', employee_code: 'EMP-005', name: 'Sneha Reddy', days_present: 21, late_count: 0, incomplete_days: 0, total_hours: 165.5 },
  { employee_id: 'd6', employee_code: 'EMP-006', name: 'Arjun Nair', days_present: 16, late_count: 3, incomplete_days: 1, total_hours: 128.0 },
  { employee_id: 'd7', employee_code: 'EMP-007', name: 'Kavya Iyer', days_present: 20, late_count: 1, incomplete_days: 0, total_hours: 160.0 },
  { employee_id: 'd8', employee_code: 'EMP-008', name: 'Dev Kapoor', days_present: 15, late_count: 6, incomplete_days: 2, total_hours: 120.5 },
];

export function buildDummyCalendar(year, month, todayKey) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const total = 26;
  const days = [];

  for (let d = 1; d <= daysInMonth; d += 1) {
    const iso = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (todayKey && iso > todayKey) {
      days.push({ date: iso, present: 0, absent: 0, total_employees: total, day_type: 'future' });
    } else if (d % 5 === 0) {
      days.push({ date: iso, present: 20, absent: 6, total_employees: total, day_type: 'some_absent' });
    } else if (d % 7 === 0) {
      days.push({ date: iso, present: 22, absent: 4, total_employees: total, day_type: 'some_absent' });
    } else {
      days.push({ date: iso, present: 24, absent: 2, total_employees: total, day_type: 'all_present' });
    }
  }
  return days;
}

export const DUMMY_MONTH_STATS = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  avg_attendance_rate: 86.5,
  punctuality_rate: 91.2,
  total_hours: 1162.7,
  total_late: 22,
  incomplete_days: 6,
};

export const DUMMY_MONTHLY_ROWS = DUMMY_EMPLOYEES;

export const DUMMY_TODAY_STATS = {
  present: 21,
  absent: 2,
  late: 3,
  present_rate: 80.8,
};
