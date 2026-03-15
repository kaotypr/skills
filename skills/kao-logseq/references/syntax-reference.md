# Logseq Syntax Reference

## Text Formatting

| Syntax | Renders As |
|---|---|
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `~~strikethrough~~` | ~~strikethrough~~ |
| `^^highlight^^` | highlighted text |
| `` `inline code` `` | `inline code` |
| `[:sup "superscript"]` | superscript |
| `[:sub "subscript"]` | subscript |
| `[link text](https://url)` | hyperlink |
| `![alt](path/to/image.png)` | embedded image |

## Page Properties

Page properties appear at the **top of the file**, without the `- ` block prefix. They apply to the entire page.

```markdown
tags:: [[project]], [[active]]
alias:: my-proj, project-x
icon:: 🚀
public:: true
category:: engineering
```

### Common Page Properties

| Property | Purpose | Example |
|---|---|---|
| `tags::` | Categorize the page | `tags:: [[design]], [[v2]]` |
| `alias::` | Alternative page names | `alias:: proj-x, project-x` |
| `icon::` | Emoji icon for the page | `icon:: 📋` |
| `public::` | Include in published graph | `public:: true` |
| `filters::` | Default query filters | `filters:: {"NOW" true}` |

### Custom Page Properties

Any `key:: value` pair at the top of the file becomes a page property:

```markdown
status:: active
owner:: [[Alice]]
due-date:: [[2026-04-01]]
priority:: high
```

## Block Properties

Block properties appear on lines **indented under a block**, without their own `- ` prefix:

```markdown
- This is a block
  collapsed:: true
  id:: 64a7b2c1-...
  custom-prop:: some value
```

### Built-in Block Properties

| Property | Purpose | Example |
|---|---|---|
| `collapsed::` | Collapse/expand a block | `collapsed:: true` |
| `heading::` | Force heading level | `heading:: true` |
| `id::` | Block UUID (auto-generated) | Never create manually |
| `background-color::` | Block background | `background-color:: yellow` |

## Namespace Conventions

Namespaces use `/` in page names, but filenames use `___` (triple underscore).

| Page Name | Filename |
|---|---|
| `Projects/Alpha` | `Projects___Alpha.md` |
| `Areas/Health/Exercise` | `Areas___Health___Exercise.md` |
| `Books/2026/Q1 Reads` | `Books___2026___Q1 Reads.md` |

Rules:
- The `/` in the page name creates a parent-child hierarchy
- Parent pages should exist as their own files
- Namespaced pages inherit visibility from parent page queries
- Use `(namespace Projects)` in queries to find all pages under `Projects`

## Headings

In Logseq, headings are blocks that begin with `#`:

```markdown
- # Heading 1
- ## Heading 2
- ### Heading 3
- #### Heading 4
- ##### Heading 5
- ###### Heading 6
```

Alternatively, use the `heading::` property:

```markdown
- This becomes a heading
  heading:: true
```

## Blockquotes

```markdown
- > This is a blockquote
  > It can span multiple lines
```

## Code Blocks

Inline code:

```markdown
- Use `const x = 1` for constants
```

Fenced code blocks within a block:

```markdown
- Here is some code:
  ```javascript
  function hello() {
    console.log("Hello from Logseq");
  }
  ```
```

## Images and Assets

Embed images from the `assets/` directory:

```markdown
- ![description](../assets/screenshot.png)
```

Or from a URL:

```markdown
- ![logo](https://example.com/logo.png)
```

## Links

### Internal Links

```markdown
- See [[Page Name]] for details
- Tagged with #category
- Multi-word tag: #[[project management]]
```

### External Links

```markdown
- [Display Text](https://example.com)
- Raw URL: https://example.com
```

### Embedded Pages/Blocks

```markdown
- {{embed [[Page Name]]}}
- {{embed ((block-uuid))}}
```

Note: Only use `{{embed [[Page Name]]}}` when creating content. Never fabricate block UUIDs for `((block-uuid))` embeds.

## Admonitions

Logseq supports admonition blocks using special syntax:

```markdown
- #+BEGIN_TIP
  This is a tip admonition.
  #+END_TIP
- #+BEGIN_NOTE
  This is a note admonition.
  #+END_NOTE
- #+BEGIN_WARNING
  This is a warning admonition.
  #+END_WARNING
- #+BEGIN_CAUTION
  This is a caution admonition.
  #+END_CAUTION
- #+BEGIN_IMPORTANT
  This is an important admonition.
  #+END_IMPORTANT
```

## LaTeX Math

Inline math:

```markdown
- The formula is $E = mc^2$ as we know
```

Display math:

```markdown
- $$
  \int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
  $$
```

## Flashcards

Create flashcards using `#card` tag and cloze deletions:

```markdown
- What is the capital of France? #card
  - Paris
- The {{cloze speed of light}} is approximately {{cloze 3 × 10⁸ m/s}}
  #card
```
