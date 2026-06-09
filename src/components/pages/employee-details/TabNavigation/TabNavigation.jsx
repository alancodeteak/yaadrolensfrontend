import clsx from 'clsx';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'personal', label: 'Personal info' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'training', label: 'Face enrollment' },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      <nav className="flex gap-1 overflow-x-auto px-2 py-2 sm:px-3" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={clsx(
              'shrink-0 rounded-xl px-3 py-2 text-xs font-medium transition-colors duration-200 sm:px-4 sm:text-sm',
              activeTab === tab.id
                ? 'bg-[#007AFF]/10 text-[#007AFF]'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;
