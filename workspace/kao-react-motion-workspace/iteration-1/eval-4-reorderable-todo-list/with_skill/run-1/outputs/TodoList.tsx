import { useState } from "react"
import {
  AnimatePresence,
  Reorder,
  motion,
  useDragControls,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react"
import type { PanInfo } from "motion/react"

export type Todo = {
  id: string
  text: string
  done: boolean
}

type TodoListProps = {
  initialTodos?: Todo[]
}

const SWIPE_DELETE_THRESHOLD = 120 // px; past this on release, item is removed
const SWIPE_VELOCITY_THRESHOLD = 500 // px/s; a fast flick also deletes

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

export function TodoList({ initialTodos = [] }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [draft, setDraft] = useState("")

  const addTodo = () => {
    const text = draft.trim()
    if (!text) return
    setTodos((prev) => [...prev, { id: makeId(), text, done: false }])
    setDraft("")
  }

  const toggleTodo = (id: string) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )

  const removeTodo = (id: string) =>
    setTodos((prev) => prev.filter((t) => t.id !== id))

  return (
    <div className="mx-auto w-full max-w-md">
      <form
        className="mb-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          addTodo()
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a todo…"
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2"
        />
        <motion.button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          Add
        </motion.button>
      </form>

      {/*
        Reorder.Group owns the list state + vertical drag-to-reorder.
        AnimatePresence mode="popLayout" lets exiting items pop out of flow
        so remaining items reflow (via Reorder.Item's built-in layout) immediately.
      */}
      <Reorder.Group
        axis="y"
        values={todos}
        onReorder={setTodos}
        className="relative flex flex-col gap-2"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {todos.map((todo) => (
            <TodoRow
              key={todo.id}
              todo={todo}
              onToggle={() => toggleTodo(todo.id)}
              onRemove={() => removeTodo(todo.id)}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  )
}

type TodoRowProps = {
  todo: Todo
  onToggle: () => void
  onRemove: () => void
}

function TodoRow({ todo, onToggle, onRemove }: TodoRowProps) {
  const reduce = useReducedMotion()

  // Per-row drag controls: disables Reorder.Item's own pointer listener
  // and only starts the reorder drag when the handle fires controls.start(e).
  const dragControls = useDragControls()

  // Swipe-to-delete: horizontal drag on the inner wrapper.
  // useMotionValue lets us derive background tint + fade as the user swipes,
  // without re-rendering every pointermove.
  const x = useMotionValue(0)
  const swipeOpacity = useTransform(
    x,
    [-SWIPE_DELETE_THRESHOLD * 1.5, -SWIPE_DELETE_THRESHOLD, 0],
    [0, 0.5, 1],
  )
  const deleteTintOpacity = useTransform(
    x,
    [-SWIPE_DELETE_THRESHOLD, 0],
    [1, 0],
  )

  const handleSwipeEnd = (_: PointerEvent, info: PanInfo) => {
    if (
      info.offset.x < -SWIPE_DELETE_THRESHOLD ||
      info.velocity.x < -SWIPE_VELOCITY_THRESHOLD
    ) {
      onRemove()
    }
    // otherwise dragSnapToOrigin springs x back to 0
  }

  return (
    <Reorder.Item
      value={todo}
      dragListener={false}
      dragControls={dragControls}
      // Enter: slide in from above. Exit: slide out to the left + fade.
      // Both are disabled for reduced-motion users (opacity-only).
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.96 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      exit={
        reduce
          ? { opacity: 0, transition: { duration: 0.15 } }
          : {
              opacity: 0,
              x: -320,
              scale: 0.9,
              transition: { duration: 0.22, ease: "easeIn" },
            }
      }
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
      }}
      // position: relative is required so whileDrag's elevated z-index applies
      // and for popLayout to position the exiting node correctly.
      style={{ position: "relative", zIndex: 0 }}
      className="list-none"
    >
      {/* Swipe wrapper: horizontal drag only, independent of reorder drag. */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.9, right: 0 }}
        dragSnapToOrigin
        dragMomentum={false}
        onDragEnd={handleSwipeEnd}
        style={{ x, opacity: swipeOpacity, touchAction: "pan-y" }}
        className="relative overflow-hidden rounded-lg"
      >
        {/* Red "delete" tint revealed as you swipe left. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg bg-red-500"
          style={{ opacity: deleteTintOpacity }}
        />

        <div className="relative flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-3">
          {/* Drag handle — the ONLY thing that starts reorder. */}
          <button
            type="button"
            aria-label="Drag to reorder"
            onPointerDown={(e) => dragControls.start(e)}
            // touch-action: none is required so touch devices don't scroll
            // the page instead of starting the drag.
            style={{ touchAction: "none" }}
            className="cursor-grab touch-none select-none px-1 text-neutral-400 active:cursor-grabbing"
          >
            {/* Six-dot grip glyph */}
            <svg width="14" height="20" viewBox="0 0 14 20" aria-hidden>
              <g fill="currentColor">
                <circle cx="4" cy="4" r="1.6" />
                <circle cx="10" cy="4" r="1.6" />
                <circle cx="4" cy="10" r="1.6" />
                <circle cx="10" cy="10" r="1.6" />
                <circle cx="4" cy="16" r="1.6" />
                <circle cx="10" cy="16" r="1.6" />
              </g>
            </svg>
          </button>

          <input
            type="checkbox"
            checked={todo.done}
            onChange={onToggle}
            className="h-4 w-4"
          />

          <span
            className={
              "flex-1 text-sm " +
              (todo.done ? "text-neutral-400 line-through" : "text-neutral-900")
            }
          >
            {todo.text}
          </span>

          <motion.button
            type="button"
            onClick={onRemove}
            aria-label={`Delete ${todo.text}`}
            className="rounded px-2 py-1 text-xs text-neutral-500 hover:text-red-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ×
          </motion.button>
        </div>
      </motion.div>
    </Reorder.Item>
  )
}

export default TodoList
