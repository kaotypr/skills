# Floating Components Reference

All floating components share the **Portal > Positioner > Popup** pattern. Never skip any layer.

## Select

**Import**: `import { Select } from '@base-ui/react/select';`

**Structure**: `Select.Root > Select.Trigger > Select.Value + Select.Icon`, then `Select.Portal > Select.Positioner > Select.Popup > Select.Item > Select.ItemText + Select.ItemIndicator`

**Key props**:
- Root: `value`/`defaultValue`, `onValueChange`, `open`/`defaultOpen`, `onOpenChange`, `multiple`, `modal` (default `true`), `name`, `disabled`, `readOnly`, `required`
- Positioner: `side`, `align`, `sideOffset`, `alignOffset`, `alignItemWithTrigger` (default `true`)
- Item: `value`, `label`, `disabled`

**Grouping**: `Select.Group` + `Select.GroupLabel`, `Select.Separator`
**Scroll arrows**: `Select.ScrollUpArrow`, `Select.ScrollDownArrow`

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
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
</Select.Root>
```

Custom value display: `<Select.Value>{(value) => value ? labels[value] : 'None'}</Select.Value>`

---

## Popover

**Import**: `import { Popover } from '@base-ui/react/popover';`

**Structure**: `Popover.Root > Popover.Trigger`, then `Popover.Portal > Popover.Positioner > Popover.Popup > Popover.Arrow + Popover.Title + Popover.Description + Popover.Close`

**Key props**:
- Root: `defaultOpen`, `open`, `onOpenChange`, `modal` (default `false`)
- Trigger: `openOnHover`, `delay` (default `300`), `closeDelay`
- Positioner: `side` (default `'bottom'`), `align`, `sideOffset`, `alignOffset`

Also has `Popover.Backdrop` and `Popover.Viewport`.

**Detached triggers**: `Popover.createHandle()` for triggers outside the Root tree, with `payload` prop for passing data.

```tsx
<Popover.Root>
  <Popover.Trigger>Info</Popover.Trigger>
  <Popover.Portal>
    <Popover.Positioner side="top" sideOffset={8}>
      <Popover.Popup>
        <Popover.Arrow />
        <Popover.Title>Details</Popover.Title>
        <Popover.Description>More info here.</Popover.Description>
        <Popover.Close>Close</Popover.Close>
      </Popover.Popup>
    </Popover.Positioner>
  </Popover.Portal>
</Popover.Root>
```

---

## Tooltip

**Import**: `import { Tooltip } from '@base-ui/react/tooltip';`

**Structure**: `Tooltip.Provider > Tooltip.Root > Tooltip.Trigger`, then `Tooltip.Portal > Tooltip.Positioner > Tooltip.Popup > Tooltip.Arrow`

**Critical**: `delay` and `closeDelay` go on **Tooltip.Trigger**, NOT on Root. Wrap app in `Tooltip.Provider` for shared delay/timeout.

**Key props**:
- Provider: `delay`, `closeDelay`, `timeout` (default `400`)
- Root: `defaultOpen`, `open`, `onOpenChange`, `trackCursorAxis`
- Trigger: `delay` (default `600`), `closeDelay` (default `0`)
- Positioner: `side` (default `'top'`), `align`, `sideOffset`

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

**Structure**: `Menu.Root > Menu.Trigger`, then `Menu.Portal > Menu.Positioner > Menu.Popup > Menu.Item`

**Submenus**: Use `Menu.SubmenuRoot` + `Menu.SubmenuTrigger` (NOT nested `Menu.Root`):
```tsx
<Menu.SubmenuRoot>
  <Menu.SubmenuTrigger>More</Menu.SubmenuTrigger>
  <Menu.Portal>
    <Menu.Positioner>
      <Menu.Popup>
        <Menu.Item>Sub item</Menu.Item>
      </Menu.Popup>
    </Menu.Positioner>
  </Menu.Portal>
</Menu.SubmenuRoot>
```

**Radio groups**: `Menu.RadioGroup` with `defaultValue`/`value`/`onValueChange`, containing `Menu.RadioItem` (value required) + `Menu.RadioItemIndicator`. Use `closeOnClick={false}` on RadioItem.

**Checkbox items**: `Menu.CheckboxItem` with `checked`/`defaultChecked`/`onCheckedChange` + `Menu.CheckboxItemIndicator`. Use `closeOnClick={false}`.

**Other parts**: `Menu.LinkItem` (navigation), `Menu.Group` + `Menu.GroupLabel`, `Menu.Separator`

**Key props**:
- Root: `defaultOpen`, `open`, `onOpenChange`, `modal` (default `true`)
- Trigger: `openOnHover`, `delay` (default `100`)
- Item: `label`, `onClick`, `closeOnClick` (default `true`), `disabled`

---

## Combobox

**Import**: `import { Combobox } from '@base-ui/react/combobox';`

**Structure**: `Combobox.Root > Combobox.Input + Combobox.Trigger`, then `Combobox.Portal > Combobox.Positioner > Combobox.Popup > Combobox.List > Combobox.Item`

**Key props**:
- Root: `items` (array), `value`/`defaultValue`, `onValueChange`, `multiple`, `filter`
- Use `Combobox.useFilter()` for filtering: returns `contains()`, `startsWith()`, `endsWith()`

```tsx
function MyCombobox() {
  const filter = Combobox.useFilter();
  const items = ['Apple', 'Banana', 'Cherry'];
  return (
    <Combobox.Root items={items} filter={filter.contains}>
      <Combobox.Input placeholder="Search..." />
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
            <Combobox.Empty>No results</Combobox.Empty>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
```

**Multi-select**: `Combobox.Chips` > `Combobox.Chip` + `Combobox.ChipRemove`

---

## PreviewCard

**Import**: `import { PreviewCard } from '@base-ui/react/preview-card';`

**Structure**: `PreviewCard.Root > PreviewCard.Trigger`, then `PreviewCard.Portal > PreviewCard.Positioner > PreviewCard.Popup > PreviewCard.Arrow`

**Key props**: Trigger has `delay` (default `600`), `closeDelay` (default `300`). Supports `createHandle()` for detached triggers.

---

## Shared Positioner Props

All floating components share: `side`, `align` (NOT `alignment`), `sideOffset`, `alignOffset`, `arrowPadding`, `collisionAvoidance`, `collisionPadding`, `sticky`.

**CSS variables on Positioner**: `--anchor-width`, `--anchor-height`, `--available-width`, `--available-height`, `--transform-origin`
