import DocsSection, {
  DocLink,
  DocList,
  DocParagraph,
  DocPageHeader,
  DocContentGrid,
} from '../DocsSection';

const EmployeesGuide = () => (
  <div className="space-y-6">
    <DocPageHeader
      title="Employees"
      subtitle="Add and manage your team before they use the kiosk."
    />

    <DocContentGrid>
      <DocsSection title="What this page is for">
        <DocParagraph>
          The <DocLink to="/admin/employees">Employees</DocLink> page is your staff list. Add new
          people here first, then register their face on the kiosk.
        </DocParagraph>
      </DocsSection>

      <DocsSection title="Finding people">
        <DocList
          items={[
            'Search by name or employee code.',
            'Filter by department or active / inactive status.',
            'Sort the list the way you prefer.',
            'Click any row to open that person’s full profile.',
          ]}
        />
      </DocsSection>

      <DocsSection title="Adding or editing staff">
        <DocList
          items={[
            'Name is required. Department, job title, phone, and salary are optional.',
            'You can upload a profile photo (JPEG, PNG, or WebP, up to 2 MB).',
            'Mark someone inactive when they leave. You can turn them active again later.',
            '“Face enrolled” means they have registered on the kiosk and can clock in.',
          ]}
        />
      </DocsSection>

      <DocsSection title="Employee profile page">
        <DocList
          items={[
            'Personal — contact and job details.',
            'Attendance — history view (being improved).',
            'Training — face registration status.',
            'You can also see today’s summary and monthly report for each person.',
          ]}
        />
      </DocsSection>

      <DocsSection title="Tips">
        <DocList
          items={[
            'Always add employees here before registering them on the kiosk.',
            'Profile photos are for display only — face scanning is separate.',
            'Departments are set up by your system provider and appear in the dropdown.',
          ]}
        />
        <DocParagraph>
          Ready for the kiosk? See <DocLink to="/docs/kiosk">Kiosk setup</DocLink>.
        </DocParagraph>
      </DocsSection>
    </DocContentGrid>
  </div>
);

export default EmployeesGuide;
