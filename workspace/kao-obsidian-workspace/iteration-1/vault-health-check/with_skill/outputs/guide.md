# Obsidian Vault Health Check — Step-by-Step CLI Guide

A two-year-old vault tends to accumulate orphan notes, broken links, dead-end pages, and stale content. This guide walks you through the exact CLI commands to audit your vault and move archived content to the right place.

> [!info] Prerequisite
> The Obsidian CLI (v1.12+) requires a running Obsidian desktop instance. Open Obsidian before running any of these commands. All commands below assume a single vault; if you have multiple vaults, prepend `vault="YourVaultName"` as the first parameter.

---

## Part 1 — Orient Yourself

Before diving into health checks, get a snapshot of your vault's current state.

```bash
# How many notes do you have?
obsidian files total

# What does the folder structure look like?
obsidian folders

# What tags exist and how often are they used?
obsidian tags counts
```

**What to do with the results:**
- `files total` gives you a baseline. A 2-year vault typically has 200–2000 notes.
- `folders` shows you the organizational system in use (PARA, MOC, flat, etc.). You'll need this to decide where orphans/dead-ends belong.
- `tags counts` shows you the full tag inventory. Look for `#archived` in the list and note its count — that's how many notes you'll be moving in Part 4.

---

## Part 2 — Find Orphan Notes (No Incoming Links)

Orphan notes exist but nothing links to them. They're invisible in the graph view and tend to rot over time.

```bash
# List all orphan notes (plain text, one per line)
obsidian orphans

# Or get them as a structured JSON list
obsidian orphans format=json

# Or just the paths for scripting
obsidian orphans format=paths
```

**What to do with the results:**

Orphans are not necessarily bad — some notes are intentionally standalone (daily notes, attachments index, etc.). Triage them:

1. **Intentionally standalone** — Add a tag like `#reference` or `#standalone` to signal intent, or link to them from a relevant MOC/index note.
2. **Should be linked** — Add `[[Note Name]]` wikilinks in related notes that should reference this content.
3. **Redundant/outdated** — Either consolidate with another note or tag with `#archived` so it gets moved in Part 4.
4. **Template/system file** — These live in `templates/` or similar and are expected to be orphans. Ignore them.

```bash
# To review an orphan note's content before deciding
obsidian read file="path/to/orphan.md"

# To see what links a note has going OUT (maybe it links to others but nothing links back)
obsidian links file="path/to/orphan.md"
```

---

## Part 3 — Find Broken Links (Unresolved Links)

Broken links occur when a note has been moved, renamed, or deleted without updating wikilinks pointing to it.

```bash
# List all broken/unresolved links in the vault
obsidian unresolved

# Get structured output with source file and broken link target
obsidian unresolved format=json
```

**What to do with the results:**

Each broken link is reported with two pieces of information: the **source file** (where the broken link lives) and the **target name** (what it's trying to link to, but can't find).

Work through each broken link:

1. **Note was renamed** — Find the renamed note and update the wikilink, OR rename the note back.
   ```bash
   # Search for the note by content to find its new name
   obsidian search query="keywords from the missing note"
   
   # Then fix the wikilink in the source file
   obsidian read file="source/file/with/broken-link.md"
   # Edit it: change [[Old Name]] to [[New Name]]
   ```

2. **Note was deleted** — Remove the broken wikilink from the source file or recreate the note.

3. **Typo in the original link** — Find the correct note name and fix the link.

4. **Intentional placeholder** — Some people write `[[Note I Want to Write]]` as a to-do. Leave these if intentional, but tag the source note with `#has-stubs` so you can find them later.

```bash
# After fixing, verify no broken links remain
obsidian unresolved
```

---

## Part 4 — Find Dead-End Notes (No Outgoing Links)

Dead-end notes have no `[[wikilinks]]` going out to other notes. They're isolated from the knowledge graph even if something links to them.

```bash
# List all dead-end notes
obsidian deadends

# Get paths only for easy processing
obsidian deadends format=paths
```

**What to do with the results:**

Dead-end notes are usually a sign of notes that were created quickly and never properly developed. They're not broken — they just don't contribute to the knowledge graph.

Triage strategy:

1. **Short/stub notes** — Expand them with real content and add relevant `[[wikilinks]]` to related concepts.
   ```bash
   obsidian read file="path/to/deadend.md"
   obsidian append file="path/to/deadend.md" content="## Related\n\n- [[Related Concept]]\n- [[Another Topic]]"
   ```

2. **Reference notes** (book notes, meeting notes, etc.) — Add links to projects, people, or topics they relate to.

