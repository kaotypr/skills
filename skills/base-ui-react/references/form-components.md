# Form Components Reference

Form components handle user input, validation, and accessibility labeling. They integrate with the `Field` and `Form` components for validation and form submission.

## Table of Contents

- [Field](#field)
- [Fieldset](#fieldset)
- [Form](#form)
- [Input](#input)
- [Checkbox](#checkbox)
- [Radio](#radio)
- [NumberField](#numberfield)
- [Slider](#slider)
- [Switch](#switch)
- [Toggle](#toggle)

---

## Field

**Import**: `import { Field } from '@base-ui/react/field';`

Groups a form control with its label, description, and error messages. Provides validation state.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `Field.Root` | `<div>` | Groups all field parts |
| `Field.Label` | `<label>` | Accessible label |
| `Field.Control` | `<input>` | Form input element |
| `Field.Description` | `<p>` | Helper text |
| `Field.Error` | `<div>` | Error message |
| `Field.Validity` | — | Render prop for validity state |
| `Field.Item` | `<div>` | Groups checkbox/radio with label |

### Root Props

- `name` — Form submission identifier
- `validate` — Custom validation function returning error string(s) or `null`
- `validationMode` (default: `'onSubmit'`) — `'onSubmit'` | `'onBlur'` | `'onChange'`
- `validationDebounceTime` (default: `0`) — Debounce for onChange validation
- `invalid` — Override validation state
- `dirty` — Whether value changed from initial
- `touched` — Whether field has been interacted with
- `disabled` — Disable the field
- `actionsRef` — Imperative `{ validate() }` actions

### Error Props

- `match` — Controls which error to show. Accepts:
  - `boolean` — Show/hide based on condition
  - ValidityState values: `'valid'`, `'badInput'`, `'customError'`, `'patternMismatch'`, `'rangeOverflow'`, `'rangeUnderflow'`, `'stepMismatch'`, `'tooLong'`, `'tooShort'`, `'typeMismatch'`, `'valueMissing'`

### Shared Data Attributes (all sub-components)

`data-disabled`, `data-valid`, `data-invalid`, `data-dirty`, `data-touched`, `data-filled`, `data-focused`

### Validation Modes

| Mode | Behavior |
|---|---|
| `onSubmit` | Validates on form submission; re-validates on change after first error |
| `onBlur` | Validates when control loses focus |
| `onChange` | Validates on every value change (use with `validationDebounceTime`) |

### Example: Basic Field

```tsx
<Field.Root>
  <Field.Label>Email</Field.Label>
  <Field.Control type="email" required placeholder="you@example.com" />
  <Field.Error match="valueMissing">Email is required</Field.Error>
  <Field.Error match="typeMismatch">Enter a valid email</Field.Error>
  <Field.Description>We'll never share your email.</Field.Description>
</Field.Root>
```

### Example: Custom Validation

```tsx
<Field.Root
  validate={(value) => {
    if (value.length < 3) return 'Must be at least 3 characters';
    return null;
  }}
  validationMode="onChange"
  validationDebounceTime={300}
>
  <Field.Label>Username</Field.Label>
  <Field.Control />
  <Field.Error match="customError" />
</Field.Root>
```

### Example: Validity Render Prop

```tsx
<Field.Validity>
  {(validity) => (
    <div>
      {validity.valueMissing && <span>Required</span>}
      {validity.typeMismatch && <span>Invalid format</span>}
    </div>
  )}
</Field.Validity>
```

---

## Fieldset

**Import**: `import { Fieldset } from '@base-ui/react/fieldset';`

Groups related form controls with a shared legend.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `Fieldset.Root` | `<fieldset>` | Groups related controls |
| `Fieldset.Legend` | `<legend>` | Group label |

### Root Props

- `disabled` — Disables all controls within
- `className`, `style`, `render`

### Example

```tsx
<Fieldset.Root>
  <Fieldset.Legend>Shipping Address</Fieldset.Legend>
  <Field.Root name="street">
    <Field.Label>Street</Field.Label>
    <Field.Control />
  </Field.Root>
  <Field.Root name="city">
    <Field.Label>City</Field.Label>
    <Field.Control />
  </Field.Root>
</Fieldset.Root>
```

---

## Form

**Import**: `import { Form } from '@base-ui/react/form';`

Form submission handler with validation integration.

### Props

- `errors` — Record of field errors `{ [fieldName]: string | string[] }`
- `onClearErrors` — Called when errors should be cleared
- `onSubmit` — Form submit handler
- `className`, `style`, `render`

### Example

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
    <Field.Error match="valueMissing">Required</Field.Error>
    <Field.Error match="customError" />
  </Field.Root>
  <button type="submit">Submit</button>
</Form>
```

---

## Input

**Import**: `import { Input } from '@base-ui/react/input';`

A styled text input. Renders an `<input>` element.

### Props

- All standard `<input>` HTML attributes
- `className` — String or state-based function
- `style` — CSSProperties or state-based function
- `render` — Custom element or render function

### Data Attributes

`data-disabled`, `data-readonly`, `data-required`, `data-valid`, `data-invalid`, `data-dirty`, `data-touched`, `data-filled`, `data-focused`

### Example

```tsx
<Field.Root name="username">
  <Field.Label>Username</Field.Label>
  <Input placeholder="Enter username" />
</Field.Root>
```

---

## Checkbox

**Import**: `import { Checkbox } from '@base-ui/react/checkbox';`

A toggle control with checked, unchecked, and indeterminate states. Renders a `<span>` with hidden `<input>`.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `Checkbox.Root` | `<span>` | Main checkbox control |
| `Checkbox.Indicator` | `<span>` | Visual checked state indicator |

### Root Props

- `name` — Form field identifier
- `defaultChecked` / `checked` — Checked state
- `onCheckedChange` — `(checked, eventDetails) => void`
- `indeterminate` (default: `false`) — Mixed state
- `value` — Value submitted when checked
- `uncheckedValue` — Value submitted when unchecked
- `disabled`, `readOnly`, `required`
- `inputRef` — Access hidden `<input>`
- `parent` — Controls child checkboxes in group

### Indicator Props

- `keepMounted` (default: `false`) — Stay in DOM when unchecked

### Data Attributes

**Root**: `data-checked`, `data-unchecked`, `data-indeterminate`, `data-disabled`, `data-readonly`, `data-required`, `data-valid`, `data-invalid`, `data-dirty`, `data-touched`, `data-filled`, `data-focused`

**Indicator**: Same as Root, plus `data-starting-style`, `data-ending-style`

### Example

```tsx
<Field.Root>
  <Field.Label>
    <Checkbox.Root>
      <Checkbox.Indicator>✓</Checkbox.Indicator>
    </Checkbox.Root>
    Accept terms and conditions
  </Field.Label>
</Field.Root>
```

---

## Radio

**Import**: `import { Radio } from '@base-ui/react/radio';`
**Import**: `import { RadioGroup } from '@base-ui/react/radio-group';`

A group of mutually exclusive options.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `RadioGroup` | `<div>` | Groups radio buttons, manages state |
| `Radio.Root` | `<span>` | Individual radio button |
| `Radio.Indicator` | `<span>` | Selection indicator |

### RadioGroup Props

- `name` — Form field identifier
- `defaultValue` / `value` — Selected value
- `onValueChange` — `(value, eventDetails) => void`
- `disabled`, `readOnly`, `required`

### Radio.Root Props

- `value` — **Required**. Unique identifying value
- `disabled`, `readOnly`, `required`
- `inputRef` — Access hidden `<input>`

### Indicator Props

- `keepMounted` (default: `false`)

### Data Attributes

**RadioGroup**: `data-disabled`
**Radio.Root**: `data-checked`, `data-unchecked`, `data-disabled`, `data-readonly`, `data-required`, `data-valid`, `data-invalid`, `data-dirty`, `data-touched`, `data-filled`, `data-focused`

### Example

```tsx
<Field.Root name="plan">
  <Fieldset.Root render={<RadioGroup />}>
    <Fieldset.Legend>Select a plan</Fieldset.Legend>
    <Field.Item>
      <Field.Label>
        <Radio.Root value="free">
          <Radio.Indicator />
        </Radio.Root>
        Free
      </Field.Label>
    </Field.Item>
    <Field.Item>
      <Field.Label>
        <Radio.Root value="pro">
          <Radio.Indicator />
        </Radio.Root>
        Pro
      </Field.Label>
    </Field.Item>
  </Fieldset.Root>
</Field.Root>
```

---

## NumberField

**Import**: `import { NumberField } from '@base-ui/react/number-field';`

A numeric input with increment/decrement buttons and a scrub area.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `NumberField.Root` | `<div>` | Groups all parts, manages state |
| `NumberField.ScrubArea` | `<span>` | Drag area for value adjustment |
| `NumberField.ScrubAreaCursor` | `<span>` | Custom cursor during scrubbing |
| `NumberField.Group` | `<div>` | Contains input and buttons |
| `NumberField.Decrement` | `<button>` | Decrease value |
| `NumberField.Input` | `<input>` | Numeric input |
| `NumberField.Increment` | `<button>` | Increase value |

### Root Props

- `value` / `defaultValue` — Number or `null`
- `onValueChange` — Callback with `eventDetails.reason`:
  - `'input-change'`, `'input-clear'`, `'input-blur'`, `'input-paste'`
  - `'keyboard'`, `'increment-press'`, `'decrement-press'`
  - `'wheel'`, `'scrub'`
- `onValueCommitted` — Called when value finalizes
- `min`, `max` — Boundaries
- `step` (default: `1`) — Step size (or `'any'`)
- `smallStep` (default: `0.1`) — Shift+arrow step
- `largeStep` (default: `10`) — Page up/down step
- `allowWheelScrub` (default: `false`) — Mouse wheel adjustment
- `allowOutOfRange` (default: `false`)
- `snapOnStep` (default: `false`)
- `locale` — `Intl.LocalesArgument`
- `format` — `Intl.NumberFormatOptions`
- `disabled`, `readOnly`, `required`

### ScrubArea Props

- `direction` (default: `'horizontal'`) — `'horizontal'` | `'vertical'`
- `pixelSensitivity` (default: `2`) — Pixels per step
- `teleportDistance` — Cursor teleport distance

### Data Attributes

All parts: `data-disabled`, `data-readonly`, `data-required`, `data-valid`, `data-invalid`, `data-dirty`, `data-touched`, `data-filled`, `data-focused`, `data-scrubbing`

### Example

```tsx
<NumberField.Root defaultValue={0} min={0} max={100}>
  <NumberField.ScrubArea>
    <label>Quantity</label>
  </NumberField.ScrubArea>
  <NumberField.Group>
    <NumberField.Decrement>−</NumberField.Decrement>
    <NumberField.Input />
    <NumberField.Increment>+</NumberField.Increment>
  </NumberField.Group>
</NumberField.Root>
```

---

## Slider

**Import**: `import { Slider } from '@base-ui/react/slider';`

A draggable range input for selecting values within a range.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `Slider.Root` | `<div>` | Groups all parts, manages state |
| `Slider.Value` | `<output>` | Displays current value |
| `Slider.Control` | `<div>` | Clickable interactive area |
| `Slider.Track` | `<div>` | Full range track |
| `Slider.Indicator` | `<div>` | Filled portion of track |
| `Slider.Thumb` | `<div>` | Draggable thumb (contains hidden `<input type="range">`) |

### Root Props

- `value` / `defaultValue` — Number or number array (for range sliders)
- `onValueChange` — Fires during drag
- `onValueCommitted` — Fires when drag ends
- `min` (default: `0`), `max` (default: `100`)
- `step` (default: `1`), `largeStep` (default: `10`)
- `minStepsBetweenValues` (default: `0`) — For range sliders
- `thumbAlignment` (default: `'center'`) — `'center'` | `'edge'` | `'edge-client-only'`
- `thumbCollisionBehavior` (default: `'push'`) — `'push'` | `'swap'` | `'none'`
- `orientation` (default: `'horizontal'`) — `'horizontal'` | `'vertical'`
- `disabled`
- `locale`, `format` — Number formatting

### Thumb Props

- `getAriaLabel` — Function returning accessible label
- `getAriaValueText` — Function returning readable value
- `index` — Thumb index for range sliders
- `inputRef` — Access hidden `<input>`

### Data Attributes

**Root**: `data-dragging`, `data-orientation`, `data-disabled`, `data-valid`, `data-invalid`, `data-dirty`, `data-touched`, `data-focused`
**Thumb**: `data-index`

### Example: Single Slider

```tsx
<Slider.Root defaultValue={50}>
  <Slider.Value />
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
      <Slider.Thumb aria-label="Volume" />
    </Slider.Track>
  </Slider.Control>
</Slider.Root>
```

### Example: Range Slider

```tsx
<Slider.Root defaultValue={[25, 75]}>
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
      <Slider.Thumb index={0} aria-label="Min price" />
      <Slider.Thumb index={1} aria-label="Max price" />
    </Slider.Track>
  </Slider.Control>
</Slider.Root>
```

---

## Switch

**Import**: `import { Switch } from '@base-ui/react/switch';`

A toggle control for binary on/off states. Renders `<span>` with hidden `<input>`.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `Switch.Root` | `<span>` | Main switch control |
| `Switch.Thumb` | `<span>` | Movable indicator |

### Root Props

- `name` — Form field identifier
- `defaultChecked` / `checked` — On/off state
- `onCheckedChange` — `(checked, eventDetails) => void`
- `value` — Value submitted when on
- `uncheckedValue` — Value submitted when off
- `disabled`, `readOnly`, `required`
- `inputRef` — Access hidden `<input>`

### Data Attributes

`data-checked`, `data-unchecked`, `data-disabled`, `data-readonly`, `data-required`, `data-valid`, `data-invalid`, `data-dirty`, `data-touched`, `data-filled`, `data-focused`

### Example

```tsx
<Field.Root>
  <Field.Label>
    <Switch.Root>
      <Switch.Thumb />
    </Switch.Root>
    Enable notifications
  </Field.Label>
</Field.Root>
```

---

## Toggle

**Import**: `import { Toggle } from '@base-ui/react/toggle';`

A two-state button (pressed/unpressed). Renders `<button>`.

### Props

- `value` — Unique identifier (for use in ToggleGroup)
- `defaultPressed` / `pressed` — Pressed state
- `onPressedChange` — `(pressed, eventDetails) => void`
- `disabled`
- `nativeButton` (default: `true`)

### Data Attributes

- `data-pressed` — Present when pressed

### Example

```tsx
<Toggle defaultPressed={false} onPressedChange={(pressed) => console.log(pressed)}>
  Bold
</Toggle>
```
