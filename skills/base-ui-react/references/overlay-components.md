# Overlay Components Reference

Overlay components create modal or non-modal layers above the main content. They handle focus trapping, scroll locking, and backdrop rendering.

## Table of Contents

- [Dialog](#dialog)
- [AlertDialog](#alertdialog)
- [Drawer](#drawer)

---

## Dialog

**Import**: `import { Dialog } from '@base-ui/react/dialog';`

A modal window with backdrop, focus trap, and scroll lock.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `Dialog.Root` | — | Groups all parts, manages state |
| `Dialog.Trigger` | `<button>` | Opens the dialog |
| `Dialog.Portal` | `<div>` | Moves to body |
| `Dialog.Backdrop` | `<div>` | Overlay behind dialog |
| `Dialog.Popup` | `<div>` | Dialog content container |
| `Dialog.Title` | `<h2>` | Heading label |
| `Dialog.Description` | `<p>` | Additional information |
| `Dialog.Close` | `<button>` | Close button |

### Root Props

- `defaultOpen` (default: `false`) — Initial state
- `open` — Controlled open state
- `onOpenChange` — `(open: boolean, eventDetails) => void`
- `modal` (default: `true`) — `true` | `false` | `'trap-focus'`
- `disablePointerDismissal` (default: `false`) — Disable outside clicks
- `handle` — For detached triggers via `Dialog.createHandle()`
- `triggerId` — Active trigger ID for multiple triggers
- `actionsRef` — Imperative `{ close, unmount }` actions
- `onOpenChangeComplete` — Called after animations finish
- `children` — ReactNode or function receiving `{ payload }`

### Popup Props

- `initialFocus` — Element to focus on open (`boolean` | `RefObject` | function)
- `finalFocus` — Element to focus on close (`boolean` | `RefObject` | function)

### Data Attributes

**Trigger**: `data-popup-open`, `data-disabled`
**Backdrop**: `data-open`, `data-closed`, `data-starting-style`, `data-ending-style`
**Popup**: `data-open`, `data-closed`, `data-nested`, `data-nested-dialog-open`, `data-starting-style`, `data-ending-style`
**Close**: `data-disabled`

### CSS Variables

- `--nested-dialogs` — Nesting depth count

### Example: Basic Dialog

```tsx
<Dialog.Root>
  <Dialog.Trigger>Open Dialog</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop className="backdrop" />
    <Dialog.Popup className="dialog">
      <Dialog.Title>Confirm Action</Dialog.Title>
      <Dialog.Description>Are you sure you want to proceed?</Dialog.Description>
      <Dialog.Close>Cancel</Dialog.Close>
      <button onClick={handleConfirm}>Confirm</button>
    </Dialog.Popup>
  </Dialog.Portal>
</Dialog.Root>
```

### Example: Detached Trigger with Payload

```tsx
const handle = Dialog.createHandle<{ text: string }>();

<Dialog.Trigger handle={handle} payload={{ text: 'Hello' }}>Open</Dialog.Trigger>

<Dialog.Root handle={handle}>
  {({ payload }) => (
    <Dialog.Portal>
      <Dialog.Backdrop />
      <Dialog.Popup>
        <Dialog.Title>{payload?.text}</Dialog.Title>
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  )}
</Dialog.Root>
```

### Example: Programmatic Control

```tsx
const actionsRef = useRef<Dialog.RootActions>(null);

// Close from outside
actionsRef.current?.close();

<Dialog.Root actionsRef={actionsRef}>...</Dialog.Root>
```

### Animation Pattern

```css
.backdrop {
  opacity: 1;
  transition: opacity 150ms;
}
.backdrop[data-starting-style],
.backdrop[data-ending-style] {
  opacity: 0;
}

.dialog {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
  transition: opacity 150ms, transform 150ms;
}
.dialog[data-starting-style],
.dialog[data-ending-style] {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.95);
}
```

---

## AlertDialog

**Import**: `import { AlertDialog } from '@base-ui/react/alert-dialog';`

A dialog requiring user response before proceeding. Identical API to Dialog but semantically indicates a confirmation workflow.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `AlertDialog.Root` | — | Groups all parts |
| `AlertDialog.Trigger` | `<button>` | Opens the alert |
| `AlertDialog.Portal` | `<div>` | Moves to body |
| `AlertDialog.Backdrop` | `<div>` | Overlay |
| `AlertDialog.Viewport` | `<div>` | Positioning container |
| `AlertDialog.Popup` | `<div>` | Content container |
| `AlertDialog.Title` | `<h2>` | Heading |
| `AlertDialog.Description` | `<p>` | Description |
| `AlertDialog.Close` | `<button>` | Close/cancel button |

### Key Differences from Dialog

- AlertDialog has a `Viewport` sub-component for positioning
- Semantically indicates a required user response
- Same detached trigger and payload patterns via `AlertDialog.createHandle()`
- Same props as Dialog (open, onOpenChange, handle, triggerId, actionsRef, etc.)

### Data Attributes

Same as Dialog: `data-open`, `data-closed`, `data-nested`, `data-nested-dialog-open`, `data-starting-style`, `data-ending-style`

### CSS Variables

- `--nested-dialogs` — Nesting depth count

### Example

```tsx
<AlertDialog.Root>
  <AlertDialog.Trigger>Delete Account</AlertDialog.Trigger>
  <AlertDialog.Portal>
    <AlertDialog.Backdrop className="backdrop" />
    <AlertDialog.Popup className="alert-dialog">
      <AlertDialog.Title>Delete Account?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. All your data will be permanently deleted.
      </AlertDialog.Description>
      <AlertDialog.Close>Cancel</AlertDialog.Close>
      <button onClick={handleDelete}>Delete</button>
    </AlertDialog.Popup>
  </AlertDialog.Portal>
</AlertDialog.Root>
```

---

## Drawer

**Import**: `import { Drawer } from '@base-ui/react/drawer';`

A sliding panel with swipe-to-dismiss support, snap points, and nested drawer stacking.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `Drawer.Root` | — | Groups all parts |
| `Drawer.Trigger` | `<button>` | Opens drawer |
| `Drawer.Portal` | `<div>` | Moves to body |
| `Drawer.Backdrop` | `<div>` | Overlay |
| `Drawer.Viewport` | `<div>` | Positioning container |
| `Drawer.Popup` | `<div>` | Drawer content |
| `Drawer.Content` | — | Inner wrapper (prevents swipe on text selection) |
| `Drawer.Title` | `<h2>` | Heading |
| `Drawer.Description` | `<p>` | Description |
| `Drawer.Close` | `<button>` | Close button |
| `Drawer.Provider` | — | Shared context for coordinating drawers |
| `Drawer.IndentBackground` | — | Background styled when drawer opens |
| `Drawer.Indent` | — | Wraps app UI, applies `data-active` |

### Root Props

- `defaultOpen`, `open`, `onOpenChange`
- `swipeDirection` (default: `'down'`) — `'up'` | `'down'` | `'left'` | `'right'`
- `modal` (default: `true`) — `true` | `false` | `'trap-focus'`
- `disablePointerDismissal`
- `snapPoints` — Preset heights as fractions (0-1) or pixel values
- `snapPoint` / `onSnapPointChange` — Controlled snap point
- `handle` — For detached triggers

### Data Attributes

- `data-expanded` — At expanded snap point
- `data-nested-drawer-open` — Nested drawer is open
- `data-nested-drawer-swiping` — Nested drawer being swiped
- `data-swipe-direction` — Direction (up/down/left/right)
- `data-swipe-dismiss` — Dismissed by swiping
- `data-swiping` — Currently being swiped
- `data-starting-style`, `data-ending-style`

### CSS Variables

- `--drawer-height` — Popup height
- `--drawer-frontmost-height` — Frontmost nested drawer height
- `--drawer-snap-point-offset` — Snap point translation
- `--drawer-swipe-movement-x` / `--drawer-swipe-movement-y` — Drag offsets
- `--drawer-swipe-progress` — Gesture progress (0-1)
- `--drawer-swipe-strength` — Velocity scalar
- `--nested-drawers` — Count of open nested drawers

### Example: Basic Drawer

```tsx
<Drawer.Root>
  <Drawer.Trigger>Open Drawer</Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Backdrop className="backdrop" />
    <Drawer.Popup className="drawer">
      <Drawer.Title>Settings</Drawer.Title>
      <Drawer.Content>
        <p>Drawer content here</p>
      </Drawer.Content>
      <Drawer.Close>Close</Drawer.Close>
    </Drawer.Popup>
  </Drawer.Portal>
</Drawer.Root>
```

### Example: Snap Points

```tsx
<Drawer.Root snapPoints={[0.3, 0.6, 1]}>
  <Drawer.Trigger>Open</Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Backdrop />
    <Drawer.Popup>
      <Drawer.Content>
        Drag to snap to 30%, 60%, or 100% height
      </Drawer.Content>
    </Drawer.Popup>
  </Drawer.Portal>
</Drawer.Root>
```

### Example: Side Drawer

```tsx
<Drawer.Root swipeDirection="left">
  <Drawer.Trigger>Open Sidebar</Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Backdrop />
    <Drawer.Popup className="right-drawer">
      <Drawer.Content>Sidebar content</Drawer.Content>
    </Drawer.Popup>
  </Drawer.Portal>
</Drawer.Root>
```
