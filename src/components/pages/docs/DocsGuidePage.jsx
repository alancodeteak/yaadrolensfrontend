import { useEffect } from 'react';
import DocsSection, {
  DocLink,
  DocList,
  DocParagraph,
  DocPageHeader,
  DocContentGrid,
  DocTip,
} from './DocsSection';
import DocLanguagePicker from './sections/DocLanguagePicker';
import { DOCS_LANGUAGE_LABEL, DOCS_LANGUAGES } from './docsI18n';
import { useDocsLanguage } from './DocsLanguageContext';

// #region agent log
const DEBUG_ENGLISH_TERMS = [
  'Employees',
  'Salary',
  'Settings',
  'Attendance',
  'Kiosk setup',
  'Live Attendance',
  'Tutorial',
  'Info',
  'Get Started',
];

const findEnglishTermsInContent = (content, lang) => {
  if (lang === 'en') return [];
  const hits = [];
  const scan = (val, path) => {
    if (typeof val === 'string') {
      DEBUG_ENGLISH_TERMS.forEach((term) => {
        if (val.includes(term)) {
          hits.push({ path, term, snippet: val.slice(0, 120) });
        }
      });
    } else if (Array.isArray(val)) {
      val.forEach((item, index) => scan(item, `${path}[${index}]`));
    } else if (val && typeof val === 'object') {
      if (val.type === 'link') scan(val.label, `${path}.link.label`);
      if (val.type === 'strong') scan(val.text, `${path}.strong.text`);
      Object.entries(val).forEach(([key, nested]) => scan(nested, `${path}.${key}`));
    }
  };
  content.sections?.forEach((section, index) => scan(section, `sections[${index}]`));
  return hits;
};
// #endregion

const renderParts = (parts) =>
  parts.map((part, index) => {
    if (typeof part === 'string') {
      return <span key={index}>{part}</span>;
    }
    if (part.type === 'link') {
      return (
        <DocLink key={index} to={part.to}>
          {part.label}
        </DocLink>
      );
    }
    if (part.type === 'strong') {
      return (
        <strong key={index} className="font-medium text-gray-900">
          {part.text}
        </strong>
      );
    }
    return null;
  });

const renderBlock = (block) => {
  if (typeof block === 'string') {
    return <DocParagraph>{block}</DocParagraph>;
  }
  if (Array.isArray(block)) {
    return <DocParagraph>{renderParts(block)}</DocParagraph>;
  }
  return null;
};

const renderListItem = (item) => {
  if (typeof item === 'string') {
    return item;
  }
  if (Array.isArray(item)) {
    return renderParts(item);
  }
  return null;
};

const DocsGuidePage = ({ contentByLang }) => {
  const { language, setLanguage } = useDocsLanguage();
  const content = contentByLang[language] || contentByLang.en;

  // #region agent log
  useEffect(() => {
    const usedFallback = !contentByLang[language];
    const englishHits = findEnglishTermsInContent(content, language);
    fetch('http://127.0.0.1:7515/ingest/538f2235-5832-44cc-ae52-fff8dcaf5d4a', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '60137d' },
      body: JSON.stringify({
        sessionId: '60137d',
        runId: 'pre-fix',
        hypothesisId: usedFallback ? 'H2' : englishHits.length ? 'H1-H3' : 'H5',
        location: 'DocsGuidePage.jsx:useEffect',
        message: 'docs guide language render',
        data: {
          language,
          pageTitle: content.pageTitle,
          usedFallback,
          englishHitCount: englishHits.length,
          englishHits: englishHits.slice(0, 12),
          sectionTitles: content.sections?.map((s) => s.title),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }, [language, content, contentByLang]);
  // #endregion

  return (
    <div className="space-y-6" lang={language}>
      <DocPageHeader title={content.pageTitle} subtitle={content.pageSubtitle} />

      <DocLanguagePicker
        languages={DOCS_LANGUAGES}
        value={language}
        onChange={setLanguage}
        label={DOCS_LANGUAGE_LABEL[language]}
      />

      <DocContentGrid>
        {content.sections.map((section) => (
          <DocsSection key={section.title} title={section.title} subtitle={section.subtitle}>
            {section.paragraphs?.map((block, index) => (
              <div key={index}>{renderBlock(block)}</div>
            ))}
            {section.list && <DocList items={section.list.map(renderListItem)} />}
            {section.tip && (
              <DocTip>
                {typeof section.tip === 'string' ? section.tip : renderParts(section.tip)}
              </DocTip>
            )}
            {section.footer && renderBlock(section.footer)}
          </DocsSection>
        ))}
      </DocContentGrid>
    </div>
  );
};

export default DocsGuidePage;
