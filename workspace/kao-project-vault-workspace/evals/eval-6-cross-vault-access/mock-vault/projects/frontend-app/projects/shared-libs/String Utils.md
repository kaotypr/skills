---
tags:
  - shared-libs
  - module
  - utils
date: 2026-04-24
parent: "[[Shared Libs]]"
---

# String Utils

A utility module providing common string manipulation functions for use across projects.

## Functions

### `slugify(str)`

Converts a string into a URL-friendly slug.

- Lowercases the input
- Replaces spaces and special characters with hyphens
- Strips leading/trailing hyphens

**Example:**
```js
slugify("Hello World!") // "hello-world"
```

### `truncate(str, maxLength, suffix?)`

Truncates a string to a maximum length, appending a suffix if truncated.

- Default suffix is `"..."`
- Returns the original string if it is within the limit

**Example:**
```js
truncate("This is a long sentence", 10) // "This is a..."
```

### `sanitize(str)`

Removes potentially dangerous characters from a string for safe display or storage.

- Strips HTML tags
- Escapes special characters (`<`, `>`, `&`, `"`, `'`)

**Example:**
```js
sanitize("<script>alert('xss')</script>") // "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"
```

## Usage

```js
import { slugify, truncate, sanitize } from 'shared-libs/string-utils'
```

## Related

- [[Shared Libs]]
