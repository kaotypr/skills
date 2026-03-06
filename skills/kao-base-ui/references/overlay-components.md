# Overlay Components Reference

## Dialog

**Import**: `import { Dialog } from '@base-ui/react/dialog';`

**Structure**: `Dialog.Root > Dialog.Trigger`, then `Dialog.Portal > Dialog.Backdrop + Dialog.Popup > Dialog.Title + Dialog.Description + Dialog.Close`

Note: Dialog does NOT use `Positioner` — only floating components do.

**Key props**:
- Root: `defaultOpen`, `open`, `onOpenChange`, `modal` (default `true`, also accepts `'trap-focus'`), `actionsRef` for imperative `{ close, unmount }`, `handle` for detached triggers
- Popup: `initialFocus`, `finalFocus`

**Detached triggers**: `Dialog.createHandle()` with `payload` prop for passing data.

```tsx
<Dialog.Root>
  <Dialog.Trigger>Open Dialog</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop className="backdrop" />
    <Dialog.Popup className="dialog">
      <Dialog.Title>Confirm Action</Dialog.Title>
      <Dialog.Description>Are you sure?</Dialog.Description>
      <Dialog.Close>Cancel</Dialog.Close>
      <button onClick={handleConfirm}>Confirm</button>
    </Dialog.Popup>
  </Dialog.Portal>
</Dialog.Root>
```

**Animation**: Use `[data-starting-style]` and `[data-ending-style]` on Backdrop and Popup.

---

## AlertDialog

**Import**: `import { AlertDialog } from '@base-ui/react/alert-dialog';`

Same API as Dialog but semantically indicates a required user response. Has `AlertDialog.Viewport` for positioning.

Parts: `AlertDialog.Root`, `AlertDialog.Trigger`, `AlertDialog.Portal`, `AlertDialog.Backdrop`, `AlertDialog.Viewport`, `AlertDialog.Popup`, `AlertDialog.Title`, `AlertDialog.Description`, `AlertDialog.Close`

---

## Drawer

**Import**: `import { Drawer } from '@base-ui/react/drawer';`

**Structure**: `Drawer.Root > Drawer.Trigger`, then `Drawer.Portal > Drawer.Backdrop + Drawer.Popup > Drawer.Content + Drawer.Title + Drawer.Description + Drawer.Close`

Use `Drawer.Content` inside Popup to prevent swipe-on-text-selection.

**Key props**:
- Root: `defaultOpen`, `open`, `onOpenChange`, `swipeDirection` (default `'down'`), `modal` (default `true`), `snapPoints` (fractions 0-1 or pixel values), `snapPoint`/`onSnapPointChange`

```tsx
<Drawer.Root>
  <Drawer.Trigger>Open Drawer</Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Backdrop className="backdrop" />
    <Drawer.Popup className="drawer">
      <Drawer.Title>Settings</Drawer.Title>
      <Drawer.Content>Content here</Drawer.Content>
      <Drawer.Close>Close</Drawer.Close>
    </Drawer.Popup>
  </Drawer.Portal>
</Drawer.Root>
```

**Snap points**: `<Drawer.Root snapPoints={[0.3, 0.6, 1]}>` for preset heights.
**Side drawer**: `<Drawer.Root swipeDirection="left">` for right-edge drawers.
