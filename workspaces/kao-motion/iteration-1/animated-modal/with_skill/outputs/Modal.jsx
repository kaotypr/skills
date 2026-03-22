import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Reusable animated modal with backdrop fade and spring scale entrance.
 *
 * Props:
 *   isOpen    - boolean controlling visibility
 *   onClose   - callback fired when backdrop is clicked or close button pressed
 *   children  - modal body content
 *   title     - optional header text
 */
function Modal({ isOpen, onClose, children, title }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            }}
          />

          {/* Modal panel */}
          <motion.div
            key="modal-panel"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              opacity: { duration: 0.2 },
            }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1001,
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: "1.5rem",
              width: "90%",
              maxWidth: 500,
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              {title && (
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "none",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  padding: "0.25rem",
                  lineHeight: 1,
                  color: "#666",
                }}
              >
                &#x2715;
              </button>
            </div>

            {/* Body */}
            <div>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Demo wrapper showing the Modal in action.
 */
function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      <Modal isOpen={isOpen} onClose={handleClose} title="Animated Modal">
        <p>
          This modal scales up from 90% with a spring transition while the
          backdrop fades in. On close, both animate out before unmounting thanks
          to AnimatePresence.
        </p>
      </Modal>
    </div>
  );
}

export default Modal;
export { ModalDemo };
