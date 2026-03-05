# Utilities Reference

Core utilities for building custom components, merging props, and providing app-wide configuration.

## Table of Contents

- [mergeProps](#mergeprops)
- [useRender](#userender)
- [CSPProvider](#cspprovider)
- [DirectionProvider](#directionprovider)

---

## mergeProps

**Import**: `import { mergeProps } from '@base-ui/react/merge-props';`

Safely merges multiple React prop objects. Event handlers are chained (all called in order), classNames are concatenated, and styles are shallow-merged.

### Signature

```tsx
function mergeProps<T extends Record<string, any>>(...args: T[]): T
```

### Behavior

| Prop Type | Merge Strategy |
|---|---|
| Event handlers (`on*`) | Chained — all handlers called in order |
| `className` | Concatenated with space separator |
| `style` | Shallow merged (later wins for conflicts) |
| `ref` | Combined using React's ref merging |
| Other props | Later values override earlier ones |

### When to Use

Use `mergeProps` when combining props from multiple sources — for example, combining Base UI's internal props with your own:

```tsx
<Dialog.Trigger
  render={(props) => (
    <button {...mergeProps(props, { onClick: handleClick, className: 'my-button' })} />
  )}
/>
```

### Example: Combining Props

```tsx
const result = mergeProps(
  { onClick: handleA, className: 'base', style: { color: 'red' } },
  { onClick: handleB, className: 'extra', style: { fontWeight: 'bold' } },
);

// Result:
// {
//   onClick: [both handleA and handleB are called],
//   className: 'base extra',
//   style: { color: 'red', fontWeight: 'bold' },
// }
```

---

## useRender

**Import**: `import { useRender } from '@base-ui/react/use-render';`

Hook for building custom components that support Base UI's `render` prop pattern. Enables consumers to override the default rendered element while preserving state-based data attributes.

### Signature

```tsx
function useRender<State>(options: UseRenderOptions<State>): { element: ReactElement }
```

### Options

| Option | Type | Description |
|---|---|---|
| `defaultTagName` | `keyof JSX.IntrinsicElements` | Default HTML tag when no render override |
| `render` | `ReactElement \| (props, state) => ReactElement` | Consumer's render override |
| `props` | `Record<string, unknown>` | Props merged with internal ones |
| `ref` | `Ref \| Ref[]` | Refs applied to the element |
| `state` | `State` | Component state passed to render callback |
| `stateAttributesMapping` | `StateAttributesMapping<State>` | Maps state keys to `data-*` attributes |

### Return Value

- `element` — The rendered React element

### TypeScript Helpers

**`useRender.ComponentProps<DefaultTag, State>`** — Types the public props of your component (includes `render`, `className`, `style` with state functions):

```tsx
type MyComponentProps = useRender.ComponentProps<'div', { active: boolean }>;
```

**`useRender.ElementProps<DefaultTag, State>`** — Types the internal/private props:

```tsx
type MyInternalProps = useRender.ElementProps<'div', { active: boolean }>;
```

### Example: Building a Custom Component

```tsx
import { useRender } from '@base-ui/react/use-render';
import { mergeProps } from '@base-ui/react/merge-props';

interface BadgeState {
  color: 'red' | 'blue' | 'green';
  count: number;
}

type BadgeProps = useRender.ComponentProps<'span', BadgeState> & {
  color?: BadgeState['color'];
  count: number;
};

function Badge(props: BadgeProps) {
  const { color = 'blue', count, ...otherProps } = props;
  const state: BadgeState = { color, count };

  const { element } = useRender({
    defaultTagName: 'span',
    render: props.render,
    state,
    props: mergeProps(
      { className: 'badge' },
      otherProps,
    ),
    stateAttributesMapping: {
      color: (value) => ({ 'data-color': value }),
      count: (value) => (value > 0 ? { 'data-has-count': '' } : {}),
    },
  });

  return element;
}

// Usage:
<Badge count={5} />
// Renders: <span class="badge" data-color="blue" data-has-count="">...</span>

<Badge count={5} render={<div />} />
// Renders: <div class="badge" data-color="blue" data-has-count="">...</div>

<Badge count={5} render={(props, state) => (
  <div {...props}>{state.count} items</div>
)} />
```

---

## CSPProvider

**Import**: `import { CSPProvider } from '@base-ui/react/csp-provider';`

Provides a nonce for inline styles to comply with strict Content Security Policy headers.

### Props

- `nonce` — The CSP nonce value from your server

### Example

```tsx
<CSPProvider nonce={serverNonce}>
  <App />
</CSPProvider>
```

When a CSP nonce is provided, Base UI injects it into any inline `<style>` elements it creates, satisfying the `style-src 'nonce-...'` directive.

---

## DirectionProvider

**Import**: `import { DirectionProvider } from '@base-ui/react/direction-provider';`

Provides text direction context for RTL/LTR support in directional components (e.g., Slider, ScrollArea, floating component positioning).

### Props

- `direction` — `'ltr'` | `'rtl'`

### Example

```tsx
<DirectionProvider direction="rtl">
  <App />
</DirectionProvider>
```

Components that use directional logic (like Slider thumb positioning, Menu submenu direction, ScrollArea scrollbar placement) will automatically adapt to the specified direction.
