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
