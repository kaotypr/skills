# Obsidian Glossary

Key terms and concepts used in Obsidian and this skill.

## Core Concepts

**Vault**
A folder on your local filesystem that Obsidian treats as a self-contained knowledge base. A vault is just a directory of `.md` files — there's no database or proprietary format. The `.obsidian/` hidden folder inside stores settings, plugins, and themes for that vault.

**Note**
A single markdown file (`.md`) in the vault. The filename (without extension) is the note's title and is used in wikilinks.

**Graph View**
A visual network diagram showing all notes as nodes and links between them as edges. Reveals clusters, orphans, and the overall structure of your knowledge base.

**Backlink**
An incoming link — when Note B contains `[[Note A]]`, Note A has a backlink from Note B. Obsidian tracks these automatically. Backlinks are a core feature for discovering connections.

**Outgoing Link**
A link from the current note to another note. The `[[wikilink]]` in your note text.

**Unresolved Link**
A wikilink `[[Something]]` where no note named "Something" exists yet. These appear in graph view as ghost nodes. They're not errors — creating notes from unresolved links is a common workflow.

**Orphan**
A note with no incoming links (no other note links to it). Orphans may indicate notes that need to be better connected to the knowledge graph.

**Dead End**
A note with no outgoing links. It doesn't link to any other note, so it's a terminal node in the graph.

## Organization Concepts

**PARA Method**
An organizational system by Tiago Forte with four top-level categories:
- **Projects** — Active efforts with a deadline or outcome (e.g., "Launch website")
- **Areas** — Ongoing responsibilities with no end date (e.g., "Health", "Finance")
- **Resources** — Reference material organized by topic (e.g., "Python", "Recipes")
- **Archive** — Completed or inactive items from the other three categories

**Map of Content (MOC)**
A hub note that links to all notes on a particular topic. Unlike folders, a single note can appear in multiple MOCs. MOCs act as a table of contents for a subject area. Example: a "Programming MOC" note with links to `[[Python]]`, `[[JavaScript]]`, `[[Data Structures]]`, etc.

**Atomic Note**
A note focused on a single idea or concept. Easier to link and reuse than long multi-topic notes. This principle comes from the Zettelkasten method.

**Zettelkasten**
A note-taking method where each note contains one idea, is given a unique identifier, and is connected to other notes via links. Obsidian's linking system is well-suited for Zettelkasten.

**Johnny Decimal**
A folder numbering system where categories are grouped in tens (10-19 Work, 20-29 Personal, etc.) and individual items get specific numbers (11 Projects, 12 Meetings). Provides a strict but navigable hierarchy.

**Index Note**
A master note that serves as the entry point to the vault, linking to major MOCs or top-level categories. Often named `+Index`, `Home`, or `Dashboard`.

## Markdown Concepts

**Wikilink**
Obsidian's preferred internal link format: `[[Note Name]]`. Double square brackets. Can include aliases: `[[Note Name|Display Text]]`.

**Embed / Transclusion**
Including the content of one note inside another using `![[Note Name]]`. The embedded content renders inline. Works with notes, headings, blocks, images, PDFs, and audio/video.

**Block ID**
A unique identifier attached to a paragraph or list item: `text ^my-id`. Enables linking to specific blocks with `[[Note#^my-id]]`. Block IDs must be unique within a note.

**Callout**
A styled blockquote with semantic meaning, using the syntax `> [!type] Title`. Obsidian has 13 built-in types (note, warning, tip, etc.) each with distinct colors and icons.

**Frontmatter / Properties**
YAML metadata at the top of a note, between `---` fences. Stores structured data like tags, dates, status, and custom fields. Three special properties: `tags`, `aliases`, `cssclasses`.

**Alias**
An alternative name for a note, defined in frontmatter. When searching or typing `[[`, aliases autocomplete to the actual note. Useful when a concept has multiple names.

**Tag**
A categorization label. Inline: `#tag`. Frontmatter: `tags: [tag]`. Tags support hierarchy: `#parent/child`. Searching for a parent tag includes all children.

**Nested Tag / Tag Hierarchy**
Tags with forward slashes create hierarchies: `#project/active`, `#project/archived`. Searching `#project` matches all subtags.

## Vault Structure

**`.obsidian/` Directory**
Hidden folder inside the vault root that stores Obsidian's configuration: settings, installed plugins, themes, CSS snippets, workspaces, hotkeys, and appearance preferences. Managed by Obsidian — don't manually edit unless you know what you're doing.

**Template**
A predefined note structure used to create consistent notes. Stored in a configured templates folder. Can include variables like `{{date}}`, `{{time}}`, `{{title}}`.

**Daily Note**
A note automatically created for each day, typically used as a journal or inbox. Stored in a configured folder (commonly `daily-notes/`). Named by date format.

**Workspace**
A saved layout of open panes, tabs, and sidebar state. Switch between workspaces for different contexts (e.g., "Writing" workspace vs. "Research" workspace).

**Snippet (CSS Snippet)**
A small CSS file in `.obsidian/snippets/` that customizes Obsidian's appearance. Can be toggled on/off in settings.

**Base**
Obsidian's built-in database feature. A `.base` file that provides spreadsheet-like views over notes using their properties/frontmatter as columns.

## CLI Concepts

**Obsidian CLI**
The official command-line interface (v1.12+). Acts as a remote control for a running Obsidian desktop instance. Commands follow the pattern: `obsidian <command> [param=value] [flags]`.

**MCP Server**
Model Context Protocol server. Obsidian can expose its CLI commands as MCP tools for AI assistants via `obsidian serve`. This enables AI tools to interact with vaults programmatically.

**Dangerous Command**
CLI commands that can cause data loss or security concerns (e.g., `eval`, `command`, `restart`). These require the `allowDangerousCommands` setting to be enabled.
