---
name: kao-project-vault
description: >
  Bridge a code repository to an Obsidian vault project folder via a `vault` symlink.
  Use when a project has a `vault/` directory containing Obsidian notes (with [[wikilinks]],
  YAML frontmatter, tags), or when the user asks to link a vault project folder, set up
  project vault context, read project documentation from a vault, or create any kind of
  note in the vault. Trigger on mentions of "vault", "project vault", "vault notes",
  "link vault folder", or when you detect a `vault/` symlink pointing to an Obsidian
  vault path. Also trigger when the user asks to create notes, document decisions,
  write implementation docs, add planning notes, capture research, track deviations,
  or write any documentation in an Obsidian vault linked to the project.
  Even if the vault symlink is gitignored, you still have full read/write access to it
  and all files inside — always use it.
license: MIT
metadata:
  author: kaotypr
  version: "2.0.0"
---

# Project Vault

This skill bridges a code repository and an Obsidian vault project folder through a `vault` symlink. It handles three things:

1. **Setup** — Creating and managing the `vault` symlink
2. **Context Reading** — Discovering vault structure, conventions, and project documentation
3. **Note Creation** — Creating any kind of note in the vault, following its conventions

## Convention Precedence

Obsidian conventions (frontmatter, tags, callouts, naming, organization) come from a chain of sources. Use the first one that provides guidance — higher sources completely override lower ones:

1. **Vault root installed skill** — Check if a skill is installed at the vault root (in `.claude/skills/` under the vault root directory). If one exists that covers Obsidian conventions, load it. This overrides everything below.
2. **Vault root CLAUDE.md** — If the vault root's CLAUDE.md defines Obsidian conventions (frontmatter formats, tag patterns, naming rules, organization methodology), use those. They override this skill's fallbacks.
3. **This skill's fallback conventions** — Only used when neither of the above exists. See [Fallback Conventions](#fallback-conventions) at the bottom.

When a higher source is found, do not mix in conventions from lower sources — the higher source owns the full convention set. This skill provides the bridge mechanism and routing; when a vault root source exists, it owns the "how to write notes" part.

## Critical Rules

1. **Convention precedence is absolute.** Follow the chain above. A vault root skill overrides everything below it.
2. **Discover, do not impose.** Never create folders or notes that break the vault's existing organizational pattern. Analyze before writing.
3. **Vault is the source of truth for project understanding.** When asked about the project, read the vault before answering.
4. **Preserve link integrity.** Every wikilink you write must point to a note that exists or that you are creating in the same operation.

## Gitignore-Safe Access

The `vault` symlink often appears in `.gitignore` because vault paths are machine-specific. This does NOT restrict your access. The symlink is a filesystem pointer — you can always:

- **Read** any file inside `vault/` and its subdirectories
- **Create** new notes anywhere inside `vault/`
- **Edit** existing notes inside `vault/`
- **Create** new folders inside `vault/`
- **Traverse** the symlink to find the vault root (parent directory containing `.obsidian/`)

Git tracking status is irrelevant to file access. Treat `vault/` as a fully writable directory at all times. The same applies to any path resolved through the symlink.

---

## Quick Start: Auto-Detection

Before anything else, detect the current state and jump to the right phase.

### Step 1: Check for existing vault symlink

```bash
ls -la vault 2>/dev/null
```

- **Symlink exists and target is valid** — Skip setup. Go to Step 2.
- **Symlink exists but target is broken** — Inform the user. Offer to update it (Phase 1).
- **Regular directory named `vault/`** — Check if it contains `.md` files. If so, treat it as an inline vault (same workflow, skip symlink creation).
- **Nothing exists** — If the user wants vault integration, go to Phase 1 (Setup).

### Step 2: Resolve vault root and discover conventions

When the symlink exists, find the vault root and check for installed convention sources:

```bash
# Find vault root
TARGET=$(readlink vault)
DIR="$TARGET"
while [ "$DIR" != "/" ]; do
  if [ -d "$DIR/.obsidian" ]; then
    VAULT_ROOT="$DIR"
    echo "Vault root: $VAULT_ROOT"
    break
  fi
  DIR=$(dirname "$DIR")
done

# Check for installed skill (highest priority)
ls "$VAULT_ROOT/.claude/skills/" 2>/dev/null

# Check for CLAUDE.md (second priority)
ls "$VAULT_ROOT/CLAUDE.md" 2>/dev/null
```

**If a vault root skill exists** — List the skills in `.claude/skills/`, find one relevant to Obsidian or vault notes (by reading its SKILL.md frontmatter), and read its full SKILL.md. That skill's instructions govern all note operations from this point on.

**If no vault root skill, but CLAUDE.md exists** — Read it. If it defines Obsidian conventions (frontmatter, tags, naming, organization), those govern note operations. If it doesn't mention conventions, fall through to the next level.

**If neither provides conventions** — Use the fallback conventions at the bottom of this file.

### Step 3: Route to the right phase

