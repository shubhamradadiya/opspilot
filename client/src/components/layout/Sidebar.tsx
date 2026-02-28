// ============================================================================
// IMPORTS
// ============================================================================
import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Clock,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Wallet,
  Package,
  Receipt,
  UserCheck,
  Phone,
  Container,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { APP_ROUTES } from '@/utils/routes';
import Logo from '@/components/common/Logo';
import { useAppSelector } from '@/hooks/useRedux';

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

  // All users (feature-flag guarded)
  { label: 'Attendance', path: APP_ROUTES.ATTENDANCE.DASHBOARD, icon: Clock, featureFlag: 'isClockInClockOutEnabled' },
  { label: 'Payouts', path: APP_ROUTES.PAYOUTS.LIST, icon: Wallet, featureFlag: 'isPayoutEnabled' },

  // Feature-flagged
  { label: 'Inventory', path: APP_ROUTES.INVENTORY.LIST, icon: Package, featureFlag: 'isInventoryEnabled' },
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
  const unreadInventoryLogs = useAppSelector((s) => s.inventory.unreadLogCount);

  // ── COMPUTED VALUES ────────────────────────────────────────────────────────
  const visibleItems = useMemo(() => {
    return NAV_ITEMS.map(item => {
      // For Admin, redirect Attendance to timestamps
      if (item.label === 'Attendance' && isAdmin) {
        return { ...item, path: APP_ROUTES.ATTENDANCE.TIMESTAMPS };
      }
      return item;
    }).filter((item) => {
      // Admin-only check
      if (item.adminOnly && !isAdmin) return false;
      // Feature flag check (Admins bypass feature flags to manage everything)
      if (item.featureFlag && user && !isAdmin) {
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
        <div className="sidebar-logo py-4 flex items-center justify-center w-full overflow-hidden">
          <Logo variant={collapsed ? 'icon-gold' : 'primary'} height={collapsed ? 32 : 44} className="shrink-0 transition-all duration-300" />
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
                {!collapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span className="sidebar-link-label">{item.label}</span>
                    {item.label === 'Inventory' && isAdmin && unreadInventoryLogs > 0 && (
                      <span className="flex items-center justify-center shrink-0 w-5 h-5 rounded-full bg-[#C0392B] text-white text-[10px] font-bold">
                        {unreadInventoryLogs > 99 ? '99+' : unreadInventoryLogs}
                      </span>
                    )}
                  </div>
                )}
                {collapsed && item.label === 'Inventory' && isAdmin && unreadInventoryLogs > 0 && (
                  <span className="absolute top-2 right-2 flex items-center justify-center w-2 h-2 rounded-full bg-[#C0392B]" />
                )}
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
