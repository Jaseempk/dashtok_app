import { useState, useEffect, useCallback, useRef } from 'react';

const WARNING_THRESHOLD_SECONDS = 300; // 5 minutes

interface RemainingTimeOptions {
  /** Called once when countdown reaches 0 */
  onExpire?: () => void;
  /** Called once when countdown drops below 5 minutes */
  onWarning?: () => void;
}

interface RemainingTime {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
  isWarning: boolean;
  formatted: string;
}

/**
 * Live countdown hook for remaining screen time.
 * Updates every second when active.
 *
 * Features:
 * - onExpire callback when time hits 0 (fires once)
 * - onWarning callback when time drops below 5 min (fires once)
 * - isWarning flag for UI styling
 */
export function useRemainingTime(
  remainingMinutes: number | undefined,
  isUnlocked: boolean | undefined,
  options: RemainingTimeOptions = {}
): RemainingTime {
  const { onExpire, onWarning } = options;

  const [remaining, setRemaining] = useState<number>(0);

  // Track if callbacks have fired to prevent duplicates
  const hasExpiredFired = useRef(false);
  const hasWarningFired = useRef(false);

  // Reset callback flags when a new session starts (remaining time increases)
  const prevRemaining = useRef<number>(0);

  // Initialize remaining time when it changes
  useEffect(() => {
    if (remainingMinutes !== undefined && isUnlocked) {
      const newRemaining = remainingMinutes * 60; // Convert to seconds
      setRemaining(newRemaining);

      // Reset flags if we got more time (new unlock session)
      if (newRemaining > prevRemaining.current) {
        hasExpiredFired.current = false;
        hasWarningFired.current = false;
      }
      prevRemaining.current = newRemaining;
    } else {
      setRemaining(0);
      prevRemaining.current = 0;
    }
  }, [remainingMinutes, isUnlocked]);

  // Countdown timer
  useEffect(() => {
    if (remaining <= 0 || !isUnlocked) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;

        // Fire warning callback at 5-minute mark (once)
        if (
          next <= WARNING_THRESHOLD_SECONDS &&
          next > 0 &&
          prev > WARNING_THRESHOLD_SECONDS &&
          !hasWarningFired.current
        ) {
          hasWarningFired.current = true;
          onWarning?.();
        }

        // Fire expire callback when hitting 0 (once)
        if (next <= 0 && !hasExpiredFired.current) {
          hasExpiredFired.current = true;
          clearInterval(interval);
          // Use setTimeout to avoid state update during render
          setTimeout(() => onExpire?.(), 0);
          return 0;
        }

        return Math.max(0, next);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining, isUnlocked, onExpire, onWarning]);

  const formatTime = useCallback((totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }, []);

  return {
    hours: Math.floor(remaining / 3600),
    minutes: Math.floor((remaining % 3600) / 60),
    seconds: remaining % 60,
    totalSeconds: remaining,
    isExpired: remaining <= 0 && isUnlocked === true,
    isWarning: remaining > 0 && remaining <= WARNING_THRESHOLD_SECONDS && isUnlocked === true,
    formatted: formatTime(remaining),
  };
}
