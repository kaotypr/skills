# Consolidating #meeting Notes into a meetings/ Folder (Without Breaking Wikilinks)

This guide walks you through finding all notes tagged `#meeting` across your vault, moving them to a new `meetings/` folder, and updating every wikilink that points to those notes so nothing breaks.

---

## Overview

The core challenge is that Obsidian resolves wikilinks by filename alone (unless you use full path links). Moving files changes their path, but if your vault uses short-name wikilinks like `[[2024-03-15 sprint sync]]`, Obsidian can usually find them after a move — but only if no two notes share the same filename. This guide covers both cases.

**Prerequisites:**
- Terminal access to your vault directory
- `grep`, `find`, `mv`, `sed` (standard Unix tools — available on macOS/Linux; on Windows use Git Bash or WSL)
- Your vault root path (referred to as `$VAULT` below)

---

## Step 1: Set Your Vault Root

```bash
export VAULT="/path/to/your/obsidian/vault"
cd "$VAULT"
```

Replace the path with the actual location of your vault.

---

## Step 2: Find All Notes Tagged #meeting

Obsidian inline tags appear as `#meeting` anywhere in the note body. YAML frontmatter tags appear as `tags: [meeting]` or `- meeting` under a `tags:` key. This command catches both:

```bash
grep -rl "#meeting" "$VAULT" --include="*.md"
```

This prints every `.md` file that contains the string `#meeting`.

To also catch frontmatter-style tags (e.g. `tags: [meeting]` or `- meeting`):

```bash
grep -rl -e "#meeting" -e "tags:.*meeting" -e "- meeting" "$VAULT" --include="*.md"
```

Save the list to a file so you can work from it:

```bash
grep -rl -e "#meeting" -e "tags:.*meeting" -e "- meeting" "$VAULT" --include="*.md" > /tmp/meeting_notes.txt
cat /tmp/meeting_notes.txt
```

