"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ToastVariant = "success" | "error" | "loading";

interface ToastData {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  /** Show a success toast */
  success: (message: string, opts?: { duration?: number }) => string;
  /** Show an error toast */
  error: (message: string, opts?: { duration?: number }) => string;
  /**
   * Show a loading toast that stays until resolved.
   * Returns helpers to transition the toast to success or error.
   */
  loading: (message: string) => {
    id: string;
    success: (message: string) => void;
    error: (message: string) => void;
  };
  /** Programmatically dismiss a toast by id */
  dismiss: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let toastCounter = 0;
function genId(): string {
  toastCounter += 1;
  return `toast-${toastCounter}-${Date.now()}`;
}

const DEFAULT_DURATION = 4000;

// ---------------------------------------------------------------------------
// Icons (inline SVG so we don't need external deps)
// ---------------------------------------------------------------------------

function SuccessIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="10" fill="#22c55e" />
      <path
        d="M6 10.5l2.5 2.5 5.5-5.5"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="10" fill="#ef4444" />
      <path
        d="M7 7l6 6M13 7l-6 6"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LoadingIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      style={{ animation: "toast-spin 1s linear infinite" }}
    >
      <circle
        cx="10"
        cy="10"
        r="8"
        stroke="#a1a1aa"
        strokeWidth="2.5"
        strokeDasharray="40 20"
        strokeLinecap="round"
      />
    </svg>
  );
}

const iconMap: Record<ToastVariant, React.FC> = {
  success: SuccessIcon,
  error: ErrorIcon,
  loading: LoadingIcon,
};

// ---------------------------------------------------------------------------
// Single Toast component (handles swipe-to-dismiss)
// ---------------------------------------------------------------------------

const SWIPE_THRESHOLD = 80;

interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [offsetX, setOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [exiting, setExiting] = useState(false);
  const startXRef = useRef<number | null>(null);
  const currentXRef = useRef(0);

  // Auto-dismiss for non-loading toasts
  useEffect(() => {
    if (toast.variant === "loading") return;
    const ms = toast.duration ?? DEFAULT_DURATION;
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, ms);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  // --- Pointer-based swipe handling ---
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      startXRef.current = e.clientX;
      currentXRef.current = 0;
      setIsSwiping(true);
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (startXRef.current === null) return;
      const dx = e.clientX - startXRef.current;
      currentXRef.current = dx;
      setOffsetX(dx);
    },
    []
  );

  const handlePointerUp = useCallback(() => {
    setIsSwiping(false);
    if (Math.abs(currentXRef.current) > SWIPE_THRESHOLD) {
      // Swipe out
      const direction = currentXRef.current > 0 ? 1 : -1;
      setOffsetX(direction * 400);
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    } else {
      setOffsetX(0);
    }
    startXRef.current = null;
    currentXRef.current = 0;
  }, [onDismiss, toast.id]);

  // --- Touch-based swipe handling (for mobile) ---
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      startXRef.current = e.touches[0].clientX;
      currentXRef.current = 0;
      setIsSwiping(true);
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (startXRef.current === null) return;
      const dx = e.touches[0].clientX - startXRef.current;
      currentXRef.current = dx;
      setOffsetX(dx);
    },
    []
  );

  const handleTouchEnd = useCallback(() => {
    setIsSwiping(false);
    if (Math.abs(currentXRef.current) > SWIPE_THRESHOLD) {
      const direction = currentXRef.current > 0 ? 1 : -1;
      setOffsetX(direction * 400);
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    } else {
      setOffsetX(0);
    }
    startXRef.current = null;
    currentXRef.current = 0;
  }, [onDismiss, toast.id]);

  const Icon = iconMap[toast.variant];

  const variantStyles: Record<ToastVariant, React.CSSProperties> = {
    success: { borderLeft: "4px solid #22c55e" },
    error: { borderLeft: "4px solid #ef4444" },
    loading: { borderLeft: "4px solid #a1a1aa" },
  };

  return (
    <div
      role="status"
      aria-live="polite"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 18px",
        borderRadius: "8px",
        backgroundColor: "#18181b",
        color: "#fafafa",
        fontSize: "14px",
        lineHeight: "1.4",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        transform: `translateX(${offsetX}px)`,
        opacity: exiting ? 0 : 1 - Math.min(Math.abs(offsetX) / 300, 0.6),
        transition: isSwiping
          ? "none"
          : "transform 0.3s ease, opacity 0.3s ease",
        cursor: "grab",
        userSelect: "none",
        touchAction: "pan-y",
        animation: exiting ? undefined : "toast-slide-in 0.3s ease forwards",
        ...variantStyles[toast.variant],
      }}
    >
      <span style={{ flexShrink: 0, display: "flex" }}>
        <Icon />
      </span>
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        aria-label="Dismiss toast"
        onClick={() => {
          setExiting(true);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        style={{
          background: "none",
          border: "none",
          color: "#71717a",
          cursor: "pointer",
          fontSize: "18px",
          lineHeight: 1,
          padding: "0 0 0 8px",
          flexShrink: 0,
        }}
      >
        &times;
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Provider + viewport
// ---------------------------------------------------------------------------

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((t: ToastData) => {
    setToasts((prev) => [...prev, t]);
  }, []);

  const updateToast = useCallback(
    (id: string, patch: Partial<ToastData>) => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...patch } : t))
      );
    },
    []
  );

  const success = useCallback(
    (message: string, opts?: { duration?: number }) => {
      const id = genId();
      addToast({ id, message, variant: "success", duration: opts?.duration });
      return id;
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, opts?: { duration?: number }) => {
      const id = genId();
      addToast({ id, message, variant: "error", duration: opts?.duration });
      return id;
    },
    [addToast]
  );

  const loading = useCallback(
    (message: string) => {
      const id = genId();
      addToast({ id, message, variant: "loading" });
      return {
        id,
        success: (msg: string) => {
          updateToast(id, { message: msg, variant: "success" });
        },
        error: (msg: string) => {
          updateToast(id, { message: msg, variant: "error" });
        },
      };
    },
    [addToast, updateToast]
  );

  const contextValue: ToastContextValue = {
    success,
    error,
    loading,
    dismiss,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes toast-slide-in {
          from {
            transform: translateY(16px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes toast-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      {/* Toast viewport – bottom-right */}
      {toasts.length > 0 && (
        <div
          aria-label="Notifications"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            zIndex: 9999,
            maxWidth: "380px",
            width: "100%",
            pointerEvents: "none",
          }}
        >
          {toasts.map((t) => (
            <div key={t.id} style={{ pointerEvents: "auto" }}>
              <ToastItem toast={t} onDismiss={dismiss} />
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Demo component – shows all toast types including promise-based loading
// ---------------------------------------------------------------------------

function fakeApiCall(shouldSucceed: boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve("Data loaded successfully");
      } else {
        reject(new Error("Network request failed"));
      }
    }, 2000);
  });
}

export default function ToastSystem() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success("Changes saved successfully!");
  };

  const handleError = () => {
    toast.error("Something went wrong. Please try again.");
  };

  const handleLoadingSuccess = async () => {
    const t = toast.loading("Saving changes...");
    try {
      const msg = await fakeApiCall(true);
      t.success(msg);
    } catch (err: unknown) {
      t.error(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleLoadingError = async () => {
    const t = toast.loading("Fetching data...");
    try {
      await fakeApiCall(false);
      t.success("Done!");
    } catch (err: unknown) {
      t.error(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "40px",
        maxWidth: "400px",
      }}
    >
      <h2 style={{ margin: 0, fontSize: "20px" }}>Toast Notifications</h2>
      <p style={{ margin: 0, color: "#71717a", fontSize: "14px" }}>
        Swipe any toast left or right to dismiss it.
      </p>

      <button onClick={handleSuccess} style={btnStyle("#22c55e")}>
        Show Success Toast
      </button>
      <button onClick={handleError} style={btnStyle("#ef4444")}>
        Show Error Toast
      </button>
      <button onClick={handleLoadingSuccess} style={btnStyle("#3b82f6")}>
        Loading &rarr; Success
      </button>
      <button onClick={handleLoadingError} style={btnStyle("#f59e0b")}>
        Loading &rarr; Error
      </button>
    </div>
  );
}

function btnStyle(color: string): React.CSSProperties {
  return {
    padding: "10px 16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: color,
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  };
}
