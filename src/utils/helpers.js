// Date formatting utilities
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD/MM/YYYY HH:mm':
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    default:
      return d.toLocaleDateString();
  }
};

// Currency formatting (INR by default)
export const formatCurrency = (
  amount,
  { currency = 'INR', locale = 'en-IN', minimumFractionDigits, maximumFractionDigits } = {},
) => {
  if (amount === null || amount === undefined) return '';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...(minimumFractionDigits !== undefined ? { minimumFractionDigits } : {}),
    ...(maximumFractionDigits !== undefined ? { maximumFractionDigits } : {}),
  }).format(amount);
};

export const formatMonthlySalary = (amount) => {
  if (amount === null || amount === undefined) return '—';
  return `${formatCurrency(amount, { maximumFractionDigits: 0 })}/mo`;
};

// Number formatting
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined) return '';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

// String utilities
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Validation utilities
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Array utilities
export const sortByProperty = (array, property, direction = 'asc') => {
  return [...array].sort((a, b) => {
    if (direction === 'asc') {
      return a[property] > b[property] ? 1 : -1;
    } else {
      return a[property] < b[property] ? 1 : -1;
    }
  });
};

export const filterByProperty = (array, property, value) => {
  if (!value) return array;
  return array.filter(item => 
    item[property]?.toString().toLowerCase().includes(value.toLowerCase())
  );
};

// Object utilities
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

export const omit = (obj, keys) => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

export const pick = (obj, keys) => {
  const result = {};
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

// Time utilities
export const getTimeFromDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const diffInDays = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};

// Status utilities
export const getStatusColor = (status) => {
  const statusColors = {
    active: 'text-green-800 bg-green-100',
    inactive: 'text-red-800 bg-red-100',
    pending: 'text-yellow-800 bg-yellow-100',
    present: 'text-green-800 bg-green-100',
    absent: 'text-red-800 bg-red-100',
    late: 'text-yellow-800 bg-yellow-100',
    processed: 'text-green-800 bg-green-100',
    draft: 'text-gray-800 bg-gray-100',
    completed: 'text-green-800 bg-green-100',
    generating: 'text-yellow-800 bg-yellow-100',
    failed: 'text-red-800 bg-red-100',
  };
  
  return statusColors[status] || 'text-gray-800 bg-gray-100';
};

// File utilities
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// Local storage utilities
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};
