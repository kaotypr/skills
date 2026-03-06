'use client';

import * as React from 'react';
import { Field } from '@base-ui/react/field';
import { Form } from '@base-ui/react/form';
import { Checkbox } from '@base-ui/react/checkbox';

interface SignupFormProps {
  onSubmit?: (data: { email: string; password: string; terms: boolean }) => Promise<{
    errors?: Record<string, string | string[]>;
  } | void>;
}

export default function SignupForm({ onSubmit }: SignupFormProps) {
  const [errors, setErrors] = React.useState<Record<string, string | string[]>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const terms = formData.get('terms') === 'on';

    if (onSubmit) {
      const result = await onSubmit({ email, password, terms });
      if (result?.errors) {
        setErrors(result.errors);
      }
    }
  };

  return (
    <Form
      errors={errors}
      onClearErrors={setErrors}
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 400 }}
    >
      {/* Email Field - validates on blur */}
      <Field.Root name="email" validationMode="onBlur">
        <Field.Label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
          Email
        </Field.Label>
        <Field.Control
          type="email"
          required
          placeholder="you@example.com"
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            border: '1px solid #ccc',
            borderRadius: 6,
            fontSize: '1rem',
            boxSizing: 'border-box',
          }}
        />
        <Field.Error match="valueMissing" style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Email is required.
        </Field.Error>
        <Field.Error match="typeMismatch" style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Please enter a valid email address.
        </Field.Error>
        <Field.Error match="customError" style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }} />
      </Field.Root>

      {/* Password Field - validates on change with debounce */}
      <Field.Root
        name="password"
        validationMode="onChange"
        validationDebounceTime={500}
        validate={(value) => {
          if (!value) return 'Password is required.';
          if (typeof value === 'string' && value.length < 8) {
            return 'Password must be at least 8 characters.';
          }
          return null;
        }}
      >
        <Field.Label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
          Password
        </Field.Label>
        <Field.Control
          type="password"
          required
          placeholder="Minimum 8 characters"
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            border: '1px solid #ccc',
            borderRadius: 6,
            fontSize: '1rem',
            boxSizing: 'border-box',
          }}
        />
        <Field.Error match="customError" style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }} />
      </Field.Root>

      {/* Terms Checkbox */}
      <Field.Root
        name="terms"
        validate={(value) => {
          if (!value || value === 'off') return 'You must accept the terms and conditions.';
          return null;
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <Field.Label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <Checkbox.Root
              name="terms"
              required
              style={{
                width: 18,
                height: 18,
                border: '2px solid #888',
                borderRadius: 4,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                cursor: 'pointer',
              }}
            >
              <Checkbox.Indicator
                style={{ fontSize: 12, lineHeight: 1 }}
              >
                &#10003;
              </Checkbox.Indicator>
            </Checkbox.Root>
            I agree to the terms and conditions
          </Field.Label>
        </div>
        <Field.Error match="customError" style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }} />
        <Field.Error match="valueMissing" style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          You must accept the terms and conditions.
        </Field.Error>
      </Field.Root>

      <button
        type="submit"
        style={{
          padding: '0.625rem 1.25rem',
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          marginTop: '0.5rem',
        }}
      >
        Sign Up
      </button>
    </Form>
  );
}
