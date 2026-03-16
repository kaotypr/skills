# Vault Reorganization Plan

## Analysis

The vault at `/tmp/test-vault-messy/` contained 10 markdown files scattered at the root level with no folder structure. After reading each file, I categorized them based on their tags, content type, and purpose.

### File Inventory

| File | Tags | Category |
|------|------|----------|
| project-alpha-notes.md | #project, #active | Active project |
| old-project-beta.md | #project, #completed | Archived project |
| meeting-2026-03-10.md | #meeting | Meeting notes |
| python-cheatsheet.md | #reference, #python | Reference material |
| book-notes-atomic-habits.md | #book, #reference | Reference material |
| onboarding-guide.md | #work, #reference | Reference material |
| 2026-03-15.md | (none, daily note) | Daily note |
| recipe-pasta.md | #personal, #recipe | Personal |
| weekly-review.md | #review, #recurring | Template |
| random-ideas.md | (none) | Unsorted / inbox |

## Decision Points

**Question I would ask:** "Do you prefer a PARA-based structure (Projects, Areas, Resources, Archive) or a simpler topic-based folder layout?"

**Default chosen:** A hybrid approach using descriptive folder names with logical grouping. The structure separates active work from completed work, keeps reference materials together, and provides dedicated spaces for daily notes, meetings, personal items, templates, and an inbox for unprocessed notes.

## Folder Structure Created

```
test-vault-messy/
  1-projects/          -- Active and in-progress project notes
  2-areas/
    meetings/          -- Meeting notes and standup records
    personal/          -- Personal non-work notes (recipes, hobbies)
  3-resources/         -- Reference material, cheatsheets, guides, book notes
  4-archive/           -- Completed or inactive projects
  daily-notes/         -- Daily journal/task entries (date-named files)
  templates/           -- Reusable note templates
  inbox/               -- Unsorted ideas and captures awaiting processing
  attachments/         -- (Reserved for images and file attachments)
```

## File Placement Rationale

- **project-alpha-notes.md** -> `1-projects/` -- Tagged #active, has open tasks, clearly an ongoing project.
- **old-project-beta.md** -> `4-archive/` -- Tagged #completed with status: completed. No open work remains.
- **meeting-2026-03-10.md** -> `2-areas/meetings/` -- Tagged #meeting, contains attendee list and discussion notes.
- **python-cheatsheet.md** -> `3-resources/` -- Tagged #reference, serves as a lookup resource.
- **book-notes-atomic-habits.md** -> `3-resources/` -- Tagged #reference and #book, permanent reference material.
- **onboarding-guide.md** -> `3-resources/` -- Tagged #work and #reference, a guide meant for repeated use.
- **2026-03-15.md** -> `daily-notes/` -- Date-named file with daily tasks and notes. Follows Obsidian daily notes convention.
- **recipe-pasta.md** -> `2-areas/personal/` -- Tagged #personal, not work-related.
- **weekly-review.md** -> `templates/` -- Tagged #recurring, contains a blank template structure with empty fields.
- **random-ideas.md** -> `inbox/` -- No tags, contains unprocessed brainstorm items needing triage.

## Wikilink Preservation

All `[[wikilinks]]` in the files were preserved as-is. Obsidian resolves wikilinks by filename regardless of folder location, so moving files into subdirectories does not break any existing links (e.g., `[[python-cheatsheet]]` will still resolve to `3-resources/python-cheatsheet.md`).
