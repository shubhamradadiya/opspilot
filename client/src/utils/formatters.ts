// ============================================================================
// FORMATTERS UTILITY
// OpsPilot · FE-05+
// Pure functions — no side effects, fully unit-testable.
// ============================================================================

// ============================================================================
// DURATION
// ============================================================================

/**
 * Calculates the human-readable duration between two ISO timestamps.
 * Returns "In Progress" if checkedOut is null.
 *
 * @example calcDuration("2024-01-01T08:00:00Z", "2024-01-01T16:30:00Z") → "8h 30m"
 */
export const calcDuration = (
  checkedIn: string,
  checkedOut: string | null,
): string => {
  if (!checkedOut) return 'In Progress';
  const ms = new Date(checkedOut).getTime() - new Date(checkedIn).getTime();
  if (ms <= 0) return '0h 00m';
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return `${h}h ${m.toString().padStart(2, '0')}m`;
};

/**
 * Converts millisecond epoch duration to "Xh Ym" string.
 * Used for weekly/daily totals from the API.
 */
export const msToHoursMinutes = (ms: number): string => {
  if (!ms || ms <= 0) return '0h 00m';
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return `${h}h ${m.toString().padStart(2, '0')}m`;
};

/**
 * Converts decimal hours (e.g. 8.5) to "8h 30m".
 */
export const decimalHoursToStr = (hours: number): string => {
  if (!hours || hours <= 0) return '—';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m.toString().padStart(2, '0')}m`;
};

// ============================================================================
// LIVE ELAPSED TIMER
// ============================================================================

/**
 * Returns elapsed time string "HH:MM:SS" from a start ISO timestamp to now.
 * Designed to be called inside a setInterval.
 */
export const elapsedSince = (startIso: string): string => {
  const ms = Date.now() - new Date(startIso).getTime();
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, '0')).join(':');
};

// ============================================================================
// DATE / TIME DISPLAY
// ============================================================================

/**
 * Formats an ISO string to a short date: "Feb 28, 2026"
 */
export const formatDate = (iso: string): string => {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Formats an ISO string to time: "09:30 AM"
 */
export const formatTime = (iso: string): string => {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formats a Unix ms timestamp to "Feb 28, 2026"
 */
export const formatTimestamp = (ms: number): string => {
  return new Date(ms).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Returns start-of-day and end-of-day epoch ms for a given Date.
 */
export const getDayRange = (date: Date): { start: number; end: number } => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start: start.getTime(), end: end.getTime() };
};

/**
 * Returns the Monday and Sunday of the current week.
 */
export const getCurrentWeekRange = (): { start: number; end: number } => {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday.getTime(), end: sunday.getTime() };
};

/**
 * Format a local datetime string (from <input type="datetime-local">) to epoch ms.
 */
export const localDatetimeToMs = (localStr: string): number => {
  return new Date(localStr).getTime();
};

// ============================================================================
// CURRENCY
// ============================================================================

/**
 * Format a number as currency with symbol.
 * @example formatCurrency(1234.5, '$') → "$1,234.50"
 */
export const formatCurrency = (
  amount: number,
  symbol: '$' | '€' | '£' = '$',
): string => {
  if (amount == null || isNaN(amount)) return `${symbol}0.00`;
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
