# Form Components Reference

## Field

**Import**: `import { Field } from '@base-ui/react/field';`

**Structure**: `Field.Root > Field.Label + Field.Control + Field.Error + Field.Description`

**Key props**:
- Root: `name`, `validate` (returns error string or `null`), `validationMode` (default `'onSubmit'`, also `'onBlur'` | `'onChange'`), `validationDebounceTime` (default `0`, use with `onChange`), `invalid`, `disabled`
- Error: `match` — accepts ValidityState keys (`'valueMissing'`, `'typeMismatch'`, `'customError'`, `'patternMismatch'`, etc.) or `boolean`

**Validation modes**:
- `onSubmit` — validates on form submit; re-validates on change after first error
- `onBlur` — validates when control loses focus
- `onChange` — validates on every change (use with `validationDebounceTime`)

```tsx
<Field.Root name="email" validationMode="onBlur">
  <Field.Label>Email</Field.Label>
  <Field.Control type="email" required placeholder="you@example.com" />
  <Field.Error match="valueMissing">Email is required</Field.Error>
  <Field.Error match="typeMismatch">Enter a valid email</Field.Error>
</Field.Root>
```

**Custom validation with debounce**:
```tsx
<Field.Root
  validate={(value) => value.length < 3 ? 'Must be at least 3 characters' : null}
  validationMode="onChange"
  validationDebounceTime={300}
>
  <Field.Label>Username</Field.Label>
  <Field.Control />
  <Field.Error match="customError" />
</Field.Root>
```

**Field.Validity**: Render prop for granular validity state: `<Field.Validity>{(validity) => ...}</Field.Validity>`
**Field.Item**: Groups checkbox/radio with label inside a Field.

---

## Fieldset

**Import**: `import { Fieldset } from '@base-ui/react/fieldset';`

`Fieldset.Root` (renders `<fieldset>`) + `Fieldset.Legend`. Use `disabled` to disable all controls within.

---

## Form

**Import**: `import { Form } from '@base-ui/react/form';`

**Key props**: `errors` (Record of field errors `{ [fieldName]: string | string[] }`), `onClearErrors`, `onSubmit`

Use Form to propagate server-side errors to Field's `customError` slot:

```tsx
const [errors, setErrors] = useState({});

<Form
  errors={errors}
  onClearErrors={setErrors}
  onSubmit={async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const res = await submitForm(data);
    if (res.errors) setErrors(res.errors);
  }}
>
  <Field.Root name="email">
    <Field.Label>Email</Field.Label>
    <Field.Control type="email" required />
    <Field.Error match="customError" />
  </Field.Root>
  <button type="submit">Submit</button>
</Form>
```

---

## Input

**Import**: `import { Input } from '@base-ui/react/input';`

A styled `<input>` element. Supports `render` prop, state-based `className`/`style`. Use inside `Field.Root` for labeling/validation.

---

## Checkbox

**Import**: `import { Checkbox } from '@base-ui/react/checkbox';`

`Checkbox.Root` (renders `<span>` with hidden `<input>`) + `Checkbox.Indicator`

**Key props**: `name`, `defaultChecked`/`checked`, `onCheckedChange`, `indeterminate`, `value`, `uncheckedValue`, `disabled`, `readOnly`, `required`, `parent` (for group control)

Indicator: `keepMounted` (default `false`)

```tsx
<Field.Root>
  <Field.Label>
    <Checkbox.Root>
      <Checkbox.Indicator>✓</Checkbox.Indicator>
    </Checkbox.Root>
    Accept terms
  </Field.Label>
</Field.Root>
```

---

## Radio

**Import**: `import { Radio } from '@base-ui/react/radio';`
**Import**: `import { RadioGroup } from '@base-ui/react/radio-group';`

`RadioGroup` manages state, `Radio.Root` + `Radio.Indicator` for each option.

**Key props**: RadioGroup: `name`, `defaultValue`/`value`, `onValueChange`. Radio.Root: `value` (required).

```tsx
<Field.Root name="plan">
  <Fieldset.Root render={<RadioGroup />}>
    <Fieldset.Legend>Select a plan</Fieldset.Legend>
    <Field.Item>
      <Field.Label>
        <Radio.Root value="free"><Radio.Indicator /></Radio.Root>
        Free
      </Field.Label>
    </Field.Item>
    <Field.Item>
      <Field.Label>
        <Radio.Root value="pro"><Radio.Indicator /></Radio.Root>
        Pro
      </Field.Label>
    </Field.Item>
  </Fieldset.Root>
</Field.Root>
```

---

## NumberField

**Import**: `import { NumberField } from '@base-ui/react/number-field';`

**Structure**: `NumberField.Root > NumberField.ScrubArea + NumberField.Group > NumberField.Decrement + NumberField.Input + NumberField.Increment`

**Key props**: `value`/`defaultValue`, `onValueChange`, `min`, `max`, `step`, `smallStep`, `largeStep`, `allowWheelScrub`, `locale`, `format`

---

## Slider

**Import**: `import { Slider } from '@base-ui/react/slider';`

**Structure**: `Slider.Root > Slider.Value + Slider.Control > Slider.Track > Slider.Indicator + Slider.Thumb`

**Key props**: `value`/`defaultValue` (number or array for range), `onValueChange`, `onValueCommitted`, `min`, `max`, `step`, `orientation`

Range slider: use `defaultValue={[25, 75]}` with `<Slider.Thumb index={0} />` and `<Slider.Thumb index={1} />`

---

## Switch

**Import**: `import { Switch } from '@base-ui/react/switch';`

`Switch.Root` + `Switch.Thumb`. Props: `name`, `defaultChecked`/`checked`, `onCheckedChange`, `value`, `uncheckedValue`.

---

## Toggle

**Import**: `import { Toggle } from '@base-ui/react/toggle';`

A two-state `<button>`. Props: `value` (for ToggleGroup), `defaultPressed`/`pressed`, `onPressedChange`.
