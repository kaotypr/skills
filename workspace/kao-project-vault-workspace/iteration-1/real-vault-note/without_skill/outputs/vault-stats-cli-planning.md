---
tags:
  - project
  - planning
  - cli
  - eval-test
date: "2026-04-24"
status: draft
---

# Vault Stats CLI — Planning Note

> [!abstract]
> Planning document for a CLI tool that analyzes an Obsidian vault and surfaces note statistics: folder-level note counts, tag frequency distribution, and orphaned note detection.

## Scope

The tool will:

- **Count notes by folder** — walk the vault directory tree and report how many `.md` files exist per folder, with optional recursive totals
- **Analyze tag frequency** — parse YAML frontmatter and inline `#tags` across all notes, then rank tags by usage count
- **Detect orphaned notes** — identify notes that have no incoming `[[wikilinks]]` and are not referenced from any index or MOC

Out of scope (v1):

- Attachment/asset analysis (images, PDFs)
- Graph visualization
- Broken link detection beyond orphan checks
- Integration with the Obsidian app itself (file system only)

## Phased Approach

### Phase 1 — Core Traversal & Counting

- Implement vault walker that respects `.obsidianignore` and skips hidden folders
- Count `.md` files per directory and emit a tree-style summary table
- Output: `vault stats folders`

### Phase 2 — Tag Frequency

- Parse YAML frontmatter `tags:` fields (list and inline string forms)
- Parse inline `#tag` syntax (excluding code blocks and URLs)
- Deduplicate, normalize to lowercase, and count occurrences
- Output: `vault stats tags [--top N]`

### Phase 3 — Orphan Detection

- Build a forward-link index from all `[[wikilinks]]` and `![[embeds]]` in each note
- Invert to a backlink index
- Flag notes with zero backlinks that are not in an explicitly whitelisted set (e.g. daily notes, inbox)
- Output: `vault stats orphans [--exclude-pattern <glob>]`

### Phase 4 — Unified Report

- Combine all three analyses into a single `vault stats report` command
- Support `--format json` for machine-readable output
- Add `--vault <path>` flag so the tool works on any vault without `cd`

## Open Questions

- Should folder counts be recursive (subtree totals) or per-level only? Offer both via a `--recursive` flag.
- How to handle aliases in wikilinks (`[[Note Title|Alias]]`) for orphan resolution?
- Should the tool be distributed as a standalone binary (Go/Rust) or a Node/Python script?
