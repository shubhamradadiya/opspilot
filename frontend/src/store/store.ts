// ============================================================================
// IMPORTS
// ============================================================================
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';

// ============================================================================
// STORE CONFIGURATION
// ============================================================================
export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV,
});

// ============================================================================
// TYPES
// ============================================================================
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
