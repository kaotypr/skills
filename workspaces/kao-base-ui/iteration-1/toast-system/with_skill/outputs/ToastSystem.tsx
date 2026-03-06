'use client';

import React, { useCallback } from 'react';
import { Toast } from '@base-ui/react/toast';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ToastType = 'success' | 'error' | 'loading' | 'info';

interface ToastData {
  icon?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Icons (inline SVG helpers)
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
      className="toast-spinner"
    >
      <circle
        cx="10"
        cy="10"
        r="8"
        stroke="#94a3b8"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="40 20"
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
      <path
        d="M10 9v5M10 6.5v.01"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 3l8 8M11 3l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const ICON_MAP: Record<ToastType, React.ReactNode> = {
  success: <SuccessIcon />,
  error: <ErrorIcon />,
  loading: <LoadingIcon />,
  info: <InfoIcon />,
};

// ---------------------------------------------------------------------------
// Styles (injected via <style> tag)
// ---------------------------------------------------------------------------

const TOAST_STYLES = `
  @keyframes toast-spinner {
    to { transform: rotate(360deg); }
  }

  .toast-spinner {
    animation: toast-spinner 0.8s linear infinite;
  }

  .toast-viewport {
    position: fixed;
    bottom: 16px;
    right: 16px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 420px;
    width: 100%;
    pointer-events: none;
  }

  .toast-root {
    pointer-events: auto;
    transform: translateX(var(--toast-swipe-movement-x, 0))
               translateY(var(--toast-swipe-movement-y, 0));
    transition:
      opacity 300ms ease,
      transform 300ms ease;
    opacity: 1;
  }

  .toast-root[data-starting-style] {
    opacity: 0;
    transform: translateY(12px);
  }

  .toast-root[data-ending-style] {
    opacity: 0;
    transform: translateX(100%);
  }

  .toast-root[data-swiping] {
    transition: none;
  }

  .toast-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 10px;
    background: #fff;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #1e293b;
  }

  .toast-content[data-type="success"] {
    border-left: 3px solid #22c55e;
  }

  .toast-content[data-type="error"] {
    border-left: 3px solid #ef4444;
  }

  .toast-content[data-type="loading"] {
    border-left: 3px solid #94a3b8;
  }

  .toast-content[data-type="info"] {
    border-left: 3px solid #3b82f6;
  }

  .toast-icon {
    flex-shrink: 0;
    margin-top: 1px;
  }

  .toast-body {
    flex: 1;
    min-width: 0;
  }

  .toast-title {
    font-weight: 600;
    font-size: 14px;
    margin: 0;
    color: #0f172a;
  }

  .toast-description {
    margin: 2px 0 0;
    font-size: 13px;
    color: #64748b;
  }

  .toast-close {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    color: #94a3b8;
    border-radius: 4px;
    cursor: pointer;
    padding: 0;
    margin-top: -2px;
    transition: color 150ms, background 150ms;
  }

  .toast-close:hover {
    color: #475569;
    background: #f1f5f9;
  }

  @media (prefers-color-scheme: dark) {
    .toast-content {
      background: #1e293b;
      border-color: #334155;
      color: #e2e8f0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .toast-title {
      color: #f1f5f9;
    }

    .toast-description {
      color: #94a3b8;
    }

    .toast-close {
      color: #64748b;
    }

    .toast-close:hover {
      color: #cbd5e1;
      background: #334155;
    }
  }
`;

// ---------------------------------------------------------------------------
// ToastList — renders all active toasts
// ---------------------------------------------------------------------------

function ToastList() {
  const toastManager = Toast.useToastManager();

  return (
    <>
      {toastManager.toasts.map((toast) => (
        <Toast.Root
          key={toast.id}
          toast={toast}
          className="toast-root"
          swipeDirection={['right', 'down']}
        >
          <Toast.Content className="toast-content">
            <span className="toast-icon">
              {(toast.data as ToastData)?.icon ??
                ICON_MAP[(toast.type as ToastType) ?? 'info']}
            </span>
            <div className="toast-body">
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
              <CloseIcon />
            </Toast.Close>
          </Toast.Content>
        </Toast.Root>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// useToast — convenience hook wrapping useToastManager
// ---------------------------------------------------------------------------

export function useToast() {
  const toastManager = Toast.useToastManager();

  const success = useCallback(
    (title: string, description?: string) =>
      toastManager.add({ title, description, type: 'success' }),
    [toastManager],
  );

  const error = useCallback(
    (title: string, description?: string) =>
      toastManager.add({ title, description, type: 'error' }),
    [toastManager],
  );

  const info = useCallback(
    (title: string, description?: string) =>
      toastManager.add({ title, description, type: 'info' }),
    [toastManager],
  );

  const loading = useCallback(
    (title: string, description?: string) =>
      toastManager.add({ title, description, type: 'loading', timeout: 0 }),
    [toastManager],
  );

  /**
   * Show a loading toast that automatically converts to success or error
   * when the provided promise resolves or rejects.
   *
   * @example
   * toast.promise(fetch('/api/save', { method: 'POST' }), {
   *   loading: { title: 'Saving...' },
   *   success: { title: 'Saved!' },
   *   error:   { title: 'Save failed' },
   * });
   */
  const promise = useCallback(
    <T,>(
      promiseOrFn: Promise<T> | (() => Promise<T>),
      options: {
        loading: { title: string; description?: string };
        success:
          | { title: string; description?: string }
          | ((result: T) => { title: string; description?: string });
        error:
          | { title: string; description?: string }
          | ((err: unknown) => { title: string; description?: string });
      },
    ): Promise<T> => {
      const p =
        typeof promiseOrFn === 'function' ? promiseOrFn() : promiseOrFn;

      toastManager.promise(p, {
        loading: { ...options.loading, type: 'loading' },
        success:
          typeof options.success === 'function'
            ? (result: T) => {
                const resolved = (
                  options.success as (
                    r: T,
                  ) => { title: string; description?: string }
                )(result);
                return { ...resolved, type: 'success' };
              }
            : { ...options.success, type: 'success' },
        error:
          typeof options.error === 'function'
            ? (err: unknown) => {
                const resolved = (
                  options.error as (
                    e: unknown,
                  ) => { title: string; description?: string }
                )(err);
                return { ...resolved, type: 'error' };
              }
            : { ...options.error, type: 'error' },
      });

      return p;
    },
    [toastManager],
  );

  return {
    success,
    error,
    info,
    loading,
    promise,
    /** Direct access to the underlying manager for advanced usage */
    manager: toastManager,
  };
}

// ---------------------------------------------------------------------------
// ToastSystem — drop-in provider + viewport wrapper
// ---------------------------------------------------------------------------

export interface ToastSystemProps {
  children: React.ReactNode;
  /** Maximum number of visible toasts (default: 5) */
  limit?: number;
  /** Auto-dismiss timeout in ms (default: 5000). Set 0 to disable. */
  timeout?: number;
}

export function ToastSystem({
  children,
  limit = 5,
  timeout = 5000,
}: ToastSystemProps) {
  return (
    <Toast.Provider limit={limit} timeout={timeout}>
      <style>{TOAST_STYLES}</style>
      {children}
      <Toast.Portal>
        <Toast.Viewport className="toast-viewport">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

// ---------------------------------------------------------------------------
// Default export
// ---------------------------------------------------------------------------

export default ToastSystem;
