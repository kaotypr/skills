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

### kao-react-motion

Advanced/complex React animations with Motion (formerly Framer Motion) in a Tailwind + shadcn/ui (Radix) project — hero reveals, feature grids, scroll-driven storytelling, parallax, horizontal-scroll sections, shared-element transitions, layout animations, and custom gesture UX. Integrates with shadcn via the `asChild` + Radix Slot pattern. Assumes shadcn theme tokens. Excludes Motion+ paid components.

- **Version**: 1.0.0
- **Skill**: [`skills/engineering/kao-react-motion`](skills/engineering/kao-react-motion)
- **Evals**: [`workspace/kao-react-motion-workspace`](workspace/kao-react-motion-workspace) (5 scenarios per iteration, 2 iterations)

| Metric | With Skill | Without Skill |
|---|---|---|
| Pass Rate (iter 2) | 96% (55/57) | 72% (41/57) |
| Avg Tokens (iter 2) | 24,043 | 22,108 |

Tested across: landing hero with staggered reveal + animated stat counter, shared-element card→modal morph, asChild magnetic CTA, horizontal-scroll case studies, custom Motion override of shadcn Dialog's default animation.

<details>
<summary>Eval iterations</summary>

**Iteration 1** — Model: `claude-opus-4-7[1m]` — Generic React animation scope

| Eval | With Skill | Without Skill |
|---|---|---|
| scroll-staggered-reveal | 8/8 | 7/8 |
| shared-element-card-to-modal | 8/8 | 8/8 |
| horizontal-scroll-section | 8/8 | 8/8 |
| reorderable-todo-list | 10/10 | 10/10 |
| animated-counter | 8/8 | 7/8 |

Aggregate: 100% vs 95% (+5% delta). Small lift — baseline already knows Motion well enough for prime use cases. The skill's value showed at the edges: modern `stagger()` vs legacy `staggerChildren`, and refusing `<AnimateNumber>` as Motion+ (baseline misattributed it to `number-flow`). Review surfaced two real regressions in with-skill output that the assertions missed: shadcn theme tokens assumed without declaring, and shared-element `layoutId` on both container and children without the `visibility: hidden` compensator.

**Iteration 2** — Model: `claude-opus-4-7[1m]` — Scope narrowed to Tailwind + shadcn projects

| Eval | With Skill | Without Skill |
|---|---|---|
| landing-hero-stagger-counter | 9/10 | 5/10 |
| shared-element-portfolio-morph | 11/11 | 10/11 |
| aschild-magnetic-cta | 12/12 | 5/12 |
| horizontal-scroll-case-studies | 11/12 | 10/12 |
| shadcn-dialog-motion-override | 12/12 | 11/12 |

Aggregate: 96% vs 72% (+25% delta). Scope rewrite (marketing/landing animations in Tailwind + shadcn only, with `asChild` + Radix Slot as the integration pattern) made the eval set discriminating. Biggest deltas: hero/counter +40% (baseline misattributed `<AnimateNumber>`, used legacy `staggerChildren`, imported `framer-motion`); asChild magnetic CTA +58% (baseline wrapped the anchor with `motion.span` instead of using `<Button asChild><motion.a>` as the direct child). The iteration-1 shared-element regression is fixed — with-skill now satisfies both Shape A (no container `layoutId`) and Shape B (`visibility: hidden` on source) guards simultaneously. One remaining weakness identified and patched post-iter-2: scroll-animations.md previously allowed `useSpring(scrollYProgress)` without distinguishing the scrub-linked case (where spring lag feels broken) from the progress-indicator case (where smoothing is fine).

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
