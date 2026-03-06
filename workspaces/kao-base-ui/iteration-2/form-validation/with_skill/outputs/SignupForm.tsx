'use client';

import * as React from 'react';
import { Form } from '@base-ui/react/form';
import { Field } from '@base-ui/react/field';
import { Checkbox } from '@base-ui/react/checkbox';

import styles from './SignupForm.module.css';

interface ServerErrors {
  [fieldName: string]: string | string[];
}

async function submitSignup(data: FormData): Promise<{ errors?: ServerErrors }> {
  // Replace with your actual API call
  const res = await fetch('/api/signup', {
    method: 'POST',
    body: data,
  });
  const json = await res.json();
  if (!res.ok) {
    return { errors: json.errors };
  }
  return {};
}

export default function SignupForm() {
  const [serverErrors, setServerErrors] = React.useState<ServerErrors>({});

  return (
    <Form
      errors={serverErrors}
      onClearErrors={setServerErrors}
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const result = await submitSignup(formData);
        if (result.errors) {
          setServerErrors(result.errors);
        }
      }}
      className={styles.form}
    >
      {/* Email field - validates on blur */}
      <Field.Root name="email" validationMode="onBlur">
        <Field.Label className={styles.label}>Email</Field.Label>
        <Field.Control
          type="email"
          required
          placeholder="you@example.com"
          className={styles.input}
        />
        <Field.Error match="valueMissing" className={styles.error}>
          Email is required.
        </Field.Error>
        <Field.Error match="typeMismatch" className={styles.error}>
          Please enter a valid email address.
        </Field.Error>
        <Field.Error match="customError" className={styles.error} />
      </Field.Root>

      {/* Password field - validates on change with debounce, min 8 chars */}
      <Field.Root
        name="password"
        validationMode="onChange"
        validationDebounceTime={300}
        validate={(value) => {
          if (!value) {
            return 'Password is required.';
          }
          if (String(value).length < 8) {
            return 'Password must be at least 8 characters.';
          }
          return null;
        }}
      >
        <Field.Label className={styles.label}>Password</Field.Label>
        <Field.Control
          type="password"
          required
          placeholder="Enter your password"
          className={styles.input}
        />
        <Field.Error match="customError" className={styles.error} />
      </Field.Root>

      {/* Terms checkbox */}
      <Field.Root name="terms">
        <div className={styles.checkboxRow}>
          <Checkbox.Root name="terms" required className={styles.checkbox}>
            <Checkbox.Indicator className={styles.checkboxIndicator}>
              &#10003;
            </Checkbox.Indicator>
          </Checkbox.Root>
          <Field.Label className={styles.checkboxLabel}>
            I agree to the Terms of Service and Privacy Policy
          </Field.Label>
        </div>
        <Field.Error match="valueMissing" className={styles.error}>
          You must accept the terms to continue.
        </Field.Error>
        <Field.Error match="customError" className={styles.error} />
      </Field.Root>

      <button type="submit" className={styles.submitButton}>
        Sign Up
      </button>
    </Form>
  );
}
