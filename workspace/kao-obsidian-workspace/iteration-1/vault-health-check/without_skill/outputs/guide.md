# Obsidian Vault Health Check: CLI Guide

A practical walkthrough for finding orphan notes, broken links, dead-end notes, and archiving tagged content — all from the terminal.

---

## Prerequisites

You need:
- **ripgrep** (`rg`) — faster and smarter than `grep` for this work
- **fd** — ergonomic `find` replacement (optional but helpful)
- Basic shell scripting

Install them if you haven't:

```bash
brew install ripgrep fd
```

Set your vault path once so every command below just works:

```bash
export VAULT="$HOME/path/to/your/vault"
# Example: export VAULT="$HOME/Documents/MyVault"
```

---

## Part 1: Find Broken Links

Obsidian uses `[[wikilinks]]`. A broken link is one that references a note that doesn't exist.

### Step 1 — Extract all wikilinks from the vault

```bash
rg --no-filename --only-matching '\[\[([^\]|#^]+)[|\]#^]' "$VAULT" \
  --glob '*.md' -r '$1' \
  | sort -u \
  > /tmp/vault_all_links.txt
```

This extracts every `[[Target Note]]`, `[[Target|Alias]]`, `[[Target#heading]]` etc., stripping the display text and anchors so you get raw note names.

### Step 2 — List all note filenames (without extension)

```bash
fd --extension md . "$VAULT" \
  --exec basename {} .md \
  | sort -u \
  > /tmp/vault_all_notes.txt
```

### Step 3 — Find links with no matching file (broken links)

```bash
comm -23 \
  <(sort /tmp/vault_all_links.txt) \
  <(sort /tmp/vault_all_notes.txt) \
  > /tmp/vault_broken_links.txt

echo "Broken links found: $(wc -l < /tmp/vault_broken_links.txt)"
cat /tmp/vault_broken_links.txt
```

**What to do with the results:**
- Names that are close matches (typos) → rename the target file or fix the link in the source note
- Names that represent notes you never created → either create stub notes for them or delete the links
- Names from a system that changed → use find-and-replace across the vault to update the link text

---

## Part 2: Find Orphan Notes

An orphan note has no incoming links — nothing in the vault points to it.

### Step 1 — Get all note basenames that are referenced anywhere

```bash
rg --no-filename --only-matching '\[\[([^\]|#^]+)[|\]#^]' "$VAULT" \
  --glob '*.md' -r '$1' \
  | sed 's|.*/||' \
  | sort -u \
  > /tmp/vault_referenced_notes.txt
```

### Step 2 — Compare against all notes

```bash
fd --extension md . "$VAULT" \
  --exec basename {} .md \
  | sort -u \
  > /tmp/vault_all_notes.txt

comm -23 \
  <(sort /tmp/vault_all_notes.txt) \
  <(sort /tmp/vault_referenced_notes.txt) \
  > /tmp/vault_orphans.txt

echo "Orphan notes found: $(wc -l < /tmp/vault_orphans.txt)"
cat /tmp/vault_orphans.txt
```

> Note: Index notes (MOCs), daily notes, and your vault root note are expected to be orphans. Filter them out:

```bash
grep -v -E '^(Home|Index|Dashboard|[0-9]{4}-[0-9]{2}-[0-9]{2})$' \
  /tmp/vault_orphans.txt \
  > /tmp/vault_orphans_filtered.txt
```

**What to do with the results:**
- Genuinely isolated notes → add them to a relevant MOC or index, or accept they're standalone
- Old drafts and fleeting notes → review and either integrate or delete
- Duplicates of other notes → merge and delete the orphan

---

## Part 3: Find Dead-End Notes

A dead-end note has no outgoing links — it doesn't connect to anything else in the vault. These are notes that don't contribute to your knowledge graph.

### Step 1 — Find notes with zero wikilinks

```bash
fd --extension md . "$VAULT" | while read -r file; do
  # Count [[wikilinks]] in the file
  count=$(rg --count '\[\[' "$file" 2>/dev/null || echo 0)
  if [ "$count" = "0" ] || [ -z "$count" ]; then
    basename "$file" .md
  fi
done | sort > /tmp/vault_dead_ends.txt

echo "Dead-end notes found: $(wc -l < /tmp/vault_dead_ends.txt)"
cat /tmp/vault_dead_ends.txt
```

Or a faster approach using `rg` directly to find files without any wikilinks:

```bash
# Get all md files
fd --extension md . "$VAULT" > /tmp/all_md_files.txt

# Get md files that DO contain wikilinks
rg --files-with-matches '\[\[' "$VAULT" --glob '*.md' \
  | xargs -I{} basename {} .md \
  | sort > /tmp/vault_has_links.txt

# Files with NO wikilinks = dead ends
fd --extension md . "$VAULT" --exec basename {} .md \
  | sort \
  | comm -23 - /tmp/vault_has_links.txt \
  > /tmp/vault_dead_ends.txt

echo "Dead-end notes: $(wc -l < /tmp/vault_dead_ends.txt)"
```

**What to do with the results:**
- Content notes with no links → add at least 1-2 relevant `[[links]]` to connect them to related concepts
- Atomic notes that are truly standalone → consider whether they belong in the vault at all
- Template files and special notes (e.g., `_README`) → add to your exclusion list

---

## Part 4: Archive Notes Tagged #archived

This moves any note with `#archived` in its frontmatter or body to `4-Archive/`.

### Step 1 — Find all notes tagged #archived

