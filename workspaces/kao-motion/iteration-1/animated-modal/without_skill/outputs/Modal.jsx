import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Reusable animated modal component.
 *
 * Props:
 *   isOpen    – boolean controlling visibility
 *   onClose   – callback fired when the user requests closing (backdrop click or close button)
 *   children  – modal body content
 *   title     – optional header text
 */
export function Modal({ isOpen, onClose, children, title }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          style={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            style={styles.modal}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              mass: 0.8,
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {title && (
              <div style={styles.header}>
                <h2 style={styles.title}>{title}</h2>
                <button
                  style={styles.closeButton}
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>
            )}

            {!title && (
              <button
                style={{ ...styles.closeButton, ...styles.closeButtonAbsolute }}
                onClick={onClose}
                aria-label="Close modal"
              >
                &times;
              </button>
            )}

            <div style={styles.body}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Convenience hook for controlling modal open/close state.
 *
 * Usage:
 *   const { isOpen, open, close } = useModal();
 *   <Modal isOpen={isOpen} onClose={close}>…</Modal>
 */
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  return { isOpen, open, close, toggle };
}

/* ---------- inline styles ---------- */

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  modal: {
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "24px",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "85vh",
    overflow: "auto",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  title: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: 600,
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    lineHeight: 1,
    padding: "4px 8px",
    borderRadius: "4px",
    color: "#666",
  },
  closeButtonAbsolute: {
    position: "absolute",
    top: "12px",
    right: "12px",
  },
  body: {
    lineHeight: 1.6,
  },
};

export default Modal;
