# Vault Setup Guide

Full procedure for creating the `vault` symlink and integrating it with the project. Only needed when no vault symlink exists.

---

## Step 1: Accept the target path

Ask the user for the vault project folder path. This is a specific project folder inside their Obsidian vault — not the vault root itself. Example:

```
~/Library/Mobile Documents/iCloud~md~obsidian/Documents/MyVault/01-Projects/MyProject
```

## Step 2: Validate the target

Check that the target:
- Exists as a directory
- Contains at least one `.md` file with YAML frontmatter

If the target does not exist, ask the user if they want to create it. If they do, create the directory and a root index note.

## Step 3: Check for existing `vault` entry

```bash
ls -la vault 2>/dev/null
```

- **Symlink exists**: Show the current target. Ask the user if they want to update it.
- **Regular directory exists**: Warn and abort — do not overwrite real directories.
- **Nothing exists**: Proceed.

If updating, remove the old symlink first: `rm vault`

## Step 4: Create the symlink

Always quote the target path (vault paths often contain spaces, especially iCloud paths):

```bash
ln -s "<target-path>" vault
```

## Step 5: Inform the user about the symlink

The `vault` symlink is a tiny pointer file. Whether to track it in git or add it to `.gitignore` is entirely the user's choice — do not make this decision for them. If they ask, explain the tradeoff:

- **Committing it**: Lets other developers and AI agents discover the vault link
- **Ignoring it**: Keeps the repo clean if the vault path is machine-specific

Either way, the symlink remains fully accessible on disk. Adding it to `.gitignore` does not prevent reading or writing — it only excludes it from git tracking.

## Step 6: Update the project's AI agent entry point

Add a section to the project's main AI agent instructions file explaining the vault link. This ensures any AI agent working in the project understands the `vault` directory without needing this skill installed.

**Which file to update:**
- If the project uses `AGENTS.md` as its main AI agent entry point, add the section there only
- If the project uses `CLAUDE.md`, add it there
- If neither exists, ask the user which file they prefer, then create it

Add a section like this:

```markdown
## Project Vault

The `vault/` directory is a symlink to an Obsidian vault project folder containing project documentation. It is the source of truth for project context.

- Read `vault/` contents to understand the project before starting work
- The vault has its own conventions defined in the vault root's CLAUDE.md — follow them when creating or editing notes inside `vault/`
- The symlink may be gitignored but is always accessible on disk — read and write freely
```

Do NOT include the absolute vault path in the instructions file — vault paths are machine-specific (especially iCloud paths) and will break on other computers. The `vault/` symlink itself is the pointer; agents should follow it rather than rely on a hardcoded path.

Adapt the wording to fit the file's existing style.

## Step 7: Find and read vault root CLAUDE.md

Resolve the symlink target to its absolute path, then walk up parent directories until you find a directory containing `.obsidian/` — this is the vault root.

```bash
TARGET=$(readlink vault)
DIR="$TARGET"
while [ "$DIR" != "/" ]; do
  if [ -d "$DIR/.obsidian" ]; then
    echo "Vault root: $DIR"
    break
  fi
  DIR=$(dirname "$DIR")
done
```

If the vault root has a `CLAUDE.md`, read it. Follow its instructions — they define the vault's conventions for note structure, frontmatter, tags, naming, and organization.
