import { docLink, docStrong } from '../docsI18n';

const enSections = [
  {
    title: 'What Settings controls',
    span: 'full',
    paragraphs: [
      [
        'Open ',
        docLink('/admin/settings/attendance', 'Settings'),
        ' from the left menu. Everything here applies to your whole organization — work hours, late rules, payroll, leave, and the attendance kiosk.',
      ],
      'There are four sections:',
    ],
    list: [
      [
        docStrong('Attendance rules'),
        ' — when the work day starts and ends, late/early grace, and how soon staff can clock out after clock-in.',
      ],
      [
        docStrong('Payment rules'),
        ' — salary pay day, auto salary generation, weekly offs, leave quota, and how monthly pay is calculated.',
      ],
      [
        docStrong('Kiosk'),
        ' — organization timezone and whether your face-scan tablet is paired.',
      ],
      [
        docStrong('Help & support'),
        ' — CodeTeak contact details if you need product help.',
      ],
    ],
    tip: [
      'Change settings carefully. Work hours and timezone affect late marking and “today’s date”. Payment rules affect how salaries are generated. After changing rules that affect attendance status, new punches use the new rules immediately.',
    ],
  },
  {
    title: 'Recommended setup order',
    span: 'full',
    subtitle: 'Do this once when you first set up the company',
    listStyle: 'steps',
    list: [
      [
        'Set ',
        docStrong('timezone'),
        ' under Settings → Kiosk (usually India — Asia/Kolkata).',
      ],
      [
        'Set ',
        docStrong('work start / end'),
        ' and grace periods under Settings → Attendance rules.',
      ],
      [
        'Set ',
        docStrong('weekly offs, leave quota, salary calculation, and pay day'),
        ' under Settings → Payment rules.',
      ],
      [
        'Add employees and set their salaries, then pair the kiosk and enroll faces.',
      ],
    ],
    footer: [
      'Also see: ',
      docLink('/docs/getting-started', 'Getting started'),
      ' · ',
      docLink('/docs/kiosk', 'Kiosk setup'),
      ' · ',
      docLink('/docs/salary', 'Salary'),
      ' · ',
      docLink('/docs/payroll', 'Payment'),
      '.',
    ],
  },
  {
    title: 'Attendance rules — Working hours',
    span: 'full',
    paragraphs: [
      [
        'Open ',
        docLink('/admin/settings/attendance', 'Settings → Attendance rules'),
        '.',
      ],
    ],
    list: [
      [
        docStrong('Start'),
        ' — Official start of the work day (for example 09:00 or 10:30). First clock-in after start + late grace is marked Late.',
      ],
      [
        docStrong('End'),
        ' — Official end of the work day. Clock-out before end − early grace can be marked Early leave (unless the day was already Late — late is kept).',
      ],
      'Both times are interpreted in your organization timezone (set under Kiosk). Wrong timezone is the most common reason late does not match what you expect.',
      'Example: start 10:30, late grace 10 minutes → arrivals after 10:40 are Late.',
    ],
  },
  {
    title: 'Attendance rules — Grace periods',
    span: 'full',
    list: [
      [
        docStrong('Late arrival (minutes)'),
        ' — Buffer after work start before a clock-in counts as late. 0 means any time after start is late. Typical values: 5–15 minutes. Max: 120.',
      ],
      [
        docStrong('Early departure (minutes)'),
        ' — Buffer before work end. Leaving earlier than (end − this many minutes) can mark Early leave when the person was not already Late. Typical values: 5–15. Max: 120.',
      ],
      'Grace only affects how status is decided at punch time. It does not change the stored clock-in / clock-out timestamps.',
    ],
  },
  {
    title: 'Attendance rules — Kiosk scan',
    span: 'full',
    list: [
      [
        docStrong('Minimum minutes before clock-out'),
        ' — After a clock-in, the next scan cannot record a clock-out until this many minutes have passed. Prevents accidental double scans. Default: 30. Set 0 to allow immediate clock-out. Max: 480 (8 hours).',
      ],
      'If someone scans too soon, the kiosk shows a message and does not record clock-out. Their session stays open until a valid clock-out later.',
      'Staff can have multiple sessions in one day (break / return). The minimum wait applies to each open session.',
    ],
    tip: [
      'Always click ',
      docStrong('Save changes'),
      ' at the bottom after editing attendance rules. Unsaved changes are discarded if you leave the page.',
    ],
  },
  {
    title: 'Payment rules — Monthly salary',
    span: 'full',
    paragraphs: [
      [
        'Open ',
        docLink('/admin/settings/payment', 'Settings → Payment rules'),
        '. Employee pay amounts themselves are set on the ',
        docLink('/admin/salary', 'Salary'),
        ' page — these settings control when and how payroll is generated.',
      ],
    ],
    list: [
      [
        docStrong('Automatically record monthly salaries'),
        ' — When ON, the server creates previous-month salary payment records on the pay day morning (in org timezone). You can still generate manually from the Payment page after the month ends. When OFF, only manual generation runs.',
      ],
      [
        docStrong('Pay day (day of month)'),
        ' — Calendar day (1–28) when auto salary recording runs. Example: 25 means on the 25th the system records salaries for the previous calendar month. Capped at 28 so short months always have that day.',
      ],
    ],
  },
  {
    title: 'Payment rules — Weekly off',
    span: 'full',
    list: [
      [
        docStrong('Default weekly off days'),
        ' — Tap Mon–Sun to mark company-wide offs (for example Sunday, or Sat+Sun). These days count as weekly off in leave-aware calendars and payroll day types.',
      ],
      [
        docStrong('Allow per-employee weekly off override'),
        ' — When ON, you can set different offs on an individual employee (where the product supports it). When OFF, everyone uses the company default.',
      ],
      'Weekly offs are not the same as leave. Leave is marked separately on the employee attendance calendar.',
    ],
  },
  {
    title: 'Payment rules — Leave policy',
    span: 'full',
    list: [
      [
        docStrong('Paid leaves per month'),
        ' — How many paid leave days each employee gets per month by default (0–31). Extra leave beyond this can reduce payable salary depending on calculation mode and deduction mode.',
      ],
      [
        docStrong('Deduction after quota exceeded — Proportional'),
        ' — Pay is scaled as (payable days ÷ working days) × monthly salary. Good when you want overall proration.',
      ],
      [
        docStrong('Deduction after quota exceeded — Per day'),
        ' — Each unpaid / over-quota day deducts one daily rate from salary. Good when you want a clear per-day cut.',
      ],
      [
        docStrong('Max days to schedule leave ahead'),
        ' — How far into the future admins can schedule leave (1–365 days). Stops leave from being booked too far ahead by mistake.',
      ],
      [
        docStrong('Block marking leave on weekly off days'),
        ' — When ON, you cannot mark leave on a day that is already a weekly off. When OFF, leave on an off day is allowed (usually not needed).',
      ],
      [
        docStrong('Allow per-employee leave quota override'),
        ' — When ON, individual employees can have a different paid-leave quota than the company default.',
      ],
    ],
  },
  {
    title: 'Payment rules — Salary calculation modes',
    span: 'full',
    paragraphs: [
      'This controls how the monthly amount on the Salary page is turned into payable salary when payroll is generated.',
    ],
    list: [
      [
        docStrong('Fixed'),
        ' — Pays the full monthly amount. Attendance and leave do not change the generated salary figure. Simplest option for fixed monthly packages.',
      ],
      [
        docStrong('Attendance-based'),
        ' — Prorates by days present. You must also choose how “working days in month” are counted (see next section). Half-days can count as 0.5 if enabled.',
      ],
      [
        docStrong('Leave-aware'),
        ' — Uses weekly offs, paid leave quota, and excess-leave deductions. Best when weekly offs and leave policy should affect pay. Half-days can count as 0.5 if enabled.',
      ],
      [
        docStrong('Hourly'),
        ' — Treats the employee’s Salary-page amount as an hourly rate (INR per hour). Payable ≈ hours worked × rate. Use only when you intentionally store hourly rates, not monthly packages.',
      ],
    ],
  },
  {
    title: 'Payment rules — Working days (attendance-based only)',
    span: 'full',
    paragraphs: [
      'These options appear when calculation mode is Attendance-based.',
    ],
    list: [
      [
        docStrong('Weekdays only (Mon–Fri)'),
        ' — Denominator is weekdays in the month (ignores Sat/Sun as working days for proration).',
      ],
      [
        docStrong('All calendar days'),
        ' — Denominator is every day in the month (including weekends).',
      ],
      [
        docStrong('Fixed count'),
        ' — Denominator is a number you set (for example 26). Use when your company always treats the month as a fixed number of payable days.',
      ],
      [
        docStrong('Fixed working days'),
        ' — Only when Fixed count is selected. Enter 1–31.',
      ],
      [
        docStrong('Count half-days as 0.5 present'),
        ' — For attendance-based and leave-aware modes. When ON, a half-day leave / half presence contributes 0.5 toward present days. When OFF, half-days are not split that way.',
      ],
    ],
    tip: [
      'If salaries look wrong after a policy change, check calculation mode first, then weekly offs and leave quota. Then regenerate or review the period on the ',
      docLink('/admin/payroll', 'Payment'),
      ' page.',
    ],
  },
  {
    title: 'Kiosk — Organization timezone',
    span: 'full',
    paragraphs: [
      [
        'Open ',
        docLink('/admin/settings/cameras', 'Settings → Kiosk'),
        '.',
      ],
    ],
    list: [
      [
        docStrong('Timezone'),
        ' — The clock your company runs on. Used for “today”, late/early decisions, leave dates, pay-day auto generation, and dashboards.',
      ],
      'For India, choose Asia/Kolkata. For UAE, Asia/Dubai. Do not leave UTC unless you truly operate on UTC — UTC with Indian work hours (for example 10:30) will mark afternoon IST arrivals as on time incorrectly.',
      'After changing timezone, new punches use the new zone. Historical rows keep their stored status unless rules are recomputed by the system.',
    ],
  },
  {
    title: 'Kiosk — Device status',
    span: 'full',
    list: [
      [
        docStrong('Paired'),
        ' — Yes means an attendance tablet is linked to your organization. No means you still need to pair from the mobile/kiosk app.',
      ],
      [
        docStrong('Device ID'),
        ' — Unique ID of the paired device (for support / troubleshooting).',
      ],
      [
        docStrong('Paired at'),
        ' — When the current device was linked.',
      ],
      'One active kiosk per organization is the normal setup. Full pairing steps are in the Kiosk guide.',
    ],
    footer: [
      'Full pairing walkthrough: ',
      docLink('/docs/kiosk', 'Kiosk setup guide'),
      '.',
    ],
  },
  {
    title: 'Help & support',
    span: 'full',
    paragraphs: [
      [
        docLink('/admin/settings/help', 'Settings → Help & support'),
        ' lists CodeTeak email, phone, and office details. Use it when something is broken or you need onboarding help — not for changing company rules (those stay under Attendance / Payment / Kiosk).',
      ],
    ],
    list: [
      'Product how-tos live under Get Started in the left menu (this documentation).',
      'For login or account creation issues, contact your system provider or CodeTeak support.',
    ],
  },
  {
    title: 'Quick reference — what each setting affects',
    span: 'full',
    list: [
      'Work start / late grace → Late badge, Late count on Dashboard Today, Live Attendance, calendars.',
      'Work end / early grace → Early leave status after clock-out.',
      'Minimum clock-out minutes → Whether a second kiosk scan can close the session.',
      'Timezone → Which calendar date is “today”, and when auto pay-day jobs run.',
      'Weekly offs + leave quota + calculation mode → Employee month calendar day types and generated salary amounts.',
      'Pay day + auto record → When previous-month salaries appear in Payment without manual generate.',
    ],
    footer: [
      'Back to ',
      docLink('/docs/getting-started', 'Getting started'),
      ' · Open ',
      docLink('/admin/settings/attendance', 'Attendance rules'),
      ' · ',
      docLink('/admin/settings/payment', 'Payment rules'),
      ' · ',
      docLink('/admin/settings/cameras', 'Kiosk'),
      '.',
    ],
  },
];

