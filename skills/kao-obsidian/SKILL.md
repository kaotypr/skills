---
name: kao-obsidian
description: >
  Use when working with Obsidian vaults, markdown notes with [[wikilinks]], ![[embeds]],
  callouts (> [!type]), YAML frontmatter/properties, #tags, block IDs (^id),
  ==highlights==, %%comments%%, Obsidian CLI commands (obsidian create/read/append/search/move/tags/daily/etc.),
  vault organization (PARA, MOC, flat+tags, Johnny Decimal), folder restructuring,
  daily notes, templates, task management, backlink analysis, or any file operations
  in an Obsidian vault directory. Trigger this skill whenever the user mentions Obsidian,
  .md files inside an Obsidian vault, knowledge base organization, or note-taking workflows
  — even if they don't explicitly say "Obsidian".
license: MIT
metadata:
  author: kaotypr
  version: "1.0.0"
---

# Obsidian Vault — Editing, CLI & Organization Guide

## Overview

This skill covers working with Obsidian vaults through two complementary approaches:

1. **Direct file editing** — Creating and modifying `.md` files that follow Obsidian Flavored Markdown conventions (wikilinks, callouts, properties, embeds, etc.)
2. **Obsidian CLI** (v1.12+) — Using the official command-line interface to interact with a running Obsidian instance for operations like search, file management, link analysis, tagging, and more.

For the full markdown syntax reference, read `references/markdown-syntax.md`.
For the complete CLI command reference, read `references/cli-commands.md`.
For Obsidian terminology, read `references/glossary.md`.

## Critical Rules

