import { useState } from 'react';
import clsx from 'clsx';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Sidebar } from '../components/common';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F7F9]">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Reserves horizontal space so main content shifts when sidebar expands */}
      <div
        aria-hidden="true"
        className={clsx(
          'hidden shrink-0 transition-[width] duration-300 ease-in-out lg:block',
          sidebarExpanded ? 'w-[260px]' : 'w-[72px]'
        )}
      />

      <Sidebar
        className={mobileOpen ? 'fixed inset-y-0 left-0 z-40 flex lg:hidden' : undefined}
        forceExpanded={mobileOpen}
        onExpandedChange={setSidebarExpanded}
        onNavigate={() => setMobileOpen(false)}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#007AFF] focus:shadow-lg"
        >
          Skip to main content
        </a>
        <header className="flex shrink-0 items-center gap-3 border-b border-gray-200/60 bg-white/80 px-4 py-3 backdrop-blur-sm lg:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-xl border border-gray-200/60 p-2 text-gray-600 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors duration-200 hover:bg-gray-50"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#007AFF] shadow-sm">
              <span className="text-sm font-bold text-white">Y</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">YaadroLens</span>
          </div>
        </header>

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