```bash
# Matches both inline #archived and YAML tags: [archived] or - archived
rg --files-with-matches '(^|\s)#archived\b|^tags:.*archived|^\s*-\s*archived' \
  "$VAULT" --glob '*.md' \
  > /tmp/vault_to_archive.txt

echo "Notes to archive: $(wc -l < /tmp/vault_to_archive.txt)"
cat /tmp/vault_to_archive.txt
```

### Step 2 — Preview the move (dry run)

Always preview before touching files:

```bash
while IFS= read -r file; do
  dest="$VAULT/4-Archive/$(basename "$file")"
  echo "MOVE: $file -> $dest"
done < /tmp/vault_to_archive.txt
```

### Step 3 — Create the archive folder if it doesn't exist

```bash
mkdir -p "$VAULT/4-Archive"
```

### Step 4 — Execute the move

```bash
while IFS= read -r file; do
  dest="$VAULT/4-Archive/$(basename "$file")"
  # Avoid clobbering files with the same name
  if [ -e "$dest" ]; then
    timestamp=$(date +%Y%m%d%H%M%S)
    dest="$VAULT/4-Archive/$(basename "$file" .md)_$timestamp.md"
    echo "CONFLICT: renamed to $(basename "$dest")"
  fi
  mv "$file" "$dest"
  echo "Moved: $(basename "$file")"
done < /tmp/vault_to_archive.txt
```

### Step 5 — Verify

```bash
ls "$VAULT/4-Archive/" | wc -l
```

> **Important:** Obsidian's link resolution is filename-based. Moving files will break any `[[Note Name]]` links pointing to them. After archiving, run the broken links check again (Part 1) and update any links that now point to the archived notes. Alternatively, use Obsidian's built-in move (drag in the file explorer) which automatically updates backlinks.

---

## Part 5: Running Everything as One Pass

Here's a consolidated script you can save as `vault-health-check.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

VAULT="${1:-$HOME/Documents/MyVault}"
REPORT_DIR="$VAULT/_vault-health-$(date +%Y-%m-%d)"
mkdir -p "$REPORT_DIR"

echo "=== Vault Health Check: $VAULT ==="
echo "Report dir: $REPORT_DIR"
echo ""

# --- All notes ---
fd --extension md . "$VAULT" --exec basename {} .md | sort > "$REPORT_DIR/all_notes.txt"
TOTAL=$(wc -l < "$REPORT_DIR/all_notes.txt")
echo "Total notes: $TOTAL"

# --- All outgoing links ---
rg --no-filename --only-matching '\[\[([^\]|#^]+)[|\]#^]' "$VAULT" \
  --glob '*.md' -r '$1' \
  | sort -u > "$REPORT_DIR/all_links.txt"

# --- Broken links ---
comm -23 \
  <(sort "$REPORT_DIR/all_links.txt") \
  <(sort "$REPORT_DIR/all_notes.txt") \
  > "$REPORT_DIR/broken_links.txt"
echo "Broken links: $(wc -l < "$REPORT_DIR/broken_links.txt")"

# --- Orphan notes (no incoming links) ---
comm -23 \
  <(sort "$REPORT_DIR/all_notes.txt") \
  <(sort "$REPORT_DIR/all_links.txt") \
  > "$REPORT_DIR/orphan_notes.txt"
echo "Orphan notes: $(wc -l < "$REPORT_DIR/orphan_notes.txt")"

# --- Dead-end notes (no outgoing links) ---
rg --files-with-matches '\[\[' "$VAULT" --glob '*.md' \
  | xargs -I{} basename {} .md | sort > "$REPORT_DIR/notes_with_outgoing.txt"
comm -23 \
  <(sort "$REPORT_DIR/all_notes.txt") \
  <(sort "$REPORT_DIR/notes_with_outgoing.txt") \
  > "$REPORT_DIR/dead_end_notes.txt"
echo "Dead-end notes: $(wc -l < "$REPORT_DIR/dead_end_notes.txt")"

# --- Notes to archive ---
rg --files-with-matches '(^|\s)#archived\b|^tags:.*archived|^\s*-\s*archived' \
  "$VAULT" --glob '*.md' \
  > "$REPORT_DIR/to_archive.txt" || true
echo "Notes tagged #archived: $(wc -l < "$REPORT_DIR/to_archive.txt")"

echo ""
echo "Full reports saved to: $REPORT_DIR"
```

Run it:

```bash
chmod +x vault-health-check.sh
./vault-health-check.sh "$HOME/Documents/MyVault"
```

---

## Interpreting the Numbers

| Metric | Healthy range | Worth investigating |
|--------|--------------|---------------------|
| Orphan rate | < 15% of total notes | > 30% |
| Dead-end rate | < 20% of total notes | > 40% |
| Broken links | 0 | Any |
| Archived but not moved | 0 | Any |

---

## Caveats and Edge Cases

1. **Subfolders in links** — If your vault uses `[[Folder/Note]]` style links, the extraction regex needs to strip the path prefix. Add `| sed 's|.*/||'` after the `-r '$1'` step.

2. **Aliases** — Notes with `aliases:` in frontmatter won't be matched by filename alone. The broken link check may flag links that resolve via alias as broken. Obsidian's native search is the only reliable alias-aware tool.

3. **Daily notes** — These are almost always orphans and dead-ends by design. Exclude them: `grep -v '^[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}$'`

4. **Templates folder** — Exclude your templates directory from all checks: add `--glob '!Templates/**'` to every `rg`/`fd` command.

5. **Attachments** — The `fd --extension md` commands only look at markdown files, so images and PDFs are safely ignored.

6. **Backlink updates after archiving** — If you use the CLI `mv` approach, Obsidian will NOT auto-update backlinks. Use Obsidian's file explorer move (which triggers link updates) or the Obsidian CLI plugin for programmatic moves with link repair.
