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
name: kao-skill-name
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

- All skills created by kaotypr use the `kao-` prefix (e.g., `kao-base-ui`, `kao-my-skill`). This distinguishes our skills from third-party ones when installed alongside other skill collections.
- Skill names use lowercase with hyphens after the prefix
- The `description` in frontmatter should explain **when** the skill triggers (e.g., "use when writing React components") — the description drives agent triggering, not the skill name
- SKILL.md content is the actual instruction set given to agents — write it as clear, actionable directives
- Skills are discovered automatically from the `skills/` directory by the `npx skills` CLI
- Keep skills focused on a single domain; split broad topics into separate skills

## Evaluation Workspaces

Skill evaluations and benchmarks are stored in `workspaces/<skill-name>/`. Each workspace contains:
- `evals/evals.json` — test prompts and assertions
- `iteration-<N>/` — results per iteration, each containing:
  - `<eval-name>/eval_metadata.json` — prompt and assertions for that test case
  - `<eval-name>/with_skill/` — outputs, grading, and timing when the skill was used
  - `<eval-name>/without_skill/` — baseline outputs without the skill
  - `benchmark.json` — aggregated pass rates, token usage, and timing comparisons

Workspaces are committed to track skill quality over time. When improving a skill, add a new iteration directory rather than overwriting previous results.

## Discovery Paths

The skills CLI searches these paths in order:
- `skills/` and subdirectories
- Root `SKILL.md` (if present)

Place all skills in `skills/<skill-name>/` for consistency.

## README Maintenance

**Always update `README.md`** when:
- A new skill is created — add a new section under "Available Skills" with the skill name, description, version, links to the skill and workspace, and an eval summary table
- A skill is updated (version bump, description change, new eval iteration) — update the corresponding section with the latest version, pass rates, and eval counts
- A skill is removed — remove its section from the README

Each skill section in the README should include:
- Skill name as an `###` heading
- One-line description
- Version, skill path link, and workspace path link
- Eval summary table (pass rate with/without skill, and any other key metrics)
- Brief note on what was tested
