"use client";

import * as React from "react";
import { HiExclamationTriangle, HiArrowRightOnRectangle } from "react-icons/hi2";
import { signOutAction } from "@/app/auth/actions";

// Default time limits in milliseconds:
// 5 minutes (300,000 ms) of total inactivity
// Show warning modal 30 seconds (30,000 ms) before logout (at 4.5 minutes / 270,000 ms)
const DEFAULT_INACTIVITY_LIMIT = 5 * 60 * 1000;
const DEFAULT_WARNING_THRESHOLD = 4.5 * 60 * 1000;
const WARNING_DURATION = 30; // 30 seconds

const STORAGE_KEY = "admin_last_active";

export default function InactivityTimeout(): React.JSX.Element | null {
  const [showWarning, setShowWarning] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(WARNING_DURATION);
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  // Keep references to prevent closure stale values
  const showWarningRef = React.useRef(false);
  const isSigningOutRef = React.useRef(false);

  React.useEffect(() => {
    showWarningRef.current = showWarning;
  }, [showWarning]);

  React.useEffect(() => {
    isSigningOutRef.current = isSigningOut;
  }, [isSigningOut]);

  // Handle actual sign out
  const triggerSignOut = React.useCallback(async () => {
    if (isSigningOutRef.current) return;
    setIsSigningOut(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
      await signOutAction();
    } catch (error) {
      console.error("Inactivity signout error, falling back to redirect:", error);
      window.location.href = "/login";
    }
  }, []);

  // Extend the session / reset active timestamp
  const extendSession = React.useCallback(() => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setShowWarning(false);
    setTimeLeft(WARNING_DURATION);
  }, []);

  React.useEffect(() => {
    // 1. Initialize active timestamp on mount
    localStorage.setItem(STORAGE_KEY, Date.now().toString());

    // 2. Track activity to reset the timer (only if warning is NOT active)
    const handleActivity = () => {
      if (showWarningRef.current || isSigningOutRef.current) return;
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    };

    const activityEvents = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // 3. Monitor inactivity periodically (every 500ms for responsiveness)
    const monitorInterval = setInterval(() => {
      if (isSigningOutRef.current) return;

      const lastActiveStr = localStorage.getItem(STORAGE_KEY);
      const lastActive = lastActiveStr ? parseInt(lastActiveStr, 10) : Date.now();
      const elapsed = Date.now() - lastActive;

      if (elapsed >= DEFAULT_INACTIVITY_LIMIT) {
        // Log out immediately
        clearInterval(monitorInterval);
        triggerSignOut();
      } else if (elapsed >= DEFAULT_WARNING_THRESHOLD) {
        // Show warning and compute accurate seconds remaining based on elapsed time
        const secondsRemaining = Math.max(
          0,
          Math.ceil((DEFAULT_INACTIVITY_LIMIT - elapsed) / 1000)
        );

        if (!showWarningRef.current) {
          setShowWarning(true);
        }
        setTimeLeft(secondsRemaining);
      } else {
        // Hide warning if active in another tab
        if (showWarningRef.current) {
          setShowWarning(false);
        }
      }
    }, 500);

    // 4. Sync across multiple tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const lastActive = parseInt(e.newValue, 10);
        const elapsed = Date.now() - lastActive;
        if (elapsed < DEFAULT_WARNING_THRESHOLD && showWarningRef.current) {
          setShowWarning(false);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(monitorInterval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [triggerSignOut]);

  if (!showWarning) return null;

  // Circle math for SVG countdown
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / WARNING_DURATION) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/60 backdrop-blur-md transition-opacity duration-300">
      {/* Glassmorphism modal wrapper */}
      <div 
        className="relative bg-white/90 dark:bg-dark-green/95 backdrop-blur-xl border border-white/20 dark:border-primary/20 shadow-2xl rounded-3xl p-8 max-w-md w-full mx-4 text-center transform scale-100 transition-all duration-300 flex flex-col items-center"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="inactivity-title"
        aria-describedby="inactivity-desc"
      >
        {/* Warning Indicator Header */}
        <div className="w-14 h-14 bg-accent/15 text-accent rounded-full flex items-center justify-center mb-6 animate-pulse">
          <HiExclamationTriangle className="w-8 h-8" />
        </div>

        <h3 id="inactivity-title" className="font-marcellus text-2xl font-bold text-dark dark:text-white mb-2">
          Session Expiring Soon
        </h3>
        <p id="inactivity-desc" className="font-sans text-sm text-light-ash dark:text-light/80 mb-6 max-w-sm">
          You have been inactive for a while. For security reasons, you will be signed out automatically.
        </p>

        {/* Circular Countdown Progress Indicator */}
        <div className="relative flex items-center justify-center mb-8">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-muted/20 dark:stroke-muted/10"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-accent transition-all duration-1000 ease-linear"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-sans text-3xl font-extrabold text-dark dark:text-white">
              {timeLeft}
            </span>
            <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-light-ash/70 dark:text-light/60">
              seconds
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={extendSession}
            disabled={isSigningOut}
            className="flex-1 bg-primary text-white hover:bg-primary-dark font-semibold font-sans py-3 px-5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer active:scale-98"
          >
            Stay Signed In
          </button>
          <button
            onClick={triggerSignOut}
            disabled={isSigningOut}
            className="flex-1 bg-light border border-muted/50 text-light-ash hover:bg-light/80 hover:text-dark font-semibold font-sans py-3 px-5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-98"
          >
            {isSigningOut ? (
              <span className="w-5 h-5 border-2 border-light-ash border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <HiArrowRightOnRectangle className="w-5 h-5" />
                Sign Out
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
