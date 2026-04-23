# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

A collection of shareable Claude Code skills (slash commands) and personal-use skills maintained by @kaotypr. Skills are prompt-based tools that extend Claude Code's capabilities.

## Repository Structure

```
skills/                  # Shareable skills organized by category
  writing/               # Output is language — copy, essays, emails, docs
  design/                # Output is visual — UI, layout, brand
  engineering/           # Output is code or technical artifacts
  knowledge/             # Organizing, finding, synthesizing information
  workflow/              # How you work — setup, plumbing, cross-tool glue
  .experimental/         # Work-in-progress skills (not yet published)
.claude/skills/          # Project-local skills (explore-codebase, review-changes, debug-issue, refactor-safely)
research/                # Research notes and materials
workspace/               # Eval and testing space for skills
```

- Each skill is a Markdown file (`.md`) following the Claude Code custom slash command convention
- Skills in `skills/` are organized by category and intended for sharing
- Skills in `.experimental/` are work-in-progress, mirroring the same category structure

## Commit Message Convention

Follow [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

Format: `<type>[optional scope]: <description>`

With optional body and footer:
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

- `feat`: new feature (correlates with MINOR in SemVer)
- `fix`: bug fix (correlates with PATCH in SemVer)
- Append `!` after type/scope for breaking changes (correlates with MAJOR in SemVer), e.g. `feat!: remove X`
- A `BREAKING CHANGE:` footer can also denote breaking changes
- Scope is optional and provides additional context, e.g. `feat(auth): add feature A`
- Description must immediately follow the colon and space after type/scope
- Description must be lowercase and not end with a period
- **Never** add `Co-Authored-By` or any similar attribution trailer to commit messages
- When there are many changes spanning different concerns, split into multiple commits — one per logical concern (e.g. separate commits for deps, config, new features, refactors, tests)

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
