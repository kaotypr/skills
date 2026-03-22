import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const tabs = [
  { id: "world", label: "World" },
  { id: "science", label: "Science" },
  { id: "technology", label: "Technology" },
  { id: "sports", label: "Sports" },
];

const tabContent = {
  world: "Stay informed with the latest global news, international relations, and events shaping our world today.",
  science: "Explore groundbreaking discoveries, research breakthroughs, and the wonders of the natural universe.",
  technology: "Dive into the newest innovations, gadgets, software updates, and trends driving the tech industry forward.",
  sports: "Catch up on scores, highlights, transfers, and stories from the world of athletics and competition.",
};

export default function Tabs() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div style={styles.container}>
      {/* Tab Bar */}
      <div style={styles.tabBar}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tabButton,
              color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.5)",
            }}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab-indicator"
                style={styles.activeIndicator}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span style={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={styles.contentArea}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={styles.content}
          >
            <h2 style={styles.contentHeading}>
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <p style={styles.contentText}>{tabContent[activeTab]}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: 520,
    margin: "40px auto",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  tabBar: {
    display: "flex",
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    position: "relative",
    padding: "10px 16px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 10,
    outline: "none",
    zIndex: 1,
  },
  tabLabel: {
    position: "relative",
    zIndex: 2,
  },
  activeIndicator: {
    position: "absolute",
    inset: 0,
    borderRadius: 10,
    backgroundColor: "#6c63ff",
    zIndex: 0,
  },
  contentArea: {
    marginTop: 16,
    minHeight: 120,
    backgroundColor: "#16213e",
    borderRadius: 12,
    overflow: "hidden",
  },
  content: {
    padding: 24,
  },
  contentHeading: {
    margin: "0 0 8px",
    fontSize: 20,
    color: "#fff",
  },
  contentText: {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.7)",
  },
};
