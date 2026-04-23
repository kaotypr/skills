# Bulk Property Update: Mark website-redesign Project as Complete

To set `status: complete` and `completed: 2026-04-24` on every note in `1-Projects/website-redesign/`, use `obsidian files` to list the paths in that folder, then loop over them with `property:set`.

## Step 1 — List all files in the folder (verify first)

```bash
obsidian files format=paths | grep "^1-Projects/website-redesign/"
```

This confirms the ~8 files you expect before making any changes.

## Step 2 — Bulk update both properties in a single loop

```bash
obsidian files format=paths | grep "^1-Projects/website-redesign/" | while read note; do
  obsidian property:set file="$note" name="status" value="complete"
  obsidian property:set file="$note" name="completed" value="2026-04-24"
done
```

This pipes the filtered list of paths into a `while read` loop. For each note it runs two `property:set` commands:
- Sets (or overwrites) `status` to `complete`
- Sets (or adds) `completed` to `2026-04-24` (a Date-type property in YAML `YYYY-MM-DD` format)

## Step 3 — Verify the changes

Spot-check one file to confirm both properties were written:

```bash
obsidian properties file="1-Projects/website-redesign/<any-note>.md"
```

Or check all of them at once:

```bash
obsidian files format=paths | grep "^1-Projects/website-redesign/" | while read note; do
  echo "=== $note ==="
  obsidian property:read file="$note" name="status"
  obsidian property:read file="$note" name="completed"
done
```

## Notes

- `property:set` creates the property if it doesn't exist yet, and overwrites it if it does — no special handling needed.
- The `completed` value `2026-04-24` follows Obsidian's Date property format (`YYYY-MM-DD`), so it will render as a date picker in the Properties panel.
- Obsidian must be running (or will auto-launch) for CLI commands to work.
- If your vault name is ambiguous (multiple vaults open), prefix each command with `vault="YourVaultName"`.
