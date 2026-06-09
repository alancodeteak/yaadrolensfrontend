import clsx from 'clsx';

const DocLanguagePicker = ({ languages, value, onChange, label }) => (
  <div className="rounded-2xl border border-gray-200/80 bg-white px-4 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:px-5">
    <p className="mb-3 text-sm font-medium text-gray-700">{label}</p>
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {languages.map((lang) => {
        const selected = value === lang.id;
        return (
          <button
            key={lang.id}
            type="button"
            onClick={() => onChange(lang.id)}
            aria-pressed={selected}
            lang={lang.id}
            className={clsx(
              'rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200',
              selected
                ? 'bg-[#007AFF] text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  </div>
);

export default DocLanguagePicker;
