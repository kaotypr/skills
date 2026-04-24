# Skill Benchmark: kao-react-motion

**Model**: claude-opus-4-7[1m]
**Date**: 2026-04-24T11:15:43Z
**Evals**: 1, 2, 3, 4, 5 (1 runs each per configuration)

## Summary

| Metric | With Skill | Without Skill | Delta |
|--------|------------|---------------|-------|
| Pass Rate | 96% ± 5% | 72% ± 24% | +0.25 |
| Time | 132.8s ± 49.3s | 106.0s ± 29.9s | +26.8s |
| Tokens | 24043 ± 16427 | 22108 ± 8087 | +1935 |

## Notes

- Pass-rate delta: +25% (96.4% vs 71.5%). Much larger than iteration-1's +5%. The new eval set is genuinely more discriminating — each eval has 1-2 assertions that probe skill-specific knowledge the baseline typically misses (motion/react vs framer-motion import, stagger() vs legacy staggerChildren, AnimateNumber as Motion+, Shape A/B layoutId, tw-animate-css class stripping, asChild+motion.a vs motion.span-wrapping-a).
- Biggest deltas: Eval 1 (hero stagger+counter) 50% → 90%, and Eval 3 (asChild magnetic CTA) 42% → 100%. Both are squarely in the new scope (marketing patterns + shadcn integration).
- The AnimateNumber trap (Eval 1) remains the most discriminating single assertion: with-skill correctly identifies it as Motion+ paid; baseline misattributes to NumberFlow / Magic UI without using the word 'paid'.
- The asChild pattern (Eval 3) is the clearest new-scope signal: baseline wraps the anchor with motion.span (not knowing asChild merges props to the direct child), breaking the integration spirit. With-skill places motion.a as the direct child of Button asChild as the skill documents.
- Shape A/B regression fix (Eval 2) working: with-skill satisfied BOTH the Shape A guard (no container layoutId) AND the Shape B guard (visibility: hidden on source) redundantly. This directly fixes the iteration-1 regression I identified.
- One skill weakness confirmed: useSpring on scroll-linked scrollYProgress (Eval 4). Both with-skill and baseline applied it. The skill's scroll-animations.md 'Smoothed progress' recipe shows useSpring(scrollYProgress) for progress bars — which is valid — but doesn't differentiate the scrub-linked case (horizontal-scroll case studies) where spring lag feels broken. Worth a clarifying note in iter-3.
- Cost: +51s duration, +16k tokens per run on average. Higher than iter-1's +29s/+4.5k — because SKILL.md body shrank but references grew and the with-skill agent does deeper reads (shadcn-integration.md, layout-animations.md, gotchas.md).
- With-skill outputs still show consistent quality extras: useReducedMotion branches that actually gate behaviour, pointer-events over mouse-events for touch support (Eval 3), tw-animate-css class stripping with explicit justification (Eval 5), LayoutGroup id namespacing (Eval 2). These weren't all captured by assertions; the qualitative review loop catches them.