Review the list carefully. Remove any false positives (notes that mention `#meeting` in body text but aren't actually meeting notes).

---

## Step 3: Create the Destination Folder

```bash
mkdir -p "$VAULT/meetings"
```

---

## Step 4: Audit for Filename Conflicts

Before moving, check if any two notes in your list share the same filename (which would cause a collision in the flat `meetings/` folder):

```bash
while IFS= read -r file; do
  basename "$file"
done < /tmp/meeting_notes.txt | sort | uniq -d
```

If this outputs anything, you have duplicate filenames coming from different subdirectories. You'll need to rename those files manually before or after moving them. For example, prefix them with their original folder name.

---

## Step 5: Move the Notes

```bash
while IFS= read -r file; do
  mv "$file" "$VAULT/meetings/$(basename "$file")"
done < /tmp/meeting_notes.txt
```

Verify the move:

```bash
ls "$VAULT/meetings/"
```

---

## Step 6: Update Wikilinks That Use Full Paths

If any of your notes use **full-path wikilinks** like `[[2-Areas/work/2024-03-15 sprint sync]]`, those links are now broken because the file moved. Short-name wikilinks like `[[2024-03-15 sprint sync]]` are typically fine — Obsidian resolves them by filename regardless of location (as long as filenames are unique across the vault).

### 6a. Identify which notes need updating

For each moved file, search for full-path wikilinks pointing to the old location:

```bash
# Build a list of old relative paths that were in the vault
while IFS= read -r file; do
  # Get path relative to vault root (strip leading $VAULT/)
  echo "${file#$VAULT/}"
done < /tmp/meeting_notes.txt > /tmp/old_paths.txt

cat /tmp/old_paths.txt
```

Now search for any note in the vault that links using one of those paths:

```bash
while IFS= read -r old_path; do
  # Strip .md extension — wikilinks usually omit it
  link_name="${old_path%.md}"
  matches=$(grep -rl "\[\[$link_name" "$VAULT" --include="*.md")
  if [ -n "$matches" ]; then
    echo "--- Links to: $link_name ---"
    echo "$matches"
  fi
done < /tmp/old_paths.txt
```

### 6b. Rewrite the broken full-path wikilinks

For each broken link pattern, use `sed` to update it. The general form is:

```bash
# Replace [[old/path/filename]] with [[meetings/filename]]
OLD_LINK_PATH="2-Areas/work/2024-03-15 sprint sync"
NEW_LINK_PATH="meetings/2024-03-15 sprint sync"

grep -rl "\[\[$OLD_LINK_PATH" "$VAULT" --include="*.md" | while IFS= read -r note; do
  sed -i.bak "s|\[\[$OLD_LINK_PATH\]\]|\[\[$NEW_LINK_PATH\]\]|g" "$note"
  sed -i.bak "s|\[\[$OLD_LINK_PATH|[[$NEW_LINK_PATH|g" "$note"  # piped aliases: [[path|alias]]
done
```

Repeat this for each old path. The `.bak` files are safety backups — remove them when satisfied:

```bash
find "$VAULT" -name "*.md.bak" -delete
```

### Scripted version for all moved files at once

If you want to automate the full-path link rewriting for all moved files in one pass:

```bash
while IFS= read -r file; do
  filename=$(basename "$file")
  name_no_ext="${filename%.md}"
  old_rel="${file#$VAULT/}"
  old_link="${old_rel%.md}"
  new_link="meetings/$name_no_ext"

  # Find all notes that link using the full old path
  grep -rl "\[\[$old_link" "$VAULT" --include="*.md" | while IFS= read -r note; do
    sed -i.bak "s|\[\[$old_link\]\]|\[\[$new_link\]\]|g" "$note"
    sed -i.bak "s|\[\[$old_link|\[\[$new_link|g" "$note"
  done
done < /tmp/meeting_notes.txt

# Remove backups once verified
find "$VAULT" -name "*.md.bak" -delete
```

---

## Step 7: Verify in Obsidian

1. Open Obsidian and let it re-index (it will detect the new `meetings/` folder automatically).
2. Open the **Graph View** and check that your meeting notes appear with their expected connections.
3. Open a few moved notes and click through any backlinks to confirm they resolve correctly.
4. Use **Settings > Files & Links > Detect all file conflicts** if your version of Obsidian has it.

Alternatively, search for broken links using Obsidian's built-in search:
- Open Search (Cmd/Ctrl+Shift+F)
- Search for `path:meetings` to confirm all notes landed there
- Check the **Backlinks** panel on a moved note to see if all inbound links are found

---

## Step 8: Optional — Use Obsidian's Built-in Move (Recommended Alternative)

If you're moving fewer than 20 notes, Obsidian's built-in **right-click > Move file to...** (or `F2` to rename/move) is the safest option because Obsidian automatically updates all wikilinks — including full-path ones — across the vault when you move a file through the app.

For bulk moves, the CLI approach above is more practical, but the link-updating step requires care.

---

## Summary of Commands (Quick Reference)

```bash
export VAULT="/path/to/your/vault"

# 1. Find meeting notes
grep -rl -e "#meeting" -e "tags:.*meeting" "$VAULT" --include="*.md" > /tmp/meeting_notes.txt

# 2. Check for filename conflicts
while IFS= read -r f; do basename "$f"; done < /tmp/meeting_notes.txt | sort | uniq -d

# 3. Create destination
mkdir -p "$VAULT/meetings"

# 4. Move files
while IFS= read -r f; do mv "$f" "$VAULT/meetings/$(basename "$f")"; done < /tmp/meeting_notes.txt

# 5. Rewrite full-path wikilinks (run the scripted version from Step 6b)

# 6. Clean up backups
find "$VAULT" -name "*.md.bak" -delete
```

---

## Important Notes

- **Short-name wikilinks** (`[[note title]]`) do not need updating after a move, as long as filenames are unique in the vault. Obsidian resolves them by name, not path.
- **Full-path wikilinks** (`[[folder/subfolder/note title]]`) must be updated manually (Step 6).
- **Embedded files** (`![[note title]]`) follow the same rules as wikilinks.
- Always **back up your vault** (or commit it to git) before running bulk move/replace operations.
- If your vault is a git repo: `git add -A && git commit -m "chore: consolidate meeting notes into meetings/ folder"` after verifying everything looks correct.
