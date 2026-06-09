import DocsSection, {
  DocLink,
  DocList,
  DocParagraph,
  DocPageHeader,
  DocContentGrid,
} from '../DocsSection';

const SettingsGuide = () => (
  <div className="space-y-6">
    <DocPageHeader
      title="Settings"
      subtitle="Set your work rules, check the kiosk, and get support."
    />

    <DocContentGrid>
      <DocsSection title="What you can change">
        <DocParagraph>
          Open <DocLink to="/admin/settings/attendance">Settings</DocLink> from the menu. There
          are three tabs: Attendance rules, Kiosk, and Help.
        </DocParagraph>
      </DocsSection>

      <DocsSection title="Attendance rules">
        <DocList
          items={[
            'Set when the work day starts and ends.',
            'Set how many minutes late or early is still okay (grace period).',
            'You will also see options for breaks, overtime, and weekends.',
            'Work hours and grace periods are saved. Some other options are coming soon.',
          ]}
        />
      </DocsSection>

      <DocsSection title="Kiosk tab">
        <DocList
          items={[
            'See if your kiosk tablet is connected.',
            'View the device ID and when it was paired.',
            'Read short steps to connect a new kiosk.',
          ]}
        />
        <DocParagraph>
          Full steps: <DocLink to="/docs/kiosk">Kiosk setup guide</DocLink>
        </DocParagraph>
      </DocsSection>

      <DocsSection title="Help tab">
        <DocParagraph>
          Find CodeTeak support contact details — email, phone, and office address.
        </DocParagraph>
        <DocParagraph>
          <DocLink to="/admin/settings/help">Open Settings → Help</DocLink> ·{' '}
          <DocLink to="/docs/getting-started">Back to Getting started</DocLink>
        </DocParagraph>
      </DocsSection>
    </DocContentGrid>
  </div>
);

export default SettingsGuide;
