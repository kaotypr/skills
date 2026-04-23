---
tags:
  - vite
  - pwa
  - plugins
  - frontend
  - research
date: "2026-04-24"
parent: "[[Eval Test Project]]"
related:
  - "[[PWA Vite Template]]"
  - "[[Sicepat Vite Template]]"
  - "[[Vite Template V2.x]]"
---

# Vite Plugin Ecosystem for PWA Development

> [!abstract]
> Research overview of the Vite plugin ecosystem relevant to Progressive Web App development, covering service workers, offline support, asset caching, and manifest generation. Relevant to the [[PWA Vite Template]] project and its integration with the [[Sicepat Vite Template]] boilerplate.

## Key Plugins

### vite-plugin-pwa

The de facto standard for PWA support in Vite projects. Built on top of Workbox, it handles:

- Automatic service worker generation
- Web App Manifest injection
- Asset precaching via Workbox's `generateSW` and `injectManifest` strategies
- TypeScript type declarations for service worker registration

Supports two modes:

| Mode | Description |
|---|---|
| `generateSW` | Workbox generates the full SW — zero config for most use cases |
| `injectManifest` | Bring your own SW file; plugin injects the precache manifest |

Integrates with `@vite-pwa/assets-generator` for favicon and icon generation from a single source image.

### @vite-pwa/assets-generator

CLI and Vite plugin for generating all required PWA icon sizes and formats from a single source SVG or PNG. Outputs:

- `favicon.ico`, `favicon.svg`, `favicon-96x96.png`
- Apple Touch Icons (180×180)
- Maskable icons for Android home screen
- Web App Manifest `icons` array entries

### workbox-window

Client-side companion to Workbox's service worker runtime. Used to manage SW registration and lifecycle events (install, activate, update). `vite-plugin-pwa` exposes a `VitePWA` virtual module that wraps `workbox-window` for framework-agnostic use.

### vite-plugin-web-app-manifest (alternative)

Lighter alternative to `vite-plugin-pwa` for projects that only need manifest injection without a service worker. Useful when offline support is not required but installability is.

## Workbox Caching Strategies

When using `injectManifest` mode, the following Workbox runtime caching strategies are relevant:

| Strategy | Use Case |
|---|---|
| `CacheFirst` | Static assets (fonts, icons) — serve from cache, update in background |
| `NetworkFirst` | API calls — try network, fall back to cache on failure |
| `StaleWhileRevalidate` | JS/CSS chunks — serve cached version, update cache in background |
| `NetworkOnly` | Auth endpoints — never cache |

## Relevance to Existing Projects

The [[PWA Vite Template]] project is actively exploring how to layer PWA capabilities onto the [[Sicepat Vite Template]] boilerplate using a modular, zero-cost default approach. Key considerations from that project's research:

- The three-layer strategy (foundation / scaffolded capabilities / AI skills) maps well to `vite-plugin-pwa`'s `generateSW` vs `injectManifest` split — foundation layer uses `generateSW` for zero-config defaults, advanced capabilities use `injectManifest` for custom SW logic.
- [[Vite Template V2.x]] targets Vite 8, which may ship with first-party PWA tooling improvements — worth tracking.
- The [[Sicepat Vite Template]]'s feature-based architecture means service worker precache manifests should be configured to scope correctly per feature module.

## Open Questions

- Does `vite-plugin-pwa` support Vite 8 (targeted in [[Vite Template V2.x]])?
- What is the overhead of `workbox-window` on initial bundle size vs a manual SW registration approach?
- How do maskable icons interact with Android adaptive icon requirements for different OEMs?
