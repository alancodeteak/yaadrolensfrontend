export const SETTINGS_ATTENDANCE_STEPS = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'Settings navigation',
    body: 'Switch between Attendance rules, Payment rules, Kiosk, and Help.',
  },
  {
    id: 'working-hours',
    selector: '[data-tour="working-hours"]',
    title: 'Working hours',
    body: 'Set the standard work day start and end times for late and early-leave detection.',
  },
  {
    id: 'grace-periods',
    selector: '[data-tour="grace-periods"]',
    title: 'Grace periods',
    body: 'Allow a few minutes of leeway before marking late arrival or early departure.',
  },
  {
    id: 'kiosk-scan-rules',
    selector: '[data-tour="kiosk-scan-rules"]',
    title: 'Kiosk scan',
    body: 'Minimum wait after clock-in before the kiosk can record clock-out.',
  },
  {
    id: 'save-actions',
    selector: '[data-tour="save-actions"]',
    title: 'Save changes',
    body: 'Apply your attendance rule changes. Validation runs before saving.',
  },
];

export const SETTINGS_PAYMENT_STEPS = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'Settings navigation',
    body: 'Switch between Attendance rules, Payment rules, Kiosk, and Help.',
  },
  {
    id: 'payment-monthly-salary',
    selector: '[data-tour="payment-monthly-salary"]',
    title: 'Monthly salary',
    body: 'Enable automatic salary generation and choose the pay day of each month.',
  },
  {
    id: 'payment-weekly-off',
    selector: '[data-tour="payment-weekly-off"]',
    title: 'Weekly off',
    body: 'Default off days for all employees. You can allow per-employee overrides.',
  },
  {
    id: 'payment-leave-policy',
    selector: '[data-tour="payment-leave-policy"]',
    title: 'Leave policy',
    body: 'Paid leave quota, excess-leave deductions, and how far ahead leave can be scheduled.',
  },
  {
    id: 'payment-salary-calculation',
    selector: '[data-tour="payment-salary-calculation"]',
    title: 'Salary calculation',
    body: 'How monthly pay is computed: fixed, attendance-based, or leave-aware with deductions.',
  },
  {
    id: 'save-actions',
    selector: '[data-tour="save-actions"]',
    title: 'Save changes',
    body: 'Apply your payment rule changes. Validation runs before saving.',
  },
];

export const SETTINGS_KIOSK_STEPS = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'Settings navigation',
    body: 'Switch between Attendance rules, Payment rules, Kiosk, and Help.',
  },
  {
    id: 'device-status',
    selector: '[data-tour="device-status"]',
    title: 'Device status',
    body: 'See whether a kiosk is paired and view the device ID and pairing time.',
  },
  {
    id: 'pairing-info',
    selector: '[data-tour="pairing-info"]',
    title: 'How to pair',
    body: 'Instructions for pairing a new kiosk using org admin credentials from the kiosk app.',
  },
];

export const SETTINGS_HELP_STEPS = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'Settings navigation',
    body: 'Switch between Attendance rules, Payment rules, Kiosk, and Help.',
  },
  {
    id: 'help-contact',
    selector: '[data-tour="help-contact"]',
    title: 'Contact',
    body: 'Email and phone for CodeTeak support — tap to call or send a message.',
  },
  {
    id: 'help-offices',
    selector: '[data-tour="help-offices"]',
    title: 'Offices',
    body: 'Our Bengaluru office address for visits and correspondence.',
  },
];