export const settingsContent = {
  en: {
    pageTitle: 'Settings — full guide',
    pageSubtitle:
      'Detailed explanation of every Attendance, Payment, Kiosk, and Help option, and how to configure them.',
    sections: enSections,
  },
  hi: {
    pageTitle: 'सेटिंग्स — पूरी गाइड',
    pageSubtitle:
      'Attendance, Payment, Kiosk और Help के हर विकल्प की विस्तृत व्याख्या। पूरा विवरण अभी अंग्रेज़ी में उपलब्ध है।',
  },
  ml: {
    pageTitle: 'സെറ്റിംഗ്സ് — പൂർണ്ണ ഗൈഡ്',
    pageSubtitle:
      'Attendance, Payment, Kiosk, Help ഓപ്ഷനുകളുടെ വിശദ വിവരണം. പൂർണ്ണ വിശദാംശങ്ങൾ ഇപ്പോൾ ഇംഗ്ലീഷിലാണ്.',
  },
  kn: {
    pageTitle: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು — ಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿ',
    pageSubtitle:
      'Attendance, Payment, Kiosk ಮತ್ತು Help ಪ್ರತಿ ಆಯ್ಕೆಯ ವಿವರ. ಪೂರ್ಣ ವಿವರ ಇದೀಗ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿದೆ.',
  },
};
