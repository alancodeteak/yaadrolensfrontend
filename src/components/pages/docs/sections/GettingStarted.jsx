import DocsSection, {
  DocLink,
  DocList,
  DocParagraph,
  DocPageHeader,
  DocContentGrid,
  DocTip,
} from '../DocsSection';

const GettingStarted = () => (
  <div className="space-y-6">
    <DocPageHeader
      title="Getting started"
      subtitle="Welcome! Here is how YaadroLens works and what to do first."
    />

    <DocContentGrid>
      <DocsSection title="What is YaadroLens?">
        <DocParagraph>
          YaadroLens helps you track employee attendance using a face-scan kiosk. Staff clock in
          and out by looking at the kiosk camera — no manual punch cards needed.
        </DocParagraph>
        <DocParagraph>
          This website is your admin panel. From here you add employees, check who is present,
          view reports, and change company settings.
        </DocParagraph>
      </DocsSection>

      <DocsSection title="How to sign in">
        <DocList
          items={[
            'Go to the login page.',
            'Enter your admin username and password (the same ones you use for this panel).',
            'If asked, enter your company code.',
            'After login, you will see the Dashboard.',
          ]}
        />
        <DocParagraph>
          Open the <DocLink to="/admin/dashboard">Dashboard</DocLink> anytime from the menu on
          the left.
        </DocParagraph>
      </DocsSection>

      <DocsSection title="Setup checklist" subtitle="Do these steps in order">
        <DocList
          items={[
            'Your company account is created by your system provider.',
            'Add your employees in the Employees section.',
            'Set work hours in Settings → Attendance.',
            'Connect the kiosk tablet (see Kiosk setup).',
            'Register each employee’s face on the kiosk.',
            'Watch attendance on the Dashboard and Live Attendance pages.',
          ]}
        />
      </DocsSection>

      <DocsSection title="Good to know">
        <DocList
          items={[
            'Face registration is done on the kiosk — not on this website.',
            'Each company can have one active kiosk at a time.',
            'On most pages you will see Tutorial and Info buttons for a quick walkthrough.',
          ]}
        />
        <DocTip>
          New here? Start with the Dashboard, then add employees, then set up the kiosk. You can
          always come back to this guide from the <strong className="font-medium">Get Started</strong>{' '}
          menu.
        </DocTip>
        <DocParagraph>
          Next: <DocLink to="/docs/dashboard">Your Dashboard</DocLink> ·{' '}
          <DocLink to="/docs/kiosk">Kiosk setup</DocLink>
        </DocParagraph>
      </DocsSection>
    </DocContentGrid>
  </div>
);

export default GettingStarted;
