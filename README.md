# kao-skills

A collection of AI agent skills.

## Installation

```bash
npx skills add kaotypr/kao-skills
```

## Available Skills

| Skill | Description |
|---|---|
| [base-ui-react](skills/base-ui-react) | Guide for building UI with Base UI React (`@base-ui/react`), a headless component library with compound component patterns. |

## Project Structure

```
kao-skills/
├── skills/
│   └── <skill-name>/
│       ├── SKILL.md          # Skill instructions (required)
│       └── references/       # Supporting documentation
├── skills-lock.json          # Installed dependencies lock file
├── CLAUDE.md                 # AI agent project instructions
└── README.md
```

## Adding a New Skill

1. Create a directory under `skills/` with your skill name (lowercase, hyphenated)
2. Add a `SKILL.md` with YAML frontmatter (`name`, `description`) and markdown instructions
3. Optionally add `references/`, `scripts/`, or `assets/` directories for supporting files

## License

MIT
