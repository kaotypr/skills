# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a collection of AI agent skills, distributed via the [skills.sh](https://skills.sh/) ecosystem. Skills are installed by users with:

```
npx skills add kaotypr/skills
```

## Skill Structure

Each skill lives under `skills/<skill-name>/` and must contain a `SKILL.md` file with YAML frontmatter:

```markdown
---
name: skill-name
description: Brief description of what the skill does and when agents should use it.
license: MIT
metadata:
  author: kaotypr
  version: "1.0.0"
---

# Skill Title

Detailed instructions for the agent...
```

Optional directories per skill:
- `scripts/` — helper scripts for automation
- `references/` — supporting documentation and context

## Conventions

- Skill names use lowercase with hyphens (e.g., `my-skill-name`)
- The `description` in frontmatter should explain **when** the skill triggers (e.g., "use when writing React components")
- SKILL.md content is the actual instruction set given to agents — write it as clear, actionable directives
- Skills are discovered automatically from the `skills/` directory by the `npx skills` CLI
- Keep skills focused on a single domain; split broad topics into separate skills

## Discovery Paths

The skills CLI searches these paths in order:
- `skills/` and subdirectories
- Root `SKILL.md` (if present)

Place all skills in `skills/<skill-name>/` for consistency.
