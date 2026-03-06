'use client';

import * as React from 'react';
import { Menu } from '@base-ui/react/menu';

const menuPopupStyles: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: 8,
  border: '1px solid #e2e2e2',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
  padding: '4px 0',
  minWidth: 200,
  outline: 'none',
};

const menuItemStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 12px',
  fontSize: 14,
  cursor: 'default',
  outline: 'none',
  userSelect: 'none',
  color: '#1a1a1a',
};

const separatorStyles: React.CSSProperties = {
  height: 1,
  backgroundColor: '#e2e2e2',
  margin: '4px 0',
};

const submenuTriggerStyles: React.CSSProperties = {
  ...menuItemStyles,
  justifyContent: 'space-between',
};

const radioIndicatorStyles: React.CSSProperties = {
  width: 16,
  height: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const checkboxIndicatorStyles: React.CSSProperties = {
  width: 16,
  height: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const shortcutStyles: React.CSSProperties = {
  marginLeft: 'auto',
  color: '#999',
  fontSize: 12,
};

interface FileManagerContextMenuProps {
  children: React.ReactNode;
  onCut?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  sortBy?: 'name' | 'date' | 'size';
  onSortByChange?: (value: string) => void;
  showHiddenFiles?: boolean;
  onShowHiddenFilesChange?: (checked: boolean) => void;
}

export default function FileManagerContextMenu({
  children,
  onCut,
  onCopy,
  onPaste,
  sortBy = 'name',
  onSortByChange,
  showHiddenFiles = false,
  onShowHiddenFilesChange,
}: FileManagerContextMenuProps) {
  const [currentSort, setCurrentSort] = React.useState(sortBy);
  const [hiddenFiles, setHiddenFiles] = React.useState(showHiddenFiles);

  const handleSortChange = (value: string) => {
    setCurrentSort(value as 'name' | 'date' | 'size');
    onSortByChange?.(value);
  };

  const handleHiddenFilesChange = (checked: boolean) => {
    setHiddenFiles(checked);
    onShowHiddenFilesChange?.(checked);
  };

  return (
    <Menu.Root>
      <Menu.Trigger
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'context-menu',
          display: 'contents',
        }}
      >
        {children}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="start" sideOffset={4}>
          <Menu.Popup style={menuPopupStyles}>
            {/* Cut */}
            <Menu.Item style={menuItemStyles} onClick={onCut}>
              <span style={{ width: 16, textAlign: 'center' }}>&#9986;</span>
              Cut
              <span style={shortcutStyles}>Ctrl+X</span>
            </Menu.Item>

            {/* Copy */}
            <Menu.Item style={menuItemStyles} onClick={onCopy}>
              <span style={{ width: 16, textAlign: 'center' }}>&#128203;</span>
              Copy
              <span style={shortcutStyles}>Ctrl+C</span>
            </Menu.Item>

            {/* Paste */}
            <Menu.Item style={menuItemStyles} onClick={onPaste}>
              <span style={{ width: 16, textAlign: 'center' }}>&#128196;</span>
              Paste
              <span style={shortcutStyles}>Ctrl+V</span>
            </Menu.Item>

            {/* Separator */}
            <Menu.Separator style={separatorStyles} />

            {/* Sort by submenu */}
            <Menu.SubmenuRoot>
              <Menu.SubmenuTrigger style={submenuTriggerStyles}>
                Sort by
                <span aria-hidden>&#9656;</span>
              </Menu.SubmenuTrigger>
              <Menu.Portal>
                <Menu.Positioner side="right" align="start" sideOffset={-4}>
                  <Menu.Popup style={menuPopupStyles}>
                    <Menu.RadioGroup
                      value={currentSort}
                      onValueChange={handleSortChange}
                    >
                      <Menu.RadioItem
                        value="name"
                        style={menuItemStyles}
                        closeOnClick={false}
                      >
                        <Menu.RadioItemIndicator style={radioIndicatorStyles}>
                          &#9679;
                        </Menu.RadioItemIndicator>
                        Name
                      </Menu.RadioItem>

                      <Menu.RadioItem
                        value="date"
                        style={menuItemStyles}
                        closeOnClick={false}
                      >
                        <Menu.RadioItemIndicator style={radioIndicatorStyles}>
                          &#9679;
                        </Menu.RadioItemIndicator>
                        Date
                      </Menu.RadioItem>

                      <Menu.RadioItem
                        value="size"
                        style={menuItemStyles}
                        closeOnClick={false}
                      >
                        <Menu.RadioItemIndicator style={radioIndicatorStyles}>
                          &#9679;
                        </Menu.RadioItemIndicator>
                        Size
                      </Menu.RadioItem>
                    </Menu.RadioGroup>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.SubmenuRoot>

            {/* Show hidden files checkbox */}
            <Menu.CheckboxItem
              style={menuItemStyles}
              checked={hiddenFiles}
              onCheckedChange={handleHiddenFilesChange}
              closeOnClick={false}
            >
              <Menu.CheckboxItemIndicator style={checkboxIndicatorStyles}>
                &#10003;
              </Menu.CheckboxItemIndicator>
              Show hidden files
            </Menu.CheckboxItem>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
