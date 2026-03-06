"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Field, Fieldset, Checkbox } from "@base-ui-components/react";

function useDebounce(callback: (value: string) => void, delay: number) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedFn = useCallback(
    (value: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(value);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFn;
}

interface FormErrors {
  email?: string;
  password?: string;
  terms?: string;
  server?: string;
}

async function fakeSignup(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email === "taken@example.com") {
        resolve({ success: false, error: "This email is already registered." });
      } else {
        resolve({ success: true });
      }
    }, 1000);
  });
}

function validateEmail(email: string): string | undefined {
  if (!email) return "Email is required.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address.";
  return undefined;
}

function validatePassword(password: string): string | undefined {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  return undefined;
}

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const setError = useCallback((field: keyof FormErrors, message: string | undefined) => {
    setErrors((prev) => {
      if (prev[field] === message) return prev;
      const next = { ...prev };
      if (message) {
        next[field] = message;
      } else {
        delete next[field];
      }
      return next;
    });
  }, []);

  const handleEmailBlur = useCallback(() => {
    setError("email", validateEmail(email));
  }, [email, setError]);

  const debouncedPasswordValidation = useDebounce(
    useCallback((value: string) => {
      setError("password", validatePassword(value));
    }, [setError]),
    300
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setPassword(value);
      debouncedPasswordValidation(value);
    },
    [debouncedPasswordValidation]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("server", undefined);

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const termsError = !termsAccepted ? "You must accept the terms and conditions." : undefined;

    setErrors({
      email: emailError,
      password: passwordError,
      terms: termsError,
    });

    if (emailError || passwordError || termsError) return;

    setSubmitting(true);
    try {
      const result = await fakeSignup(email, password);
      if (!result.success) {
        setError("server", result.error);
      } else {
        setSuccess(true);
      }
    } catch {
      setError("server", "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.successBox}>
          <h2 style={styles.heading}>Account Created</h2>
          <p>Your account has been successfully created.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} noValidate style={styles.form}>
        <h2 style={styles.heading}>Sign Up</h2>

        {errors.server && (
          <div role="alert" style={styles.serverError}>
            {errors.server}
          </div>
        )}

        <Fieldset.Root style={styles.fieldset}>
          <Fieldset.Legend style={styles.legend}>Account Details</Fieldset.Legend>

          <Field.Root invalid={!!errors.email} style={styles.fieldRoot}>
            <Field.Label style={styles.label}>Email</Field.Label>
            <Field.Control
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
                if (errors.email) setError("email", undefined);
              }}
              onBlur={handleEmailBlur}
              required
              style={styles.input}
            />
            {errors.email && (
              <Field.Error style={styles.error} forceShow>
                {errors.email}
              </Field.Error>
            )}
          </Field.Root>

          <Field.Root invalid={!!errors.password} style={styles.fieldRoot}>
            <Field.Label style={styles.label}>Password</Field.Label>
            <Field.Control
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={handlePasswordChange}
              required
              style={styles.input}
            />
            {errors.password && (
              <Field.Error style={styles.error} forceShow>
                {errors.password}
              </Field.Error>
            )}
            {!errors.password && password.length > 0 && (
              <Field.Description style={styles.description}>
                Password strength: {password.length >= 12 ? "Strong" : "Acceptable"}
              </Field.Description>
            )}
          </Field.Root>

          <Field.Root invalid={!!errors.terms} style={styles.fieldRoot}>
            <div style={styles.checkboxRow}>
              <Checkbox.Root
                checked={termsAccepted}
                onCheckedChange={(checked) => {
                  setTermsAccepted(checked === true);
                  if (checked) setError("terms", undefined);
                }}
                style={styles.checkbox}
                aria-label="Accept terms and conditions"
              >
                <Checkbox.Indicator style={styles.checkboxIndicator}>
                  <CheckIcon />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <Field.Label style={styles.checkboxLabel}>
                I agree to the terms and conditions
              </Field.Label>
            </div>
            {errors.terms && (
              <Field.Error style={styles.error} forceShow>
                {errors.terms}
              </Field.Error>
            )}
          </Field.Root>
        </Fieldset.Root>

        <button type="submit" disabled={submitting} style={styles.button}>
          {submitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M10 3L4.5 8.5L2 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "2rem",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  form: {
    width: "100%",
    maxWidth: 420,
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  heading: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: 600,
  },
  serverError: {
    padding: "0.75rem 1rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fca5a5",
    borderRadius: 6,
    color: "#b91c1c",
    fontSize: "0.875rem",
  },
  fieldset: {
    border: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  legend: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#6b7280",
    marginBottom: "0.25rem",
  },
  fieldRoot: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#1f2937",
  },
  input: {
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    outline: "none",
    transition: "border-color 0.15s",
  },
  error: {
    fontSize: "0.8125rem",
    color: "#dc2626",
  },
  description: {
    fontSize: "0.8125rem",
    color: "#6b7280",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  checkbox: {
    width: 20,
    height: 20,
    border: "1px solid #d1d5db",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    backgroundColor: "#fff",
    padding: 0,
    flexShrink: 0,
  },
  checkboxIndicator: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#2563eb",
  },
  checkboxLabel: {
    fontSize: "0.875rem",
    color: "#1f2937",
    cursor: "pointer",
  },
  button: {
    padding: "0.625rem 1.25rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#fff",
    backgroundColor: "#2563eb",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    transition: "background-color 0.15s",
  },
  successBox: {
    padding: "2rem",
    textAlign: "center" as const,
    maxWidth: 420,
  },
};
