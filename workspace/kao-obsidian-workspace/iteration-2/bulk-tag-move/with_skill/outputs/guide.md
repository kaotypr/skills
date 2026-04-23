# How to Consolidate All #meeting Notes into a meetings/ Folder

This guide walks you through finding every note tagged `#meeting` across your vault and moving them all into a new `meetings/` folder — without breaking any wikilinks.

## Why use `obsidian move` instead of `mv`

The `obsidian move` command is the only safe way to relocate files in an Obsidian vault. It automatically updates every wikilink across the vault that points to a moved file. Using the shell's `mv` command (or Finder/Explorer drag-and-drop) bypasses Obsidian's link updater and will leave all `[[wikilinks]]` broken.

**Prerequisite:** Obsidian must be running (or it will auto-launch) when you run these commands.

---

## Step 1 — Preview what you're going to move

First, see all files tagged `#meeting` before touching anything:

```bash
obsidian tag tag="#meeting"
```

To get a clean list of paths only (useful for scripting):

```bash
obsidian tag tag="#meeting" format=paths
```

Review the list. Confirm these are the ~20 notes you expect, spread across `2-Areas/work/`, `2-Areas/personal/`, and the vault root.

---

## Step 2 — Check for any unresolved links in the vault (baseline)

Before you make changes, record the current state of broken links. This gives you a baseline so you can confirm no new problems were introduced:

```bash
obsidian unresolved
```

---

## Step 3 — Move all #meeting notes in one shell loop

This is the core command. It pipes the list of tagged file paths into a `while` loop and calls `obsidian move` on each one:

```bash
obsidian tag tag="#meeting" format=paths | while read note; do
  obsidian move file="$note" to="meetings/"
done
```

What this does, step by step:
1. `obsidian tag tag="#meeting" format=paths` — emits one vault-relative file path per line.
2. `while read note` — iterates over each path.
3. `obsidian move file="$note" to="meetings/"` — moves that file to `meetings/` and updates all wikilinks that pointed to it across the entire vault.

The `meetings/` folder will be created automatically if it doesn't exist.

---

## Step 4 — Verify the move succeeded

Confirm all notes are now in `meetings/`:

```bash
obsidian tag tag="#meeting" format=paths
```

Every path in the output should now begin with `meetings/`. If any note still shows the old path, re-run the move for that specific file:

```bash
obsidian move file="2-Areas/work/some-straggler.md" to="meetings/"
```

---

## Step 5 — Verify no wikilinks broke

Run the unresolved links check again:

```bash
obsidian unresolved
```

Compare to the baseline from Step 2. If the list is the same (or shorter), you're clean — no new broken links were introduced. If new entries appeared, they are likely links pointing to one of the moved notes that was missed. See the troubleshooting section below.

---

## Step 6 — Spot-check a few notes

Open a couple of the moved notes and confirm their content and frontmatter are intact:

```bash
obsidian read file="meetings/your-meeting-note.md"
```

Also verify a note that linked *to* one of the moved notes to confirm its wikilinks were updated:

```bash
obsidian links file="meetings/your-meeting-note.md"
obsidian backlinks file="meetings/your-meeting-note.md"
```

---

## Troubleshooting

### A wikilink still shows the old path

This can happen if a note uses a path-based link like `[[2-Areas/work/Note Name]]` instead of a bare `[[Note Name]]`. Obsidian's link updater handles both forms, but if you find a broken link, update it manually:

```bash
obsidian read file="path/to/linking-note.md"
# Identify the broken link, then edit the file to use [[Note Name]] (no path prefix)
```

### One note didn't move

Re-run the move for that file explicitly:

```bash
obsidian move file="exact/path/to/note.md" to="meetings/"
```

### You want to confirm the meetings/ folder exists

```bash
obsidian folders
```

Look for `meetings/` in the tree output.

---

## Full command sequence (copy-paste ready)

```bash
# 1. Preview tagged files
obsidian tag tag="#meeting" format=paths

# 2. Baseline broken-link check
obsidian unresolved

# 3. Move all #meeting notes
obsidian tag tag="#meeting" format=paths | while read note; do
  obsidian move file="$note" to="meetings/"
done

# 4. Confirm all notes moved
obsidian tag tag="#meeting" format=paths

# 5. Verify no new broken links
obsidian unresolved
```

That's it. The entire operation is ~5 commands and Obsidian handles all the link-rewriting automatically.