1. **Use wikilinks for internal links** — `[[Note Name]]`, not `[Note Name](Note%20Name.md)`. Obsidian's link updater works with wikilinks. Use standard markdown links only for external URLs.
2. **Properties go in YAML frontmatter** — Fenced by `---` at the very top of the file. Use lowercase keys. Three special properties: `tags`, `aliases`, `cssclasses`.
3. **File and folder names** — Use lowercase-with-hyphens for folders (`daily-notes/`, `project-plans/`). Note titles can use natural casing (`Meeting Notes 2026-03-16.md`). Avoid special characters: `# ^ [] | \`.
4. **Don't fabricate block IDs** — Block IDs (`^my-block-id`) should only be added when the user specifically wants to reference a block. Don't scatter them preemptively.
5. **Preserve existing content** — When editing notes, preserve existing frontmatter fields, block IDs, and wikilinks you don't need to change. Obsidian users build interconnected graphs; breaking links breaks their knowledge base.
6. **CLI requires a running Obsidian instance** — The CLI is a remote control for the desktop app, not a standalone tool. If Obsidian isn't running, it will auto-launch. All CLI commands follow the pattern: `obsidian <command> [param=value] [flags]`.
7. **Respect the vault's organization system** — Before creating files, check the existing folder structure to understand the organizational philosophy in use. Don't impose a different structure on an existing vault.

## Obsidian Flavored Markdown — Quick Reference

Obsidian Markdown is a superset of CommonMark + GFM with these extensions:

| Feature | Syntax |
|---------|--------|
| Wikilink | `[[Note Name]]` |
| Wikilink with alias | `[[Note Name\|Display Text]]` |
| Link to heading | `[[Note#Heading]]` |
| Link to block | `[[Note#^block-id]]` |
| Embed note | `![[Note Name]]` |
| Embed image | `![[image.png]]` or `![[image.png\|300]]` for width |
| Embed PDF page | `![[doc.pdf#page=3]]` |
| Embed heading | `![[Note#Heading]]` |
| Highlight | `==highlighted text==` |
| Callout | `> [!note] Title` (see below) |
| Comment | `%%hidden text%%` |
| Block ID | `Paragraph text ^my-id` |
| Tag | `#tag` or `#nested/tag` |
| Inline math | `$E = mc^2$` |
| Block math | `$$\int_0^\infty$$` |
| Footnote | `Text[^1]` with `[^1]: Definition` |
| Task | `- [ ] unchecked` / `- [x] checked` |

For the full syntax reference with examples, read `references/markdown-syntax.md`.

### Callout Types

13 built-in types: `note`, `abstract`, `info`, `todo`, `tip`, `success`, `question`, `warning`, `failure`, `danger`, `bug`, `example`, `quote`.

```markdown
> [!warning] Watch out
> This is a warning callout.

> [!tip]+ Expandable (open by default)
> Content here.

> [!faq]- Collapsed by default
> Content here.
```

### Properties (YAML Frontmatter)

```yaml
---
title: My Note Title
date: 2026-03-16
tags:
  - project
  - active
aliases:
  - My Note
  - MN
cssclasses:
  - wide-page
status: draft
priority: 1
reviewed: false
due: 2026-04-01T10:00:00
related:
  - "[[Other Note]]"
---
```

Supported property types: Text, Number, Checkbox (true/false), Date (YYYY-MM-DD), Date & Time (ISO 8601), List (YAML array), Links (wikilinks as quoted strings in YAML).

## Obsidian CLI — Essential Commands

The CLI has 100+ commands. Here are the most commonly used ones for AI agent workflows. For the full reference, read `references/cli-commands.md`.

### File Operations

```bash
# Read a note
obsidian read file="path/to/note.md"

# Create a note with content
obsidian create name="Projects/new-project" content="# New Project\n\nDescription here."

# Create from template
obsidian create name="Meeting Notes" template="meeting-template"

# Append content to end of file
obsidian append file="path/to/note.md" content="- New bullet point"

# Prepend content after frontmatter
obsidian prepend file="path/to/note.md" content="## Added Section"

# Move file (auto-updates wikilinks!)
obsidian move file="old/path/note.md" to="new/path/"

# Delete to trash
obsidian delete file="path/to/note.md"

# List files
obsidian files sort=modified limit=10
obsidian files format=json
```

### Search & Discovery

```bash
# Full-text search
obsidian search query="meeting notes"

# Search with context (grep-style)
obsidian search:context query="TODO" limit=10

# Find unresolved (broken) links
obsidian unresolved

# Find orphan notes (no incoming links)
obsidian orphans

# Find dead-end notes (no outgoing links)
obsidian deadends

# Show backlinks to a note
obsidian backlinks file="Projects/alpha.md"

# Show outgoing links
obsidian links file="Projects/alpha.md"
```

### Tags & Properties

```bash
# List all tags with counts
obsidian tags counts

# Find files with a specific tag
obsidian tag tag="#project"

# Read properties
obsidian properties file="note.md"
obsidian property:read file="note.md" name="status"

# Set a property
obsidian property:set file="note.md" name="status" value="complete"

# Remove a property
obsidian property:remove file="note.md" name="priority"
```

### Daily Notes

```bash
obsidian daily                                    # Open today's daily note
obsidian daily:read                               # Read today's content
obsidian daily:append content="- [ ] New task"    # Add to end
obsidian daily:prepend content="## Morning"       # Add after frontmatter
obsidian daily:path                               # Get file path
```

### Tasks

```bash
obsidian tasks              # List all tasks
obsidian tasks daily        # Tasks from today's daily note
```

### Vault Structure

```bash
obsidian vault              # Vault info
obsidian folders            # Folder tree
obsidian files total        # File count
obsidian outline file="note.md"  # Show headings
obsidian wordcount file="note.md"
```

### Output Formats

Most GET commands accept `format=` parameter: `json`, `csv`, `tsv`, `md`, `paths`, `text`, `tree`, `yaml`.

```bash
obsidian files format=json | jq '.[].path'
obsidian tags format=yaml
obsidian search query="TODO" format=json
```

### Clipboard

Add `--copy` to any command to copy output to clipboard:

```bash
obsidian files sort=modified limit=5 --copy
obsidian read file="note.md" --copy
```

### Multi-Vault

Specify vault as the first parameter when working with multiple vaults:

```bash
obsidian vault="Work" daily
obsidian vault="Personal" search query="recipe"
```

## Vault Organization

When working with an Obsidian vault, first assess which organizational philosophy is in use by examining the folder structure, existing MOCs/index notes, and tag patterns. If the vault is clearly using a system, follow it consistently.

### Detecting the Organization System

Check these signals:
- **PARA**: Folders named `Projects/`, `Areas/`, `Resources/`, `Archive/` (or close variations)
- **MOC**: Index/hub notes with titles like "MOC - Topic" or "Index - Topic", heavy use of wikilinks as navigation
- **Flat + Tags**: Few or no folders, heavy tag usage in frontmatter and inline, tag hierarchies like `#project/active`
- **Johnny Decimal**: Numbered folders like `10-19 Finance/`, `11 Budgets/`, `12 Invoices/`

### If the vault is empty or the user asks for a structure

Ask the user which organization system they prefer. Present these options:

**1. PARA** (default recommendation for new vaults)
```
vault/
├── 1-Projects/        # Active projects with deadlines
├── 2-Areas/           # Ongoing responsibilities (health, finance, career)
├── 3-Resources/       # Reference material by topic
├── 4-Archive/         # Completed/inactive items
├── templates/         # Note templates
├── daily-notes/       # Daily journal entries
└── attachments/       # Images, PDFs, files
```

**2. Maps of Content (MOC)**
```
vault/
├── +Index.md          # Master index linking to all MOCs
├── MOCs/              # Hub notes that link to topic clusters
├── notes/             # All atomic notes (flat or lightly categorized)
├── templates/
├── daily-notes/
└── attachments/
```

**3. Flat + Tags**
```
vault/
├── notes/             # All notes in one folder
├── templates/
├── daily-notes/
└── attachments/
```
Organization is entirely through `tags` in frontmatter and inline `#tags`. Use tag hierarchies: `#project/active`, `#area/health`, `#type/meeting`.

**4. Johnny Decimal**
```
vault/
├── 00-09 System/
│   ├── 00 Index/
│   └── 01 Templates/
├── 10-19 Work/
│   ├── 10 Projects/
│   ├── 11 Meetings/
│   └── 12 Reports/
├── 20-29 Personal/
│   ├── 20 Health/
│   └── 21 Finance/
├── daily-notes/
└── attachments/
```

### Organization Best Practices (Apply Regardless of System)

- **One note, one idea** — Atomic notes are easier to link and reuse than monolithic pages.
- **Link generously** — Use `[[wikilinks]]` whenever you mention a concept that has (or could have) its own note. This builds the knowledge graph.
- **Use templates for recurring notes** — Daily notes, meeting notes, project briefs should have templates for consistency.
- **Keep attachments in one place** — Configure Obsidian to save attachments to an `attachments/` folder (Settings > Files & links > Default location for new attachments).
- **Frontmatter on every note** — At minimum include `tags` and `date`. For project notes, add `status`, `priority`, `due`.
- **Regular maintenance** — Periodically check `obsidian orphans` and `obsidian unresolved` to find disconnected notes and broken links.
- **Archive, don't delete** — Move completed projects/outdated notes to archive rather than deleting them.

### Implementing Organization with CLI

When reorganizing a vault, use the CLI's `move` command because it automatically updates all wikilinks:

```bash
# Move completed project to archive
obsidian move file="1-Projects/website-redesign.md" to="4-Archive/"

# Bulk move with tag filtering
obsidian tag tag="#archived" format=paths | while read note; do
  obsidian move file="$note" to="4-Archive/"
done

# Find orphans and review them
obsidian orphans format=paths
```

## Common Agent Workflows

### Creating a New Note

1. Check existing vault structure to determine where the note belongs
2. Use appropriate template if one exists (`obsidian templates` to list them)
3. Add proper frontmatter with at minimum `tags` and `date`
4. Use wikilinks to connect to related notes
5. Create the note: `obsidian create name="path/note-title" content="..."`

### Reorganizing Notes

1. Assess current structure: `obsidian folders` and `obsidian files`
2. Identify problems: `obsidian orphans`, `obsidian unresolved`, `obsidian deadends`
3. Use `obsidian move` for relocating files (preserves links)
4. Update index/MOC notes if the vault uses them
5. Verify links: `obsidian unresolved`

### Daily Note Workflow

```bash
# Start the day
obsidian daily
obsidian daily:read

# Add tasks throughout the day
obsidian daily:append content="- [ ] Review PR #42"
obsidian daily:append content="- [ ] Update project status"

# Review tasks
obsidian tasks daily
```

### Knowledge Capture

1. Create atomic notes for individual concepts
2. Add proper frontmatter and tags
3. Link to related notes with wikilinks
4. If using MOC system, update the relevant MOC note
5. If using PARA, place in the correct area/project folder
