"use client";

import React, { useCallback } from "react";
import { Toast } from "@base-ui/react/toast";

// ─── Types ───────────────────────────────────────────────────────────────────

type ToastType = "success" | "error" | "loading" | "info";

interface ToastData {
  title: string;
  description?: string;
  type?: ToastType;
}

// ─── Global toast manager (usable outside React) ────────────────────────────

const toastManager = Toast.createToastManager();

// ─── Public API ──────────────────────────────────────────────────────────────

export function showSuccessToast(title: string, description?: string) {
  return toastManager.add({ title, description, type: "success" });
}

export function showErrorToast(title: string, description?: string) {
  return toastManager.add({ title, description, type: "error" });
}

export function showLoadingToast(title: string, description?: string) {
  return toastManager.add({ title, description, type: "loading", timeout: 0 });
}

/**
 * Shows a loading toast that automatically converts to success or error
 * when the provided promise resolves or rejects.
 */
export function showPromiseToast<T>(
  promise: Promise<T>,
  options: {
    loading: { title: string; description?: string };
    success: { title: string; description?: string };
    error: { title: string; description?: string };
  }
) {
  return toastManager.promise(promise, {
    loading: { ...options.loading, type: "loading" },
    success: { ...options.success, type: "success" },
    error: { ...options.error, type: "error" },
  });
}

export { toastManager };

// ─── Icon components ─────────────────────────────────────────────────────────

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
        d="M6 10.5l2.5 2.5L14 7"
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

function LoadingSpinner() {
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
        stroke="#d1d5db"
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M10 2a8 8 0 0 1 8 8"
        stroke="#3b82f6"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="10" fill="#3b82f6" />
      <text
        x="10"
        y="15"
        textAnchor="middle"
        fill="#fff"
        fontSize="13"
        fontWeight="bold"
        fontFamily="serif"
      >
        i
      </text>
    </svg>
  );
}

