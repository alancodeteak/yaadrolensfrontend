export function filterPaymentRows(rows, search = '') {
  if (!search) return rows;
  const term = search.toLowerCase();
  return rows.filter(
    (row) =>
      row.employee_name?.toLowerCase().includes(term) ||
      row.employee_code?.toLowerCase().includes(term) ||
      row.name?.toLowerCase().includes(term)
  );
}

export function paginateRows(rows, page, perPage) {
  const start = (page - 1) * perPage;
  return rows.slice(start, start + perPage);
}

export function enrichRowsWithPhotos(rows, photoMap) {
  return rows.map((row) => {
    const empId = String(row.employee_id || row.id || '');
    const photos = photoMap.get(empId) || {};
    return {
      ...row,
      profilePhotoUrl: photos.profilePhotoUrl ?? row.profilePhotoUrl,
      photo: photos.photo ?? row.photo,
      avatar: photos.avatar ?? row.avatar,
    };
  });
}

export function buildEmployeePhotoMap(employees = []) {
  const map = new Map();
  employees.forEach((emp) => {
    map.set(String(emp.id), {
      profilePhotoUrl: emp.profile_photo_url || emp.profilePhotoUrl || null,
      photo: emp.photo,
      avatar: emp.avatar,
    });
  });
  return map;
}

export function computePeriodPaymentStats(items = []) {
  const paid = items.filter((p) => p.status === 'paid');
  const pendingSalaries = items.filter(
    (p) => p.status === 'pending' && p.payment_type === 'monthly_salary'
  );
  const approvedSalaries = items.filter(
    (p) => p.status === 'approved' && p.payment_type === 'monthly_salary'
  );

  return {
    paidTotal: paid.reduce((sum, p) => sum + Number(p.amount || 0), 0),
    paidCount: paid.length,
    pendingSalaryCount: pendingSalaries.length,
    pendingSalaryTotal: pendingSalaries.reduce((sum, p) => sum + Number(p.amount || 0), 0),
    approvedSalaryCount: approvedSalaries.length,
  };
}
