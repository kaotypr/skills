# Display Components Reference

## Accordion

**Import**: `import { Accordion } from '@base-ui/react/accordion';`

**Structure**: `Accordion.Root > Accordion.Item > Accordion.Header > Accordion.Trigger` + `Accordion.Panel`

**Key props**:
- Root: `defaultValue`/`value` (array of expanded item values), `onValueChange`, `multiple` (default `false`), `orientation`, `keepMounted`
- Item: `value` (unique identifier)

**CSS variable**: `--accordion-panel-height` for panel animation.

```tsx
<Accordion.Root defaultValue={['item-1']}>
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>Question?</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>Answer.</Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>
```

---

## Tabs

**Import**: `import { Tabs } from '@base-ui/react/tabs';`

**Structure**: `Tabs.Root > Tabs.List > Tabs.Tab + Tabs.Indicator`, then `Tabs.Panel` for each tab.

**Critical**: Active tab uses `[data-active]`, NOT `[data-selected]`.

**Key props**:
- Root: `defaultValue` (default `0`)/`value`, `onValueChange`, `orientation`
- List: `activateOnFocus` (default `false`), `loopFocus`
- Tab: `value` (required), `disabled`
- Panel: `value` (required, matches Tab), `keepMounted`

**Indicator CSS variables**: `--active-tab-width`, `--active-tab-height`, `--active-tab-left`, `--active-tab-top`

```tsx
<Tabs.Root defaultValue="overview">
  <Tabs.List>
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="features">Features</Tabs.Tab>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Panel value="overview">Overview content</Tabs.Panel>
  <Tabs.Panel value="features">Features content</Tabs.Panel>
</Tabs.Root>
```

---

## Toast

**Import**: `import { Toast } from '@base-ui/react/toast';`

**Structure**: `Toast.Provider > children + Toast.Portal > Toast.Viewport > Toast.Root > Toast.Content > Toast.Title + Toast.Description + Toast.Close`

**Key props**:
- Provider: `limit` (default `3`), `timeout` (default `5000`), `toastManager` (for global usage)
- Root: `toast` (required, from manager), `swipeDirection` (default `['down', 'right']`)

**useToastManager hook** — use inside Provider:
```tsx
const toastManager = Toast.useToastManager();
toastManager.add({ title: 'Saved', description: 'Done', type: 'success' });
toastManager.update(id, options);
toastManager.close(id);
```

**add() options**: `title`, `description`, `type` (string for styling), `timeout`, `priority`, `onClose`, `onRemove`, `actionProps`, `data`

**Async toast with promise()** — shows loading then auto-converts to success/error:
```tsx
toastManager.promise(
  fetch('/api/save', { method: 'POST' }),
  {
    loading: { title: 'Saving...' },
    success: { title: 'Saved!' },
    error: { title: 'Failed to save' },
  }
);
```

**Global manager** (outside React):
```tsx
const toastManager = Toast.createToastManager();
<Toast.Provider toastManager={toastManager}>
// Use toastManager.add() anywhere
```

**Swipe CSS variables**: `--toast-swipe-movement-x`, `--toast-swipe-movement-y`
**Stacking CSS variables**: `--toast-index`, `--toast-offset-y`, `--toast-height`

```tsx
function App() {
  return (
    <Toast.Provider>
      <MyContent />
      <Toast.Portal>
        <Toast.Viewport>
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

function ToastList() {
  const toastManager = Toast.useToastManager();
  return toastManager.toasts.map((toast) => (
    <Toast.Root key={toast.id} toast={toast} swipeDirection={['right', 'down']}>
      <Toast.Content>
        <Toast.Title>{toast.title}</Toast.Title>
        <Toast.Description>{toast.description}</Toast.Description>
        <Toast.Close>Dismiss</Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
}
```

---

## Collapsible

**Import**: `import { Collapsible } from '@base-ui/react/collapsible';`

`Collapsible.Root > Collapsible.Trigger + Collapsible.Panel`

Props: `defaultOpen`/`open`, `onOpenChange`, `disabled`. Panel: `keepMounted`, `hiddenUntilFound`.
CSS variable: `--collapsible-panel-height`

---

## Progress

**Import**: `import { Progress } from '@base-ui/react/progress';`

`Progress.Root > Progress.Label + Progress.Track > Progress.Indicator` + `Progress.Value`

Props: `value` (number or `null` for indeterminate), `min`, `max`. Value children: `(formattedValue, value) => ReactNode`.

---

## ScrollArea

**Import**: `import { ScrollArea } from '@base-ui/react/scroll-area';`

`ScrollArea.Root > ScrollArea.Viewport > ScrollArea.Content` + `ScrollArea.Scrollbar > ScrollArea.Thumb` + `ScrollArea.Corner`

Scrollbar props: `orientation` (default `'vertical'`), `keepMounted`.

---

## ToggleGroup

**Import**: `import { ToggleGroup } from '@base-ui/react/toggle-group';`

Groups `Toggle` buttons. Props: `defaultValue`/`value` (string array), `onValueChange`, `toggleMultiple` (default `false`), `orientation`.

```tsx
<ToggleGroup defaultValue={['bold']}>
  <Toggle value="bold">B</Toggle>
  <Toggle value="italic">I</Toggle>
</ToggleGroup>
```

---

## Separator

**Import**: `import { Separator } from '@base-ui/react/separator';`

Props: `orientation` (default `'horizontal'`).

---

## Avatar

**Import**: `import { Avatar } from '@base-ui/react/avatar';`

`Avatar.Root > Avatar.Image + Avatar.Fallback`. Fallback has `delay` prop to avoid flicker.

---

## Toolbar

**Import**: `import { Toolbar } from '@base-ui/react/toolbar';`

`Toolbar.Root > Toolbar.Button + Toolbar.Link + Toolbar.Group + Toolbar.Separator + Toolbar.Input`

Props: `orientation`, `loopFocus`, `disabled`.
