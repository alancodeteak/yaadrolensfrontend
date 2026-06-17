export function filterEmployees(
  employees,
  { search = '', department = 'all', is_active } = {}
) {
  let result = [...employees];

  if (search) {
    const term = search.toLowerCase();
    result = result.filter(
      (employee) =>
        employee.name?.toLowerCase().includes(term) ||
        employee.employee_code?.toLowerCase().includes(term) ||
        employee.phone?.toLowerCase().includes(term)
    );
  }

  if (department && department !== 'all') {
    result = result.filter((employee) => employee.department === department);
  }

  if (is_active !== undefined && is_active !== null && is_active !== 'all') {
    result = result.filter((employee) => employee.is_active === is_active);
  }

  return result;
}

export function sortEmployees(employees, sortBy) {
  const sorted = [...employees];
  sorted.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'department':
        return (a.department || '').localeCompare(b.department || '');
      case 'status':
        return (a.is_active ? 'Active' : 'Inactive').localeCompare(
          b.is_active ? 'Active' : 'Inactive'
        );
      case 'created_at':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'training_status':
        return (a.training_status || 'not_started').localeCompare(
          b.training_status || 'not_started'
        );
      default:
        return 0;
    }
  });
  return sorted;
}

export function paginateEmployees(employees, page, perPage) {
  const start = (page - 1) * perPage;
  return employees.slice(start, start + perPage);
}
