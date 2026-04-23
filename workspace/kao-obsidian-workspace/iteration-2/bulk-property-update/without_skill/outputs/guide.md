# Bulk-Update Obsidian Note Properties via CLI

## Goal

Set `status: complete` and `completed: 2026-04-24` on every `.md` file inside `1-Projects/website-redesign/`.

---

## Prerequisites

- Your vault root is referred to as `$VAULT` below. Replace it with your actual vault path, e.g. `~/Documents/my-vault`.
- Standard Unix tools: `bash`, `perl` or `python3` (both work; pick one approach).
- Obsidian should be **closed** (or at least the vault not actively syncing) while you run batch edits to avoid conflicts.

---

## Approach

Obsidian stores properties as YAML frontmatter — the block between the opening and closing `---` delimiters at the very top of the file. The safest CLI approach is to parse each file's frontmatter, update/add the two keys, and write the file back.

---

## Option A — Python one-liner (recommended)

```bash
python3 - <<'EOF'
import os, re, pathlib

VAULT = os.path.expanduser("~/Documents/my-vault")   # ← change this
PROJECT_DIR = os.path.join(VAULT, "1-Projects/website-redesign")
COMPLETED_DATE = "2026-04-24"

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)

def update_frontmatter(text):
    m = FRONTMATTER_RE.match(text)
    if m:
        fm = m.group(1)
        body = text[m.end():]
        # Update or add 'status'
        if re.search(r"^status:", fm, re.MULTILINE):
            fm = re.sub(r"^status:.*$", f"status: complete", fm, flags=re.MULTILINE)
        else:
            fm += f"\nstatus: complete"
        # Update or add 'completed'
        if re.search(r"^completed:", fm, re.MULTILINE):
            fm = re.sub(r"^completed:.*$", f"completed: {COMPLETED_DATE}", fm, flags=re.MULTILINE)
        else:
            fm += f"\ncompleted: {COMPLETED_DATE}"
        return f"---\n{fm}\n---\n{body}"
    else:
        # No frontmatter — prepend it
        return f"---\nstatus: complete\ncompleted: {COMPLETED_DATE}\n---\n{text}"

for path in pathlib.Path(PROJECT_DIR).glob("*.md"):
    original = path.read_text(encoding="utf-8")
    updated = update_frontmatter(original)
    if updated != original:
        path.write_text(updated, encoding="utf-8")
        print(f"Updated: {path.name}")
    else:
        print(f"No change: {path.name}")
EOF
```

**What it does:**
1. Iterates over every `.md` file directly inside `1-Projects/website-redesign/`.
2. If a `status:` key already exists, replaces its value with `complete`.
3. If a `completed:` key already exists, replaces its value with `2026-04-24`.
4. If neither key exists, appends them to the frontmatter block.
5. If the file has no frontmatter at all, prepends a new frontmatter block.

---

## Option B — perl + sed (no Python)

```bash
VAULT=~/Documents/my-vault   # ← change this
DIR="$VAULT/1-Projects/website-redesign"

for f in "$DIR"/*.md; do
  perl -i -0pe '
    if (/\A---\n.*?^---\n/ms) {
      s/^status:.*$/status: complete/m
        or s/(---\n)/---\nstatus: complete\n/;
      s/^completed:.*$/completed: 2026-04-24/m
        or s/(---\n.*?)(^---\n)/$1completed: 2026-04-24\n$2/ms;
    } else {
      s/\A/---\nstatus: complete\ncompleted: 2026-04-24\n---\n/;
    }
  ' "$f"
  echo "Processed: $f"
done
```

> Note: `perl -i` edits in-place. On macOS, `-i` requires an empty string argument: use `perl -i ''` instead of `perl -i`.

---

## Option C — Using the Obsidian CLI (if installed)

If you have the [obsidian-cli](https://github.com/Yakitrak/obsidian-cli) tool installed:

```bash
VAULT=~/Documents/my-vault   # ← change this
DIR="$VAULT/1-Projects/website-redesign"

for f in "$DIR"/*.md; do
  note_path="${f#$VAULT/}"       # strip vault prefix to get relative path
  note_name="${note_path%.md}"   # strip .md extension
  obsidian-cli property set "$note_name" status complete --vault "$VAULT"
  obsidian-cli property set "$note_name" completed 2026-04-24 --vault "$VAULT"
  echo "Updated: $note_name"
done
```

> Check your CLI's exact syntax with `obsidian-cli --help` — flags vary by version.

---

## Verification

After running any of the options above, spot-check a file:

```bash
head -10 "$VAULT/1-Projects/website-redesign/your-note.md"
```

You should see something like:

```yaml
---
title: Your Note Title
status: complete
completed: 2026-04-24
---
```

---

## Tips

- **Backup first:** `cp -r "$DIR" "$DIR.bak"` before running.
- **Nested folders:** The `*.md` glob only matches files directly in the folder, not sub-folders. To recurse, replace `glob("*.md")` with `glob("**/*.md")` in Python, or use `find "$DIR" -name "*.md"` in the shell loop.
- **Date format:** Obsidian's date picker stores dates as `YYYY-MM-DD`. The value `2026-04-24` matches that format and will render correctly in Obsidian's calendar/date property UI.
