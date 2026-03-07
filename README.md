# kaotypr/skills

A collection of kaotypr AI agent skills.

## Installation

```bash
npx skills add kaotypr/skills
```

## Available Skills

| Skill | Description |
|---|---|
| [kao-base-ui](skills/kao-base-ui) | Guide for building UI with Base UI React (`@base-ui/react`), a headless component library with compound component patterns. |
| [kao-shadcn-base-ui](skills/kao-shadcn-base-ui) | Provides complete shadcn/ui (with base-ui as its primitives) component library patterns including installation, configuration, and implementation of accessible React components. |

## Project Structure

```
├── skills/
│   └── <skill-name>/
│       ├── SKILL.md          # Skill instructions (required)
│       └── references/       # Supporting documentation
├── workspaces/
│   └── <skill-name>/
│       ├── evals/            # Test prompts and assertions
│       └── iteration-<N>/    # Eval outputs, grading, and benchmarks
├── skills-lock.json          # Installed dependencies lock file
├── CLAUDE.md                 # AI agent project instructions
└── README.md
```

## Adding a New Skill

1. Create a directory under `skills/` with your skill name (lowercase, hyphenated, prefixed with `kao-`)
2. Add a `SKILL.md` with YAML frontmatter (`name`, `description`) and markdown instructions
3. Optionally add `references/`, `scripts/`, or `assets/` directories for supporting files

## Evaluation Results

Each skill has evaluation benchmarks in `workspaces/`. For example, the `kao-base-ui` skill was tested across 4 scenarios (form validation, context menu, toast system, custom utilities):

| Metric | With Skill | Without Skill |
|---|---|---|
| Pass Rate | 100% (23/23) | 37% (9/23) |
| Avg Tokens | 11,491 | 7,521 |

See [`workspaces/kao-base-ui/`](workspaces/kao-base-ui) for full benchmark data and eval outputs.

## License

© 2026 kaotypr (Adhitya Yosua Sanjaya Andaria)

Licensed under the MIT License.