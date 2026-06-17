import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, ChevronsUpDown } from 'lucide-react';
import { logoutUser } from '../../../store/slices';
import SidebarIdentityChip from './SidebarIdentityChip';

const OrganizationSwitcher = ({ collapsed = false }) => {
  const [open, setOpen] = useState(false);
  const [showOrgComingSoon, setShowOrgComingSoon] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const orgName = user?.organization_code || user?.login_id || 'Organization';
  const loginId = user?.login_id || user?.email || orgName;
  const displayName = user?.first_name || user?.name || loginId;
  const avatarLabel = (orgName.charAt(0) || 'O').toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
        setShowOrgComingSoon(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login', { replace: true });
  };

  const handleSwitchOrg = () => {
    setShowOrgComingSoon(true);
  };

  const handleToggleMenu = () => {
    setOpen((value) => {
      if (value) {
        setShowOrgComingSoon(false);
      }
      return !value;
    });
  };

  return (
    <div ref={menuRef} className="relative w-full">
      <SidebarIdentityChip
        avatarLabel={avatarLabel}
        primary={displayName}
        secondary={orgName}
        collapsed={collapsed}
        onClick={handleToggleMenu}
        trailingIcon={collapsed ? undefined : ChevronsUpDown}
        ariaLabel="Open account menu"
        className={collapsed ? 'w-full' : 'w-full'}
      />

      {open && (
        <div
          className="absolute left-0 z-[60] mt-2 w-full min-w-[200px] overflow-hidden rounded-2xl border border-gray-200/60 bg-white py-1 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
          style={collapsed ? { left: '100%', marginLeft: 8, width: 220 } : undefined}
        >
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-gray-900">{displayName}</p>
            <p className="truncate text-[11px] text-gray-500">{loginId}</p>
          </div>
          <button
            type="button"
            onClick={handleSwitchOrg}
            className="mx-1 flex w-[calc(100%-0.5rem)] items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50"
          >
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={2} />
            Switch organization
          </button>
          {showOrgComingSoon && (
            <p className="mx-4 border-b border-gray-100 py-2 text-[11px] text-gray-500">
              Multiple org is coming soon
            </p>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="mx-1 mb-1 flex w-[calc(100%-0.5rem)] items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-[#FF3B30] transition-colors duration-200 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default OrganizationSwitcher;