| User intent | Phase |
|---|---|
| "Link a vault folder" / "Set up vault" | Phase 1: Setup |
| "What's in the vault?" / "Read project context" | Phase 2: Context Reading |
| "Create a note" / "Document this" / "Write implementation notes" | Phase 2 (if not done yet) then Phase 3: Note Creation |

---

## Phase 1: Setup

Only needed when no `vault` symlink exists and the user wants to create one. Read `references/setup-guide.md` for the full procedure — it covers:

- Accepting and validating the target path
- Creating the symlink (with proper quoting for paths with spaces)
- Updating the project's AI agent instructions (CLAUDE.md / AGENTS.md)
- Finding and reading vault root CLAUDE.md
- Informing the user about git tracking options

---

## Phase 2: Context Reading

Run this before any task requiring project understanding, or when the user asks about project context.

### Step 1: Load conventions

If not already done during auto-detection, resolve the vault root and follow the convention precedence chain (vault root skill > vault root CLAUDE.md > fallback).

### Step 2: Identify the root index

Look for the project's entry-point note in `vault/`:

1. A `.md` file whose name matches the project folder name
2. Fallback: any `.md` file with `tags: [nav]` in frontmatter
3. Fallback: `README.md` or `Index.md`

Read the root index — it maps out the project's note structure.

### Step 3: Discover organization

Scan the folder structure. Record: folder names, subfolder naming patterns, whether subfolders have index notes. Let the loaded conventions guide your interpretation.

### Step 4: Parse conventions from existing notes

Read 3-5 representative `.md` files from different parts of the vault. Extract:

- Frontmatter fields and formats
- Tag patterns
- Status values
- Heading hierarchy
- Callout usage
- Filename patterns
- Wikilink style

This helps you understand what the vault already contains — use it to inform placement and match existing patterns, not to override loaded conventions.

### Output

You now have an internal model of vault conventions. Use it silently to guide Phase 3.

---

## Phase 3: Note Creation

Run this whenever you need to create a note in the vault.

### Step 1: Ensure conventions are loaded

If you haven't run Phase 2, do it now.

### Step 2: Determine note type and placement

Match the note to the vault's existing folder structure. Place it where similar notes live. If no folder matches, place at the project folder root or ask the user.

### Step 3: Construct frontmatter

Build frontmatter using fields from the loaded conventions and patterns observed in existing notes. Only include fields the vault actually uses.

### Step 4: Write the note body

Follow patterns from existing notes of the same kind and the loaded conventions. General structure:

1. **H1 title**
2. **Context callout** (if the vault uses them)
3. **Main content** — adapted to note type
4. **Wikilinks** to related notes

### Step 5: Update parent indexes (if the vault uses them)

If the vault uses index notes that link to child notes:
1. Find the parent index note
2. Add a wikilink to your new note under the appropriate heading
3. Follow the existing format

### Step 6: Handle edge cases

- **No existing notes of this type**: Propose minimal format and ask user to approve
- **Multiple notes at once**: Create each individually, then update indexes
- **Note overlaps categories**: Pick primary category, use `related` links for cross-references
- **New category needed**: Ask user, follow sibling folder naming patterns

---

## Reference Files

- `references/setup-guide.md` — Full Phase 1 setup procedure for creating the vault symlink

---

## Fallback Conventions

These apply **only** when no vault root skill and no vault root CLAUDE.md with Obsidian conventions exist. If either higher source is found, ignore this section entirely.

### Frontmatter

| Field | Required | Description |
|---|---|---|
| `tags` | Yes | YAML array, lowercase, hyphenated |
| `date` | Yes | Creation date, `YYYY-MM-DD` |
| `status` | Context-dependent | e.g., `active`, `closed`, `done` |
| `parent` | Recommended | Wikilink to parent index: `"[[Parent Note]]"` |
| `related` | Optional | Array of wikilinks: `["[[Note A]]", "[[Note B]]"]` |

### Wikilinks

- Use `[[wikilinks]]` for all internal references, never markdown links
- Link to sections with `[[Note#Heading]]`

### Callouts

Use `> [!abstract]` for summaries, `> [!info]` for guidance, `> [!warning]` for risks/deviations, `> [!tip]` for suggestions.

### Tags

- Lowercase, hyphenated: `#market-validation`, `#ci-cd`
- 3-7 tags per note
- Use `#nav` on index/navigation notes

### Naming

- **Notes**: Title Case — `Implementation Review.md`
- **Folders**: lowercase-hyphens for utility (`attachments/`), Title Case for content (`01-Projects/`)

### Plan Documents

Do not modify existing plan documents unless explicitly asked.

### Diagrams

Do not use Mermaid — use markdown tables instead.

---

## Integration Notes

- **Project instructions vs vault conventions**: The project's CLAUDE.md/AGENTS.md governs code. Vault conventions govern documentation. Both apply simultaneously.
- **Symlink git tracking is the user's choice**: Do not make assumptions.
- **Concurrent editing**: Read notes fresh before modifying — the user may edit in Obsidian simultaneously.
- **Access beyond the symlink**: You can access any file inside the vault root directory, not just `vault/`. Resolve the vault root path to access sibling project folders or shared resources.
