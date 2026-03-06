"use client";

import * as React from "react";
import { Menu } from "@base-ui-components/react/menu";

export default function FileManagerContextMenu() {
  const [sortBy, setSortBy] = React.useState<string>("name");
  const [showHidden, setShowHidden] = React.useState<boolean>(false);

  return (
    <Menu.Root>
      <Menu.Trigger
        style={{
          padding: "8px 16px",
          border: "1px solid #ccc",
          borderRadius: 6,
          background: "#fff",
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        Right-click area (or click here)
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner sideOffset={4}>
          <Menu.Popup
            style={{
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              padding: 4,
              minWidth: 200,
              boxShadow:
                "0 4px 16px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)",
              outline: "none",
            }}
          >
            {/* Cut */}
            <Menu.Item
              style={menuItemStyle}
              onSelect={() => console.log("Cut")}
            >
              Cut
            </Menu.Item>

            {/* Copy */}
            <Menu.Item
              style={menuItemStyle}
              onSelect={() => console.log("Copy")}
            >
              Copy
            </Menu.Item>

            {/* Paste */}
            <Menu.Item
              style={menuItemStyle}
              onSelect={() => console.log("Paste")}
            >
              Paste
            </Menu.Item>

            {/* Separator */}
            <Menu.Separator
              style={{
                height: 1,
                backgroundColor: "#e5e5e5",
                margin: "4px 8px",
              }}
            />

            {/* Sort by submenu */}
            <Menu.Root>
              <Menu.SubmenuTrigger style={menuItemStyle}>
                Sort by
                <span style={{ marginLeft: "auto", fontSize: 12 }}>&#9654;</span>
              </Menu.SubmenuTrigger>

              <Menu.Portal>
                <Menu.Positioner sideOffset={0} alignOffset={-4}>
                  <Menu.Popup
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: 8,
                      padding: 4,
                      minWidth: 160,
                      boxShadow:
                        "0 4px 16px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)",
                      outline: "none",
                    }}
                  >
                    <Menu.RadioGroup
                      value={sortBy}
                      onValueChange={setSortBy}
                    >
                      <Menu.RadioItem value="name" style={menuItemStyle}>
                        <Menu.RadioItemIndicator
                          style={radioIndicatorStyle}
                        >
                          <RadioDot />
                        </Menu.RadioItemIndicator>
                        Name
                      </Menu.RadioItem>

                      <Menu.RadioItem value="date" style={menuItemStyle}>
                        <Menu.RadioItemIndicator
                          style={radioIndicatorStyle}
                        >
                          <RadioDot />
                        </Menu.RadioItemIndicator>
                        Date
                      </Menu.RadioItem>

                      <Menu.RadioItem value="size" style={menuItemStyle}>
                        <Menu.RadioItemIndicator
                          style={radioIndicatorStyle}
                        >
                          <RadioDot />
                        </Menu.RadioItemIndicator>
                        Size
                      </Menu.RadioItem>
                    </Menu.RadioGroup>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>

            {/* Show hidden files checkbox */}
            <Menu.CheckboxItem
              checked={showHidden}
              onCheckedChange={setShowHidden}
              style={menuItemStyle}
            >
              <Menu.CheckboxItemIndicator style={checkboxIndicatorStyle}>
                <CheckMark />
              </Menu.CheckboxItemIndicator>
              Show hidden files
            </Menu.CheckboxItem>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

function RadioDot() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
      <circle cx="4" cy="4" r="4" />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 6l3 3 5-5" />
    </svg>
  );
}

const menuItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 12px",
  borderRadius: 4,
  fontSize: 14,
  cursor: "pointer",
  outline: "none",
  border: "none",
  background: "transparent",
  width: "100%",
  textAlign: "left",
  color: "#1a1a1a",
};

const radioIndicatorStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 14,
  height: 14,
  color: "#111",
};

const checkboxIndicatorStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 14,
  height: 14,
  color: "#111",
};
