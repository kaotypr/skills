import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"

const modules = path.resolve(__dirname, "node_modules")
const motionDist = path.join(modules, "motion/dist/es")

// Demo app imports tsx files from a sibling iteration-N directory. Those files
// `import { motion } from "motion/react"` etc., but Vite resolves dependencies
// relative to the importing file — and the iteration directory has no
// node_modules. Alias the Motion + React packages back to the demo-app's own
// node_modules so the imports resolve no matter where the source file lives.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: /^motion\/react$/,        replacement: path.join(motionDist, "react.mjs") },
      { find: /^motion\/react-client$/, replacement: path.join(motionDist, "react-client.mjs") },
      { find: /^motion\/react-m$/,      replacement: path.join(motionDist, "react-m.mjs") },
      { find: /^motion\/react-mini$/,   replacement: path.join(motionDist, "react-mini.mjs") },
      { find: /^motion$/,               replacement: path.join(motionDist, "index.mjs") },
      { find: /^react\/jsx-runtime$/,   replacement: path.join(modules, "react/jsx-runtime.js") },
      { find: /^react\/jsx-dev-runtime$/, replacement: path.join(modules, "react/jsx-dev-runtime.js") },
      { find: /^react-dom\/client$/,    replacement: path.join(modules, "react-dom/client.js") },
      { find: /^react-dom$/,            replacement: path.join(modules, "react-dom/index.js") },
      { find: /^react$/,                replacement: path.join(modules, "react/index.js") },
    ],
  },
  server: {
    fs: {
      // Allow Vite to serve files outside this project so iteration-N/*.tsx
      // can be imported directly.
      allow: [path.resolve(__dirname, ".."), path.resolve(__dirname)],
    },
    port: 5173,
  },
})
