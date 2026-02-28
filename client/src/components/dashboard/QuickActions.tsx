// ============================================================================
// IMPORTS
// ============================================================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  PackagePlus,
  Wallet,
  ClipboardList,
} from 'lucide-react';
import { APP_ROUTES } from '@/utils/routes';

// ============================================================================
// CONSTANTS
// ============================================================================
const ACTIONS = [
  {
    label: 'Add Employee',
    icon: UserPlus,
    path: APP_ROUTES.EMPLOYEES.CREATE,
    color: 'bg-[#F0DFA0] dark:bg-[rgba(212,175,55,0.15)] text-[#D4AF37]',
  },
  {
    label: 'Add Inventory',
    icon: PackagePlus,
    path: APP_ROUTES.INVENTORY.LIST,
    color: 'bg-[#D4F5E0] dark:bg-[rgba(45,122,79,0.15)] text-[#2D7A4F] dark:text-[#4CAF80]',
  },
  {
    label: 'View Payouts',
    icon: Wallet,
    path: APP_ROUTES.PAYOUTS.LIST,
    color: 'bg-[#EDD6F5] dark:bg-[rgba(106,58,138,0.15)] text-[#6A3A8A] dark:text-[#9A6ABA]',
  },
  {
    label: 'Attendance Logs',
    icon: ClipboardList,
    path: APP_ROUTES.ATTENDANCE.LOGS,
    color: 'bg-[#D4E8F5] dark:bg-[rgba(90,106,122,0.15)] text-[#5A6A7A] dark:text-[#8A9AAA]',
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const QuickActions: React.FC = () => {
  // ── HOOKS ──────────────────────────────────────────────────────────────────
  const navigate = useNavigate();

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E8E0B8] dark:border-[#2E2E2E] p-5">
      <h3 className="text-sm font-semibold text-[#2A2A2A] dark:text-[#F5F5F5] mb-4">
        ⚡ Quick Actions
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[#E8E0B8] dark:border-[#2E2E2E] hover:shadow-md hover:shadow-[#E8E0B8]/30 dark:hover:shadow-black/20 transition-all duration-150 hover:-translate-y-0.5 cursor-pointer bg-white dark:bg-[#1E1E1E]"
          >
            <div className={`p-2 rounded-lg ${action.color}`}>
              <action.icon size={20} />
            </div>
            <span className="text-xs font-medium text-[#5A5A5A] dark:text-[#AAAAAA]">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
