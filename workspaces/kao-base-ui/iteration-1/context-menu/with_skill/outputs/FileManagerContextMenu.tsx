'use client';

import * as React from 'react';
import { Menu } from '@base-ui/react/menu';

type SortOption = 'name' | 'date' | 'size';

interface FileManagerContextMenuProps {
  children: React.ReactNode;
  onCut?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  sortBy?: SortOption;
  onSortByChange?: (value: SortOption) => void;
  showHiddenFiles?: boolean;
  onShowHiddenFilesChange?: (checked: boolean) => void;
}

export function FileManagerContextMenu({
  children,
  onCut,
  onCopy,
  onPaste,
  sortBy: controlledSortBy,
  onSortByChange,
  showHiddenFiles: controlledShowHidden,
  onShowHiddenFilesChange,
}: FileManagerContextMenuProps) {
  const [internalSortBy, setInternalSortBy] = React.useState<SortOption>('name');
  const [internalShowHidden, setInternalShowHidden] = React.useState(false);

  const sortBy = controlledSortBy ?? internalSortBy;
  const showHiddenFiles = controlledShowHidden ?? internalShowHidden;

  const handleSortByChange = React.useCallback(
    (value: SortOption) => {
      setInternalSortBy(value);
      onSortByChange?.(value);
    },
    [onSortByChange],
  );

  const handleShowHiddenChange = React.useCallback(
    (checked: boolean) => {
      setInternalShowHidden(checked);
      onShowHiddenFilesChange?.(checked);
    },
    [onShowHiddenFilesChange],
  );

  return (
    <Menu.Root>
      <Menu.Trigger
        render={(props) => (
          <span
            {...props}
            onContextMenu={(e) => {
              e.preventDefault();
              props.onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
            }}
            style={{ display: 'contents' }}
          >
            {children}
          </span>
        )}
      />
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="start" sideOffset={4}>
          <Menu.Popup
            style={{
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: 8,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
              padding: '4px 0',
              minWidth: 180,
              outline: 'none',
            }}
          >
            {/* Cut / Copy / Paste */}
            <Menu.Item onClick={onCut} style={itemStyle}>
              Cut
            </Menu.Item>
            <Menu.Item onClick={onCopy} style={itemStyle}>
              Copy
            </Menu.Item>
            <Menu.Item onClick={onPaste} style={itemStyle}>
              Paste
            </Menu.Item>

            <Menu.Separator style={separatorStyle} />

            {/* Sort by submenu */}
            <Menu.SubmenuRoot>
              <Menu.SubmenuTrigger style={itemStyle}>
                <span>Sort by</span>
                <span aria-hidden style={{ marginLeft: 'auto', paddingLeft: 16 }}>
                  &#9656;
                </span>
              </Menu.SubmenuTrigger>
              <Menu.Portal>
                <Menu.Positioner side="right" align="start" sideOffset={-4}>
                  <Menu.Popup
                    style={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: 8,
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                      padding: '4px 0',
                      minWidth: 150,
                      outline: 'none',
                    }}
                  >
                    <Menu.RadioGroup
                      value={sortBy}
                      onValueChange={(value) => handleSortByChange(value as SortOption)}
                    >
                      <Menu.RadioItem value="name" closeOnClick={false} style={itemStyle}>
                        <Menu.RadioItemIndicator
                          render={<span style={radioIndicatorStyle} />}
                        />
                        <span style={{ marginLeft: 4 }}>Name</span>
                      </Menu.RadioItem>
                      <Menu.RadioItem value="date" closeOnClick={false} style={itemStyle}>
                        <Menu.RadioItemIndicator
                          render={<span style={radioIndicatorStyle} />}
                        />
                        <span style={{ marginLeft: 4 }}>Date</span>
                      </Menu.RadioItem>
                      <Menu.RadioItem value="size" closeOnClick={false} style={itemStyle}>
                        <Menu.RadioItemIndicator
                          render={<span style={radioIndicatorStyle} />}
                        />
                        <span style={{ marginLeft: 4 }}>Size</span>
                      </Menu.RadioItem>
                    </Menu.RadioGroup>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.SubmenuRoot>

            {/* Show hidden files checkbox */}
            <Menu.CheckboxItem
              checked={showHiddenFiles}
              onCheckedChange={handleShowHiddenChange}
              closeOnClick={false}
              style={itemStyle}
            >
              <Menu.CheckboxItemIndicator
                render={<span style={checkboxIndicatorStyle} />}
              />
              <span style={{ marginLeft: 4 }}>Show hidden files</span>
            </Menu.CheckboxItem>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

/* ---------- Shared inline styles ---------- */

const itemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '6px 12px',
  fontSize: 14,
  lineHeight: '20px',
  cursor: 'default',
  userSelect: 'none',
  outline: 'none',
  borderRadius: 4,
  margin: '0 4px',
};

const separatorStyle: React.CSSProperties = {
  height: 1,
  backgroundColor: '#e0e0e0',
  margin: '4px 0',
};

const radioIndicatorStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  flexShrink: 0,
};

const checkboxIndicatorStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  flexShrink: 0,
};

export default FileManagerContextMenu;
