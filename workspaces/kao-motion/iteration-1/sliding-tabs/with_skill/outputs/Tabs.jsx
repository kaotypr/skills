import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const tabs = [
  { id: "world", label: "World", content: "Global headlines and international affairs from around the globe." },
  { id: "tech", label: "Technology", content: "The latest in AI, software, hardware, and the future of computing." },
  { id: "sports", label: "Sports", content: "Scores, highlights, and stories from the world of athletics." },
  { id: "culture", label: "Culture", content: "Art, music, film, and the trends shaping modern society." },
];

export default function Tabs() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div style={styles.container}>
      {/* Tab bar */}
      <div style={styles.tabBar} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tabButton,
              color: activeTab === tab.id ? "#1d4ed8" : "#6b7280",
            }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab-indicator"
                style={styles.indicator}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content with crossfade */}
      <div style={styles.contentArea}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={styles.content}
            role="tabpanel"
          >
            <h2 style={styles.contentTitle}>
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <p style={styles.contentText}>
              {tabs.find((t) => t.id === activeTab)?.content}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 560,
    margin: "40px auto",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  tabBar: {
    display: "flex",
    borderBottom: "1px solid #e5e7eb",
    gap: 0,
  },
  tabButton: {
    position: "relative",
    flex: 1,
    padding: "12px 16px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 600,
    transition: "color 0.15s",
  },
  indicator: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#1d4ed8",
  },
  contentArea: {
    minHeight: 120,
    padding: "24px 4px",
  },
  content: {
    willChange: "opacity",
  },
  contentTitle: {
    margin: "0 0 8px",
    fontSize: 20,
    fontWeight: 700,
    color: "#111827",
  },
  contentText: {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.6,
    color: "#4b5563",
  },
};
