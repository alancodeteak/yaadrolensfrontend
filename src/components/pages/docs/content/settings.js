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
      'There are five sections:',
    ],
    list: [
      [
        docStrong('Attendance rules'),
        ' — shift mode (same for all vs per employee), work hours, late/early grace, and how soon staff can clock out after clock-in.',
      ],
      [
        docStrong('Shifts'),
        ' — reusable shift templates (Morning, Night, …) with work hours and breaks (lunch, tea). Assign Mon–Sun schedules on each employee when per-employee mode is on.',
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
        ' and grace periods under Settings → Attendance rules. Choose same-for-all or per-employee shifts.',
      ],
      [
        'If using per-employee shifts, create ',
        docStrong('shift templates'),
        ' under Settings → Shifts, then assign Mon–Sun on each employee.',
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
        docStrong('Shift schedule mode'),
        ' — Same for all uses the org start/end below for everyone. Per employee uses shift templates assigned Mon–Sun on each person.',
      ],
      [
        docStrong('Start'),
        ' — Official start of the work day (for example 09:00 or 10:30). First clock-in after start + late grace is marked Late. Overnight is allowed (e.g. 22:00–06:00).',
      ],
      [
        docStrong('End'),
        ' — Official end of the work day. Clock-out before end − early grace can be marked Early leave (unless the day was already Late — late is kept).',
      ],
      'Both times are interpreted in your organization timezone (set under Kiosk). Wrong timezone is the most common reason late does not match what you expect.',
      'Example: start 10:30, late grace 10 minutes → arrivals after 10:40 are Late.',
      'Switching from per-employee back to same-for-all requires clearing all employee weekly shift assignments first (use Clear all schedules & switch if needed).',
    ],
  },
  {
    title: 'Shifts — Templates',
    span: 'full',
    paragraphs: [
      [
        'Open ',
        docLink('/admin/settings/shifts', 'Settings → Shifts'),
        '. You can create templates even while mode is still same-for-all, then enable per-employee mode when ready.',
      ],
    ],
    list: [
      [
        docStrong('Template name'),
        ' — e.g. Morning, Evening, Night. Names must be unique in your organization.',
      ],
      [
        docStrong('Work start / end'),
        ' — Hours for that shift. Overnight OK (22:00–06:00).',
      ],
      [
        docStrong('Breaks'),
        ' — Optional lunch, tea, etc. Multiple breaks allowed. Shown on attendance for display; soft break rules come later.',
      ],
      'Delete is blocked while a template is assigned. Confirm Unassign all & delete to clear weekly slots and remove it.',
      [
        'When mode is per-employee, edit an employee and set ',
        docStrong('Weekly shift schedule'),
        ' (Mon–Sun). Off days leave the day empty. A working template cannot be set on a weekly-off day.',
      ],
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
  },
  {
    title: 'Attendance rules — Manual attendance',
    span: 'full',
    list: [
      [
        docStrong('Enable manual punch in / out'),
        ' — Off by default. When on, Live attendance shows In / Out actions for today so an admin can record punches without the kiosk.',
      ],
      'Each manual punch requires typing “manual attendance approved” in the confirmation dialog before it is saved.',
      'Use only when face scan is unavailable. Prefer the kiosk for normal day-to-day attendance.',
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

const hiSections = [
  {
    title: 'Settings क्या नियंत्रित करती है',
    span: 'full',
    paragraphs: [
      [
        'बाएँ मेनू से ',
        docLink('/admin/settings/attendance', 'Settings'),
        ' खोलें। यहाँ सब कुछ आपकी पूरी संस्था पर लागू होता है — कार्य समय, लेट नियम, पेरोल, छुट्टी और हाजिरी कियोस्क।',
      ],
      'पाँच सेक्शन हैं:',
    ],
    list: [
      [
        docStrong('Attendance rules'),
        ' — शिफ्ट मोड (सभी एक जैसे या प्रति कर्मचारी), कार्य समय, लेट/अर्ली ग्रेस, और क्लॉक-इन के बाद कितनी जल्दी क्लॉक-आउट हो सकता है।',
      ],
      [
        docStrong('Shifts'),
        ' — शिफ्ट टेम्पलेट (Morning, Night, …) कार्य समय और ब्रेक के साथ। प्रति-कर्मचारी मोड में Mon–Sun शेड्यूल असाइन करें।',
      ],
      [
        docStrong('Payment rules'),
        ' — सैलरी पे डे, ऑटो सैलरी जनरेशन, साप्ताहिक छुट्टी, लीव कोटा, और मासिक वेतन कैसे गणना होता है।',
      ],
      [
        docStrong('Kiosk'),
        ' — संस्था का टाइमज़ोन और आपका फेस-स्कैन टैबलेट पेयर है या नहीं।',
      ],
      [
        docStrong('Help & support'),
        ' — प्रोडक्ट मदद के लिए CodeTeak संपर्क विवरण।',
      ],
    ],
    tip: [
      'सेटिंग्स सावधानी से बदलें। कार्य समय और टाइमज़ोन लेट मार्क और “आज की तारीख” को प्रभावित करते हैं। Payment rules सैलरी कैसे बनेगी इसे प्रभावित करते हैं। हाजिरी स्थिति बदलने वाले नियम बदलने के बाद नए पंच तुरंत नए नियमों का उपयोग करते हैं।',
    ],
  },
  {
    title: 'अनुशंसित सेटअप क्रम',
    span: 'full',
    subtitle: 'कंपनी पहली बार सेट करते समय एक बार करें',
    listStyle: 'steps',
    list: [
      [
        'Settings → Kiosk के तहत ',
        docStrong('timezone'),
        ' सेट करें (आमतौर पर भारत — Asia/Kolkata)।',
      ],
      [
        'Settings → Attendance rules के तहत ',
        docStrong('work start / end'),
        ' और ग्रेस पीरियड सेट करें। same-for-all या per-employee शिफ्ट चुनें।',
      ],
      [
        'Per-employee मोड हो तो ',
        docLink('/admin/settings/shifts', 'Settings → Shifts'),
        ' में टेम्पलेट बनाएँ और कर्मचारी पर Mon–Sun असाइन करें।',
      ],
      [
        'Settings → Payment rules के तहत ',
        docStrong('weekly offs, leave quota, salary calculation, और pay day'),
        ' सेट करें।',
      ],
      [
        'कर्मचारी जोड़ें और उनकी सैलरी सेट करें, फिर कियोस्क पेयर करें और चेहरे रजिस्टर करें।',
      ],
    ],
    footer: [
      'यह भी देखें: ',
      docLink('/docs/getting-started', 'शुरुआत करें'),
      ' · ',
      docLink('/docs/kiosk', 'कियोस्क सेटअप'),
      ' · ',
      docLink('/docs/salary', 'सैलरी'),
      ' · ',
      docLink('/docs/payroll', 'पेमेंट'),
      '।',
    ],
  },
  {
    title: 'Attendance rules — कार्य समय',
    span: 'full',
    paragraphs: [
      [
        'खोलें ',
        docLink('/admin/settings/attendance', 'Settings → Attendance rules'),
        '।',
      ],
    ],
    list: [
      [
        docStrong('Start'),
        ' — कार्य दिवस की आधिकारिक शुरुआत (उदाहरण 09:00 या 10:30)। start + late grace के बाद पहला क्लॉक-इन Late मार्क होता है।',
      ],
      [
        docStrong('End'),
        ' — कार्य दिवस का आधिकारिक अंत। end − early grace से पहले क्लॉक-आउट Early leave मार्क हो सकता है (जब तक दिन पहले से Late न हो — late बना रहता है)।',
      ],
      'दोनों समय आपके संस्था टाइमज़ोन में समझे जाते हैं (Kiosk के तहत सेट)। गलत टाइमज़ोन सबसे आम कारण है कि लेट आपकी अपेक्षा से मेल नहीं खाता।',
      'उदाहरण: start 10:30, late grace 10 मिनट → 10:40 के बाद आने वाले Late हैं।',
    ],
  },
  {
    title: 'Attendance rules — ग्रेस पीरियड',
    span: 'full',
    list: [
      [
        docStrong('Late arrival (minutes)'),
        ' — कार्य शुरू के बाद बफर, इससे पहले क्लॉक-इन लेट नहीं गिना जाता। 0 का मतलब start के बाद कोई भी समय लेट है। सामान्य: 5–15 मिनट। अधिकतम: 120।',
      ],
      [
        docStrong('Early departure (minutes)'),
        ' — कार्य अंत से पहले बफर। (end − इतने मिनट) से पहले जाने पर Early leave हो सकता है जब व्यक्ति पहले से Late न हो। सामान्य: 5–15। अधिकतम: 120।',
      ],
      'ग्रेस केवल पंच समय पर स्थिति तय करने को प्रभावित करता है। संग्रहीत क्लॉक-इन / क्लॉक-आउट टाइमस्टैम्प नहीं बदलता।',
    ],
  },
  {
    title: 'Attendance rules — कियोस्क स्कैन',
    span: 'full',
    list: [
      [
        docStrong('Minimum minutes before clock-out'),
        ' — क्लॉक-इन के बाद अगला स्कैन इतने मिनट तक क्लॉक-आउट रिकॉर्ड नहीं कर सकता। आकस्मिक डबल स्कैन रोकता है। डिफ़ॉल्ट: 30। तुरंत क्लॉक-आउट के लिए 0 सेट करें। अधिकतम: 480 (8 घंटे)।',
      ],
      'अगर कोई जल्दी स्कैन करे, कियोस्क संदेश दिखाता है और क्लॉक-आउट रिकॉर्ड नहीं करता। सत्र वैध क्लॉक-आउट तक खुला रहता है।',
      'स्टाफ एक दिन में कई सत्र रख सकते हैं (ब्रेक / वापसी)। न्यूनतम प्रतीक्षा हर खुले सत्र पर लागू होती है।',
    ],
  },
  {
    title: 'Attendance rules — मैनुअल अटेंडेंस',
    span: 'full',
    list: [
      [
        docStrong('Enable manual punch in / out'),
        ' — डिफ़ॉल्ट रूप से बंद। चालू होने पर Live attendance में आज के लिए In / Out क्रियाएँ दिखती हैं, ताकि एडमिन कियोस्क के बिना पंच रिकॉर्ड कर सके।',
      ],
      'हर मैनुअल पंच से पहले कन्फर्मेशन में “manual attendance approved” टाइप करना आवश्यक है।',
      'केवल तब उपयोग करें जब फेस स्कैन उपलब्ध न हो। सामान्य दिन-प्रतिदिन अटेंडेंस के लिए कियोस्क पसंद करें।',
    ],
    tip: [
      'Attendance rules एडिट करने के बाद नीचे हमेशा ',
      docStrong('Save changes'),
      ' क्लिक करें। पेज छोड़ने पर अनसेव्ड बदलाव खो जाते हैं।',
    ],
  },
  {
    title: 'Payment rules — मासिक सैलरी',
    span: 'full',
    paragraphs: [
      [
        'खोलें ',
        docLink('/admin/settings/payment', 'Settings → Payment rules'),
        '। कर्मचारी की वेतन राशि ',
        docLink('/admin/salary', 'Salary'),
        ' पेज पर सेट होती है — ये सेटिंग्स नियंत्रित करती हैं कि पेरोल कब और कैसे बनेगा।',
      ],
    ],
    list: [
      [
        docStrong('Automatically record monthly salaries'),
        ' — ON होने पर सर्वर पे डे की सुबह (org टाइमज़ोन में) पिछले महीने की सैलरी पेमेंट रिकॉर्ड बनाता है। महीना खत्म होने के बाद Payment पेज से मैन्युअल भी जनरेट कर सकते हैं। OFF होने पर केवल मैन्युअल जनरेशन चलता है।',
      ],
      [
        docStrong('Pay day (day of month)'),
        ' — कैलेंडर दिन (1–28) जब ऑटो सैलरी रिकॉर्डिंग चलती है। उदाहरण: 25 का मतलब 25 तारीख को सिस्टम पिछले कैलेंडर महीने की सैलरी रिकॉर्ड करता है। 28 पर सीमित ताकि छोटे महीनों में भी वह दिन हो।',
      ],
    ],
  },
  {
    title: 'Payment rules — साप्ताहिक छुट्टी',
    span: 'full',
    list: [
      [
        docStrong('Default weekly off days'),
        ' — कंपनी-व्यापी छुट्टी के लिए Mon–Sun टैप करें (उदाहरण रविवार, या Sat+Sun)। ये दिन लीव-अवेयर कैलेंडर और पेरोल डे टाइप में weekly off गिने जाते हैं।',
      ],
      [
        docStrong('Allow per-employee weekly off override'),
        ' — ON होने पर व्यक्तिगत कर्मचारी पर अलग छुट्टी सेट कर सकते हैं (जहाँ प्रोडक्ट सपोर्ट करे)। OFF होने पर सभी कंपनी डिफ़ॉल्ट उपयोग करते हैं।',
      ],
      'साप्ताहिक छुट्टी लीव जैसी नहीं है। लीव कर्मचारी हाजिरी कैलेंडर पर अलग मार्क होती है।',
    ],
  },
  {
    title: 'Payment rules — लीव नीति',
    span: 'full',
    list: [
      [
        docStrong('Paid leaves per month'),
        ' — डिफ़ॉल्ट रूप से हर कर्मचारी को प्रति माह कितने पेड लीव दिन मिलते हैं (0–31)। इससे अधिक लीव गणना मोड और कटौती मोड के अनुसार देय सैलरी घटा सकती है।',
      ],
      [
        docStrong('Deduction after quota exceeded — Proportional'),
        ' — वेतन (payable days ÷ working days) × monthly salary के रूप में स्केल होता है। समग्र प्रोरेशन चाहिए तो अच्छा।',
      ],
      [
        docStrong('Deduction after quota exceeded — Per day'),
        ' — हर unpaid / ओवर-कोटा दिन सैलरी से एक दैनिक दर काटता है। स्पष्ट प्रति-दिन कटौती चाहिए तो अच्छा।',
      ],
      [
        docStrong('Max days to schedule leave ahead'),
        ' — एडमिन भविष्य में कितनी दूर तक लीव शेड्यूल कर सकते हैं (1–365 दिन)। गलती से बहुत आगे लीव बुक होने से रोकता है।',
      ],
      [
        docStrong('Block marking leave on weekly off days'),
        ' — ON होने पर जो दिन पहले से weekly off है उस पर लीव मार्क नहीं कर सकते। OFF होने पर छुट्टी के दिन लीव अनुमति है (आमतौर पर ज़रूरी नहीं)।',
      ],
      [
        docStrong('Allow per-employee leave quota override'),
        ' — ON होने पर व्यक्तिगत कर्मचारियों का पेड-लीव कोटा कंपनी डिफ़ॉल्ट से अलग हो सकता है।',
      ],
    ],
  },
  {
    title: 'Payment rules — सैलरी गणना मोड',
    span: 'full',
    paragraphs: [
      'यह नियंत्रित करता है कि Salary पेज की मासिक राशि पेरोल जनरेट होने पर देय सैलरी में कैसे बदले।',
    ],
    list: [
      [
        docStrong('Fixed'),
        ' — पूरी मासिक राशि देता है। हाजिरी और लीव जनरेटेड सैलरी आंकड़ा नहीं बदलते। फिक्स्ड मासिक पैकेज के लिए सबसे सरल विकल्प।',
      ],
      [
        docStrong('Attendance-based'),
        ' — उपस्थित दिनों के अनुसार प्रोरेट करता है। “महीने में कार्य दिवस” कैसे गिने जाएँ यह भी चुनना होगा (अगला सेक्शन देखें)। सक्षम होने पर हाफ़-डे 0.5 गिने जा सकते हैं।',
      ],
      [
        docStrong('Leave-aware'),
        ' — साप्ताहिक छुट्टी, पेड लीव कोटा और अतिरिक्त-लीव कटौती उपयोग करता है। जब weekly offs और लीव नीति वेतन प्रभावित करें तो सबसे अच्छा। सक्षम होने पर हाफ़-डे 0.5 गिने जा सकते हैं।',
      ],
      [
        docStrong('Hourly'),
        ' — कर्मचारी की Salary-पेज राशि को प्रति घंटा दर मानता है (INR प्रति घंटा)। देय ≈ काम के घंटे × दर। केवल जब आप जानबूझकर प्रति घंटा दर रखते हों, मासिक पैकेज नहीं।',
      ],
    ],
  },
  {
    title: 'Payment rules — कार्य दिवस (केवल attendance-based)',
    span: 'full',
    paragraphs: [
      'ये विकल्प तब दिखते हैं जब गणना मोड Attendance-based हो।',
    ],
    list: [
      [
        docStrong('Weekdays only (Mon–Fri)'),
        ' — हर (denominator) महीने के weekdays हैं (प्रोरेशन के लिए Sat/Sun कार्य दिवस नहीं गिने जाते)।',
      ],
      [
        docStrong('All calendar days'),
        ' — हर महीने का हर दिन (वीकेंड सहित)।',
      ],
      [
        docStrong('Fixed count'),
        ' — आप जो संख्या सेट करें (उदाहरण 26)। जब कंपनी हमेशा महीने को तय देय दिनों के रूप में माने।',
      ],
      [
        docStrong('Fixed working days'),
        ' — केवल Fixed count चुनने पर। 1–31 दर्ज करें।',
      ],
      [
        docStrong('Count half-days as 0.5 present'),
        ' — attendance-based और leave-aware मोड के लिए। ON होने पर हाफ़-डे लीव / हाफ़ उपस्थिति present दिनों में 0.5 जोड़ती है। OFF होने पर हाफ़-डे उस तरह विभाजित नहीं होते।',
      ],
    ],
    tip: [
      'नीति बदलने के बाद सैलरी गलत लगे तो पहले गणना मोड जाँचें, फिर weekly offs और लीव कोटा। फिर ',
      docLink('/admin/payroll', 'Payment'),
      ' पेज पर अवधि दोबारा जनरेट या समीक्षा करें।',
    ],
  },
  {
    title: 'Kiosk — संस्था टाइमज़ोन',
    span: 'full',
    paragraphs: [
      [
        'खोलें ',
        docLink('/admin/settings/cameras', 'Settings → Kiosk'),
        '।',
      ],
    ],
    list: [
      [
        docStrong('Timezone'),
        ' — आपकी कंपनी जिस घड़ी पर चलती है। “आज”, लेट/अर्ली निर्णय, लीव तारीखें, पे-डे ऑटो जनरेशन और डैशबोर्ड के लिए उपयोग।',
      ],
      'भारत के लिए Asia/Kolkata चुनें। UAE के लिए Asia/Dubai। UTC न छोड़ें जब तक आप सच में UTC पर न चलें — भारतीय कार्य समय (उदाहरण 10:30) के साथ UTC दोपहर IST आगमन को गलत तरीके से ऑन टाइम मार्क कर सकता है।',
      'टाइमज़ोन बदलने के बाद नए पंच नए ज़ोन का उपयोग करते हैं। ऐतिहासिक पंक्तियाँ अपनी संग्रहीत स्थिति रखती हैं जब तक सिस्टम नियम दोबारा गणना न करे।',
    ],
  },
  {
    title: 'Kiosk — डिवाइस स्थिति',
    span: 'full',
    list: [
      [
        docStrong('Paired'),
        ' — Yes का मतलब हाजिरी टैबलेट आपकी संस्था से जुड़ा है। No का मतलब मोबाइल/कियोस्क ऐप से अभी पेयर करना बाकी है।',
      ],
      [
        docStrong('Device ID'),
        ' — पेयर किए गए डिवाइस की यूनिक ID (सपोर्ट / ट्रबलशूटिंग के लिए)।',
      ],
      [
        docStrong('Paired at'),
        ' — वर्तमान डिवाइस कब लिंक हुआ।',
      ],
      'प्रति संस्था एक सक्रिय कियोस्क सामान्य सेटअप है। पूरी पेयरिंग चरण Kiosk गाइड में हैं।',
    ],
    footer: [
      'पूरी पेयरिंग वॉकथ्रू: ',
      docLink('/docs/kiosk', 'कियोस्क सेटअप गाइड'),
      '।',
    ],
  },
  {
    title: 'Help & support',
    span: 'full',
    paragraphs: [
      [
        docLink('/admin/settings/help', 'Settings → Help & support'),
        ' में CodeTeak ईमेल, फ़ोन और ऑफिस विवरण हैं। जब कुछ टूटा हो या ऑनबोर्डिंग मदद चाहिए तब उपयोग करें — कंपनी नियम बदलने के लिए नहीं (वे Attendance / Payment / Kiosk के तहत रहते हैं)।',
      ],
    ],
    list: [
      'प्रोडक्ट हाउ-टू बाएँ मेनू में Get Started के तहत हैं (यह दस्तावेज़)।',
      'लॉगिन या अकाउंट बनाने की समस्या के लिए अपने सिस्टम प्रदाता या CodeTeak सपोर्ट से संपर्क करें।',
    ],
  },
  {
    title: 'त्वरित संदर्भ — हर सेटिंग क्या प्रभावित करती है',
    span: 'full',
    list: [
      'Work start / late grace → Late बैज, Dashboard Today पर Late गिनती, Live Attendance, कैलेंडर।',
      'Work end / early grace → क्लॉक-आउट के बाद Early leave स्थिति।',
      'Minimum clock-out minutes → दूसरा कियोस्क स्कैन सत्र बंद कर सकता है या नहीं।',
      'Timezone → कौन सी कैलेंडर तारीख “आज” है, और ऑटो पे-डे जॉब कब चलते हैं।',
      'Weekly offs + leave quota + calculation mode → कर्मचारी माह कैलेंडर डे टाइप और जनरेटेड सैलरी राशि।',
      'Pay day + auto record → मैन्युअल जनरेट के बिना पिछले महीने की सैलरी Payment में कब दिखे।',
    ],
    footer: [
      'वापस ',
      docLink('/docs/getting-started', 'शुरुआत करें'),
      ' · खोलें ',
      docLink('/admin/settings/attendance', 'Attendance rules'),
      ' · ',
      docLink('/admin/settings/payment', 'Payment rules'),
      ' · ',
      docLink('/admin/settings/cameras', 'Kiosk'),
      '।',
    ],
  },
];

const mlSections = [
  {
    title: 'Settings എന്തൊക്കെ നിയന്ത്രിക്കുന്നു',
    span: 'full',
    paragraphs: [
      [
        'ഇടത് മെനുവിൽ നിന്ന് ',
        docLink('/admin/settings/attendance', 'Settings'),
        ' തുറക്കുക. ഇവിടെയുള്ളതെല്ലാം നിങ്ങളുടെ മുഴുവൻ ഓർഗനൈസേഷനും ബാധകമാണ് — ജോലി സമയം, ലേറ്റ് നിയമങ്ങൾ, പേറോൾ, ലീവ്, ഹാജർ കിയോസ്ക്.',
      ],
      'അഞ്ച് വിഭാഗങ്ങളുണ്ട്:',
    ],
    list: [
      [
        docStrong('Attendance rules'),
        ' — ഷിഫ്റ്റ് മോഡ് (എല്ലാവർക്കും ഒരേത് / ഓരോ ജീവനക്കാരനും), ജോലി സമയം, ലേറ്റ്/എർലി ഗ്രേസ്, ക്ലോക്ക്-ഇന് ശേഷം എത്ര പെട്ടെന്ന് ക്ലോക്ക്-ഔട്ട് ചെയ്യാം.',
      ],
      [
        docStrong('Shifts'),
        ' — ഷിഫ്റ്റ് ടെംപ്ലേറ്റുകൾ (Morning, Night, …) ജോലി സമയവും ബ്രേക്കുകളും. Per-employee മോഡിൽ Mon–Sun ഷെഡ്യൂൾ നൽകുക.',
      ],
      [
        docStrong('Payment rules'),
        ' — ശമ്പള പേ ഡേ, ഓട്ടോ ശമ്പള ജനറേഷൻ, ആഴ്ച അവധി, ലീവ് ക്വോട്ട, മാസ ശമ്പളം എങ്ങനെ കണക്കാക്കുന്നു.',
      ],
      [
        docStrong('Kiosk'),
        ' — ഓർഗനൈസേഷൻ ടൈംസോണും ഫേസ്-സ്കാൻ ടാബ്ലെറ്റ് പെയർ ചെയ്തിട്ടുണ്ടോ എന്നും.',
      ],
      [
        docStrong('Help & support'),
        ' — ഉൽപ്പന്ന സഹായത്തിന് CodeTeak ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ.',
      ],
    ],
    tip: [
      'സെറ്റിംഗ്സ് ശ്രദ്ധയോടെ മാറ്റുക. ജോലി സമയവും ടൈംസോണും ലേറ്റ് മാർക്കിംഗും “ഇന്നത്തെ തീയതിയും” ബാധിക്കുന്നു. Payment rules ശമ്പളം എങ്ങനെ ഉണ്ടാകും എന്നത് ബാധിക്കുന്നു. ഹാജർ സ്റ്റാറ്റസ് ബാധിക്കുന്ന നിയമങ്ങൾ മാറ്റിയ ശേഷം പുതിയ പഞ്ചുകൾ ഉടൻ പുതിയ നിയമങ്ങൾ ഉപയോഗിക്കുന്നു.',
    ],
  },
  {
    title: 'ശുപാർശ ചെയ്യുന്ന സെറ്റപ്പ് ക്രമം',
    span: 'full',
    subtitle: 'കമ്പനി ആദ്യം സെറ്റപ്പ് ചെയ്യുമ്പോൾ ഒരിക്കൽ ചെയ്യുക',
    listStyle: 'steps',
    list: [
      [
        'Settings → Kiosk-ൽ ',
        docStrong('timezone'),
        ' സെറ്റ് ചെയ്യുക (സാധാരണ ഇന്ത്യ — Asia/Kolkata).',
      ],
      [
        'Settings → Attendance rules-ൽ ',
        docStrong('work start / end'),
        ' ഉം ഗ്രേസ് പീരിയഡുകളും സെറ്റ് ചെയ്യുക. same-for-all അല്ലെങ്കിൽ per-employee ഷിഫ്റ്റ് തിരഞ്ഞെടുക്കുക.',
      ],
      [
        'Per-employee ആണെങ്കിൽ ',
        docLink('/admin/settings/shifts', 'Settings → Shifts'),
        '-ൽ ടെംപ്ലേറ്റ് ഉണ്ടാക്കി ജീവനക്കാരന് Mon–Sun നൽകുക.',
      ],
      [
        'Settings → Payment rules-ൽ ',
        docStrong('weekly offs, leave quota, salary calculation, pay day'),
        ' സെറ്റ് ചെയ്യുക.',
      ],
      [
        'ജീവനക്കാരെ ചേർത്ത് ശമ്പളം സെറ്റ് ചെയ്യുക, പിന്നെ കിയോസ്ക് പെയർ ചെയ്ത് മുഖങ്ങൾ രജിസ്റ്റർ ചെയ്യുക.',
      ],
    ],
    footer: [
      'കൂടുതൽ കാണുക: ',
      docLink('/docs/getting-started', 'ആരംഭിക്കുക'),
      ' · ',
      docLink('/docs/kiosk', 'കിയോസ്ക് സെറ്റപ്പ്'),
      ' · ',
      docLink('/docs/salary', 'ശമ്പളം'),
      ' · ',
      docLink('/docs/payroll', 'പേമെന്റ്'),
      '.',
    ],
  },
  {
    title: 'Attendance rules — ജോലി സമയം',
    span: 'full',
    paragraphs: [
      [
        'തുറക്കുക ',
        docLink('/admin/settings/attendance', 'Settings → Attendance rules'),
        '.',
      ],
    ],
    list: [
      [
        docStrong('Start'),
        ' — ജോലി ദിവസത്തിന്റെ ഔദ്യോഗിക തുടക്കം (ഉദാ. 09:00 അല്ലെങ്കിൽ 10:30). start + late grace-ന് ശേഷമുള്ള ആദ്യ ക്ലോക്ക്-ഇൻ Late ആയി മാർക്ക് ചെയ്യപ്പെടും.',
      ],
      [
        docStrong('End'),
        ' — ജോലി ദിവസത്തിന്റെ ഔദ്യോഗിക അവസാനം. end − early grace-ന് മുമ്പ് ക്ലോക്ക്-ഔട്ട് Early leave ആയി മാർക്ക് ചെയ്യാം (ദിവസം ഇതിനകം Late ആയിരുന്നില്ലെങ്കിൽ — late നിലനിൽക്കും).',
      ],
      'രണ്ട് സമയങ്ങളും നിങ്ങളുടെ ഓർഗനൈസേഷൻ ടൈംസോണിൽ വ്യാഖ്യാനിക്കപ്പെടുന്നു (Kiosk-ൽ സെറ്റ്). തെറ്റായ ടൈംസോൺ ആണ് ലേറ്റ് പ്രതീക്ഷയുമായി പൊരുത്തപ്പെടാത്തതിന്റെ ഏറ്റവും സാധാരണ കാരണം.',
      'ഉദാഹരണം: start 10:30, late grace 10 മിനിറ്റ് → 10:40-ന് ശേഷം വരുന്നവർ Late.',
    ],
  },
  {
    title: 'Attendance rules — ഗ്രേസ് പീരിയഡുകൾ',
    span: 'full',
    list: [
      [
        docStrong('Late arrival (minutes)'),
        ' — ജോലി തുടങ്ങിയ ശേഷം ക്ലോക്ക്-ഇൻ ലേറ്റായി കണക്കാക്കുന്നതിന് മുമ്പുള്ള ബഫർ. 0 എന്നാൽ start-ന് ശേഷമുള്ള ഏത് സമയവും ലേറ്റ്. സാധാരണ: 5–15 മിനിറ്റ്. പരമാവധി: 120.',
      ],
      [
        docStrong('Early departure (minutes)'),
        ' — ജോലി അവസാനത്തിന് മുമ്പുള്ള ബഫർ. (end − ഇത്ര മിനിറ്റ്)-ന് മുമ്പ് പോകുന്നത്, വ്യക്തി ഇതിനകം Late അല്ലെങ്കിൽ Early leave ആക്കാം. സാധാരണ: 5–15. പരമാവധി: 120.',
      ],
      'ഗ്രേസ് പഞ്ച് സമയത്ത് സ്റ്റാറ്റസ് തീരുമാനിക്കുന്നതിനെ മാത്രം ബാധിക്കുന്നു. സംഭരിച്ച ക്ലോക്ക്-ഇൻ / ക്ലോക്ക്-ഔട്ട് ടൈംസ്റ്റാമ്പുകൾ മാറ്റുന്നില്ല.',
    ],
  },
  {
    title: 'Attendance rules — കിയോസ്ക് സ്കാൻ',
    span: 'full',
    list: [
      [
        docStrong('Minimum minutes before clock-out'),
        ' — ക്ലോക്ക്-ഇന് ശേഷം അടുത്ത സ്കാൻ ഇത്ര മിനിറ്റ് കഴിയും വരെ ക്ലോക്ക്-ഔട്ട് രേഖപ്പെടുത്തില്ല. ആകസ്മിക ഡബിൾ സ്കാൻ തടയുന്നു. ഡിഫോൾട്ട്: 30. ഉടൻ ക്ലോക്ക്-ഔട്ടിന് 0 സെറ്റ് ചെയ്യുക. പരമാവധി: 480 (8 മണിക്കൂർ).',
      ],
      'ആരെങ്കിലും വളരെ പെട്ടെന്ന് സ്കാൻ ചെയ്താൽ കിയോസ്ക് സന്ദേശം കാണിക്കുകയും ക്ലോക്ക്-ഔട്ട് രേഖപ്പെടുത്താതിരിക്കുകയും ചെയ്യും. സാധുവായ ക്ലോക്ക്-ഔട്ട് വരെ സെഷൻ തുറന്നിരിക്കും.',
      'സ്റ്റാഫിന് ഒരു ദിവസം ഒന്നിലധികം സെഷനുകൾ ഉണ്ടാകാം (ബ്രേക്ക് / തിരിച്ചുവരവ്). മിനിമം വെയ്റ്റ് ഓരോ തുറന്ന സെഷനും ബാധകമാണ്.',
    ],
  },
  {
    title: 'Attendance rules — മാനുവൽ അറ്റൻഡൻസ്',
    span: 'full',
    list: [
      [
        docStrong('Enable manual punch in / out'),
        ' — ഡിഫോൾട്ടായി ഓഫ്. ഓണാക്കിയാൽ Live attendance-ൽ ഇന്നത്തെ In / Out ആക്ഷനുകൾ കാണാം, അഡ്മിന് കിയോസ്ക് ഇാടാതെ പഞ്ച് രേഖപ്പെടുത്താം.',
      ],
      'ഓരോ മാനുവൽ പഞ്ചിനും കൺഫർമേഷനിൽ “manual attendance approved” ടൈപ്പ് ചെയ്യണം.',
      'ഫേസ് സ്കാൻ ലഭ്യമല്ലാത്തപ്പോൾ മാത്രം ഉപയോഗിക്കുക. സാധാരണ അറ്റൻഡൻസിന് കിയോസ്ക് തിരഞ്ഞെടുക്കുക.',
    ],
    tip: [
      'Attendance rules എഡിറ്റ് ചെയ്ത ശേഷം താഴെ എപ്പോഴും ',
      docStrong('Save changes'),
      ' ക്ലിക്ക് ചെയ്യുക. പേജ് വിട്ടാൽ സേവ് ചെയ്യാത്ത മാറ്റങ്ങൾ നഷ്ടപ്പെടും.',
    ],
  },
  {
    title: 'Payment rules — മാസ ശമ്പളം',
    span: 'full',
    paragraphs: [
      [
        'തുറക്കുക ',
        docLink('/admin/settings/payment', 'Settings → Payment rules'),
        '. ജീവനക്കാരുടെ ശമ്പള തുകകൾ ',
        docLink('/admin/salary', 'Salary'),
        ' പേജിൽ സെറ്റ് ചെയ്യുന്നു — ഈ സെറ്റിംഗ്സ് പേറോൾ എപ്പോൾ, എങ്ങനെ ജനറേറ്റ് ചെയ്യപ്പെടും എന്ന് നിയന്ത്രിക്കുന്നു.',
      ],
    ],
    list: [
      [
        docStrong('Automatically record monthly salaries'),
        ' — ON ആയാൽ സർവർ പേ ഡേ രാവിലെ (org ടൈംസോണിൽ) മുൻ മാസത്തിന്റെ ശമ്പള പേമെന്റ് റെക്കോർഡുകൾ സൃഷ്ടിക്കുന്നു. മാസം അവസാനിച്ച ശേഷം Payment പേജിൽ നിന്ന് മാനുവലായും ജനറേറ്റ് ചെയ്യാം. OFF ആയാൽ മാനുവൽ ജനറേഷൻ മാത്രം.',
      ],
      [
        docStrong('Pay day (day of month)'),
        ' — ഓട്ടോ ശമ്പള റെക്കോർഡിംഗ് നടക്കുന്ന കലണ്ടർ ദിവസം (1–28). ഉദാ.: 25 എന്നാൽ 25-ാം തീയതി സിസ്റ്റം മുൻ കലണ്ടർ മാസത്തിന്റെ ശമ്പളം രേഖപ്പെടുത്തും. ചെറിയ മാസങ്ങളിലും ആ ദിവസം ഉണ്ടാകാൻ 28-ൽ പരിമിതപ്പെടുത്തിയിരിക്കുന്നു.',
      ],
    ],
  },
  {
    title: 'Payment rules — ആഴ്ച അവധി',
    span: 'full',
    list: [
      [
        docStrong('Default weekly off days'),
        ' — കമ്പനി-വ്യാപക അവധിക്ക് Mon–Sun ടാപ്പ് ചെയ്യുക (ഉദാ. ഞായർ, അല്ലെങ്കിൽ Sat+Sun). ലീവ്-അവെയർ കലണ്ടറുകളിലും പേറോൾ ഡേ ടൈപ്പുകളിലും ഇവ weekly off ആയി കണക്കാക്കപ്പെടും.',
      ],
      [
        docStrong('Allow per-employee weekly off override'),
        ' — ON ആയാൽ വ്യക്തിഗത ജീവനക്കാരന് വ്യത്യസ്ത അവധി സെറ്റ് ചെയ്യാം (പ്രോഡക്റ്റ് സപ്പോർട്ട് ചെയ്യുന്നിടത്ത്). OFF ആയാൽ എല്ലാവരും കമ്പനി ഡിഫോൾട്ട് ഉപയോഗിക്കും.',
      ],
      'ആഴ്ച അവധി ലീവ് പോലെയല്ല. ലീവ് ജീവനക്കാരന്റെ ഹാജർ കലണ്ടറിൽ പ്രത്യേകം മാർക്ക് ചെയ്യപ്പെടുന്നു.',
    ],
  },
  {
    title: 'Payment rules — ലീവ് പോളിസി',
    span: 'full',
    list: [
      [
        docStrong('Paid leaves per month'),
        ' — ഡിഫോൾട്ടായി ഓരോ ജീവനക്കാരനും മാസത്തിൽ എത്ര പെയ്ഡ് ലീവ് ദിവസങ്ങൾ (0–31). ഇതിനപ്പുറമുള്ള ലീവ് കണക്കുകൂട്ടൽ മോഡും ഡിഡക്ഷൻ മോഡും അനുസരിച്ച് അടയ്ക്കേണ്ട ശമ്പളം കുറയ്ക്കാം.',
      ],
      [
        docStrong('Deduction after quota exceeded — Proportional'),
        ' — ശമ്പളം (payable days ÷ working days) × monthly salary ആയി സ്കെയിൽ ചെയ്യപ്പെടും. മൊത്തം പ്രോറേഷൻ വേണമെങ്കിൽ നല്ലത്.',
      ],
      [
        docStrong('Deduction after quota exceeded — Per day'),
        ' — ഓരോ unpaid / ഓവർ-ക്വോട്ട ദിവസവും ശമ്പളത്തിൽ നിന്ന് ഒരു ദൈനംദിന നിരക്ക് കുറയ്ക്കും. വ്യക്തമായ ദിവസത്തോറും കുറവ് വേണമെങ്കിൽ നല്ലത്.',
      ],
      [
        docStrong('Max days to schedule leave ahead'),
        ' — അഡ്മിനുകൾക്ക് ഭാവിയിലേക്ക് എത്ര ദൂരം ലീവ് ഷെഡ്യൂൾ ചെയ്യാം (1–365 ദിവസം). തെറ്റായി വളരെ മുമ്പേ ലീവ് ബുക്ക് ചെയ്യുന്നത് തടയുന്നു.',
      ],
      [
        docStrong('Block marking leave on weekly off days'),
        ' — ON ആയാൽ ഇതിനകം weekly off ആയ ദിവസത്തിൽ ലീവ് മാർക്ക് ചെയ്യാൻ കഴിയില്ല. OFF ആയാൽ അവധി ദിവസത്തിൽ ലീവ് അനുവദനീയം (സാധാരണ ആവശ്യമില്ല).',
      ],
      [
        docStrong('Allow per-employee leave quota override'),
        ' — ON ആയാൽ വ്യക്തിഗത ജീവനക്കാർക്ക് കമ്പനി ഡിഫോൾട്ടിൽ നിന്ന് വ്യത്യസ്ത പെയ്ഡ്-ലീവ് ക്വോട്ട ഉണ്ടാകാം.',
      ],
    ],
  },
  {
    title: 'Payment rules — ശമ്പള കണക്കുകൂട്ടൽ മോഡുകൾ',
    span: 'full',
    paragraphs: [
      'Salary പേജിലെ മാസ തുക പേറോൾ ജനറേറ്റ് ചെയ്യുമ്പോൾ അടയ്ക്കേണ്ട ശമ്പളമായി എങ്ങനെ മാറുന്നു എന്ന് ഇത് നിയന്ത്രിക്കുന്നു.',
    ],
    list: [
      [
        docStrong('Fixed'),
        ' — പൂർണ്ണ മാസ തുക നൽകുന്നു. ഹാജറും ലീവും ജനറേറ്റ് ചെയ്ത ശമ്പള കണക്ക് മാറ്റുന്നില്ല. ഫിക്സഡ് മാസ പാക്കേജുകൾക്ക് ഏറ്റവും ലളിതം.',
      ],
      [
        docStrong('Attendance-based'),
        ' — ഹാജർ ദിവസങ്ങൾ അനുസരിച്ച് പ്രോറേറ്റ് ചെയ്യുന്നു. “മാസത്തിലെ ജോലി ദിവസങ്ങൾ” എങ്ങനെ എണ്ണണമെന്നും തിരഞ്ഞെടുക്കണം (അടുത്ത വിഭാഗം കാണുക). പ്രവർത്തനക്ഷമമാക്കിയാൽ ഹാഫ്-ഡേ 0.5 ആയി കണക്കാക്കാം.',
      ],
      [
        docStrong('Leave-aware'),
        ' — ആഴ്ച അവധി, പെയ്ഡ് ലീവ് ക്വോട്ട, അധിക-ലീവ് ഡിഡക്ഷനുകൾ ഉപയോഗിക്കുന്നു. weekly offs-ഉം ലീവ് പോളിസിയും ശമ്പളം ബാധിക്കുമ്പോൾ മികച്ചത്. പ്രവർത്തനക്ഷമമാക്കിയാൽ ഹാഫ്-ഡേ 0.5 ആയി കണക്കാക്കാം.',
      ],
      [
        docStrong('Hourly'),
        ' — ജീവനക്കാരന്റെ Salary-പേജ് തുകയെ മണിക്കൂർ നിരക്കായി കണക്കാക്കുന്നു (INR / മണിക്കൂർ). അടയ്ക്കേണ്ടത് ≈ ജോലി ചെയ്ത മണിക്കൂറുകൾ × നിരക്ക്. മനഃപൂർവ്വം മണിക്കൂർ നിരക്ക് സൂക്ഷിക്കുമ്പോൾ മാത്രം ഉപയോഗിക്കുക, മാസ പാക്കേജുകൾക്കല്ല.',
      ],
    ],
  },
  {
    title: 'Payment rules — ജോലി ദിവസങ്ങൾ (attendance-based മാത്രം)',
    span: 'full',
    paragraphs: [
      'കണക്കുകൂട്ടൽ മോഡ് Attendance-based ആയിരിക്കുമ്പോൾ ഈ ഓപ്ഷനുകൾ കാണാം.',
    ],
    list: [
      [
        docStrong('Weekdays only (Mon–Fri)'),
        ' — ഡിനോമിനേറ്റർ മാസത്തിലെ weekdays (പ്രോറേഷന് Sat/Sun ജോലി ദിവസമായി കണക്കാക്കില്ല).',
      ],
      [
        docStrong('All calendar days'),
        ' — ഡിനോമിനേറ്റർ മാസത്തിലെ ഓരോ ദിവസവും (വാരാന്ത്യങ്ങൾ ഉൾപ്പെടെ).',
      ],
      [
        docStrong('Fixed count'),
        ' — നിങ്ങൾ സെറ്റ് ചെയ്യുന്ന സംഖ്യ (ഉദാ. 26). കമ്പനി എപ്പോഴും മാസത്തെ നിശ്ചിത അടയ്ക്കേണ്ട ദിവസങ്ങളായി കണക്കാക്കുമ്പോൾ.',
      ],
      [
        docStrong('Fixed working days'),
        ' — Fixed count തിരഞ്ഞെടുക്കുമ്പോൾ മാത്രം. 1–31 നൽകുക.',
      ],
      [
        docStrong('Count half-days as 0.5 present'),
        ' — attendance-based, leave-aware മോഡുകൾക്ക്. ON ആയാൽ ഹാഫ്-ഡേ ലീവ് / ഹാഫ് ഹാജർ present ദിവസങ്ങളിലേക്ക് 0.5 സംഭാവന ചെയ്യും. OFF ആയാൽ ഹാഫ്-ഡേകൾ അങ്ങനെ വിഭജിക്കപ്പെടില്ല.',
      ],
    ],
    tip: [
      'പോളിസി മാറ്റത്തിന് ശേഷം ശമ്പളം തെറ്റായി തോന്നിയാൽ ആദ്യം കണക്കുകൂട്ടൽ മോഡ് പരിശോധിക്കുക, പിന്നെ weekly offs, ലീവ് ക്വോട്ട. പിന്നെ ',
      docLink('/admin/payroll', 'Payment'),
      ' പേജിൽ കാലയളവ് വീണ്ടും ജനറേറ്റ് ചെയ്യുകയോ അവലോകനം ചെയ്യുകയോ ചെയ്യുക.',
    ],
  },
  {
    title: 'Kiosk — ഓർഗനൈസേഷൻ ടൈംസോൺ',
    span: 'full',
    paragraphs: [
      [
        'തുറക്കുക ',
        docLink('/admin/settings/cameras', 'Settings → Kiosk'),
        '.',
      ],
    ],
    list: [
      [
        docStrong('Timezone'),
        ' — നിങ്ങളുടെ കമ്പനി പ്രവർത്തിക്കുന്ന ക്ലോക്ക്. “ഇന്ന്”, ലേറ്റ്/എർലി തീരുമാനങ്ങൾ, ലീവ് തീയതികൾ, പേ-ഡേ ഓട്ടോ ജനറേഷൻ, ഡാഷ്‌ബോർഡുകൾക്ക് ഉപയോഗിക്കുന്നു.',
      ],
      'ഇന്ത്യയ്ക്ക് Asia/Kolkata തിരഞ്ഞെടുക്കുക. UAE-ക്ക് Asia/Dubai. നിങ്ങൾ യഥാർത്ഥത്തിൽ UTC-യിൽ പ്രവർത്തിക്കുന്നില്ലെങ്കിൽ UTC വിടരുത് — ഇന്ത്യൻ ജോലി സമയത്തോടൊപ്പം (ഉദാ. 10:30) UTC ഉച്ചയ്ക്ക് ശേഷമുള്ള IST വരവുകളെ തെറ്റായി ഓൺ ടൈം ആയി മാർക്ക് ചെയ്യാം.',
      'ടൈംസോൺ മാറ്റിയ ശേഷം പുതിയ പഞ്ചുകൾ പുതിയ സോൺ ഉപയോഗിക്കും. ചരിത്ര റെക്കോർഡുകൾ സിസ്റ്റം നിയമങ്ങൾ വീണ്ടും കണക്കാക്കുന്നില്ലെങ്കിൽ സംഭരിച്ച സ്റ്റാറ്റസ് നിലനിർത്തും.',
    ],
  },
  {
    title: 'Kiosk — ഡിവൈസ് സ്റ്റാറ്റസ്',
    span: 'full',
    list: [
      [
        docStrong('Paired'),
        ' — Yes എന്നാൽ ഹാജർ ടാബ്ലെറ്റ് നിങ്ങളുടെ ഓർഗനൈസേഷനുമായി ലിങ്ക് ചെയ്തിരിക്കുന്നു. No എന്നാൽ മൊബൈൽ/കിയോസ്ക് ആപ്പിൽ നിന്ന് ഇനിയും പെയർ ചെയ്യേണ്ടതുണ്ട്.',
      ],
      [
        docStrong('Device ID'),
        ' — പെയർ ചെയ്ത ഡിവൈസിന്റെ യൂണിക് ID (സപ്പോർട്ട് / ട്രബിൾഷൂട്ടിംഗിന്).',
      ],
      [
        docStrong('Paired at'),
        ' — നിലവിലെ ഡിവൈസ് എപ്പോൾ ലിങ്ക് ചെയ്തു.',
      ],
      'ഓർഗനൈസേഷന് ഒരു സജീവ കിയോസ്ക് ആണ് സാധാരണ സെറ്റപ്പ്. പൂർണ്ണ പെയറിംഗ് ഘട്ടങ്ങൾ Kiosk ഗൈഡിലുണ്ട്.',
    ],
    footer: [
      'പൂർണ്ണ പെയറിംഗ് വാക്ത്രൂ: ',
      docLink('/docs/kiosk', 'കിയോസ്ക് സെറ്റപ്പ് ഗൈഡ്'),
      '.',
    ],
  },
  {
    title: 'Help & support',
    span: 'full',
    paragraphs: [
      [
        docLink('/admin/settings/help', 'Settings → Help & support'),
        ' CodeTeak ഇമെയിൽ, ഫോൺ, ഓഫീസ് വിവരങ്ങൾ ലിസ്റ്റ് ചെയ്യുന്നു. എന്തെങ്കിലും തകർന്നിരിക്കുമ്പോഴോ ഓൺബോർഡിംഗ് സഹായം വേണമെങ്കിലോ ഉപയോഗിക്കുക — കമ്പനി നിയമങ്ങൾ മാറ്റാൻ അല്ല (അവ Attendance / Payment / Kiosk-ൽ തന്നെ തുടരും).',
      ],
    ],
    list: [
      'ഉൽപ്പന്ന ഹൗ-ടൂകൾ ഇടത് മെനുവിലെ Get Started-ൽ ഉണ്ട് (ഈ ഡോക്യുമെന്റേഷൻ).',
      'ലോഗിൻ അല്ലെങ്കിൽ അക്കൗണ്ട് സൃഷ്ടി പ്രശ്നങ്ങൾക്ക് നിങ്ങളുടെ സിസ്റ്റം പ്രൊവൈഡറെയോ CodeTeak സപ്പോർട്ടിനെയോ ബന്ധപ്പെടുക.',
    ],
  },
  {
    title: 'ദ്രുത റഫറൻസ് — ഓരോ സെറ്റിംഗും എന്ത് ബാധിക്കുന്നു',
    span: 'full',
    list: [
      'Work start / late grace → Late ബാഡ്ജ്, Dashboard Today-ലെ Late കൗണ്ട്, Live Attendance, കലണ്ടറുകൾ.',
      'Work end / early grace → ക്ലോക്ക്-ഔട്ടിന് ശേഷമുള്ള Early leave സ്റ്റാറ്റസ്.',
      'Minimum clock-out minutes → രണ്ടാമത്തെ കിയോസ്ക് സ്കാൻ സെഷൻ അടയ്ക്കാമോ എന്നത്.',
      'Timezone → ഏത് കലണ്ടർ തീയതിയാണ് “ഇന്ന്”, ഓട്ടോ പേ-ഡേ ജോബുകൾ എപ്പോൾ ഓടും.',
      'Weekly offs + leave quota + calculation mode → ജീവനക്കാരന്റെ മാസ കലണ്ടർ ഡേ ടൈപ്പുകളും ജനറേറ്റ് ചെയ്ത ശമ്പള തുകകളും.',
      'Pay day + auto record → മാനുവൽ ജനറേറ്റ് ഇല്ലാതെ മുൻ മാസ ശമ്പളം Payment-ൽ എപ്പോൾ കാണാം.',
    ],
    footer: [
      'തിരികെ ',
      docLink('/docs/getting-started', 'ആരംഭിക്കുക'),
      ' · തുറക്കുക ',
      docLink('/admin/settings/attendance', 'Attendance rules'),
      ' · ',
      docLink('/admin/settings/payment', 'Payment rules'),
      ' · ',
      docLink('/admin/settings/cameras', 'Kiosk'),
      '.',
    ],
  },
];

const knSections = [
  {
    title: 'Settings ಏನನ್ನು ನಿಯಂತ್ರಿಸುತ್ತದೆ',
    span: 'full',
    paragraphs: [
      [
        'ಎಡ ಬದಿಯ ಮೆನುವಿನಿಂದ ',
        docLink('/admin/settings/attendance', 'Settings'),
        ' ತೆರೆಯಿರಿ. ಇಲ್ಲಿರುವುದೆಲ್ಲ ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಸಂಸ್ಥೆಗೆ ಅನ್ವಯಿಸುತ್ತದೆ — ಕೆಲಸದ ಸಮಯ, ಲೇಟ್ ನಿಯಮಗಳು, ಪೇರೋಲ್, ರಜೆ ಮತ್ತು ಹಾಜರಾತಿ ಕಿಯೋಸ್ಕ್.',
      ],
      'ಐದು ವಿಭಾಗಗಳಿವೆ:',
    ],
    list: [
      [
        docStrong('Attendance rules'),
        ' — ಶಿಫ್ಟ್ ಮೋಡ್ (ಎಲ್ಲರಿಗೂ ಒಂದೇ / ಪ್ರತಿ ಉದ್ಯೋಗಿ), ಕೆಲಸದ ಸಮಯ, ಲೇಟ್/ಅರ್ಲಿ ಗ್ರೇಸ್, ಮತ್ತು ಕ್ಲಾಕ್-ಇನ್ ನಂತರ ಎಷ್ಟು ಬೇಗ ಕ್ಲಾಕ್-ಔಟ್.',
      ],
      [
        docStrong('Shifts'),
        ' — ಶಿಫ್ಟ್ ಟೆಂಪ್ಲೇಟ್‌ಗಳು (Morning, Night, …) ಕೆಲಸದ ಸಮಯ ಮತ್ತು ಬ್ರೇಕ್‌ಗಳೊಂದಿಗೆ. Per-employee ಮೋಡ್‌ನಲ್ಲಿ Mon–Sun ನಿಗದಿಪಡಿಸಿ.',
      ],
      [
        docStrong('Payment rules'),
        ' — ಸಂಬಳ ಪೇ ಡೇ, ಆಟೋ ಸಂಬಳ ಜನರೇಷನ್, ವಾರದ ರಜೆ, ಲೀವ್ ಕೋಟಾ, ಮತ್ತು ಮಾಸಿಕ ವೇತನ ಹೇಗೆ ಲೆಕ್ಕ ಹಾಕಲಾಗುತ್ತದೆ.',
      ],
      [
        docStrong('Kiosk'),
        ' — ಸಂಸ್ಥೆಯ ಟೈಮ್‌ಝೋನ್ ಮತ್ತು ನಿಮ್ಮ ಫೇಸ್-ಸ್ಕ್ಯಾನ್ ಟ್ಯಾಬ್ಲೆಟ್ ಪೇರ್ ಆಗಿದೆಯೇ.',
      ],
      [
        docStrong('Help & support'),
        ' — ಉತ್ಪನ್ನ ಸಹಾಯಕ್ಕೆ CodeTeak ಸಂಪರ್ಕ ವಿವರಗಳು.',
      ],
    ],
    tip: [
      'ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಜಾಗರೂಕತೆಯಿಂದ ಬದಲಾಯಿಸಿ. ಕೆಲಸದ ಸಮಯ ಮತ್ತು ಟೈಮ್‌ಝೋನ್ ಲೇಟ್ ಮಾರ್ಕಿಂಗ್ ಮತ್ತು “ಇಂದಿನ ದಿನಾಂಕ”ವನ್ನು ಪ್ರಭಾವಿಸುತ್ತವೆ. Payment rules ಸಂಬಳ ಹೇಗೆ ರಚನೆಯಾಗುತ್ತದೆ ಎಂಬುದನ್ನು ಪ್ರಭಾವಿಸುತ್ತವೆ. ಹಾಜರಾತಿ ಸ್ಥಿತಿಯನ್ನು ಬದಲಾಯಿಸುವ ನಿಯಮಗಳನ್ನು ಬದಲಾಯಿಸಿದ ನಂತರ ಹೊಸ ಪಂಚ್‌ಗಳು ತಕ್ಷಣ ಹೊಸ ನಿಯಮಗಳನ್ನು ಬಳಸುತ್ತವೆ.',
    ],
  },
  {
    title: 'ಶಿಫಾರಸು ಮಾಡಿದ ಸೆಟಪ್ ಕ್ರಮ',
    span: 'full',
    subtitle: 'ಕಂಪನಿಯನ್ನು ಮೊದಲು ಸೆಟಪ್ ಮಾಡುವಾಗ ಒಮ್ಮೆ ಮಾಡಿ',
    listStyle: 'steps',
    list: [
      [
        'Settings → Kiosk ಅಡಿಯಲ್ಲಿ ',
        docStrong('timezone'),
        ' ಹೊಂದಿಸಿ (ಸಾಮಾನ್ಯವಾಗಿ ಭಾರತ — Asia/Kolkata).',
      ],
      [
        'Settings → Attendance rules ಅಡಿಯಲ್ಲಿ ',
        docStrong('work start / end'),
        ' ಮತ್ತು ಗ್ರೇಸ್ ಪೀರಿಯಡ್‌ಗಳನ್ನು ಹೊಂದಿಸಿ. same-for-all ಅಥವಾ per-employee ಶಿಫ್ಟ್ ಆಯ್ಕೆಮಾಡಿ.',
      ],
      [
        'Per-employee ಆದರೆ ',
        docLink('/admin/settings/shifts', 'Settings → Shifts'),
        ' ನಲ್ಲಿ ಟೆಂಪ್ಲೇಟ್ ರಚಿಸಿ ಮತ್ತು ಉದ್ಯೋಗಿಗೆ Mon–Sun ನಿಗದಿಪಡಿಸಿ.',
      ],
      [
        'Settings → Payment rules ಅಡಿಯಲ್ಲಿ ',
        docStrong('weekly offs, leave quota, salary calculation, ಮತ್ತು pay day'),
        ' ಹೊಂದಿಸಿ.',
      ],
      [
        'ಉದ್ಯೋಗಿಗಳನ್ನು ಸೇರಿಸಿ ಮತ್ತು ಅವರ ಸಂಬಳ ಹೊಂದಿಸಿ, ನಂತರ ಕಿಯೋಸ್ಕ್ ಪೇರ್ ಮಾಡಿ ಮತ್ತು ಮುಖಗಳನ್ನು ನೋಂದಾಯಿಸಿ.',
      ],
    ],
    footer: [
      'ಇದನ್ನೂ ನೋಡಿ: ',
      docLink('/docs/getting-started', 'ಪ್ರಾರಂಭಿಸಿ'),
      ' · ',
      docLink('/docs/kiosk', 'ಕಿಯೋಸ್ಕ್ ಸೆಟಪ್'),
      ' · ',
      docLink('/docs/salary', 'ಸಂಬಳ'),
      ' · ',
      docLink('/docs/payroll', 'ಪೇಮೆಂಟ್'),
      '.',
    ],
  },
  {
    title: 'Attendance rules — ಕೆಲಸದ ಸಮಯ',
    span: 'full',
    paragraphs: [
      [
        'ತೆರೆಯಿರಿ ',
        docLink('/admin/settings/attendance', 'Settings → Attendance rules'),
        '.',
      ],
    ],
    list: [
      [
        docStrong('Start'),
        ' — ಕೆಲಸದ ದಿನದ ಅಧಿಕೃತ ಪ್ರಾರಂಭ (ಉದಾ. 09:00 ಅಥವಾ 10:30). start + late grace ನಂತರ ಮೊದಲ ಕ್ಲಾಕ್-ಇನ್ Late ಎಂದು ಮಾರ್ಕ್ ಆಗುತ್ತದೆ.',
      ],
      [
        docStrong('End'),
        ' — ಕೆಲಸದ ದಿನದ ಅಧಿಕೃತ ಅಂತ್ಯ. end − early grace ಮೊದಲು ಕ್ಲಾಕ್-ಔಟ್ Early leave ಆಗಬಹುದು (ದಿನ ಈಗಾಗಲೇ Late ಆಗಿದ್ದರೆ ಹೊರತುಪಡಿಸಿ — late ಉಳಿಯುತ್ತದೆ).',
      ],
      'ಎರಡೂ ಸಮಯಗಳನ್ನು ನಿಮ್ಮ ಸಂಸ್ಥೆಯ ಟೈಮ್‌ಝೋನ್‌ನಲ್ಲಿ ಅರ್ಥೈಸಲಾಗುತ್ತದೆ (Kiosk ಅಡಿಯಲ್ಲಿ ಹೊಂದಿಸಿ). ತಪ್ಪಾದ ಟೈಮ್‌ಝೋನ್ ಲೇಟ್ ನಿಮ್ಮ ನಿರೀಕ್ಷೆಗೆ ಹೊಂದಿಕೆಯಾಗದಿರುವ ಅತ್ಯಂತ ಸಾಮಾನ್ಯ ಕಾರಣ.',
      'ಉದಾಹರಣೆ: start 10:30, late grace 10 ನಿಮಿಷ → 10:40 ನಂತರ ಬರುವವರು Late.',
    ],
  },
  {
    title: 'Attendance rules — ಗ್ರೇಸ್ ಪೀರಿಯಡ್‌ಗಳು',
    span: 'full',
    list: [
      [
        docStrong('Late arrival (minutes)'),
        ' — ಕೆಲಸ ಪ್ರಾರಂಭದ ನಂತರ ಕ್ಲಾಕ್-ಇನ್ ಲೇಟ್ ಎಂದು ಎಣಿಸುವ ಮೊದಲು ಬಫರ್. 0 ಎಂದರೆ start ನಂತರ ಯಾವುದೇ ಸಮಯ ಲೇಟ್. ಸಾಮಾನ್ಯ: 5–15 ನಿಮಿಷ. ಗರಿಷ್ಠ: 120.',
      ],
      [
        docStrong('Early departure (minutes)'),
        ' — ಕೆಲಸದ ಅಂತ್ಯದ ಮೊದಲು ಬಫರ್. (end − ಇಷ್ಟು ನಿಮಿಷ) ಗಿಂತ ಮೊದಲು ಹೊರಡುವುದು, ವ್ಯಕ್ತಿ ಈಗಾಗಲೇ Late ಆಗಿಲ್ಲದಿದ್ದರೆ Early leave ಆಗಬಹುದು. ಸಾಮಾನ್ಯ: 5–15. ಗರಿಷ್ಠ: 120.',
      ],
      'ಗ್ರೇಸ್ ಪಂಚ್ ಸಮಯದಲ್ಲಿ ಸ್ಥಿತಿ ನಿರ್ಧರಿಸುವುದನ್ನು ಮಾತ್ರ ಪ್ರಭಾವಿಸುತ್ತದೆ. ಸಂಗ್ರಹಿತ ಕ್ಲಾಕ್-ಇನ್ / ಕ್ಲಾಕ್-ಔಟ್ ಟೈಮ್‌ಸ್ಟ್ಯಾಂಪ್‌ಗಳನ್ನು ಬದಲಾಯಿಸುವುದಿಲ್ಲ.',
    ],
  },
  {
    title: 'Attendance rules — ಕಿಯೋಸ್ಕ್ ಸ್ಕ್ಯಾನ್',
    span: 'full',
    list: [
      [
        docStrong('Minimum minutes before clock-out'),
        ' — ಕ್ಲಾಕ್-ಇನ್ ನಂತರ ಮುಂದಿನ ಸ್ಕ್ಯಾನ್ ಇಷ್ಟು ನಿಮಿಷಗಳು ಕಳೆಯುವವರೆಗೆ ಕ್ಲಾಕ್-ಔಟ್ ದಾಖಲಿಸುವುದಿಲ್ಲ. ಆಕಸ್ಮಿಕ ಡಬಲ್ ಸ್ಕ್ಯಾನ್ ತಡೆಯುತ್ತದೆ. ಡೀಫಾಲ್ಟ್: 30. ತಕ್ಷಣ ಕ್ಲಾಕ್-ಔಟ್‌ಗೆ 0 ಹೊಂದಿಸಿ. ಗರಿಷ್ಠ: 480 (8 ಗಂಟೆ).',
      ],
      'ಯಾರಾದರೂ ಬೇಗ ಸ್ಕ್ಯಾನ್ ಮಾಡಿದರೆ, ಕಿಯೋಸ್ಕ್ ಸಂದೇಶ ತೋರಿಸುತ್ತದೆ ಮತ್ತು ಕ್ಲಾಕ್-ಔಟ್ ದಾಖಲಿಸುವುದಿಲ್ಲ. ಮಾನ್ಯ ಕ್ಲಾಕ್-ಔಟ್ವರೆಗೆ ಅವರ ಸೆಷನ್ ತೆರೆದಿರುತ್ತದೆ.',
      'ಸಿಬ್ಬಂದಿಗೆ ಒಂದು ದಿನದಲ್ಲಿ ಅನೇಕ ಸೆಷನ್‌ಗಳಿರಬಹುದು (ಬ್ರೇಕ್ / ಹಿಂತಿರುಗುವಿಕೆ). ಕನಿಷ್ಠ ನಿರೀಕ್ಷೆ ಪ್ರತಿ ತೆರೆದ ಸೆಷನ್‌ಗೆ ಅನ್ವಯಿಸುತ್ತದೆ.',
    ],
  },
  {
    title: 'Attendance rules — ಮ್ಯಾನುಯಲ್ ಅಟೆಂಡೆನ್ಸ್',
    span: 'full',
    list: [
      [
        docStrong('Enable manual punch in / out'),
        ' — ಡೀಫಾಲ್ಟ್‌ನಲ್ಲಿ ಆಫ್. ಆನ್ ಮಾಡಿದರೆ Live attendance ನಲ್ಲಿ ಇಂದಿನ In / Out ಕ್ರಿಯೆಗಳು ಕಾಣಿಸುತ್ತವೆ, ಆಡ್ಮಿನ್ ಕಿಯೋಸ್ಕ್ ಇಲ್ಲದೆ ಪಂಚ್ ದಾಖಲಿಸಬಹುದು.',
      ],
      'ಪ್ರತಿ ಮ್ಯಾನುಯಲ್ ಪಂಚ್‌ಗೂ ದೃಢೀಕರಣದಲ್ಲಿ “manual attendance approved” ಟೈಪ್ ಮಾಡಬೇಕು.',
      'ಫೇಸ್ ಸ್ಕ್ಯಾನ್ ಲಭ್ಯವಿಲ್ಲದಾಗ ಮಾತ್ರ ಬಳಸಿ. ಸಾಮಾನ್ಯ ಅಟೆಂಡೆನ್ಸ್‌ಗೆ ಕಿಯೋಸ್ಕ್ ಆದ್ಯತೆ ನೀಡಿ.',
    ],
    tip: [
      'Attendance rules ಸಂಪಾದಿಸಿದ ನಂತರ ಕೆಳಗೆ ಯಾವಾಗಲೂ ',
      docStrong('Save changes'),
      ' ಕ್ಲಿಕ್ ಮಾಡಿ. ಪುಟ ಬಿಟ್ಟರೆ ಉಳಿಸದ ಬದಲಾವಣೆಗಳು ಕಳೆದುಹೋಗುತ್ತವೆ.',
    ],
  },
  {
    title: 'Payment rules — ಮಾಸಿಕ ಸಂಬಳ',
    span: 'full',
    paragraphs: [
      [
        'ತೆರೆಯಿರಿ ',
        docLink('/admin/settings/payment', 'Settings → Payment rules'),
        '. ಉದ್ಯೋಗಿ ವೇತನ ಮೊತ್ತಗಳನ್ನು ',
        docLink('/admin/salary', 'Salary'),
        ' ಪುಟದಲ್ಲಿ ಹೊಂದಿಸಲಾಗುತ್ತದೆ — ಈ ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಪೇರೋಲ್ ಯಾವಾಗ ಮತ್ತು ಹೇಗೆ ರಚನೆಯಾಗುತ್ತದೆ ಎಂಬುದನ್ನು ನಿಯಂತ್ರಿಸುತ್ತವೆ.',
      ],
    ],
    list: [
      [
        docStrong('Automatically record monthly salaries'),
        ' — ON ಆದಾಗ ಸರ್ವರ್ ಪೇ ಡೇ ಬೆಳಿಗ್ಗೆ (org ಟೈಮ್‌ಝೋನ್‌ನಲ್ಲಿ) ಹಿಂದಿನ ತಿಂಗಳ ಸಂಬಳ ಪೇಮೆಂಟ್ ದಾಖಲೆಗಳನ್ನು ರಚಿಸುತ್ತದೆ. ತಿಂಗಳು ಮುಗಿದ ನಂತರ Payment ಪುಟದಿಂದ ಕೈಯಿಂದಲೂ ಜನರೇಟ್ ಮಾಡಬಹುದು. OFF ಆದಾಗ ಕೇವಲ ಮ್ಯಾನುವಲ್ ಜನರೇಷನ್ ನಡೆಯುತ್ತದೆ.',
      ],
      [
        docStrong('Pay day (day of month)'),
        ' — ಆಟೋ ಸಂಬಳ ದಾಖಲಾತಿ ನಡೆಯುವ ಕ್ಯಾಲೆಂಡರ್ ದಿನ (1–28). ಉದಾ.: 25 ಎಂದರೆ 25ನೇ ತಾರೀಕು ಸಿಸ್ಟಮ್ ಹಿಂದಿನ ಕ್ಯಾಲೆಂಡರ್ ತಿಂಗಳ ಸಂಬಳವನ್ನು ದಾಖಲಿಸುತ್ತದೆ. ಚಿಕ್ಕ ತಿಂಗಳುಗಳಲ್ಲಿಯೂ ಆ ದಿನ ಇರುವಂತೆ 28ಕ್ಕೆ ಮಿತಿಗೊಳಿಸಲಾಗಿದೆ.',
      ],
    ],
  },
  {
    title: 'Payment rules — ವಾರದ ರಜೆ',
    span: 'full',
    list: [
      [
        docStrong('Default weekly off days'),
        ' — ಕಂಪನಿ-ವ್ಯಾಪಕ ರಜೆಗೆ Mon–Sun ಟ್ಯಾಪ್ ಮಾಡಿ (ಉದಾ. ಭಾನುವಾರ, ಅಥವಾ Sat+Sun). ಈ ದಿನಗಳು ಲೀವ್-ಅವೇರ್ ಕ್ಯಾಲೆಂಡರ್‌ಗಳು ಮತ್ತು ಪೇರೋಲ್ ಡೇ ಟೈಪ್‌ಗಳಲ್ಲಿ weekly off ಎಂದು ಎಣಿಸಲಾಗುತ್ತದೆ.',
      ],
      [
        docStrong('Allow per-employee weekly off override'),
        ' — ON ಆದಾಗ ವೈಯಕ್ತಿಕ ಉದ್ಯೋಗಿಗೆ ವಿಭಿನ್ನ ರಜೆ ಹೊಂದಿಸಬಹುದು (ಉತ್ಪನ್ನ ಬೆಂಬಲಿಸುವಲ್ಲಿ). OFF ಆದಾಗ ಎಲ್ಲರೂ ಕಂಪನಿ ಡೀಫಾಲ್ಟ್ ಬಳಸುತ್ತಾರೆ.',
      ],
      'ವಾರದ ರಜೆ ಲೀವ್‌ಗೆ ಸಮಾನವಲ್ಲ. ಲೀವ್ ಉದ್ಯೋಗಿ ಹಾಜರಾತಿ ಕ್ಯಾಲೆಂಡರ್‌ನಲ್ಲಿ ಪ್ರತ್ಯೇಕವಾಗಿ ಮಾರ್ಕ್ ಆಗುತ್ತದೆ.',
    ],
  },
  {
    title: 'Payment rules — ಲೀವ್ ನೀತಿ',
    span: 'full',
    list: [
      [
        docStrong('Paid leaves per month'),
        ' — ಡೀಫಾಲ್ಟ್‌ನಂತೆ ಪ್ರತಿ ಉದ್ಯೋಗಿಗೆ ತಿಂಗಳಿಗೆ ಎಷ್ಟು ಪೇಡ್ ಲೀವ್ ದಿನಗಳು (0–31). ಇದಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ಲೀವ್ ಲೆಕ್ಕಾಚಾರ ಮೋಡ್ ಮತ್ತು ಕಡಿತ ಮೋಡ್ ಅನುಸಾರ ಪಾವತಿಸಬೇಕಾದ ಸಂಬಳವನ್ನು ಕಡಿಮೆ ಮಾಡಬಹುದು.',
      ],
      [
        docStrong('Deduction after quota exceeded — Proportional'),
        ' — ವೇತನವನ್ನು (payable days ÷ working days) × monthly salary ಆಗಿ ಸ್ಕೇಲ್ ಮಾಡಲಾಗುತ್ತದೆ. ಒಟ್ಟು ಪ್ರೊರೇಷನ್ ಬೇಕಾದಾಗ ಉತ್ತಮ.',
      ],
      [
        docStrong('Deduction after quota exceeded — Per day'),
        ' — ಪ್ರತಿ unpaid / ಓವರ್-ಕೋಟಾ ದಿನ ಸಂಬಳದಿಂದ ಒಂದು ದೈನಂದಿನ ದರ ಕಡಿತ ಮಾಡುತ್ತದೆ. ಸ್ಪಷ್ಟ ಪ್ರತಿ-ದಿನ ಕಡಿತ ಬೇಕಾದಾಗ ಉತ್ತಮ.',
      ],
      [
        docStrong('Max days to schedule leave ahead'),
        ' — ಅಡ್ಮಿನ್‌ಗಳು ಭವಿಷ್ಯಕ್ಕೆ ಎಷ್ಟು ದೂರ ಲೀವ್ ಶೆಡ್ಯೂಲ್ ಮಾಡಬಹುದು (1–365 ದಿನ). ತಪ್ಪಾಗಿ ತುಂಬಾ ಮುಂದಕ್ಕೆ ಲೀವ್ ಬುಕ್ ಆಗುವುದನ್ನು ತಡೆಯುತ್ತದೆ.',
      ],
      [
        docStrong('Block marking leave on weekly off days'),
        ' — ON ಆದಾಗ ಈಗಾಗಲೇ weekly off ಆದ ದಿನದಲ್ಲಿ ಲೀವ್ ಮಾರ್ಕ್ ಮಾಡಲಾಗುವುದಿಲ್ಲ. OFF ಆದಾಗ ರಜೆಯ ದಿನದಲ್ಲಿ ಲೀವ್ ಅನುಮತಿ (ಸಾಮಾನ್ಯವಾಗಿ ಅಗತ್ಯವಿಲ್ಲ).',
      ],
      [
        docStrong('Allow per-employee leave quota override'),
        ' — ON ಆದಾಗ ವೈಯಕ್ತಿಕ ಉದ್ಯೋಗಿಗಳು ಕಂಪನಿ ಡೀಫಾಲ್ಟ್‌ಗಿಂತ ವಿಭಿನ್ನ ಪೇಡ್-ಲೀವ್ ಕೋಟಾ ಹೊಂದಬಹುದು.',
      ],
    ],
  },
  {
    title: 'Payment rules — ಸಂಬಳ ಲೆಕ್ಕಾಚಾರ ಮೋಡ್‌ಗಳು',
    span: 'full',
    paragraphs: [
      'Salary ಪುಟದ ಮಾಸಿಕ ಮೊತ್ತವನ್ನು ಪೇರೋಲ್ ಜನರೇಟ್ ಆದಾಗ ಪಾವತಿಸಬೇಕಾದ ಸಂಬಳವಾಗಿ ಹೇಗೆ ಪರಿವರ್ತಿಸಲಾಗುತ್ತದೆ ಎಂಬುದನ್ನು ಇದು ನಿಯಂತ್ರಿಸುತ್ತದೆ.',
    ],
    list: [
      [
        docStrong('Fixed'),
        ' — ಪೂರ್ಣ ಮಾಸಿಕ ಮೊತ್ತವನ್ನು ಪಾವತಿಸುತ್ತದೆ. ಹಾಜರಾತಿ ಮತ್ತು ಲೀವ್ ಜನರೇಟ್ ಆದ ಸಂಬಳ ಅಂಕಿಯನ್ನು ಬದಲಾಯಿಸುವುದಿಲ್ಲ. ಫಿಕ್ಸ್ಡ್ ಮಾಸಿಕ ಪ್ಯಾಕೇಜ್‌ಗಳಿಗೆ ಸರಳತಮ ಆಯ್ಕೆ.',
      ],
      [
        docStrong('Attendance-based'),
        ' — ಹಾಜರಾದ ದಿನಗಳ ಪ್ರಕಾರ ಪ್ರೊರೇಟ್ ಮಾಡುತ್ತದೆ. “ತಿಂಗಳಲ್ಲಿ ಕೆಲಸದ ದಿನಗಳು” ಹೇಗೆ ಎಣಿಸಬೇಕು ಎಂಬುದನ್ನೂ ಆಯ್ಕೆ ಮಾಡಬೇಕು (ಮುಂದಿನ ವಿಭಾಗ ನೋಡಿ). ಸಕ್ರಿಯಗೊಳಿಸಿದರೆ ಹಾಫ್-ಡೇ 0.5 ಎಂದು ಎಣಿಸಬಹುದು.',
      ],
      [
        docStrong('Leave-aware'),
        ' — ವಾರದ ರಜೆ, ಪೇಡ್ ಲೀವ್ ಕೋಟಾ ಮತ್ತು ಹೆಚ್ಚುವರಿ-ಲೀವ್ ಕಡಿತಗಳನ್ನು ಬಳಸುತ್ತದೆ. weekly offs ಮತ್ತು ಲೀವ್ ನೀತಿ ವೇತನವನ್ನು ಪ್ರಭಾವಿಸಬೇಕಾದಾಗ ಉತ್ತಮ. ಸಕ್ರಿಯಗೊಳಿಸಿದರೆ ಹಾಫ್-ಡೇ 0.5 ಎಂದು ಎಣಿಸಬಹುದು.',
      ],
      [
        docStrong('Hourly'),
        ' — ಉದ್ಯೋಗಿಯ Salary-ಪುಟ ಮೊತ್ತವನ್ನು ಗಂಟೆಯ ದರವೆಂದು ಪರಿಗಣಿಸುತ್ತದೆ (INR ಪ್ರತಿ ಗಂಟೆ). ಪಾವತಿಸಬೇಕಾದುದು ≈ ಕೆಲಸದ ಗಂಟೆಗಳು × ದರ. ಉದ್ದೇಶಪೂರ್ವಕವಾಗಿ ಗಂಟೆಯ ದರಗಳನ್ನು ಇಟ್ಟಾಗ ಮಾತ್ರ ಬಳಸಿ, ಮಾಸಿಕ ಪ್ಯಾಕೇಜ್‌ಗಳಿಗಲ್ಲ.',
      ],
    ],
  },
  {
    title: 'Payment rules — ಕೆಲಸದ ದಿನಗಳು (attendance-based ಮಾತ್ರ)',
    span: 'full',
    paragraphs: [
      'ಲೆಕ್ಕಾಚಾರ ಮೋಡ್ Attendance-based ಆದಾಗ ಈ ಆಯ್ಕೆಗಳು ಕಾಣಿಸುತ್ತವೆ.',
    ],
    list: [
      [
        docStrong('Weekdays only (Mon–Fri)'),
        ' — ಛೇದ (denominator) ತಿಂಗಳ weekdays (ಪ್ರೊರೇಷನ್‌ಗೆ Sat/Sun ಕೆಲಸದ ದಿನಗಳಾಗಿ ಎಣಿಸುವುದಿಲ್ಲ).',
      ],
      [
        docStrong('All calendar days'),
        ' — ಛೇದ ತಿಂಗಳ ಪ್ರತಿ ದಿನ (ವಾರಾಂತ್ಯಗಳು ಸೇರಿದಂತೆ).',
      ],
      [
        docStrong('Fixed count'),
        ' — ನೀವು ಹೊಂದಿಸುವ ಸಂಖ್ಯೆ (ಉದಾ. 26). ಕಂಪನಿ ಯಾವಾಗಲೂ ತಿಂಗಳನ್ನು ನಿಗದಿತ ಪಾವತಿಸಬೇಕಾದ ದಿನಗಳಾಗಿ ಪರಿಗಣಿಸುವಾಗ.',
      ],
      [
        docStrong('Fixed working days'),
        ' — Fixed count ಆಯ್ಕೆ ಮಾಡಿದಾಗ ಮಾತ್ರ. 1–31 ನಮೂದಿಸಿ.',
      ],
      [
        docStrong('Count half-days as 0.5 present'),
        ' — attendance-based ಮತ್ತು leave-aware ಮೋಡ್‌ಗಳಿಗೆ. ON ಆದಾಗ ಹಾಫ್-ಡೇ ಲೀವ್ / ಹಾಫ್ ಹಾಜರಾತಿ present ದಿನಗಳಿಗೆ 0.5 ಕೊಡುಗೆ ನೀಡುತ್ತದೆ. OFF ಆದಾಗ ಹಾಫ್-ಡೇಗಳನ್ನು ಹಾಗೆ ವಿಭಜಿಸಲಾಗುವುದಿಲ್ಲ.',
      ],
    ],
    tip: [
      'ನೀತಿ ಬದಲಾವಣೆಯ ನಂತರ ಸಂಬಳ ತಪ್ಪಾಗಿ ಕಂಡರೆ ಮೊದಲು ಲೆಕ್ಕಾಚಾರ ಮೋಡ್ ಪರಿಶೀಲಿಸಿ, ನಂತರ weekly offs ಮತ್ತು ಲೀವ್ ಕೋಟಾ. ನಂತರ ',
      docLink('/admin/payroll', 'Payment'),
      ' ಪುಟದಲ್ಲಿ ಅವಧಿಯನ್ನು ಮರು-ಜನರೇಟ್ ಅಥವಾ ಪರಿಶೀಲಿಸಿ.',
    ],
  },
  {
    title: 'Kiosk — ಸಂಸ್ಥೆಯ ಟೈಮ್‌ಝೋನ್',
    span: 'full',
    paragraphs: [
      [
        'ತೆರೆಯಿರಿ ',
        docLink('/admin/settings/cameras', 'Settings → Kiosk'),
        '.',
      ],
    ],
    list: [
      [
        docStrong('Timezone'),
        ' — ನಿಮ್ಮ ಕಂಪನಿ ಚಲಿಸುವ ಗಡಿಯಾರ. “ಇಂದು”, ಲೇಟ್/ಅರ್ಲಿ ನಿರ್ಧಾರಗಳು, ಲೀವ್ ದಿನಾಂಕಗಳು, ಪೇ-ಡೇ ಆಟೋ ಜನರೇಷನ್ ಮತ್ತು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗಳಿಗೆ ಬಳಸಲಾಗುತ್ತದೆ.',
      ],
      'ಭಾರತಕ್ಕೆ Asia/Kolkata ಆಯ್ಕೆ ಮಾಡಿ. UAE ಗೆ Asia/Dubai. ನೀವು ನಿಜವಾಗಿಯೂ UTC ನಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸದಿದ್ದರೆ UTC ಬಿಡಬೇಡಿ — ಭಾರತೀಯ ಕೆಲಸದ ಸಮಯದೊಂದಿಗೆ (ಉದಾ. 10:30) UTC ಮಧ್ಯಾಹ್ನದ IST ಆಗಮನಗಳನ್ನು ತಪ್ಪಾಗಿ ಆನ್ ಟೈಮ್ ಎಂದು ಮಾರ್ಕ್ ಮಾಡಬಹುದು.',
      'ಟೈಮ್‌ಝೋನ್ ಬದಲಾಯಿಸಿದ ನಂತರ ಹೊಸ ಪಂಚ್‌ಗಳು ಹೊಸ ಝೋನ್ ಬಳಸುತ್ತವೆ. ಐತಿಹಾಸಿಕ ಸಾಲುಗಳು ಸಿಸ್ಟಮ್ ನಿಯಮಗಳನ್ನು ಮರುಲೆಕ್ಕ ಹಾಕದ ಹೊರತು ತಮ್ಮ ಸಂಗ್ರಹಿತ ಸ್ಥಿತಿಯನ್ನು ಉಳಿಸಿಕೊಳ್ಳುತ್ತವೆ.',
    ],
  },
  {
    title: 'Kiosk — ಸಾಧನ ಸ್ಥಿತಿ',
    span: 'full',
    list: [
      [
        docStrong('Paired'),
        ' — Yes ಎಂದರೆ ಹಾಜರಾತಿ ಟ್ಯಾಬ್ಲೆಟ್ ನಿಮ್ಮ ಸಂಸ್ಥೆಗೆ ಲಿಂಕ್ ಆಗಿದೆ. No ಎಂದರೆ ಮೊಬೈಲ್/ಕಿಯೋಸ್ಕ್ ಆ್ಯಪ್‌ನಿಂದ ಇನ್ನೂ ಪೇರ್ ಮಾಡಬೇಕು.',
      ],
      [
        docStrong('Device ID'),
        ' — ಪೇರ್ ಮಾಡಿದ ಸಾಧನದ ವಿಶಿಷ್ಟ ID (ಸಪೋರ್ಟ್ / ಟ್ರಬಲ್‌ಶೂಟಿಂಗ್‌ಗೆ).',
      ],
      [
        docStrong('Paired at'),
        ' — ಪ್ರಸ್ತುತ ಸಾಧನ ಯಾವಾಗ ಲಿಂಕ್ ಆಯಿತು.',
      ],
      'ಪ್ರತಿ ಸಂಸ್ಥೆಗೆ ಒಂದು ಸಕ್ರಿಯ ಕಿಯೋಸ್ಕ್ ಸಾಮಾನ್ಯ ಸೆಟಪ್. ಪೂರ್ಣ ಪೇರಿಂಗ್ ಹಂತಗಳು Kiosk ಮಾರ್ಗದರ್ಶಿಯಲ್ಲಿವೆ.',
    ],
    footer: [
      'ಪೂರ್ಣ ಪೇರಿಂಗ್ ವಾಕ್‌ತ್ರೂ: ',
      docLink('/docs/kiosk', 'ಕಿಯೋಸ್ಕ್ ಸೆಟಪ್ ಮಾರ್ಗದರ್ಶಿ'),
      '.',
    ],
  },
  {
    title: 'Help & support',
    span: 'full',
    paragraphs: [
      [
        docLink('/admin/settings/help', 'Settings → Help & support'),
        ' CodeTeak ಇಮೇಲ್, ಫೋನ್ ಮತ್ತು ಕಚೇರಿ ವಿವರಗಳನ್ನು ಪಟ್ಟಿ ಮಾಡುತ್ತದೆ. ಏನಾದರೂ ಮುರಿದಿದ್ದರೆ ಅಥವಾ ಆನ್‌ಬೋರ್ಡಿಂಗ್ ಸಹಾಯ ಬೇಕಾದಾಗ ಬಳಸಿ — ಕಂಪನಿ ನಿಯಮಗಳನ್ನು ಬದಲಾಯಿಸಲು ಅಲ್ಲ (ಅವು Attendance / Payment / Kiosk ಅಡಿಯಲ್ಲೇ ಉಳಿಯುತ್ತವೆ).',
      ],
    ],
    list: [
      'ಉತ್ಪನ್ನ ಹೌ-ಟೂಗಳು ಎಡ ಮೆನುವಿನ Get Started ಅಡಿಯಲ್ಲಿವೆ (ಈ ಡಾಕ್ಯುಮೆಂಟೇಶನ್).',
      'ಲಾಗಿನ್ ಅಥವಾ ಖಾತೆ ರಚನೆ ಸಮಸ್ಯೆಗಳಿಗೆ ನಿಮ್ಮ ಸಿಸ್ಟಮ್ ಪ್ರೊವೈಡರ್ ಅಥವಾ CodeTeak ಸಪೋರ್ಟ್ ಅನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    ],
  },
  {
    title: 'ತ್ವರಿತ ಉಲ್ಲೇಖ — ಪ್ರತಿ ಸೆಟ್ಟಿಂಗ್ ಏನನ್ನು ಪ್ರಭಾವಿಸುತ್ತದೆ',
    span: 'full',
    list: [
      'Work start / late grace → Late ಬ್ಯಾಡ್ಜ್, Dashboard Today ನಲ್ಲಿ Late ಎಣಿಕೆ, Live Attendance, ಕ್ಯಾಲೆಂಡರ್‌ಗಳು.',
      'Work end / early grace → ಕ್ಲಾಕ್-ಔಟ್ ನಂತರ Early leave ಸ್ಥಿತಿ.',
      'Minimum clock-out minutes → ಎರಡನೇ ಕಿಯೋಸ್ಕ್ ಸ್ಕ್ಯಾನ್ ಸೆಷನ್ ಮುಚ್ಚಬಹುದೇ.',
      'Timezone → ಯಾವ ಕ್ಯಾಲೆಂಡರ್ ದಿನಾಂಕ “ಇಂದು”, ಮತ್ತು ಆಟೋ ಪೇ-ಡೇ ಜಾಬ್‌ಗಳು ಯಾವಾಗ ಓಡುತ್ತವೆ.',
      'Weekly offs + leave quota + calculation mode → ಉದ್ಯೋಗಿ ತಿಂಗಳ ಕ್ಯಾಲೆಂಡರ್ ಡೇ ಟೈಪ್‌ಗಳು ಮತ್ತು ಜನರೇಟ್ ಆದ ಸಂಬಳ ಮೊತ್ತಗಳು.',
      'Pay day + auto record → ಮ್ಯಾನುವಲ್ ಜನರೇಟ್ ಇಲ್ಲದೆ ಹಿಂದಿನ ತಿಂಗಳ ಸಂಬಳ Payment ನಲ್ಲಿ ಯಾವಾಗ ಕಾಣಿಸುತ್ತದೆ.',
    ],
    footer: [
      'ಹಿಂದಕ್ಕೆ ',
      docLink('/docs/getting-started', 'ಪ್ರಾರಂಭಿಸಿ'),
      ' · ತೆರೆಯಿರಿ ',
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
      'Attendance, Payment, Kiosk और Help के हर विकल्प की विस्तृत व्याख्या, और उन्हें कैसे कॉन्फ़िगर करें।',
    sections: hiSections,
  },
  ml: {
    pageTitle: 'സെറ്റിംഗ്സ് — പൂർണ്ണ ഗൈഡ്',
    pageSubtitle:
      'Attendance, Payment, Kiosk, Help ഓപ്ഷനുകളുടെ വിശദ വിവരണം, അവ എങ്ങനെ ക്രമീകരിക്കാം.',
    sections: mlSections,
  },
  kn: {
    pageTitle: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು — ಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿ',
    pageSubtitle:
      'Attendance, Payment, Kiosk ಮತ್ತು Help ಪ್ರತಿ ಆಯ್ಕೆಯ ವಿವರ, ಮತ್ತು ಅವುಗಳನ್ನು ಹೇಗೆ ಹೊಂದಿಸುವುದು.',
    sections: knSections,
  },
};
