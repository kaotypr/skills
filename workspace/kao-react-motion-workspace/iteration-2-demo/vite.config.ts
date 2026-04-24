import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"

const modules = path.resolve(__dirname, "node_modules")
const motionDist = path.join(modules, "motion/dist/es")

// The eval outputs live in ../iteration-2/eval-*/**/outputs/*.tsx. Vite needs
// to (1) serve files from outside this project, and (2) resolve motion/react
// and framer-motion (the baseline outputs use the legacy name) to our own
// node_modules — the outer directories don't have node_modules.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      // Eval outputs import things like `@/components/ui/button` and `@/lib/utils`.
      // Resolve those to this demo app's own src/.
      { find: "@/components/ui/button", replacement: path.join(__dirname, "src/components/ui/button.tsx") },
      { find: "@/components/ui/card",   replacement: path.join(__dirname, "src/components/ui/card.tsx") },
      { find: "@/lib/utils",            replacement: path.join(__dirname, "src/lib/utils.ts") },
      { find: /^@\/(.*)$/,              replacement: path.join(__dirname, "src/$1") },

      // Motion package — the outer tsx files won't find node_modules otherwise.
      { find: /^motion\/react$/,        replacement: path.join(motionDist, "react.mjs") },
      { find: /^motion\/react-client$/, replacement: path.join(motionDist, "react-client.mjs") },
      { find: /^motion\/react-m$/,      replacement: path.join(motionDist, "react-m.mjs") },
      { find: /^motion\/react-mini$/,   replacement: path.join(motionDist, "react-mini.mjs") },
      { find: /^motion$/,               replacement: path.join(motionDist, "index.mjs") },

      // Baseline outputs still use `framer-motion`. It's installed as a transitive
      // dep of `motion`; point outer imports directly at its real ESM entry (NOT at
      // motion/react.mjs — that re-exports from framer-motion and would cycle).
      { find: /^framer-motion$/,        replacement: path.join(modules, "framer-motion/dist/es/index.mjs") },

      // External packages the outer eval tsx files import — alias to our node_modules.
      { find: /^lucide-react$/,           replacement: path.join(modules, "lucide-react/dist/esm/lucide-react.js") },
      { find: /^@radix-ui\/react-dialog$/, replacement: path.join(modules, "@radix-ui/react-dialog/dist/index.mjs") },
      { find: /^@radix-ui\/react-slot$/,  replacement: path.join(modules, "@radix-ui/react-slot/dist/index.mjs") },
      { find: /^class-variance-authority$/, replacement: path.join(modules, "class-variance-authority/dist/index.mjs") },
      { find: /^clsx$/,                   replacement: path.join(modules, "clsx/dist/clsx.mjs") },
      { find: /^tailwind-merge$/,         replacement: path.join(modules, "tailwind-merge/dist/bundle-mjs.mjs") },

      // Radix + React — standard resolution through demo-app node_modules
      { find: /^react\/jsx-runtime$/,     replacement: path.join(modules, "react/jsx-runtime.js") },
      { find: /^react\/jsx-dev-runtime$/, replacement: path.join(modules, "react/jsx-dev-runtime.js") },
      { find: /^react-dom\/client$/,      replacement: path.join(modules, "react-dom/client.js") },
      { find: /^react-dom$/,              replacement: path.join(modules, "react-dom/index.js") },
      { find: /^react$/,                  replacement: path.join(modules, "react/index.js") },
    ],
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, ".."), path.resolve(__dirname)],
    },
    port: 5174,
  },
})
