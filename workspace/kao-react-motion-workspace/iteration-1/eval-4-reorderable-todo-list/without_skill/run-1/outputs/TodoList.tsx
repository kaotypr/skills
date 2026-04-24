import { useState } from "react";
import {
  Reorder,
  useDragControls,
  motion,
  AnimatePresence,
  type PanInfo,
} from "motion/react";

export interface Todo {
  id: string;
  text: string;
  done: boolean;
}

interface TodoListProps {
  initialItems?: Todo[];
}

export function TodoList({ initialItems = [] }: TodoListProps) {
  const [items, setItems] = useState<Todo[]>(initialItems);
  const [draft, setDraft] = useState("");

  const addItem = () => {
    const text = draft.trim();
    if (!text) return;
    const newTodo: Todo = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text,
      done: false,
    };
    setItems((prev) => [newTodo, ...prev]);
    setDraft("");
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div className="todo-list">
      <form
        className="todo-list__add"
        onSubmit={(e) => {
          e.preventDefault();
          addItem();
        }}
      >
        <input
          type="text"
          value={draft}
          placeholder="Add a todo…"
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        as="ul"
        className="todo-list__items"
      >
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <TodoItem
              key={item.id}
              item={item}
              onRemove={removeItem}
              onToggle={toggleItem}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
}

interface TodoItemProps {
  item: Todo;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}

function TodoItem({ item, onRemove, onToggle }: TodoItemProps) {
  // Gate dragging to the handle only.
  const dragControls = useDragControls();

  const SWIPE_THRESHOLD = 120;

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
      onRemove(item.id);
    }
  };

  return (
    <Reorder.Item
      value={item}
      as="li"
      // Disable the default drag listener on the whole item so that
      // only the handle (via dragControls.start) can start a reorder.
      dragListener={false}
      dragControls={dragControls}
      layout
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{
        opacity: 0,
        x: 300,
        transition: { duration: 0.2 },
      }}
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
      className="todo-item"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        background: "white",
        borderRadius: 8,
        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        userSelect: "none",
      }}
    >
      {/* Drag handle — starts the reorder drag on pointer down. */}
      <button
        type="button"
        aria-label="Drag to reorder"
        onPointerDown={(e) => {
          // Prevent focus/click side effects but keep the pointer
          // captured so Reorder.Item sees the drag gesture.
          e.preventDefault();
          dragControls.start(e);
        }}
        style={{
          cursor: "grab",
          touchAction: "none",
          background: "transparent",
          border: "none",
          padding: 4,
          color: "#888",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Simple six-dot grip icon */}
        <svg width="12" height="18" viewBox="0 0 12 18" aria-hidden>
          <circle cx="3" cy="3" r="1.5" fill="currentColor" />
          <circle cx="9" cy="3" r="1.5" fill="currentColor" />
          <circle cx="3" cy="9" r="1.5" fill="currentColor" />
          <circle cx="9" cy="9" r="1.5" fill="currentColor" />
          <circle cx="3" cy="15" r="1.5" fill="currentColor" />
          <circle cx="9" cy="15" r="1.5" fill="currentColor" />
        </svg>
      </button>

      {/* Swipe-to-delete wrapper.
          We use a nested motion.div with drag="x" so the horizontal
          swipe is independent of the vertical reorder gesture. */}
      <motion.div
        drag="x"
        dragSnapToOrigin
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: "grabbing" }}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <input
          type="checkbox"
          checked={item.done}
          onChange={() => onToggle(item.id)}
        />
        <span
          style={{
            flex: 1,
            textDecoration: item.done ? "line-through" : "none",
            color: item.done ? "#999" : "inherit",
          }}
        >
          {item.text}
        </span>
      </motion.div>
    </Reorder.Item>
  );
}

export default TodoList;
