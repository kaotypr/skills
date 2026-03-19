# kaotypr/skills

A collection of kaotypr AI agent skills.

## Installation

```bash
npx skills add kaotypr/skills
```

## Available Skills

### kao-base-ui

Guide for building UI with Base UI React (`@base-ui/react`), a headless, accessible component library using compound component patterns.

- **Version**: 1.1.0
- **Skill**: [`skills/kao-base-ui`](skills/kao-base-ui)
- **Evals**: [`workspaces/kao-base-ui`](workspaces/kao-base-ui) (4 scenarios, 2 iterations)

| Metric | With Skill | Without Skill |
|---|---|---|
| Pass Rate | 100% (23/23) | 37% (9/23) |
| Avg Tokens | 11,491 | 7,521 |

Tested across: form validation, context menu, toast system, custom utilities.

---

### kao-shadcn-base-ui

Complete shadcn/ui component library patterns using `@base-ui/react` as its primitive layer. Covers installation, Tailwind CSS v4 theming with oklch variables, forms with React Hook Form + Zod, and 59 components.

- **Version**: 2.0.0
- **Skill**: [`skills/kao-shadcn-base-ui`](skills/kao-shadcn-base-ui)
- **Evals**: [`workspaces/kao-shadcn-base-ui`](workspaces/kao-shadcn-base-ui) (3 scenarios, 5 iterations)

| Metric | With Skill | Without Skill |
|---|---|---|
| Pass Rate | 100% (18/18) | 87% (16/18) |
| Avg Tokens | 15,327 | 5,499 |

Tested across: settings form, warning button + dialog, drawer with toast. The skill's primary value is enforcing Base UI patterns (`render` prop vs `asChild`, `@phosphor-icons/react`, oklch CSS variables).

---

### kao-logseq

File-level operations guide for Logseq knowledge graphs — covers outliner markdown syntax, NOW/LATER task workflows, journal entries, page/namespace management, templates, simple and advanced Datalog queries, and `logseq/config.edn` configuration.

- **Version**: 1.0.0
- **Skill**: [`skills/kao-logseq`](skills/kao-logseq)
- **Evals**: [`workspaces/kao-logseq`](workspaces/kao-logseq) (3 scenarios, 2 iterations)

| Metric | With Skill | Without Skill |
|---|---|---|
| Pass Rate | 100% (31/31) | 84% (26/31) |
| Avg Tokens | 16,038 | 10,258 |

Tested across: journal entry with tasks, project namespace with properties, Datalog query page. The skill's primary value is enforcing Logseq-specific conventions: 2-space indentation, `[[page link]]` syntax, NOW/LATER workflow markers, and bounded query `:inputs`.

---

### kao-obsidian

Obsidian vault editing, CLI commands, and organization guide — covers Obsidian Flavored Markdown (wikilinks, callouts, embeds, properties), the official Obsidian CLI (v1.12+), vault organization philosophies (PARA, MOC, flat+tags, Johnny Decimal), and best practices for structuring knowledge bases.

- **Version**: 1.0.0
- **Skill**: [`skills/kao-obsidian`](skills/kao-obsidian)
- **Evals**: [`workspaces/kao-obsidian`](workspaces/kao-obsidian) (3 scenarios, 1 iteration)

| Metric | With Skill | Without Skill |
|---|---|---|
| Pass Rate | 100% (26/26) | 88% (23/26) |
| Avg Tokens | 21,538 | 18,006 |

Tested across: empty vault setup with org system selection, messy vault reorganization with CLI commands, MOC-structured vault project creation. The skill's primary value is presenting organization options (PARA as default), using `obsidian move` over shell `mv` for link preservation, and creating complete folder structures with attachments.

---

### kao-copywriting-bahasa

Skill untuk menulis copywriting dalam Bahasa Indonesia yang persuasif, culturally-aware, dan sesuai konteks platform digital Indonesia. Covers formula copywriting (AIDA, PAS, FAB, BAB, SLAP), register bahasa (formal/semi-formal/kasual), konteks budaya seasonal, dan panduan per platform (Instagram, TikTok, Shopee, WhatsApp, landing page).

- **Version**: 1.0.0
- **Skill**: [`skills/kao-copywriting-bahasa`](skills/kao-copywriting-bahasa)
- **Evals**: [`workspaces/kao-copywriting-bahasa`](workspaces/kao-copywriting-bahasa) (4 scenarios, 2 iterations)

| Metric | With Skill | Without Skill |
|---|---|---|
| Pass Rate | 100% (33/33) | 97% (32/33) |
| Avg Tokens | 46,410 | 34,733 |

Tested across: Instagram skincare caption (Gen Z), SaaS B2B landing page, Ramadan multi-platform campaign, digital wedding invitation SaaS multi-deliverable. The skill's primary value is producing multiple named variations with distinct copywriting frameworks, culturally-aware emotional framing, and consistent benefit-over-feature translation.

---

### kao-copywriting

Skill for writing high-quality, persuasive English copywriting for global and international audiences. Covers copywriting frameworks (AIDA, PAS, BAB, ACCA, SLAP), persuasion psychology, global English guidelines, platform-specific guidance (email, landing page, social ads, e-commerce), voice/tone calibration, and literary devices.

- **Version**: 1.0.0
- **Skill**: [`skills/kao-copywriting`](skills/kao-copywriting)
- **Evals**: [`workspaces/kao-copywriting`](workspaces/kao-copywriting) (7 scenarios, 2 iterations)

| Metric | With Skill | Without Skill |
|---|---|---|
| Pass Rate (iter-1) | 100% (19/19) | 89.5% (17/19) |
| Pass Rate (iter-2) | 100% (28/28) | 85.7% (24/28) |
| Avg Tokens | ~45,000 | ~34,600 |

Tested across: SaaS email welcome sequence (FlowBoard), Instagram skincare ad copy (Glow Theory), B2B landing page (MetricShift), and a 4-email lifecycle sequence for a digital invitation platform (InviteJoy — welcome, upgrade to premium, abandoned cart, 7-day unpublished reminder). The skill's primary value is producing multiple named variations with distinct copywriting frameworks, A/B testing recommendations, global audience considerations, and strategic notes per variation.

---

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

## License

© 2026 kaotypr (Adhitya Yosua Sanjaya Andaria)

Licensed under the MIT License.