3. **Legitimately atomic** — Some notes are terminal by design (a single definition, a quote). That's fine. Add a tag like `#atomic` so you know it's intentional.

4. **Overlap with orphans** — A note with no incoming AND no outgoing links is a complete island. These need the most attention.

```bash
# Find notes that are BOTH orphans AND dead-ends (complete islands)
# Cross-reference the two lists manually or via JSON + jq:
obsidian orphans format=json > /tmp/orphans.json
obsidian deadends format=json > /tmp/deadends.json
# Then diff them or inspect manually
```

---

## Part 5 — Move #archived Notes to 4-Archive/

Now handle all notes tagged `#archived`. The CLI's `move` command automatically updates all wikilinks across the vault when files are moved — this is critical for preserving graph integrity.

### Step 1 — Preview what will be moved

```bash
# See all notes tagged #archived before moving anything
obsidian tag tag="#archived"

# Get the count
obsidian tag tag="#archived" format=json | jq length

# Get just the paths
obsidian tag tag="#archived" format=paths
```

### Step 2 — Move them (one by one for safety, or bulk)

**Option A — Move one at a time (safer, good for review):**
```bash
obsidian move file="1-Projects/old-project.md" to="4-Archive/"
obsidian move file="2-Areas/inactive-area.md" to="4-Archive/"
```

**Option B — Bulk move all #archived notes in one shot:**
```bash
obsidian tag tag="#archived" format=paths | while read note; do
  obsidian move file="$note" to="4-Archive/"
done
```

> [!warning] Bulk move caveat
> The bulk loop above moves every `#archived` note regardless of its current location. If your `4-Archive/` folder has subfolders (e.g., `4-Archive/projects/`, `4-Archive/areas/`), you may want to review first and move to the appropriate subfolder manually. Use Option A in that case.

### Step 3 — Verify the moves

```bash
# Confirm all #archived notes are now in 4-Archive/
obsidian tag tag="#archived" format=paths

# Verify no new broken links were introduced
obsidian unresolved

# Check what's now in 4-Archive/
obsidian files sort=modified format=paths | grep "^4-Archive/"
```

### Step 4 — Optional cleanup after moving

If you want, remove the `#archived` tag from moved notes since the folder location now implies archive status:

```bash
# Remove #archived tag from a specific note after moving
obsidian property:read file="4-Archive/old-project.md" name="tags"
# Then edit the tags property to remove "archived"
obsidian property:set file="4-Archive/old-project.md" name="tags" value='["done"]'
```

Or use a bulk rename if you want to keep the tag but standardize it:
```bash
# Rename #archived to #archive across the entire vault (frontmatter + inline)
obsidian tags:rename old="archived" new="archive"
```

---

## Part 6 — Final Verification

After completing the health check, run a final sweep to confirm vault integrity.

```bash
# Should be empty or very small now
obsidian unresolved

# Review remaining orphans (should be mostly intentional ones)
obsidian orphans

# Review remaining dead-ends
obsidian deadends

# Confirm archive is populated
obsidian files sort=modified limit=20

# Updated tag inventory
obsidian tags counts
```

---

## Quick Reference — Health Check Commands

| Goal | Command |
|------|---------|
| Find orphan notes | `obsidian orphans` |
| Find broken links | `obsidian unresolved` |
| Find dead-end notes | `obsidian deadends` |
| Find #archived notes | `obsidian tag tag="#archived"` |
| Move to archive | `obsidian move file="path.md" to="4-Archive/"` |
| Bulk move #archived | `obsidian tag tag="#archived" format=paths \| while read n; do obsidian move file="$n" to="4-Archive/"; done` |
| Verify after move | `obsidian unresolved` |
| See folder tree | `obsidian folders` |
| See all tags | `obsidian tags counts` |

---

## Summary Workflow

```bash
# 1. Snapshot
obsidian files total && obsidian tags counts

# 2. Find problems
obsidian orphans format=paths
obsidian unresolved format=json
obsidian deadends format=paths

# 3. Fix broken links (manual review required)
# obsidian read / obsidian search to investigate each one

# 4. Move archived notes
obsidian tag tag="#archived" format=paths | while read note; do
  obsidian move file="$note" to="4-Archive/"
done

# 5. Final check
obsidian unresolved
obsidian orphans
```

> [!tip] Make this a habit
> Run `obsidian orphans`, `obsidian unresolved`, and `obsidian deadends` monthly. A 15-minute review every month is much easier than a multi-hour archaeology session every two years.
