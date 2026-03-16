# Vault Reorganization Plan

## Vault: /tmp/test-vault-messy/

## Assessment

The vault contained 10 markdown files with no folder structure — all notes were in the root directory. Tags were present on most notes, providing enough signal to classify each file.

No existing organizational system was detected (no PARA folders, no MOCs, no Johnny Decimal numbering). Per the skill's guidance, PARA was recommended as the default for new/unstructured vaults.

**Question I would ask the user:** "Your vault has no folder structure. I recommend the PARA method (Projects, Areas, Resources, Archive) for organizing it. Would you prefer PARA, Maps of Content, Flat+Tags, or Johnny Decimal?"

**Default chosen:** PARA (the skill's default recommendation).

## Classification of Notes

| File | Tags | Classification | Destination |
|------|------|---------------|-------------|
| `project-alpha-notes.md` | #project, #active | Active project | `1-projects/` |
| `old-project-beta.md` | #project, #completed | Completed project | `4-archive/` |
| `meeting-2026-03-10.md` | #meeting | Ongoing area (meetings) | `2-areas/meetings/` |
| `weekly-review.md` | #review, #recurring | Recurring template | `templates/` |
| `python-cheatsheet.md` | #reference, #python | Reference material | `3-resources/` |
| `book-notes-atomic-habits.md` | #reference | Reference material | `3-resources/` |
| `onboarding-guide.md` | #work, #reference | Reference material | `3-resources/` |
| `recipe-pasta.md` | #personal, #recipe | Personal area | `2-areas/personal/` |
| `random-ideas.md` | (none) | Untagged, needs triage | `inbox/` |
| `2026-03-15.md` | (none, daily note) | Daily note | `daily-notes/` |

## Reasoning

- **project-alpha-notes.md** has `#active` tag and contains open tasks, so it belongs in `1-projects/`.
- **old-project-beta.md** has `#completed` status and tag, so it goes straight to `4-archive/`.
- **meeting-2026-03-10.md** is a meeting note — meetings are an ongoing area of responsibility, placed under `2-areas/meetings/`.
- **weekly-review.md** is tagged `#recurring` and is structured as a template, so it goes in `templates/`.
- **python-cheatsheet.md**, **book-notes-atomic-habits.md**, **onboarding-guide.md** are all reference material (`#reference` tag), placed in `3-resources/`.
- **recipe-pasta.md** is tagged `#personal`, placed in `2-areas/personal/`.
- **random-ideas.md** has no tags and no clear category — it goes to `inbox/` for later triage.
- **2026-03-15.md** is clearly a daily note by its date-based filename, placed in `daily-notes/`.

## Obsidian CLI Commands (What Would Be Used)

If the Obsidian CLI were running, the following commands would perform this reorganization. The `obsidian move` command is preferred because it automatically updates all wikilinks across the vault.

```bash
# Step 1: Assess current state
obsidian folders
obsidian files sort=modified
obsidian tags counts
obsidian orphans
obsidian unresolved

# Step 2: Move active project
obsidian move file="project-alpha-notes.md" to="1-projects/"

# Step 3: Archive completed project
obsidian move file="old-project-beta.md" to="4-archive/"

# Step 4: Move meeting note
obsidian move file="meeting-2026-03-10.md" to="2-areas/meetings/"

# Step 5: Move recurring template
obsidian move file="weekly-review.md" to="templates/"

# Step 6: Move reference materials
obsidian move file="python-cheatsheet.md" to="3-resources/"
obsidian move file="book-notes-atomic-habits.md" to="3-resources/"
obsidian move file="onboarding-guide.md" to="3-resources/"

# Step 7: Move personal note
obsidian move file="recipe-pasta.md" to="2-areas/personal/"

# Step 8: Move untagged note to inbox
obsidian move file="random-ideas.md" to="inbox/"

# Step 9: Move daily note
obsidian move file="2026-03-15.md" to="daily-notes/"

# Step 10: Verify no broken links
obsidian unresolved
obsidian orphans
```

## Additional Recommendations

1. **Add frontmatter to untagged notes** — `random-ideas.md` and `2026-03-15.md` lack YAML frontmatter. Add at minimum `tags` and `date` properties.
2. **Create a daily note template** — Since daily notes exist, create a template in `templates/` for consistency.
3. **Set up attachment folder** — Configure Obsidian to save attachments to `attachments/`.
4. **Periodic maintenance** — Run `obsidian orphans` and `obsidian unresolved` weekly to keep the vault healthy.
