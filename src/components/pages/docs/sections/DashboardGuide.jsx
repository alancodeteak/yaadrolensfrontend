import DocsSection, {
  DocLink,
  DocList,
  DocParagraph,
  DocPageHeader,
  DocContentGrid,
} from '../DocsSection';

const DashboardGuide = () => (
  <div className="space-y-6">
    <DocPageHeader
      title="Dashboard"
      subtitle="Your home screen — see today’s numbers at a glance."
    />

    <DocContentGrid>
      <DocsSection title="What you will see">
        <DocParagraph>
          The <DocLink to="/admin/dashboard">Dashboard</DocLink> gives you a quick picture of your
          team, today’s attendance, and anything that needs your attention.
        </DocParagraph>
      </DocsSection>

      <DocsSection title="Top cards" subtitle="Four summary boxes">
        <DocList
          items={[
            'Workforce — how many staff you have, new joiners this month, and face registration status.',
            'Today — who is present, absent, or late right now. Tap any number to see more detail.',
            'Actions — staff who still need face registration, missing profile details, or kiosk setup.',
            'Holidays — public holidays in India for today and upcoming dates (for your information).',
          ]}
        />
      </DocsSection>

      <DocsSection title="Calendar and activity">
        <DocList
          items={[
            'This month — a calendar showing each day. Green means everyone was present. Orange means some people were absent.',
            'Activity — circles showing present rate, monthly attendance, and on-time arrival.',
            'Recent activity — the latest clock-in and clock-out times for today.',
          ]}
        />
        <DocParagraph>
          If you are new, you may see sample numbers until real attendance data comes in from the
          kiosk.
        </DocParagraph>
      </DocsSection>

      <DocsSection title="Where to go next">
        <DocList
          items={[
            <>Check who is in today — <DocLink to="/docs/attendance">Live Attendance</DocLink></>,
            <>Manage staff — <DocLink to="/docs/employees">Employees</DocLink></>,
            <>View monthly trends — <DocLink to="/docs/analytics">Analytics</DocLink></>,
          ]}
        />
      </DocsSection>
    </DocContentGrid>
  </div>
);

export default DashboardGuide;
