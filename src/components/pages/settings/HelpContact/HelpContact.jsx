import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DASHBOARD_ACCENTS } from '../settingsTheme';
import SettingsSection, { SettingsContentGrid } from '../SettingsSection/SettingsSection';

const CODETEAK_URL = 'https://www.codeteak.com/';
const SUPPORT_EMAIL = 'info@codeteak.com';
const SUPPORT_PHONE = '+91 99952 03149';

const ContactRow = ({ icon: Icon, label, children }) => (
  <div className="flex gap-3">
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
      style={{ backgroundColor: `${DASHBOARD_ACCENTS.blue}1A`, color: DASHBOARD_ACCENTS.blue }}
    >
      <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <div className="mt-0.5 text-sm text-gray-900">{children}</div>
    </div>
  </div>
);

const HelpContact = () => (
  <div className="space-y-6">
    <SettingsContentGrid>
      <SettingsSection
        title="Contact"
        subtitle={
          <>
            Reach our team directly. For how-to guides, see{' '}
            <Link to="/docs/getting-started" className="font-medium text-blue-600 hover:text-blue-700">
              Documentation
            </Link>
            .
          </>
        }
        tourId="help-contact"
      >
        <div className="space-y-5">
          <ContactRow icon={Mail} label="Email">
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-blue-600 hover:text-blue-700">
              {SUPPORT_EMAIL}
            </a>
          </ContactRow>
          <ContactRow icon={Phone} label="Phone">
            <a
              href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`}
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              {SUPPORT_PHONE}
            </a>
          </ContactRow>
          <ContactRow icon={Mail} label="Website">
            <a
              href={CODETEAK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              codeteak.com
            </a>
          </ContactRow>
        </div>
      </SettingsSection>

      <SettingsSection title="Offices" tourId="help-offices">
        <ContactRow icon={MapPin} label="Bengaluru">
          <address className="not-italic leading-relaxed text-gray-700">
            4th floor, 1190 Desk NO-FD 78,
            <br />
            Eva Info Marketing Solution Pvt Ltd,
            <br />
            22nd Cross Road, HSR Layout, Bengaluru,
            <br />
            Bengaluru Urban, Karnataka 560102
          </address>
        </ContactRow>
      </SettingsSection>
    </SettingsContentGrid>
  </div>
);

export default HelpContact;
