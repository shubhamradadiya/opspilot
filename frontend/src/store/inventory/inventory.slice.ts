import { createSlice } from '@reduxjs/toolkit';
import { InventoryState } from './inventory.types';
import {
  createInventory,
  getInventories,
  updateInventory,
  deleteInventory,
  getActivityLogs,
  markLogsAsRead,
} from './inventory.thunk';

const initialState: InventoryState = {
  records: [],
  logs: [],
  unreadLogCount: 0,
  loading: false,
  error: null,
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  logsTotalItems: 0,
  logsTotalPages: 1,
  logsCurrentPage: 1,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetInventoryState: () => initialState,
  },
  extraReducers: (builder) => {
    // getInventories
    builder.addCase(getInventories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getInventories.fulfilled, (state, action) => {
      state.loading = false;
      state.records = action.payload.data;
      if (action.payload.meta) {
        state.totalItems = action.payload.meta.totalItems;
        state.totalPages = action.payload.meta.totalPages;
        state.currentPage = action.payload.meta.currentPage || 1;
      }
    });
    builder.addCase(getInventories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // createInventory
    builder.addCase(createInventory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createInventory.fulfilled, (state, action) => {
      state.loading = false;
      state.records.unshift(action.payload);
      state.totalItems += 1;
    });
    builder.addCase(createInventory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // updateInventory
    builder.addCase(updateInventory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateInventory.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.records.findIndex((r) => r.iId === action.payload.iId);
      if (index !== -1) {
        state.records[index] = action.payload;
      }
    });
    builder.addCase(updateInventory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // deleteInventory
    builder.addCase(deleteInventory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteInventory.fulfilled, (state, action) => {
      state.loading = false;
      state.records = state.records.filter((r) => r.iId !== action.payload);
      state.totalItems -= 1;
    });
    builder.addCase(deleteInventory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // getActivityLogs
    builder.addCase(getActivityLogs.pending, (state) => {
      // Background reload typically, so we might not block the whole page with a spinner or we might. Let's keep it simple.
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getActivityLogs.fulfilled, (state, action) => {
      state.loading = false;
      state.logs = action.payload.data;
      if (action.payload.meta) {
        state.logsTotalItems = action.payload.meta.totalItems;
        state.logsTotalPages = action.payload.meta.totalPages;
        state.logsCurrentPage = action.payload.meta.currentPage || 1;
        // Optionally calculate unread from the payload if returned, else count manually for current page, or rely on a dedicated unread count endpoint if available.
        // The endpoint should have `isRead: boolean`. Let's calculate from logs payload.
        // We might need a separate endpoint to get total unread count for sidebar if it relies on across pages. Let's assume meta doesn't pass it yet. We'll count unreads in current view for now and update later as needed.
      }
      
      // Calculate unread count (if the backend doesn't send total unread, we just count the unread in loaded logs - preferably backend provides a dedicated count, but for now we look at the fetched logs)
      state.unreadLogCount = state.logs.filter((log) => !log.isRead).length; 
    });
    builder.addCase(getActivityLogs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // markLogsAsRead
    builder.addCase(markLogsAsRead.fulfilled, (state, action) => {
      // The payload contains the IDs we just marked read
      const ids = action.payload;
      state.logs = state.logs.map((log) => {
        if (ids.includes(log.id)) {
          return { ...log, isRead: true };
        }
        return log;
      });
      state.unreadLogCount = Math.max(0, state.unreadLogCount - ids.length);
    });
  },
});

export const { clearError, resetInventoryState } = inventorySlice.actions;
export default inventorySlice.reducer;
