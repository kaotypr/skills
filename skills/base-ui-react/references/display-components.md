# Display Components Reference

Display components handle layout, content organization, feedback, and visual presentation.

## Table of Contents

- [Accordion](#accordion)
- [Tabs](#tabs)
- [Toast](#toast)
- [Collapsible](#collapsible)
- [Progress](#progress)
- [ScrollArea](#scrollarea)
- [ToggleGroup](#togglegroup)
- [Separator](#separator)
- [Avatar](#avatar)
- [Toolbar](#toolbar)

---

## Accordion

**Import**: `import { Accordion } from '@base-ui/react/accordion';`

A vertically stacked set of collapsible panels. By default only one panel can be open at a time (`multiple` defaults to `false`).

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `Accordion.Root` | `<div>` | Groups all items |
| `Accordion.Item` | `<div>` | Groups header and panel |
| `Accordion.Header` | `<h3>` | Labels the panel |
| `Accordion.Trigger` | `<button>` | Opens/closes panel |
| `Accordion.Panel` | `<div>` | Collapsible content |

### Root Props

- `defaultValue` / `value` — Expanded item value(s) as array
- `onValueChange` — `(value: any[], eventDetails) => void`
- `multiple` (default: `false`) — Allow multiple panels open
- `disabled` — Disable all items
- `orientation` (default: `'vertical'`) — `'vertical'` | `'horizontal'`
- `loopFocus` (default: `true`) — Loop keyboard focus
- `hiddenUntilFound` (default: `false`) — Browser search compatibility
- `keepMounted` (default: `false`) — Keep panels in DOM when closed

### Item Props

- `value` — Unique identifier
- `disabled` — Disable this item
- `onOpenChange` — `(open, eventDetails) => void`

### Panel Props

- `hiddenUntilFound` — Browser search compatibility
- `keepMounted` — Keep in DOM when closed

### Data Attributes

**Root**: `data-orientation`, `data-disabled`
**Item**: `data-open`, `data-disabled`, `data-index`
**Header**: `data-open`, `data-disabled`, `data-index`
**Trigger**: `data-panel-open`, `data-disabled`
**Panel**: `data-open`, `data-orientation`, `data-disabled`, `data-index`, `data-starting-style`, `data-ending-style`

### CSS Variables (Panel)

- `--accordion-panel-height`
- `--accordion-panel-width`

### Example

```tsx
<Accordion.Root defaultValue={['item-1']}>
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>What is Base UI?</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>
      Base UI is a library of high-quality unstyled React components.
    </Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Header>
      <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>
      Yes, it follows WAI-ARIA patterns.
    </Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>
```

### Panel Animation

```css
.panel {
  height: var(--accordion-panel-height);
  overflow: hidden;
  transition: height 300ms;
}
.panel[data-starting-style],
.panel[data-ending-style] {
  height: 0;
}
```

---

## Tabs

**Import**: `import { Tabs } from '@base-ui/react/tabs';`

Tabbed content with keyboard navigation. Uses `[data-active]` (not `[data-selected]`).

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `Tabs.Root` | `<div>` | Container |
| `Tabs.List` | `<div>` | Groups tab buttons |
| `Tabs.Tab` | `<button>` | Individual tab |
| `Tabs.Indicator` | `<span>` | Active tab indicator |
| `Tabs.Panel` | `<div>` | Tab content |

### Root Props

- `defaultValue` (default: `0`) / `value` — Active tab value
- `onValueChange` — `(value, eventDetails) => void`
- `orientation` (default: `'horizontal'`) — `'horizontal'` | `'vertical'`

### List Props

- `activateOnFocus` (default: `false`) — Auto-activate on arrow key focus
- `loopFocus` (default: `true`) — Loop keyboard focus

### Tab Props

- `value` — **Required**. Unique identifier
- `disabled`
- `nativeButton` (default: `true`)

### Indicator Props

- `renderBeforeHydration` (default: `false`) — SSR support

### Panel Props

- `value` — **Required**. Matches corresponding Tab value
- `keepMounted` (default: `false`)

### Data Attributes

**Root/List**: `data-orientation`, `data-activation-direction`
**Tab**: `data-active`, `data-disabled`, `data-orientation`, `data-activation-direction`
**Panel**: `data-hidden`, `data-index`, `data-orientation`, `data-activation-direction`

### CSS Variables (Indicator)

- `--active-tab-width`, `--active-tab-height`
- `--active-tab-left`, `--active-tab-right`, `--active-tab-top`, `--active-tab-bottom`

### Example

```tsx
<Tabs.Root defaultValue="overview">
  <Tabs.List>
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="features">Features</Tabs.Tab>
    <Tabs.Tab value="pricing">Pricing</Tabs.Tab>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Panel value="overview">Overview content</Tabs.Panel>
  <Tabs.Panel value="features">Features content</Tabs.Panel>
  <Tabs.Panel value="pricing">Pricing content</Tabs.Panel>
</Tabs.Root>
```

### Animated Indicator

```css
.indicator {
  position: absolute;
  width: var(--active-tab-width);
  height: 2px;
  bottom: 0;
  left: var(--active-tab-left);
  transition: left 200ms, width 200ms;
}
```

---

## Toast

**Import**: `import { Toast } from '@base-ui/react/toast';`

Notification system with Provider/Manager pattern. Supports swipe-to-dismiss, stacking, and async toasts.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `Toast.Provider` | — | Manages toast state |
| `Toast.Portal` | `<div>` | Moves viewport to body |
| `Toast.Viewport` | — | Container for stacked toasts |
| `Toast.Root` | — | Individual toast wrapper |
| `Toast.Content` | — | Toast content container |
| `Toast.Title` | `<h2>` | Toast heading |
| `Toast.Description` | `<p>` | Toast description |
| `Toast.Action` | `<button>` | Action button |
| `Toast.Close` | `<button>` | Dismiss button |
| `Toast.Positioner` | — | Anchors toast to element |
| `Toast.Arrow` | — | Arrow pointer |

### Provider Props

- `limit` (default: `3`) — Max visible toasts
- `timeout` (default: `5000`) — Auto-dismiss ms
- `toastManager` — Global manager for external usage

### Root Props

- `toast` — **Required**. Toast object from manager
- `swipeDirection` (default: `['down', 'right']`)

### useToastManager Hook

```tsx
const toastManager = Toast.useToastManager();
```

Returns:
- `toasts` — Array of active toast objects
- `add(options)` — Create toast, returns ID
- `update(id, options)` — Modify existing toast
- `close(id)` — Remove toast
- `promise(promise, options)` — Async toast with loading/success/error

### add() Options

- `title`, `description` — ReactNode content
- `type` — String for conditional styling (e.g. `'success'`, `'error'`)
- `timeout` — Override Provider timeout
- `priority` (default: `'low'`) — `'low'` | `'high'`
- `onClose`, `onRemove` — Lifecycle callbacks
- `actionProps` — Button properties
- `data` — Custom data object

### Global Manager (outside React)

```tsx
const toastManager = Toast.createToastManager();

// Pass to provider
<Toast.Provider toastManager={toastManager}>

// Use anywhere
toastManager.add({ title: 'Hello' });
```

### Data Attributes

**Root**: `data-expanded`, `data-limited`, `data-swipe-direction`, `data-swiping`, `data-type`, `data-starting-style`, `data-ending-style`
**Content**: `data-behind`, `data-expanded`
**Title/Description**: `data-type`
**Viewport**: `data-expanded`

### CSS Variables

- `--toast-index` — Z-index and scale
- `--toast-offset-y` — Vertical offset when expanded
- `--toast-height` — Toast height
- `--toast-swipe-movement-x` / `--toast-swipe-movement-y` — Swipe offsets
- `--toast-frontmost-height` (Viewport)

### Example

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

function MyContent() {
  const toastManager = Toast.useToastManager();
  return (
    <button onClick={() =>
      toastManager.add({ title: 'Saved', description: 'Changes saved successfully', type: 'success' })
    }>
      Save
    </button>
  );
}

function ToastList() {
  const toastManager = Toast.useToastManager();
  return toastManager.toasts.map((toast) => (
    <Toast.Root key={toast.id} toast={toast}>
      <Toast.Content>
        <Toast.Title>{toast.title}</Toast.Title>
        <Toast.Description>{toast.description}</Toast.Description>
        <Toast.Close>Dismiss</Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
}
```

### Async Toast

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

---

## Collapsible

**Import**: `import { Collapsible } from '@base-ui/react/collapsible';`

A single collapsible section with trigger and panel.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `Collapsible.Root` | `<div>` | Groups all parts |
| `Collapsible.Trigger` | `<button>` | Opens/closes panel |
| `Collapsible.Panel` | `<div>` | Collapsible content |

### Root Props

- `defaultOpen` / `open` — Panel visibility
- `onOpenChange` — `(open, eventDetails) => void`
- `disabled`

### Panel Props

- `hiddenUntilFound` (default: `false`) — Browser search compatibility
- `keepMounted` (default: `false`)

### Data Attributes

**Trigger**: `data-panel-open`
**Panel**: `data-open`, `data-closed`, `data-starting-style`, `data-ending-style`

### CSS Variables (Panel)

- `--collapsible-panel-height`
- `--collapsible-panel-width`

### Example

```tsx
<Collapsible.Root>
  <Collapsible.Trigger>Show details</Collapsible.Trigger>
  <Collapsible.Panel>
    Hidden content that can be toggled.
  </Collapsible.Panel>
</Collapsible.Root>
```

### Panel Animation

```css
.panel {
  height: var(--collapsible-panel-height);
  overflow: hidden;
  transition: height 300ms;
}
.panel[data-starting-style],
.panel[data-ending-style] {
  height: 0;
}
```

---

## Progress

**Import**: `import { Progress } from '@base-ui/react/progress';`

A progress bar with label and value display.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `Progress.Root` | `<div>` | Groups all parts |
| `Progress.Track` | `<div>` | Full range track |
| `Progress.Indicator` | `<div>` | Filled portion |
| `Progress.Value` | `<span>` | Text value display |
| `Progress.Label` | `<span>` | Accessible label |

### Root Props

- `value` — Number or `null` (null = indeterminate)
- `min` (default: `0`), `max` (default: `100`)
- `aria-valuetext` — Human-readable value
- `getAriaValueText` — Function returning readable text
- `locale`, `format` — Number formatting

### Value Props

- `children` — `(formattedValue, value) => ReactNode`

### Data Attributes (all parts)

- `data-complete` — When finished
- `data-indeterminate` — When value is `null`
- `data-progressing` — While in progress

### Example

```tsx
<Progress.Root value={65}>
  <Progress.Label>Upload progress</Progress.Label>
  <Progress.Track>
    <Progress.Indicator style={{ width: `${65}%` }} />
  </Progress.Track>
  <Progress.Value />
</Progress.Root>
```

### Indeterminate

```tsx
<Progress.Root value={null}>
  <Progress.Track>
    <Progress.Indicator className="indeterminate-animation" />
  </Progress.Track>
</Progress.Root>
```

---

## ScrollArea

**Import**: `import { ScrollArea } from '@base-ui/react/scroll-area';`

Custom scrollbar overlay with overflow detection.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `ScrollArea.Root` | `<div>` | Groups all parts |
| `ScrollArea.Viewport` | `<div>` | Scrollable container |
| `ScrollArea.Content` | `<div>` | Content wrapper |
| `ScrollArea.Scrollbar` | `<div>` | Scrollbar track |
| `ScrollArea.Thumb` | `<div>` | Draggable scrollbar thumb |
| `ScrollArea.Corner` | `<div>` | Corner between scrollbars |

### Root Props

- `overflowEdgeThreshold` (default: `0`) — Number or `{ xStart, xEnd, yStart, yEnd }`

### Scrollbar Props

- `orientation` (default: `'vertical'`) — `'vertical'` | `'horizontal'`
- `keepMounted` (default: `false`)

### Data Attributes

**Root/Viewport**: `data-has-overflow-x`, `data-has-overflow-y`, `data-overflow-x-start`, `data-overflow-x-end`, `data-overflow-y-start`, `data-overflow-y-end`, `data-scrolling`
**Scrollbar**: Same as Root, plus `data-orientation`, `data-hovering`
**Thumb**: `data-orientation`

### CSS Variables

**Root**: `--scroll-area-corner-height`, `--scroll-area-corner-width`
**Viewport**: `--scroll-area-overflow-x-start`, `--scroll-area-overflow-x-end`, `--scroll-area-overflow-y-start`, `--scroll-area-overflow-y-end`
**Scrollbar**: `--scroll-area-thumb-height`, `--scroll-area-thumb-width`

### Example

```tsx
<ScrollArea.Root style={{ height: 300 }}>
  <ScrollArea.Viewport>
    <ScrollArea.Content>
      {/* Long content here */}
    </ScrollArea.Content>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
  <ScrollArea.Scrollbar orientation="horizontal">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
  <ScrollArea.Corner />
</ScrollArea.Root>
```

---

## ToggleGroup

**Import**: `import { ToggleGroup } from '@base-ui/react/toggle-group';`

A group of Toggle buttons where one or more can be pressed.

### Props

- `defaultValue` / `value` — Array of pressed toggle values
- `onValueChange` — `(value: string[], eventDetails) => void`
- `toggleMultiple` (default: `false`) — Allow multiple pressed
- `disabled`
- `loopFocus` (default: `true`)
- `orientation` (default: `'horizontal'`)

### Data Attributes

- `data-orientation`
- `data-disabled`

### Example

```tsx
<ToggleGroup defaultValue={['bold']}>
  <Toggle value="bold">B</Toggle>
  <Toggle value="italic">I</Toggle>
  <Toggle value="underline">U</Toggle>
</ToggleGroup>
```

---

## Separator

**Import**: `import { Separator } from '@base-ui/react/separator';`

A visual divider between sections. Renders `<div>` with `role="separator"`.

### Props

- `orientation` (default: `'horizontal'`) — `'horizontal'` | `'vertical'`
- `className`, `style`, `render`

### Data Attributes

- `data-orientation`

### Example

```tsx
<Separator orientation="horizontal" />
```

---

## Avatar

**Import**: `import { Avatar } from '@base-ui/react/avatar';`

User avatar with image and fallback support.

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `Avatar.Root` | `<span>` | Container |
| `Avatar.Image` | `<img>` | User image |
| `Avatar.Fallback` | `<span>` | Shown when image fails |

### Image Props

- `src`, `alt` — Standard image attributes
- `onLoadingStatusChange` — `(status) => void`

### Fallback Props

- `delay` — Ms before showing fallback (avoids flicker)

### Example

```tsx
<Avatar.Root>
  <Avatar.Image src="/avatar.jpg" alt="Jane Doe" />
  <Avatar.Fallback>JD</Avatar.Fallback>
</Avatar.Root>
```

---

## Toolbar

**Import**: `import { Toolbar } from '@base-ui/react/toolbar';`

A container for grouping interactive controls (buttons, toggles, links, separators).

### Sub-components

| Part | Renders | Purpose |
|---|---|---|
| `Toolbar.Root` | `<div>` | Container with keyboard navigation |
| `Toolbar.Button` | `<button>` | Action button |
| `Toolbar.Link` | `<a>` | Navigation link |
| `Toolbar.Group` | `<div>` | Groups related items |
| `Toolbar.Separator` | `<div>` | Visual divider |
| `Toolbar.Input` | `<input>` | Text input |

### Root Props

- `orientation` (default: `'horizontal'`) — `'horizontal'` | `'vertical'`
- `loopFocus` (default: `true`)
- `disabled`

### Example

```tsx
<Toolbar.Root>
  <Toolbar.Button onClick={handleSave}>Save</Toolbar.Button>
  <Toolbar.Separator />
  <ToggleGroup>
    <Toggle value="bold">B</Toggle>
    <Toggle value="italic">I</Toggle>
  </ToggleGroup>
  <Toolbar.Separator />
  <Toolbar.Link href="/help">Help</Toolbar.Link>
</Toolbar.Root>
```
