// ============================================================================
// CLOCK BUTTON COMPONENT
// OpsPilot · FE-05
// Large prominence clock-in / clock-out button with live elapsed timer.
// States: Clocked Out (gold), Clocked In (red), Loading (spinner).
// ============================================================================
import React, { useEffect, useRef, useState } from 'react';
import { Play, Square, Loader2 } from 'lucide-react';
import { elapsedSince } from '@/utils/formatters';

// ============================================================================
// TYPES
// ============================================================================
interface ClockButtonProps {
  isCheckedIn: boolean;
  checkedInAt: string | null;  // ISO string — start of current session
  loading?: boolean;
  onClock: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================
const ClockButton: React.FC<ClockButtonProps> = ({
  isCheckedIn,
  checkedInAt,
  loading = false,
  onClock,
}) => {
  // ── Live timer ──────────────────────────────────────────────────────────────
  const [elapsed, setElapsed] = useState<string>('00:00:00');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isCheckedIn && checkedInAt) {
      // Start counting
      setElapsed(elapsedSince(checkedInAt));
      timerRef.current = setInterval(() => {
        setElapsed(elapsedSince(checkedInAt));
      }, 1000);
    } else {
      setElapsed('00:00:00');
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCheckedIn, checkedInAt]);

  // ── Derived styles ──────────────────────────────────────────────────────────
  const isOut = !isCheckedIn;

  const outerGlow = isOut
    ? 'shadow-[0_0_40px_rgba(212,175,55,0.15)]'
    : 'shadow-[0_0_40px_rgba(192,57,43,0.2)]';

  const bgClass = isOut
    ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8960E] hover:from-[#E0BC40] hover:to-[#C9A30F]'
    : 'bg-gradient-to-br from-[#C0392B] to-[#922B21] hover:from-[#CD3B2B] hover:to-[#A33025]';

  const label = isOut ? 'CLOCK IN' : 'CLOCK OUT';
  const subLabel = isOut ? 'Start Your Day' : 'End Your Day';

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Live timer — only shown when clocked in */}
      {isCheckedIn && (
        <div className="flex flex-col items-center gap-1">
          <span className="flex items-center gap-2 text-xs text-[#C0392B] dark:text-[#E05A4A] font-semibold uppercase tracking-widest">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C0392B] animate-pulse" />
            LIVE
          </span>
          <span className="font-mono text-4xl font-bold tracking-tight text-[#2A2A2A] dark:text-[#F5F5F5]">
            {elapsed}
          </span>
        </div>
      )}

      {/* Main button */}
      <button
        type="button"
        onClick={onClock}
        disabled={loading}
        aria-label={label}
        className={`
          relative w-48 h-48 rounded-full flex flex-col items-center justify-center gap-3
          ${bgClass} ${outerGlow}
          text-white font-bold transition-all duration-200
          active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
          focus:outline-none focus-visible:ring-4 focus-visible:ring-[#D4AF37]/50
        `}
      >
        {loading ? (
          <Loader2 size={40} className="animate-spin" />
        ) : (
          <>
            {isOut ? <Play size={36} className="ml-2" /> : <Square size={36} />}
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-black tracking-widest">{label}</span>
              <span className="text-xs opacity-80 font-normal tracking-wide">{subLabel}</span>
            </div>
          </>
        )}

        {/* Ripple ring when clocked in */}
        {isCheckedIn && !loading && (
          <span className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
        )}
      </button>
    </div>
  );
};

export default ClockButton;
