// ============================================================================
// IMPORTS
// ============================================================================
import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Clock,
  Wallet,
  Package,
  Receipt,
  UserCheck,
  Phone,
  Container,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { APP_ROUTES } from '@/utils/routes';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  featureFlag?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const NAV_ITEMS: NavItem[] = [
  // Admin-only
  { label: 'Dashboard', path: APP_ROUTES.DASHBOARD, icon: LayoutDashboard, adminOnly: true },
  { label: 'Employees', path: APP_ROUTES.EMPLOYEES.LIST, icon: Users, adminOnly: true },

  // All users
  { label: 'Attendance', path: APP_ROUTES.ATTENDANCE, icon: Clock },
  { label: 'Payouts', path: APP_ROUTES.PAYOUTS, icon: Wallet },

  // Feature-flagged
  { label: 'Inventory', path: APP_ROUTES.INVENTORY, icon: Package, featureFlag: 'isInventoryEnabled' },
  { label: 'Expenses', path: APP_ROUTES.EXPENSES, icon: Receipt, featureFlag: 'isExpenseEnabled' },
  { label: 'Walk-In', path: APP_ROUTES.WALK_IN_CUSTOMERS, icon: UserCheck, featureFlag: 'isWalkInCustomerEnabled' },
  { label: 'Ring', path: APP_ROUTES.RING_CUSTOMERS, icon: Phone, featureFlag: 'isRingCustomerEnabled' },
  { label: 'Containers', path: APP_ROUTES.CONTAINERS, icon: Container, featureFlag: 'isContainerEnabled' },
];

const BOTTOM_ITEMS: NavItem[] = [
  { label: 'Settings', path: APP_ROUTES.SETTINGS, icon: Settings },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  // ── HOOKS ──────────────────────────────────────────────────────────────────
  const { user, isAdmin } = useAuth();

  // ── COMPUTED VALUES ────────────────────────────────────────────────────────
  const visibleItems = useMemo(() => {
    return NAV_ITEMS.filter((item) => {
      // Admin-only check
      if (item.adminOnly && !isAdmin) return false;
      // Feature flag check
      if (item.featureFlag && user) {
        const flagValue = user[item.featureFlag as keyof typeof user];
        if (flagValue === false) return false;
      }
      return true;
    });
  }, [user, isAdmin]);

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* ── Logo area ── */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img
            src="/apexTrack.png"
            alt="OpsPilot"
            className="sidebar-logo-img"
            draggable={false}
          />
          {!collapsed && <span className="sidebar-logo-text">OpsPilot</span>}
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="sidebar-toggle"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>
      </div>

      {/* ── Main nav ── */}
      <nav className="sidebar-nav">
        <ul className="sidebar-list">
          {visibleItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={20} className="sidebar-link-icon" />
                {!collapsed && <span className="sidebar-link-label">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Bottom nav ── */}
      <div className="sidebar-bottom">
        <ul className="sidebar-list">
          {BOTTOM_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={20} className="sidebar-link-icon" />
                {!collapsed && <span className="sidebar-link-label">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
