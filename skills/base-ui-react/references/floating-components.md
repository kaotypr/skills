# Floating Components Reference

All floating components share the **Portal > Positioner > Popup** pattern. They render positioned overlays anchored to a trigger element.

## Table of Contents

- [Select](#select)
- [Popover](#popover)
- [Tooltip](#tooltip)
- [Menu](#menu)
- [Combobox](#combobox)
- [PreviewCard](#previewcard)

---

## Select

**Import**: `import { Select } from '@base-ui/react/select';`

A form component for choosing predefined values from a dropdown. The popup overlaps the trigger to align selected item text.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `Select.Root` | — | Groups all parts, manages state |
| `Select.Trigger` | `<button>` | Opens the dropdown |
| `Select.Value` | `<span>` | Displays selected value |
| `Select.Icon` | `<span>` | Visual indicator (chevron) |
| `Select.Portal` | `<div>` | Moves popup to body |
| `Select.Positioner` | `<div>` | Handles positioning |
| `Select.Popup` | `<div>` | Container for items |
| `Select.List` | `<div>` | Container for select items |
| `Select.Item` | `<div>` | Individual option |
| `Select.ItemText` | `<div>` | Item's text label |
| `Select.ItemIndicator` | `<span>` | Checkmark for selected item |
| `Select.Group` | `<div>` | Groups related items |
| `Select.GroupLabel` | `<div>` | Accessible group label |
| `Select.ScrollUpArrow` | `<div>` | Scroll indicator (top) |
| `Select.ScrollDownArrow` | `<div>` | Scroll indicator (bottom) |
| `Select.Separator` | `<div>` | Divider between groups |
| `Select.Arrow` | `<div>` | Positioned arrow element |
| `Select.Backdrop` | `<div>` | Overlay beneath popup |

### Root Props

- `value` / `defaultValue` — Controlled/uncontrolled selected value(s)
- `onValueChange` — Fired when selection changes
- `open` / `defaultOpen` — Controls popup visibility
- `onOpenChange` — Fired when popup opens/closes
- `items` — Data structure for labels; accepts `{label, value}[]` or Record
- `multiple` — Enable multi-select
- `disabled`, `readOnly`, `required` — Form control states
- `name` — Form submission identifier
- `modal` (default: `true`) — Locks document scroll when open
- `highlightItemOnHover` (default: `true`)

### Positioner Props

- `alignItemWithTrigger` (default: `true`) — Overlaps trigger to align selected item text
- `side` (default: `'bottom'`) — `'top'` | `'bottom'` | `'left'` | `'right'` | `'inline-start'` | `'inline-end'`
- `align` (default: `'center'`) — `'start'` | `'center'` | `'end'`
- `sideOffset` (default: `0`) — Distance from anchor
- `alignOffset` (default: `0`) — Offset along alignment axis
- `collisionAvoidance` — `{ side, align, fallbackAxisSide }`
- `collisionPadding` (default: `5`)
- `sticky` — Keep popup in viewport when anchor scrolls

### Item Props

- `value` — Unique identifier (default `null`)
- `label` — Text for keyboard navigation (auto-detected from content)
- `disabled` — Disable this item

### Data Attributes

**Trigger**: `data-popup-open`, `data-pressed`, `data-disabled`, `data-readonly`, `data-required`, `data-placeholder`
**Item**: `data-selected`, `data-highlighted`, `data-disabled`
**Positioner**: `data-open`, `data-closed`, `data-align`, `data-side`, `data-anchor-hidden`

### Example

```tsx
<Select.Root defaultValue="apple">
  <Select.Trigger>
    <Select.Value placeholder="Pick a fruit" />
    <Select.Icon />
  </Select.Trigger>
  <Select.Portal>
    <Select.Positioner>
      <Select.Popup>
        <Select.Item value="apple">
          <Select.ItemIndicator />
          <Select.ItemText>Apple</Select.ItemText>
        </Select.Item>
        <Select.Item value="banana">
          <Select.ItemIndicator />
          <Select.ItemText>Banana</Select.ItemText>
        </Select.Item>
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
</Select.Root>
```

### Custom Value Display

```tsx
<Select.Value>
  {(value: string | null) => value ? labels[value] : 'No selection'}
</Select.Value>
```

---

## Popover

**Import**: `import { Popover } from '@base-ui/react/popover';`

A floating panel anchored to a trigger, for displaying rich content.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `Popover.Root` | — | Groups all parts |
| `Popover.Trigger` | `<button>` | Opens the popover |
| `Popover.Portal` | `<div>` | Moves to body |
| `Popover.Positioner` | `<div>` | Handles positioning |
| `Popover.Popup` | `<div>` | Content container |
| `Popover.Arrow` | `<div>` | Arrow element |
| `Popover.Title` | `<h2>` | Heading |
| `Popover.Description` | `<p>` | Description text |
| `Popover.Close` | `<button>` | Close button |
| `Popover.Backdrop` | `<div>` | Overlay beneath popup |
| `Popover.Viewport` | `<div>` | Content transitions between triggers |

### Root Props

- `defaultOpen` (default: `false`)
- `open` — Controlled state
- `onOpenChange`
- `modal` (default: `false`) — Popover is non-modal by default (unlike Dialog)
- `handle` — For detached triggers via `Popover.createHandle()`
- `triggerId` — Active trigger ID for multiple triggers

### Trigger Props

- `openOnHover` (default: `false`) — Open on hover
- `delay` (default: `300`) — Hover delay in ms
- `closeDelay` (default: `0`) — Close delay in ms
- `handle` — Links to external Popover.Root
- `payload` — Data passed to popover

### Positioner Props

- `side` (default: `'bottom'`)
- `align` (default: `'center'`)
- `sideOffset`, `alignOffset`, `arrowPadding`, `collisionAvoidance`, `collisionPadding`, `sticky`

### CSS Variables (Positioner)

- `--anchor-height`, `--anchor-width`
- `--available-height`, `--available-width`
- `--positioner-height`, `--positioner-width`
- `--transform-origin`

### CSS Variables (Popup)

- `--popup-height`, `--popup-width`

### Example

```tsx
<Popover.Root>
  <Popover.Trigger>Info</Popover.Trigger>
  <Popover.Portal>
    <Popover.Positioner side="top" sideOffset={8}>
      <Popover.Popup>
        <Popover.Arrow />
        <Popover.Title>Details</Popover.Title>
        <Popover.Description>More information here.</Popover.Description>
        <Popover.Close>Close</Popover.Close>
      </Popover.Popup>
    </Popover.Positioner>
  </Popover.Portal>
</Popover.Root>
```

### Detached Triggers with Payload

```tsx
const handle = Popover.createHandle<{ text: string }>();

<Popover.Trigger handle={handle} payload={{ text: 'Hello' }}>Open</Popover.Trigger>
<Popover.Root handle={handle}>
  {({ payload }) => (
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup>{payload?.text}</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  )}
</Popover.Root>
```

---

## Tooltip

**Import**: `import { Tooltip } from '@base-ui/react/tooltip';`

A small floating label that appears on hover/focus. Wrap your app in `Tooltip.Provider` for shared delay management.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `Tooltip.Provider` | — | Shared delay management |
| `Tooltip.Root` | — | Groups all parts |
| `Tooltip.Trigger` | `<button>` | Element that shows tooltip |
| `Tooltip.Portal` | `<div>` | Moves to body |
| `Tooltip.Positioner` | `<div>` | Handles positioning |
| `Tooltip.Popup` | `<div>` | Tooltip content |
| `Tooltip.Arrow` | `<div>` | Arrow element |

### Provider Props

- `delay` — Ms before opening
- `closeDelay` — Ms before closing
- `timeout` (default: `400`) — Instant open window for adjacent tooltips

### Root Props

- `defaultOpen`, `open`, `onOpenChange`
- `disabled` — Disables tooltip
- `disableHoverablePopup` — Prevents hovering tooltip content
- `trackCursorAxis` — `'none'` | `'x'` | `'y'` | `'both'`
- `handle` — Via `Tooltip.createHandle()`

### Trigger Props (timing goes here, NOT on Root)

- `delay` (default: `600`) — Opening delay in ms
- `closeDelay` (default: `0`) — Closing delay in ms
- `handle`, `payload`

### Positioner Props

- `side` (default: `'top'`) — Note: default is top, unlike other floating components
- `align` (default: `'center'`)
- `sideOffset`, `alignOffset`, `arrowPadding`, `collisionAvoidance`, `collisionPadding`

### Example

```tsx
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger delay={300}>Hover me</Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Positioner sideOffset={8}>
        <Tooltip.Popup>
          <Tooltip.Arrow />
          Tooltip content
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
```

---

## Menu

**Import**: `import { Menu } from '@base-ui/react/menu';`

A dropdown menu with items, separators, radio groups, checkboxes, and submenus.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `Menu.Root` | — | Groups all parts |
| `Menu.Trigger` | `<button>` | Opens the menu |
| `Menu.Portal` | `<div>` | Moves to body |
| `Menu.Positioner` | `<div>` | Handles positioning |
| `Menu.Popup` | `<div>` | Container for items |
| `Menu.Backdrop` | `<div>` | Overlay |
| `Menu.Arrow` | `<div>` | Arrow element |
| `Menu.Item` | — | Standard interactive item |
| `Menu.LinkItem` | `<a>` | Navigation link item |
| `Menu.Group` | `<div>` | Groups related items |
| `Menu.GroupLabel` | — | Label for group |
| `Menu.Separator` | `<div>` | Visual divider |
| `Menu.RadioGroup` | — | Container for radio items |
| `Menu.RadioItem` | — | Radio option |
| `Menu.RadioItemIndicator` | — | Radio selection indicator |
| `Menu.CheckboxItem` | — | Toggle item |
| `Menu.CheckboxItemIndicator` | — | Checkbox indicator |
| `Menu.SubmenuRoot` | — | Nested menu container |
| `Menu.SubmenuTrigger` | — | Opens submenu |

### Root Props

- `defaultOpen`, `open`, `onOpenChange`
- `highlightItemOnHover` (default: `true`)
- `closeParentOnEsc` (default: `false`)
- `loopFocus` (default: `true`)
- `modal` (default: `true`)
- `orientation` (default: `'vertical'`)

### Trigger Props

- `handle` — For detached triggers via `Menu.createHandle()`
- `openOnHover` — Open on hover
- `delay` (default: `100`) — Hover delay
- `closeDelay` (default: `0`)

### Item Props

- `label` — Text for keyboard navigation
- `onClick` — Click handler
- `closeOnClick` (default: `true`)
- `disabled`

### RadioGroup Props

- `defaultValue` / `value` — Selected value
- `onValueChange` — Selection callback

### RadioItem Props

- `value` — Required identifier
- `closeOnClick` (default: `false`)

### CheckboxItem Props

- `defaultChecked` / `checked`
- `onCheckedChange`
- `closeOnClick` (default: `false`)

### Data Attributes

**Item**: `data-highlighted`, `data-disabled`
**RadioItem**: `data-checked`, `data-unchecked`, `data-highlighted`, `data-disabled`
**CheckboxItem**: `data-checked`, `data-unchecked`, `data-highlighted`, `data-disabled`

### Example: Basic Menu

```tsx
<Menu.Root>
  <Menu.Trigger>Options</Menu.Trigger>
  <Menu.Portal>
    <Menu.Positioner>
      <Menu.Popup>
        <Menu.Item onClick={handleEdit}>Edit</Menu.Item>
        <Menu.Item onClick={handleDuplicate}>Duplicate</Menu.Item>
        <Menu.Separator />
        <Menu.Item onClick={handleDelete}>Delete</Menu.Item>
      </Menu.Popup>
    </Menu.Positioner>
  </Menu.Portal>
</Menu.Root>
```

### Example: Submenu

```tsx
<Menu.Root>
  <Menu.Trigger>Menu</Menu.Trigger>
  <Menu.Portal>
    <Menu.Positioner>
      <Menu.Popup>
        <Menu.Item>Item 1</Menu.Item>
        <Menu.SubmenuRoot>
          <Menu.SubmenuTrigger>More options</Menu.SubmenuTrigger>
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Popup>
                <Menu.Item>Sub item 1</Menu.Item>
                <Menu.Item>Sub item 2</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.SubmenuRoot>
      </Menu.Popup>
    </Menu.Positioner>
  </Menu.Portal>
</Menu.Root>
```

### Example: Radio Group in Menu

```tsx
<Menu.RadioGroup defaultValue="medium">
  <Menu.GroupLabel>Size</Menu.GroupLabel>
  <Menu.RadioItem value="small">
    <Menu.RadioItemIndicator /> Small
  </Menu.RadioItem>
  <Menu.RadioItem value="medium">
    <Menu.RadioItemIndicator /> Medium
  </Menu.RadioItem>
  <Menu.RadioItem value="large">
    <Menu.RadioItemIndicator /> Large
  </Menu.RadioItem>
</Menu.RadioGroup>
```

---

## Combobox

**Import**: `import { Combobox } from '@base-ui/react/combobox';`

An autocomplete input with filterable dropdown. Use for large lists (100+ items) where Select would be impractical.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `Combobox.Root` | — | Groups all parts |
| `Combobox.Input` | `<input>` | Text field for filtering |
| `Combobox.Trigger` | `<button>` | Opens popup |
| `Combobox.Portal` | `<div>` | Moves to body |
| `Combobox.Positioner` | `<div>` | Handles positioning |
| `Combobox.Popup` | `<div>` | Container for items |
| `Combobox.List` | — | Items container (accepts function children) |
| `Combobox.Item` | — | Individual option |
| `Combobox.ItemIndicator` | — | Selected indicator |
| `Combobox.Empty` | — | Shown when list is empty |
| `Combobox.Clear` | — | Clears selection |
| `Combobox.Value` | — | Displays selected value |
| `Combobox.Icon` | — | Visual indicator |
| `Combobox.Chips` | — | Multi-select chips container |
| `Combobox.Chip` | — | Individual selection chip |
| `Combobox.ChipRemove` | — | Remove button for chips |
| `Combobox.Group` | — | Groups related items |
| `Combobox.GroupLabel` | — | Group header |
| `Combobox.Separator` | — | Divider |
| `Combobox.Status` | — | Screen reader announcements |
| `Combobox.Collection` | — | Renders filtered items |
| `Combobox.Row` | — | Grid layout row |
| `Combobox.Backdrop` | — | Overlay |
| `Combobox.Arrow` | — | Positioned arrow |

### Root Props

- `items` — Array of selectable options
- `value` / `defaultValue` — Selected value(s)
- `multiple` — Enable multi-select
- `open` / `defaultOpen` — Popup visibility
- `onValueChange` — Selection callback
- `filter` — Custom filtering function
- `autoHighlight` — Auto-highlight first match
- `grid` — Grid layout mode
- `virtualized` — External virtualization support

### Hooks

**`Combobox.useFilter()`** — Returns filtering functions using `Intl.Collator`:
- `contains()` — Match anywhere
- `startsWith()` — Match from beginning
- `endsWith()` — Match at end

**`Combobox.useFilteredItems()`** — Returns internally filtered items

### Data Attributes

**Input**: `data-popup-open`, `data-list-empty`, `data-pressed`, `data-disabled`, `data-readonly`, `data-required`
**Item**: `data-selected`, `data-highlighted`, `data-disabled`

### Example

```tsx
function MyCombobox() {
  const filter = Combobox.useFilter();
  const items = ['Apple', 'Banana', 'Cherry', 'Date'];

  return (
    <Combobox.Root items={items} filter={filter.contains}>
      <Combobox.Input placeholder="Search fruits..." />
      <Combobox.Trigger>Open</Combobox.Trigger>
      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup>
            <Combobox.List>
              {(item) => (
                <Combobox.Item value={item}>
                  <Combobox.ItemIndicator />
                  {item}
                </Combobox.Item>
              )}
            </Combobox.List>
            <Combobox.Empty>No results found</Combobox.Empty>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
```

---

## PreviewCard

**Import**: `import { PreviewCard } from '@base-ui/react/preview-card';`

A hover card that shows a preview when hovering over a link.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `PreviewCard.Root` | — | Groups all parts |
| `PreviewCard.Trigger` | `<a>` | Link that shows the card |
| `PreviewCard.Portal` | `<div>` | Moves to body |
| `PreviewCard.Positioner` | `<div>` | Handles positioning |
| `PreviewCard.Popup` | `<div>` | Content container |
| `PreviewCard.Arrow` | `<div>` | Arrow element |
| `PreviewCard.Backdrop` | `<div>` | Overlay |
| `PreviewCard.Viewport` | `<div>` | Content transitions |

### Trigger Props

- `delay` (default: `600`) — Hover delay in ms
- `closeDelay` (default: `300`) — Close delay in ms
- `handle` — For detached triggers via `PreviewCard.createHandle()`
- `payload` — Data passed to card

### Example

```tsx
<PreviewCard.Root>
  <PreviewCard.Trigger href="/profile/jane">Jane Doe</PreviewCard.Trigger>
  <PreviewCard.Portal>
    <PreviewCard.Positioner side="top" sideOffset={8}>
      <PreviewCard.Popup>
        <PreviewCard.Arrow />
        <img src="/avatars/jane.jpg" alt="" />
        <h3>Jane Doe</h3>
        <p>Software Engineer</p>
      </PreviewCard.Popup>
    </PreviewCard.Positioner>
  </PreviewCard.Portal>
</PreviewCard.Root>
```

---

## Shared Positioner Props Reference

All floating components share these Positioner props:

| Prop | Default | Description |
|---|---|---|
| `side` | varies | `'top'` \| `'bottom'` \| `'left'` \| `'right'` \| `'inline-start'` \| `'inline-end'` |
| `align` | `'center'` | `'start'` \| `'center'` \| `'end'` |
| `sideOffset` | `0` | Distance from anchor (number or function) |
| `alignOffset` | `0` | Offset along alignment axis |
| `arrowPadding` | `5` | Arrow edge distance |
| `collisionAvoidance` | — | `{ side, align, fallbackAxisSide }` |
| `collisionBoundary` | `'clipping-ancestors'` | Element or rect boundary |
| `collisionPadding` | `5` | Padding from boundary |
| `sticky` | `false` | Keep visible when anchor scrolls |
| `positionMethod` | `'absolute'` | `'absolute'` \| `'fixed'` |
| `disableAnchorTracking` | `false` | Disable layout shift tracking |

### Shared CSS Variables (Positioner)

- `--anchor-height`, `--anchor-width`
- `--available-height`, `--available-width`
- `--transform-origin`

### Shared Data Attributes (Positioner)

- `data-open`, `data-closed`
- `data-side`, `data-align`
- `data-anchor-hidden`

### Shared Data Attributes (Popup)

- `data-open`, `data-closed`
- `data-side`, `data-align`
- `data-starting-style`, `data-ending-style`
