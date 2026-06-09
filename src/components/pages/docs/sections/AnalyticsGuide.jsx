import DocsSection, {
  DocLink,
  DocList,
  DocParagraph,
  DocPageHeader,
  DocContentGrid,
} from '../DocsSection';

const AnalyticsGuide = () => (
  <div className="space-y-6">
    <DocPageHeader
      title="Analytics"
      subtitle="Look at attendance trends across the whole month."
    />

    <DocContentGrid>
      <DocsSection title="What this page is for">
        <DocParagraph>
          <DocLink to="/admin/attendance-dashboard">Analytics</DocLink> helps you understand
          patterns — who is often late, who works the most hours, and how attendance looks day by
          day.
        </DocParagraph>
      </DocsSection>

      <DocsSection title="How to use it">
        <DocList
          items={[
            'Use the month picker to move between months.',
            'Click a day to see that day’s numbers along with the month total.',
            'On the calendar, green days mean full attendance. Orange means some absences.',
            'Scroll the daily chart if the month is long.',
            'Check the bar charts for most late arrivals and most hours worked.',
            'Use the table at the bottom for each employee’s monthly summary.',
          ]}
        />
      </DocsSection>

      <DocsSection title="What the numbers mean">
        <DocList
          items={[
            'Average attendance — how often people were present compared to working days.',
            'Punctuality — how many clock-ins were on time.',
            'Total hours — combined hours logged in the month.',
            'Total late — how many late arrivals in the month.',
          ]}
        />
      </DocsSection>

      <DocsSection title="Good to know">
        <DocParagraph>
          Sample charts may show when your company is just getting started. They update
          automatically as the kiosk records real attendance.
        </DocParagraph>
        <DocParagraph>
          For today’s view, go to <DocLink to="/docs/attendance">Live Attendance</DocLink>.
        </DocParagraph>
      </DocsSection>
    </DocContentGrid>
  </div>
);

export default AnalyticsGuide;
