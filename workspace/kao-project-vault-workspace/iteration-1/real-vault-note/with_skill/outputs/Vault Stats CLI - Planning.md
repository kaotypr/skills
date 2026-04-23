---
tags:
  - planning
  - cli
  - vault-stats
  - tooling
  - project/planning
date: "2026-04-24"
parent: "[[Eval Test Project]]"
---

# Vault Stats CLI - Planning

> [!abstract]
> Planning note for a CLI tool that surfaces statistics about an Obsidian vault: note counts by folder, tag frequency analysis, and orphaned note detection.

## Scope

Build a lightweight CLI tool (`vault-stats`) that operates on any Obsidian vault directory and produces a structured report. The tool has no runtime dependencies on Obsidian itself — it reads `.md` files directly from the filesystem.

### In Scope

- Count notes per top-level folder and recursively per subfolder
- Analyze tag frequency across all notes (frontmatter `tags` array + inline `#tag` syntax)
- Detect orphaned notes (notes with no inbound `[[wikilinks]]` from any other note)
- Output as plain text summary to stdout; optional `--json` flag for machine-readable output
- Cross-platform: macOS, Linux

### Out of Scope

- Modifying vault contents
- Real-time / watch mode (deferred to a future phase)
- Attachment or binary file analysis
- Obsidian plugin integration

---

## Phased Approach

### Phase 1 — Note Counting

Build the core traversal engine and produce per-folder note counts.

| Deliverable | Details |
|---|---|
| Vault walker | Recursively list `.md` files, skip `.obsidian/`, `attachments/`, `templates/` |
| Folder counter | Aggregate count by top-level and nested folder |
| CLI entry point | `vault-stats count <vault-path>` command |
| Output | Table: folder path, note count, % of total |

Acceptance: running `vault-stats count ~/vault` prints a sorted folder breakdown with totals.

### Phase 2 — Tag Frequency Analysis

Add frontmatter and inline tag parsing on top of the Phase 1 walker.

| Deliverable | Details |
|---|---|
| Frontmatter parser | Extract `tags:` YAML array from each note |
| Inline tag scanner | Regex scan for `#tag` patterns in note body (exclude code blocks) |
| Frequency aggregator | Count occurrences per unique tag across all notes |
| CLI command | `vault-stats tags <vault-path>` with optional `--top N` flag |
| Output | Ranked list: tag name, count, notes using it |

Acceptance: `vault-stats tags ~/vault --top 20` prints the 20 most-used tags.

### Phase 3 — Orphaned Note Detection

Build a wikilink index and invert it to find notes with no inbound links.

| Deliverable | Details |
|---|---|
| Link extractor | Parse `[[wikilink]]` and `[[wikilink\|alias]]` patterns from all notes |
| Link index | Map: note name → set of notes that link to it |
| Orphan detector | Notes with zero inbound links (excluding index notes tagged `nav`) |
| CLI command | `vault-stats orphans <vault-path>` with optional `--include-nav` flag |
| Output | List of orphaned note paths with last-modified date |

Acceptance: `vault-stats orphans ~/vault` lists notes unreachable from the link graph.

### Phase 4 — Unified Report

Combine all three analyses into a single `vault-stats report` command.

| Deliverable | Details |
|---|---|
| Report command | `vault-stats report <vault-path>` runs all three analyses |
| `--json` flag | Machine-readable output for scripting / CI |
| README | Usage docs with examples |

---

## Related

- [[Eval Test Project]]
