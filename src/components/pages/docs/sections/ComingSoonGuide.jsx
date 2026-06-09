import DocsSection, { DocList, DocParagraph, DocPageHeader, DocContentGrid } from '../DocsSection';

const ComingSoonGuide = () => (
  <div className="space-y-6">
    <DocPageHeader
      title="Coming soon"
      subtitle="Features we are working on and a few things to be aware of today."
    />

    <DocContentGrid>
      <DocsSection title="Menu items not ready yet">
        <DocParagraph>
          You may see these in the sidebar. They are placeholders and do not open working pages
          yet:
        </DocParagraph>
        <DocList
          items={[
            'Report',
            'Payment',
            'Salary',
            'Tax',
            'Reimbursements',
            'Loan',
            'Asset Management',
            'WhatsApp',
          ]}
        />
      </DocsSection>

      <DocsSection title="Things to know today">
        <DocList
          items={[
            'You can manage one company per login for now.',
            'The attendance history tab on an employee profile shows sample data — a live version is coming.',
            'Company-specific holiday calendars are not available yet — the Dashboard shows India public holidays only.',
            'Some settings fields (like breaks and overtime) are visible but not fully saved yet.',
          ]}
        />
      </DocsSection>

      <DocsSection title="Need a new company account?">
        <DocParagraph>
          Setting up a brand-new organization is done by your system provider using the admin
          portal. Contact CodeTeak or your account manager if you need a new company created.
        </DocParagraph>
      </DocsSection>
    </DocContentGrid>
  </div>
);

export default ComingSoonGuide;
