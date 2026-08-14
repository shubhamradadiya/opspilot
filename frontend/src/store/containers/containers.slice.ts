import { createSlice } from '@reduxjs/toolkit';
import { ContainersState, IContainer } from './containers.types';
import {
  fetchContainersThunk,
  fetchBookingNumbersThunk,
  createContainerThunk,
  updateContainerThunk,
  deleteContainerThunk,
} from './containers.thunk';

const initialState: ContainersState = {
  data: [],
  bookingNumbers: [],
  total: 0,
  loading: false,
  submitting: false,
  error: null,
};

const containersSlice = createSlice({
  name: 'containers',
  initialState,
  reducers: {
    clearContainersError: (state) => {
      state.error = null;
    },
    resetContainersState: () => initialState,
  },
  extraReducers: (builder) => {
    // ── FETCH CONTAINERS ──
    builder
      .addCase(fetchContainersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContainersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.meta?.totalItems || 0;
      })
      .addCase(fetchContainersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── FETCH BOOKING NUMBERS ──
    builder
      .addCase(fetchBookingNumbersThunk.fulfilled, (state, action) => {
        state.bookingNumbers = action.payload.data;
      });

    // ── CREATE CONTAINER ──
    builder
      .addCase(createContainerThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createContainerThunk.fulfilled, (state, action) => {
        state.submitting = false;
        // Prepend new container to list
        if (action.payload.data) {
          state.data.unshift(action.payload.data as IContainer);
          state.total += 1;
        }
      })
      .addCase(createContainerThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });

    // ── UPDATE CONTAINER ──
    builder
      .addCase(updateContainerThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateContainerThunk.fulfilled, (state, action) => {
        state.submitting = false;
        const updatedContainer = action.payload.data as IContainer;
        if (updatedContainer) {
          const index = state.data.findIndex((c) => c.cId === updatedContainer.cId);
          if (index !== -1) {
            state.data[index] = updatedContainer;
          }
        }
      })
      .addCase(updateContainerThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });

    // ── DELETE CONTAINER ──
    builder
      .addCase(deleteContainerThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(deleteContainerThunk.fulfilled, (state, action) => {
        state.submitting = false;
        const deletedId = action.payload;
        state.data = state.data.filter((c) => c.cId !== deletedId);
        state.total -= 1;
      })
      .addCase(deleteContainerThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearContainersError, resetContainersState } = containersSlice.actions;
export const containersReducer = containersSlice.reducer;
