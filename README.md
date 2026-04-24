# kaotypr/skills

A collection of shareable AI agent skills maintained by [@kaotypr](https://github.com/kaotypr). Skills are developed using materials gathered in [`research/`](research/) and tested against eval scenarios in [`workspace/`](workspace/).

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

### kao-project-vault

Bridge a code repository to an Obsidian vault project folder via a `vault` symlink. Handles setup, convention discovery, and note creation with a precedence chain: vault root skill > vault root CLAUDE.md > fallback conventions.

- **Version**: 2.0.0
- **Skill**: [`skills/workflow/kao-project-vault`](skills/workflow/kao-project-vault)
- **Evals**: [`workspace/kao-project-vault-workspace`](workspace/kao-project-vault-workspace) (11 scenarios, 1 iteration)

| Metric | With Skill | Without Skill |
|---|---|---|
| Pass Rate | 100% (8/8) | 38% (3/8) |
| Avg Tokens | 23,868 | 18,590 |

Tested across: gitignored vault, vault root skill precedence, fallback conventions, setup from scratch, conflicting conventions, cross-vault access, multiple vault skills, deep convention override, real vault note, CLAUDE.md skill reference, cross-project reference.

<details>
<summary>Eval iterations</summary>

**Iteration 1** — Model: `claude-sonnet-4-6` — Fair baselines (zero vault hints in without-skill prompts)

| Eval | With Skill | Without Skill |
|---|---|---|
| E3 — fallback conventions | Proper frontmatter + callouts | No frontmatter at all |
| E4 — setup from scratch | Full protocol (symlink, AGENTS.md, vault root, git tracking) | Symlink only |
| E5 — conflicting conventions | Loaded vault root skill (kebab-case, nested tags) | Followed legacy notes (Title Case, flat tags) |
| E8 — deep override | Inline tags, no frontmatter tags (correct) | Kept tags in frontmatter (wrong) |
| E9 — real vault | Title Case filename (correct per CLAUDE.md) | kebab-case filename (wrong) |

3 evals (E1, E2, E7) had race conditions from parallel runs sharing fixtures. 3 evals (E6, E10, E11) were non-discriminating — Sonnet 4.6 handled cross-vault access and CLAUDE.md conventions without the skill.

The skill's value: convention precedence chain (vault root skill > CLAUDE.md > fallback), structured setup protocol, and gitignore-safe access guarantee.

</details>

## Installation

```bash
npx skills add https://github.com/kaotypr/skills --skill <skill-name>
```

## License

MIT
