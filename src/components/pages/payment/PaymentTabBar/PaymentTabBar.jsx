import clsx from 'clsx';

const tabs = [
  { id: 'ledger', label: 'Ledger' },
  { id: 'advances', label: 'Advances' },
  { id: 'bonuses', label: 'Bonuses' },
  { id: 'balance', label: 'Balance' },
];

const PaymentTabBar = ({ activeTab, onTabChange, inline = false }) => {
  const nav = (
    <nav className="flex gap-1 overflow-x-auto" aria-label="Payment tabs">
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
  );

  if (inline) return nav;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      <div className="px-2 py-2 sm:px-3">{nav}</div>
    </div>
  );
};

export default PaymentTabBar;
