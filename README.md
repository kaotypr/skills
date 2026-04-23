# Claude Code Skills

A collection of shareable [Claude Code](https://claude.ai/code) skills (slash commands) maintained by [@kaotypr](https://github.com/kaotypr).

## Available Skills

### kao-obsidian

Guide for working with Obsidian vaults — editing notes with Obsidian Flavored Markdown, using the Obsidian CLI (v1.12+), and organizing vaults with PARA, MOC, flat+tags, or Johnny Decimal.

- **Version**: 1.0.0
- **Skill**: [`skills/knowledge/kao-obsidian`](skills/knowledge/kao-obsidian)
- **Evals**: [`workspace/kao-obsidian-workspace`](workspace/kao-obsidian-workspace) (5 scenarios, 2 iterations)

| Metric | With Skill | Without Skill |
|---|---|---|
| Pass Rate | 100% (28/28) | 46% (13/28) |
| Avg Tokens | 23,381 | 16,420 |

Tested across: note creation, vault health check, callout syntax, bulk tag-based move, bulk property update.

<details>
<summary>Eval iterations</summary>

**Iteration 1** — Model: `claude-sonnet-4-6`

| Eval | With Skill | Without Skill |
|---|---|---|
| create-project-note | 6/6 | 6/6 |
| vault-health-check | 6/6 | 0/6 |
| add-callouts | 5/5 | 5/5 |

Evals 1 and 3 non-discriminating — Claude already knows note/callout formatting at baseline. Eval 2 showed the skill's CLI reference is the primary value driver.

**Iteration 2** — Model: `claude-sonnet-4-6`

| Eval | With Skill | Without Skill |
|---|---|---|
| bulk-tag-move | 6/6 | 1/6 |
| bulk-property-update | 5/5 | 1/5 |

Added two harder CLI-focused evals. Without the skill, Claude defaults to Python/Perl/grep/mv — technically capable but wrong tooling. Both highly discriminating.

</details>

## Installation

Copy the skill folder into your Claude Code skills directory:

```bash
cp -r skills/<category>/<skill-name> ~/.claude/skills/
```

Or reference the skill directly from this repo using the skill path.

## License

MIT
