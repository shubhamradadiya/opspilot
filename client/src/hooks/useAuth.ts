// ============================================================================
// IMPORTS
// ============================================================================
import { useAppSelector } from '@/hooks/useRedux';
import {
  selectAuthUser,
  selectIsAuthenticated,
  selectSessionRestored,
  selectAuthLoading,
} from '@/store/auth/auth.slice';

// ============================================================================
// HOOK
// ============================================================================

/**
 * Convenience hook — surfaces auth state with derived role helpers.
 */
export const useAuth = () => {
  const user = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const sessionRestored = useAppSelector(selectSessionRestored);
  const loading = useAppSelector(selectAuthLoading);

  return {
    user,
    isAdmin: user?.role === 'admin',
    isAuthenticated,
    sessionRestored,
    loading,
  };
};
