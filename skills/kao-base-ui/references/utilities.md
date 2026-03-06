# Utilities Reference

## mergeProps

**Import**: `import { mergeProps } from '@base-ui/react/merge-props';`

Safely merges multiple React prop objects. Event handlers are chained (all called), classNames concatenated, styles shallow-merged, refs combined.

```tsx
const result = mergeProps(
  { onClick: handleA, className: 'base', style: { color: 'red' } },
  { onClick: handleB, className: 'extra', style: { fontWeight: 'bold' } },
);
// onClick: both called, className: 'base extra', style: { color: 'red', fontWeight: 'bold' }
```

Use when combining Base UI's internal props with your own in render functions:
```tsx
<Dialog.Trigger render={(props) => (
  <button {...mergeProps(props, { onClick: myHandler, className: 'my-btn' })} />
)} />
```

---

## useRender

**Import**: `import { useRender } from '@base-ui/react/use-render';`

Hook for building custom components that support Base UI's `render` prop pattern.

**Options**: `defaultTagName`, `render`, `props`, `ref`, `state`, `stateAttributesMapping`

**TypeScript**: `useRender.ComponentProps<DefaultTag, State>` for public props, `useRender.ElementProps<DefaultTag, State>` for internal props.

```tsx
import { useRender } from '@base-ui/react/use-render';
import { mergeProps } from '@base-ui/react/merge-props';

interface BadgeState { color: 'red' | 'blue'; count: number }

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
    props: mergeProps({ className: 'badge' }, otherProps),
    stateAttributesMapping: {
      color: (value) => ({ 'data-color': value }),
      count: (value) => (value > 0 ? { 'data-has-count': '' } : {}),
    },
  });

  return element;
}
```

---

## CSPProvider

**Import**: `import { CSPProvider } from '@base-ui/react/csp-provider';`

Provides a `nonce` for inline styles to comply with strict CSP headers: `<CSPProvider nonce={serverNonce}><App /></CSPProvider>`

---

## DirectionProvider

**Import**: `import { DirectionProvider } from '@base-ui/react/direction-provider';`

RTL/LTR support: `<DirectionProvider direction="rtl"><App /></DirectionProvider>`
