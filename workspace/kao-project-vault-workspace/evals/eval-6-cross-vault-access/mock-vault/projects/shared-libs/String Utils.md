---
tags:
  - implementation
  - shared-libs
  - utilities
date: 2026-04-24
parent: "[[Shared Libs]]"
---

# String Utils

String manipulation utilities shared across projects.

## Functions

### Slug Generation

Converts a string into a URL-safe slug.

- Lowercases all characters
- Replaces spaces and special characters with hyphens
- Strips leading and trailing hyphens

**Example:** `"Hello World!"` → `"hello-world"`

### Truncation

Truncates a string to a specified maximum length with an optional suffix.

- Accepts `maxLength` and optional `suffix` (default: `"..."`)
- Truncates at word boundaries when possible
- Returns the original string if it is within the limit

**Example:** `truncate("The quick brown fox", 10)` → `"The quick..."`

### Sanitization

Strips or escapes potentially unsafe characters from a string.

- Removes HTML tags
- Escapes special characters (`<`, `>`, `&`, `"`, `'`)
- Optionally strips control characters

**Example:** `sanitize("<script>alert(1)</script>")` → `"alert(1)"`

## Related

- [[Date Utils]]
