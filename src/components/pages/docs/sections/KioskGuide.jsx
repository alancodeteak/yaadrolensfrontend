import DocsSection, {
  DocLink,
  DocList,
  DocParagraph,
  DocPageHeader,
  DocContentGrid,
  DocTip,
} from '../DocsSection';

const KioskGuide = () => (
  <div className="space-y-6">
    <DocPageHeader
      title="Kiosk setup"
      subtitle="Connect your attendance tablet and register staff faces."
    />

    <DocContentGrid>
      <DocsSection title="What is the kiosk?">
        <DocParagraph>
          The kiosk is a tablet or phone at your office entrance. Employees stand in front of it
          to clock in and clock out. Face registration also happens on the kiosk — not on this
          website.
        </DocParagraph>
      </DocsSection>

      <DocsSection title="Connect the kiosk (one time)">
        <DocList
          items={[
            'Open the YaadroLens kiosk app on the tablet.',
            'Sign in with your admin username and password — the same ones you use for this website.',
            'Do not use an employee code here.',
            'After login, the kiosk is linked to your company.',
            'Only one kiosk can be active per company. Connecting a new one replaces the old one.',
            'Check status anytime under Settings → Kiosk.',
          ]}
        />
      </DocsSection>

      <DocsSection title="Daily use on the kiosk">
        <DocList
          items={[
            '1. Make sure employees are added on this website first.',
            '2. Register each person’s face on the kiosk (one-time setup per employee).',
            '3. Staff scan their face to clock in when they arrive.',
            '4. They scan again to clock out when they leave.',
            '5. You can also upload a profile photo from the kiosk if needed.',
          ]}
        />
      </DocsSection>

      <DocsSection title="Tips for a smooth setup">
        <DocList
          items={[
            'Make sure the tablet date and time are correct.',
            'Good lighting helps face scanning work better.',
            'If the kiosk stops working, try signing in again on the app.',
            'Attendance will start showing on your Dashboard and Live Attendance pages.',
          ]}
        />
        <DocTip>
          Add all employees on the website before registering faces on the kiosk. That way
          everyone appears in the list when you open the app.
        </DocTip>
        <DocParagraph>
          Check connection status: <DocLink to="/admin/settings/cameras">Settings → Kiosk</DocLink>
        </DocParagraph>
      </DocsSection>
    </DocContentGrid>
  </div>
);

export default KioskGuide;
