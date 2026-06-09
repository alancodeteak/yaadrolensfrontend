export const SETTINGS_ATTENDANCE_STEPS = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'Settings navigation',
    body: 'Switch between Attendance rules, Kiosk device, and Help.',
  },
  {
    id: 'working-hours',
    selector: '[data-tour="working-hours"]',
    title: 'Working hours',
    body: 'Set the standard work day start, end, and break duration for attendance calculations.',
  },
  {
    id: 'grace-periods',
    selector: '[data-tour="grace-periods"]',
    title: 'Grace periods',
    body: 'Allow a few minutes of leeway before marking late arrival or early departure.',
  },
  {
    id: 'overtime-rules',
    selector: '[data-tour="overtime-rules"]',
    title: 'Overtime',
    body: 'Enable overtime tracking and set the pay rate multiplier.',
  },
  {
    id: 'weekend-days',
    selector: '[data-tour="weekend-days"]',
    title: 'Weekend days',
    body: 'Choose which days count as non-working weekends for your organization.',
  },
  {
    id: 'save-actions',
    selector: '[data-tour="save-actions"]',
    title: 'Save changes',
    body: 'Apply your attendance rule changes. Validation runs before saving.',
  },
];

export const SETTINGS_KIOSK_STEPS = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'Settings navigation',
    body: 'Switch between Attendance rules, Kiosk device, and Help.',
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
    body: 'Switch between Attendance rules, Kiosk device, and Help.',
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
