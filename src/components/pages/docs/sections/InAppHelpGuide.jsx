import DocsSection, {
  DocLink,
  DocList,
  DocParagraph,
  DocPageHeader,
  DocContentGrid,
} from '../DocsSection';

const InAppHelpGuide = () => (
  <div className="space-y-6">
    <DocPageHeader
      title="Page tours"
      subtitle="Built-in walkthroughs on each main page — no need to read everything here."
    />

    <DocContentGrid>
      <DocsSection title="Two ways to get help on a page">
        <DocParagraph>
          On most pages you will see <strong className="font-medium text-gray-900">Tutorial</strong>{' '}
          and <strong className="font-medium text-gray-900">Info</strong> buttons at the top
          right. Both explain the page without leaving the app.
        </DocParagraph>
      </DocsSection>

      <DocsSection title="Tutorial button">
        <DocList
          items={[
            'Walks you through the page one step at a time.',
            'Highlights each section with Next, Back, and Skip buttons.',
            'Great for your first visit to a page.',
          ]}
        />
      </DocsSection>

      <DocsSection title="Info button">
        <DocList
          items={[
            'Shows labels on all sections at once.',
            'Good when you want a quick map of the whole page.',
            'On smaller screens, the list scrolls so you can read everything.',
          ]}
        />
      </DocsSection>

      <DocsSection title="Available on these pages">
        <DocList
          items={[
            <>Dashboard — <DocLink to="/admin/dashboard">open</DocLink></>,
            <>Employees — <DocLink to="/admin/employees">open</DocLink></>,
            <>Live Attendance — <DocLink to="/admin/attendance">open</DocLink></>,
            <>Analytics — <DocLink to="/admin/attendance-dashboard">open</DocLink></>,
            <>Settings — <DocLink to="/admin/settings">open</DocLink></>,
          ]}
        />
      </DocsSection>

      <DocsSection title="Good to know">
        <DocParagraph>
          You can only use Tutorial or Info at a time — not both together. For written help, use
          this guide anytime from the Get Started menu.
        </DocParagraph>
      </DocsSection>
    </DocContentGrid>
  </div>
);

export default InAppHelpGuide;