function ToastIcon({ type }: { type?: string }) {
  switch (type) {
    case "success":
      return <SuccessIcon />;
    case "error":
      return <ErrorIcon />;
    case "loading":
      return <LoadingSpinner />;
    case "info":
      return <InfoIcon />;
    default:
      return <InfoIcon />;
  }
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = `
  @keyframes toast-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .toast-viewport {
    position: fixed;
    bottom: 16px;
    right: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 9999;
    max-width: 420px;
    width: 100%;
    pointer-events: none;
  }

  .toast-root {
    pointer-events: auto;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.06);
    overflow: hidden;
    opacity: 1;
    transform: translateX(0) translateY(0);
    transition:
      opacity 300ms ease,
      transform 300ms ease;
  }

  .toast-root[data-starting-style] {
    opacity: 0;
    transform: translateX(100%);
  }

  .toast-root[data-ending-style] {
    opacity: 0;
    transform: translateX(100%);
  }

  .toast-root[data-swipe-direction="right"] {
    transform: translateX(var(--toast-swipe-movement-x));
  }

  .toast-root[data-swipe-direction="down"] {
    transform: translateY(var(--toast-swipe-movement-y));
  }

  .toast-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
  }

  .toast-icon {
    flex-shrink: 0;
    margin-top: 1px;
  }

  .toast-text {
    flex: 1;
    min-width: 0;
  }

  .toast-title {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    line-height: 1.4;
    margin: 0;
  }

  .toast-description {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.4;
    margin: 4px 0 0;
  }

  .toast-close {
    flex-shrink: 0;
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 2px;
    border-radius: 4px;
    line-height: 1;
    font-size: 18px;
    transition: color 150ms ease, background-color 150ms ease;
    align-self: flex-start;
  }

  .toast-close:hover {
    color: #374151;
    background-color: #f3f4f6;
  }

  .toast-root[data-type="success"] {
    border-left: 4px solid #22c55e;
  }

  .toast-root[data-type="error"] {
    border-left: 4px solid #ef4444;
  }

  .toast-root[data-type="loading"] {
    border-left: 4px solid #3b82f6;
  }

  .toast-root[data-type="info"] {
    border-left: 4px solid #3b82f6;
  }
`;

// ─── Toast list (renders inside Provider) ────────────────────────────────────

function ToastList() {
  const manager = Toast.useToastManager();

  return (
    <>
      {manager.toasts.map((toast) => (
        <Toast.Root
          key={toast.id}
          toast={toast}
          className="toast-root"
          swipeDirection={["right", "down"]}
          data-type={toast.type}
        >
          <Toast.Content className="toast-content">
            <span className="toast-icon">
              <ToastIcon type={toast.type} />
            </span>
            <div className="toast-text">
              <Toast.Title className="toast-title">
                {toast.title}
              </Toast.Title>
              {toast.description && (
                <Toast.Description className="toast-description">
                  {toast.description}
                </Toast.Description>
              )}
            </div>
            <Toast.Close className="toast-close" aria-label="Dismiss">
              &times;
            </Toast.Close>
          </Toast.Content>
        </Toast.Root>
      ))}
    </>
  );
}

// ─── Demo controls (inside Provider to access useToastManager) ───────────────

function DemoControls() {
  const manager = Toast.useToastManager();

  const handleSuccess = useCallback(() => {
    manager.add({
      title: "Changes saved",
      description: "Your profile has been updated successfully.",
      type: "success",
    });
  }, [manager]);

  const handleError = useCallback(() => {
    manager.add({
      title: "Something went wrong",
      description: "Could not save your changes. Please try again.",
      type: "error",
    });
  }, [manager]);

  const handlePromise = useCallback(() => {
    const fakeApiCall = new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.3 ? resolve() : reject(new Error("Network error"));
      }, 2000);
    });

    manager.promise(fakeApiCall, {
      loading: {
        title: "Uploading...",
        description: "Please wait while we process your file.",
        type: "loading",
      },
      success: {
        title: "Upload complete",
        description: "Your file has been uploaded successfully.",
        type: "success",
      },
      error: {
        title: "Upload failed",
        description: "The file could not be uploaded. Please try again.",
        type: "error",
      },
    });
  }, [manager]);

  const buttonStyle: React.CSSProperties = {
    padding: "10px 20px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    transition: "background 150ms ease",
  };

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <button
        onClick={handleSuccess}
        style={{ ...buttonStyle, borderColor: "#22c55e", color: "#16a34a" }}
      >
        Success Toast
      </button>
      <button
        onClick={handleError}
        style={{ ...buttonStyle, borderColor: "#ef4444", color: "#dc2626" }}
      >
        Error Toast
      </button>
      <button
        onClick={handlePromise}
        style={{ ...buttonStyle, borderColor: "#3b82f6", color: "#2563eb" }}
      >
        Promise Toast (Loading → Result)
      </button>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

/**
 * ToastSystem
 *
 * A complete toast notification system built with @base-ui/react Toast.
 *
 * Features:
 * - Success, error, loading, and info toast types
 * - Loading toasts that convert to success/error via `promise()`
 * - Swipe-to-dismiss (right and down)
 * - Global toast manager for use outside React components
 * - Slide-in/out animations
 * - Accessible with ARIA live regions (handled by Base UI)
 *
 * Usage:
 *   Wrap your app with <ToastSystem> and use the exported helpers:
 *     showSuccessToast('Saved!')
 *     showErrorToast('Failed!')
 *     showPromiseToast(fetchData(), { loading: {...}, success: {...}, error: {...} })
 *
 *   Or use Toast.useToastManager() inside the provider for the hook API.
 */
export default function ToastSystem({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <Toast.Provider toastManager={toastManager} limit={5} timeout={5000}>
      <style>{styles}</style>

      {children ?? <DemoControls />}

      <Toast.Portal>
        <Toast.Viewport className="toast-viewport">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}
