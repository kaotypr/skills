# Obsidian CLI — Full Command Reference

The official Obsidian CLI (v1.12+) is a remote control for a running Obsidian desktop instance. It is not a standalone headless tool — if Obsidian isn't running, it auto-launches.

**Syntax**: `obsidian <command> [param=value] [flags]`

Multi-vault: Add `vault="VaultName"` as the first parameter to target a specific vault.

## Table of Contents

1. [General](#general)
2. [File Operations](#file-operations)
3. [Search](#search)
4. [Links & Structure](#links--structure)
5. [Tags](#tags)
6. [Properties](#properties)
7. [Daily Notes](#daily-notes)
8. [Tasks](#tasks)
9. [Templates](#templates)
10. [Bookmarks](#bookmarks)
11. [Workspaces](#workspaces)
12. [Bases (Databases)](#bases-databases)
13. [Plugins](#plugins)
14. [Themes & CSS](#themes--css)
15. [File History & Recovery](#file-history--recovery)
16. [Developer Tools](#developer-tools)
17. [Output Formats & Flags](#output-formats--flags)

---

## General

| Command | Type | Description |
|---------|------|-------------|
| `help` | GET | Display available commands or help for a specific command |
| `version` | GET | Show Obsidian version |
| `vault` | GET | Show current vault information |
| `vaults` | GET | List all known vaults (desktop only) |
| `reload` | POST* | Refresh the app window |
| `restart` | POST* | Restart the application |

*Commands marked POST* require `allowDangerousCommands` setting.

## File Operations

| Command | Type | Description |
|---------|------|-------------|
| `file file="path"` | GET | Show file metadata |
| `files` | GET | List all files in vault |
| `files sort=modified limit=5` | GET | List files sorted by modification, limited |
| `files total` | GET | Show total file count |
| `folder file="path"` | GET | Show folder info |
| `folders` | GET | Display folder tree |
| `read file="path"` | GET | Read file contents |
| `outline file="path"` | GET | Show headings for a file |
| `wordcount file="path"` | GET | Count words and characters |
| `open file="path"` | POST | Open a file in Obsidian |
| `create name="path" content="text"` | POST | Create a new file |
| `create name="path" template="name"` | POST | Create file from template |
| `append file="path" content="text"` | POST | Add content to end of file |
| `prepend file="path" content="text"` | POST | Insert content after frontmatter |
| `move file="path" to="new/path/"` | POST | Move/rename file (auto-updates wikilinks) |
| `rename file="path" name="new-name"` | POST | Rename a file |
| `delete file="path"` | DELETE | Move file to trash |
| `delete file="path" permanent` | DELETE | Permanently delete file |

### Key Details

- `create` overwrites if the file already exists. Check first with `read` or `file`.
- `move` is the most important command for reorganization — it updates all wikilinks across the vault that point to the moved file.
- `prepend` inserts after YAML frontmatter, not at byte 0.
- `append` adds to the very end of the file.
- When no `file=` is specified, many commands default to the currently active file.

## Search

| Command | Type | Description |
|---------|------|-------------|
| `search query="text"` | GET | Full-text search across vault |
| `search:context query="text" limit=N` | GET | Search with surrounding line context |
| `search:open` | POST | Open Obsidian's search panel in the GUI |

Search returns file paths by default. Use `format=json` for structured output with match details.

## Links & Structure

| Command | Type | Description |
|---------|------|-------------|
| `links file="path"` | GET | Show outgoing links from a file |
| `backlinks file="path"` | GET | Show incoming links to a file |
| `unresolved` | GET | List all broken/unresolved links |
| `orphans` | GET | List files with no incoming links |
| `deadends` | GET | List files with no outgoing links |

These commands are essential for vault health. Run `unresolved` after reorganizing to verify no links broke. Run `orphans` periodically to find disconnected notes.

## Tags

| Command | Type | Description |
|---------|------|-------------|
| `tags` | GET | List all tags in vault |
| `tags counts` | GET | List tags with frequency counts |
| `tag tag="#tagname"` | GET | Find files with a specific tag |
| `tags:rename old="oldname" new="newname"` | POST | Bulk rename tag across entire vault |

Tag rename is vault-wide — it updates both frontmatter and inline tags.

## Properties

| Command | Type | Description |
|---------|------|-------------|
| `properties` | GET | List all property keys used in vault |
| `properties file="path"` | GET | Show frontmatter for a specific file |
| `property:read file="path" name="key"` | GET | Read a specific property value |
| `property:set file="path" name="key" value="val"` | POST | Set/update a property |
| `property:remove file="path" name="key"` | DELETE | Remove a property from frontmatter |
| `aliases` | GET | List all aliases across vault |

## Daily Notes

| Command | Type | Description |
|---------|------|-------------|
| `daily` | POST | Open/create today's daily note |
| `daily:path` | GET | Get the file path of today's note |
| `daily:read` | GET | Read today's daily note contents |
| `daily:append content="text"` | POST | Append content to today's note |
| `daily:prepend content="text"` | POST | Prepend content after frontmatter |

## Tasks

| Command | Type | Description |
|---------|------|-------------|
| `tasks` | GET | List all tasks in vault |
| `tasks daily` | GET | List tasks from today's daily note |
| `tasks all` | GET | List all tasks including completed |
| `tasks done` | GET | List completed tasks only |
| `task` | POST | Show or modify a specific task |

## Templates

| Command | Type | Description |
|---------|------|-------------|
| `templates` | GET | List available template files |
| `template:read name="template-name"` | GET | Display template content |
| `template:insert name="template-name"` | POST | Insert template into current file |

## Bookmarks

| Command | Type | Description |
|---------|------|-------------|
| `bookmarks` | GET | List all bookmarks |
| `bookmark file="path"` | POST | Add a file to bookmarks |

## Workspaces

| Command | Type | Description |
|---------|------|-------------|
| `workspace` | GET | Show current workspace layout tree |
| `workspaces` | GET | List saved workspaces |
| `workspace:save name="name"` | POST | Save current layout as workspace |
| `workspace:load name="name"` | POST | Load a saved workspace |
| `workspace:delete name="name"` | DELETE | Delete a workspace |
| `tabs` | GET | List open tabs |
| `tab:open file="path"` | POST | Open a file in a new tab |
| `recents` | GET | List recently opened files |

## Bases (Databases)

Bases are Obsidian's built-in database feature for structured data.

| Command | Type | Description |
|---------|------|-------------|
| `bases` | GET | List all .base files in vault |
| `base:views file="base.base"` | GET | Show views in a base |
| `base:query file="base.base"` | GET | Query and return base results |
| `base:create file="base.base"` | POST | Add a new item to a base |

## Plugins

| Command | Type | Description |
|---------|------|-------------|
| `plugins` | GET | List installed plugins |
| `plugins:enabled` | GET | List currently enabled plugins |
| `plugin id="plugin-id"` | GET | Get plugin details |
| `plugin:enable id="plugin-id"` | POST | Enable a plugin |
| `plugin:disable id="plugin-id"` | POST | Disable a plugin |
| `plugin:install id="plugin-id"` | POST | Install from community plugins |
| `plugin:uninstall id="plugin-id"` | DELETE | Uninstall a plugin |
| `plugin:reload id="plugin-id"` | POST | Hot-reload plugin (for development) |
| `plugins:restrict` | POST* | Toggle restricted mode |

## Themes & CSS

| Command | Type | Description |
|---------|------|-------------|
| `themes` | GET | List installed themes |
| `theme` | GET | Show active theme |
| `theme:set name="ThemeName"` | POST | Switch theme |
| `theme:install name="ThemeName"` | POST | Install community theme |
| `theme:uninstall name="ThemeName"` | DELETE | Remove theme |
| `snippets` | GET | List CSS snippets |
| `snippets:enabled` | GET | List active snippets |
| `snippet:enable name="snippet"` | POST | Activate a CSS snippet |
| `snippet:disable name="snippet"` | POST | Deactivate a CSS snippet |

## File History & Recovery

| Command | Type | Description |
|---------|------|-------------|
| `diff file="path" from="ts1" to="ts2"` | GET | Compare file versions |
| `history file="path"` | GET | List recovery versions |
| `history:list` | GET | Show files with version history |
| `history:read file="path" version="id"` | GET | Read a specific version |
| `history:restore file="path" version="id"` | POST | Restore a file version |
| `history:open file="path"` | POST | Open recovery UI in Obsidian |

## Developer Tools

All developer commands require `allowDangerousCommands`.

| Command | Type | Description |
|---------|------|-------------|
| `devtools` | POST | Toggle developer tools panel |
| `eval code="javascript"` | POST | Execute JavaScript (has access to `app` object) |
| `dev:console` | GET | Show console output |
| `dev:errors` | GET | Display JavaScript error logs |
| `dev:screenshot path="file.png"` | POST | Capture app screenshot as base64 |
| `dev:dom selector=".class"` | GET | Query DOM elements |
| `dev:css selector=".class"` | GET | Inspect CSS rules |
| `dev:mobile` | POST | Toggle mobile emulation |
| `dev:debug` | POST | Attach debugger |
| `dev:cdp` | POST | Execute Chrome DevTools Protocol command |
| `commands` | GET | List all available command IDs |
| `command id="command-id"` | POST | Execute an Obsidian command by ID |
| `hotkeys` | GET | List all keybindings |
| `hotkey id="command-id"` | GET | Get hotkey for a specific command |

## Output Formats & Flags

### Format Parameter

Most GET commands accept `format=` to control output:

| Format | Description |
|--------|-------------|
| `text` | Plain text (default) |
| `json` | JSON structured output |
| `csv` | Comma-separated values |
| `tsv` | Tab-separated values |
| `md` | Markdown formatted |
| `paths` | File paths only (one per line) |
| `tree` | Tree view (for folders) |
| `yaml` | YAML formatted |

### Flags

| Flag | Description |
|------|-------------|
| `--copy` | Copy output to system clipboard |

### Shell Integration

```bash
# Pipe JSON output to jq
obsidian search query="TODO" format=json | jq '.[].file'

# Bulk operations
obsidian tag tag="#to-archive" format=paths | while read note; do
  obsidian move file="$note" to="4-Archive/"
done

# Count tasks
obsidian tasks format=json | jq length
```
