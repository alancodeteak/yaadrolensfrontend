import DocsSection, {
  DocLink,
  DocList,
  DocParagraph,
  DocPageHeader,
  DocContentGrid,
} from '../DocsSection';

const LiveAttendanceGuide = () => (
  <div className="space-y-6">
    <DocPageHeader
      title="Live Attendance"
      subtitle="See who is in, who is late, and who has left — for any day."
    />

    <DocContentGrid>
      <DocsSection title="What this page is for">
        <DocParagraph>
          <DocLink to="/admin/attendance">Live Attendance</DocLink> shows real-time clock-in and
          clock-out activity. Use it during the day to see who is on site.
        </DocParagraph>
      </DocsSection>

      <DocsSection title="How to use it">
        <DocList
          items={[
            'Pick a date — today or any past day.',
            'Search for someone by name or employee code.',
            'Filter by status: Present, Late, Absent, or Clocked Out.',
            'Click a person’s row to open their profile.',
            'Press Refresh to get the latest updates.',
          ]}
        />
      </DocsSection>

      <DocsSection title="What each part shows">
        <DocList
          items={[
            'Live activity — recent clock-in and clock-out events.',
            'Summary numbers — present, absent, late, and total staff count.',
            'Hourly chart — when people arrived during the day.',
            'Staff table — each person’s status and clock-in time.',
          ]}
        />
      </DocsSection>

      <DocsSection title="Good to know">
        <DocParagraph>
          If no one has used the kiosk yet, you may see sample data as a preview. Real records
          appear once staff start clocking in.
        </DocParagraph>
        <DocParagraph>
          Also see: <DocLink to="/docs/dashboard">Dashboard</DocLink> ·{' '}
          <DocLink to="/docs/analytics">Analytics</DocLink>
        </DocParagraph>
      </DocsSection>
    </DocContentGrid>
  </div>
);

export default LiveAttendanceGuide;
