// ============================================================================
// IMPORTS
// ============================================================================
import React from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/hooks/useRedux';
import { logoutThunk } from '@/store/auth/auth.thunk';
import Breadcrumb from './Breadcrumb';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface TopbarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const ROLE_BADGE_STYLES: Record<string, string> = {
  admin: 'topbar-badge topbar-badge--admin',
  user: 'topbar-badge topbar-badge--user',
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/** Avatar with initials fallback */
const UserAvatar: React.FC<{ fullName: string | null; profilePicture: string | null }> = ({
  fullName,
  profilePicture,
}) => {
  const initials = (fullName ?? 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (profilePicture) {
    return (
      <img
        src={profilePicture}
        alt={fullName ?? 'User'}
        className="topbar-avatar"
      />
    );
  }

  return (
    <div className="topbar-avatar topbar-avatar--initials">
      <span>{initials}</span>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const Topbar: React.FC<TopbarProps> = ({ sidebarCollapsed, onToggleSidebar }) => {
  // ── HOOKS ──────────────────────────────────────────────────────────────────
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  // ── FUNCTIONS ──────────────────────────────────────────────────────────────
  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <header className="topbar">
      {/* Left — hamburger + breadcrumb */}
      <div className="topbar-left">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="topbar-hamburger"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
        <Breadcrumb />
      </div>

      {/* Right — theme toggle + user info + logout */}
      <div className="topbar-right">
        <ThemeToggle />

        <div className="topbar-user">
          <UserAvatar
            fullName={user?.fullName ?? null}
            profilePicture={user?.profilePicture ?? null}
          />
          <div className="topbar-user-info">
            <span className="topbar-user-name">{user?.fullName ?? 'User'}</span>
            <span className={ROLE_BADGE_STYLES[user?.role ?? 'user'] ?? ROLE_BADGE_STYLES.user}>
              {user?.role === 'admin' ? 'Admin' : 'User'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="topbar-logout"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
