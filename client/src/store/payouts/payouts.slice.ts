// ============================================================================
// PAYOUTS REDUX SLICE
// OpsPilot · FE-06
// ============================================================================
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  IPayoutsState,
  IUserWisePayout,
  ISelfPayout,
  IPayoutFilters,
} from './payouts.types';
import { getCurrentWeekRange } from '@/utils/formatters';

// ============================================================================
// INITIAL STATE
// ============================================================================
const { start, end } = getCurrentWeekRange();

const initialState: IPayoutsState = {
  allPayouts: [],
  selfPayouts: [],
  filters: {
    search: '',
    startTimestamp: start,
    endTimestamp: end,
    calenderSlotType: 'DAY',
  },
  meta: null,
  loading: false,
  submitting: false,
  error: null,
};

// ============================================================================
// SLICE
// ============================================================================
const payoutsSlice = createSlice({
  name: 'payouts',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.submitting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAllPayouts: (state, action: PayloadAction<IUserWisePayout[]>) => {
      state.allPayouts = action.payload;
    },
    setSelfPayouts: (state, action: PayloadAction<ISelfPayout[]>) => {
      state.selfPayouts = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<IPayoutFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setMeta: (state, action: PayloadAction<any | null>) => {
      state.meta = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setLoading,
  setSubmitting,
  setError,
  setAllPayouts,
  setSelfPayouts,
  setFilters,
  setMeta,
  resetFilters,
} = payoutsSlice.actions;

export const payoutsReducer = payoutsSlice.reducer;
export default payoutsSlice.reducer;
