import DocsSection, {
  DocLink,
  DocList,
  DocStepList,
  DocParagraph,
  DocPageHeader,
  DocContentGrid,
  DocTip,
  DocFooter,
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

  const renderSectionList = (section) => {
    const items = section.list.map(renderListItem);
    if (section.listStyle === 'steps') {
      return <DocStepList items={items} />;
    }
    return <DocList items={items} />;
  };

  return (
    <div className="space-y-6" lang={language}>
      <div className="space-y-4">
        <DocPageHeader title={content.pageTitle} subtitle={content.pageSubtitle} />
        <DocLanguagePicker
          languages={DOCS_LANGUAGES}
          value={language}
          onChange={setLanguage}
          label={DOCS_LANGUAGE_LABEL[language]}
        />
      </div>

      <DocContentGrid>
        {content.sections.map((section) => (
          <DocsSection
            key={section.title}
            title={section.title}
            subtitle={section.subtitle}
            className={section.span === 'full' ? 'xl:col-span-2' : undefined}
          >
            {section.paragraphs?.map((block, index) => (
              <div key={index}>{renderBlock(block)}</div>
            ))}
            {section.list && renderSectionList(section)}
            {section.tip && (
              <DocTip>
                {typeof section.tip === 'string' ? section.tip : renderParts(section.tip)}
              </DocTip>
            )}
            {section.footer && (
              <DocFooter>{renderParts(section.footer)}</DocFooter>
            )}
          </DocsSection>
        ))}
      </DocContentGrid>
    </div>
  );
};

export default DocsGuidePage;
