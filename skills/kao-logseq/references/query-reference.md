# Logseq Query Reference

## Simple Queries

Simple queries use `{{query ...}}` syntax and are embedded inline in blocks.

### Page Reference Queries

```markdown
- {{query [[Page Name]]}}
```

Finds all blocks that reference `[[Page Name]]`.

### Logical Operators

**AND** — blocks matching all conditions:

```markdown
- {{query (and [[project]] [[active]])}}
```

**OR** — blocks matching any condition:

```markdown
- {{query (or [[bug]] [[feature request]])}}
```

**NOT** — exclude blocks matching a condition:

```markdown
- {{query (and [[project]] (not [[archived]]))}}
```

### Task Queries

Find blocks with specific task markers:

```markdown
- {{query (task NOW)}}
- {{query (task NOW LATER)}}
- {{query (task DONE)}}
- {{query (task NOW LATER DOING)}}
```

Combine with page references:

```markdown
- {{query (and (task NOW LATER) [[Project Alpha]])}}
```

### Priority Queries

```markdown
- {{query (priority A)}}
- {{query (priority A B)}}
- {{query (and (task NOW LATER) (priority A))}}
```

### Property Queries

Find blocks or pages with specific property values:

```markdown
- {{query (property status active)}}
- {{query (property tags project)}}
- {{query (and (property owner [[Alice]]) (task NOW LATER))}}
```

### Date Range Queries

Find blocks within a date range (relative to today):

```markdown
- {{query (between -7d today)}}
- {{query (between -30d today)}}
- {{query (between today +7d)}}
- {{query (between -3d +3d)}}
```

Specific dates:

```markdown
- {{query (between [[2026-03-01]] [[2026-03-31]])}}
```

### Namespace Queries

Find all pages under a namespace:

```markdown
- {{query (namespace Projects)}}
- {{query (namespace Areas/Health)}}
```

### Combining Operators

```markdown
- {{query (and (task NOW LATER) (priority A B) (not [[archived]]))}}
- {{query (or (and [[meeting]] [[Q1 2026]]) (property type standup))}}
```

## Advanced Datalog Queries

Advanced queries use Datalog syntax and provide full access to the Logseq database. They are wrapped in `#+BEGIN_QUERY` / `#+END_QUERY` blocks.

### Basic Structure

```markdown
- #+BEGIN_QUERY
  {:title "Query Title"
   :query [:find (pull ?b [*])
           :where
           [?b :block/marker ?marker]
           [(contains? #{"NOW" "LATER"} ?marker)]]
   :collapsed? false}
  #+END_QUERY
```

### Key Components

| Component | Purpose |
|---|---|
| `:title` | Display title for the query results |
| `:query` | The Datalog query (`:find`, `:in`, `:where`) |
| `:inputs` | Input parameters (e.g., `:today`, `:7d-after`) |
| `:result-transform` | Transform results before display |
| `:group-by-page?` | Group results by their page |
| `:collapsed?` | Whether results start collapsed |
| `:breadcrumb-show?` | Show block breadcrumbs |

### Common `:inputs` Values

| Input | Meaning |
|---|---|
| `:today` | Today's journal day number |
| `:7d-before` / `:7d-after` | 7 days before/after today |
| `:14d` | 14 days before today |
| `:start-of-next-week` | Start of next week |
| `:current-page` | Name of the current page |

### Entity Attributes

Common attributes for querying:

| Attribute | Description |
|---|---|
| `?b :block/content` | Block text content |
| `?b :block/marker` | Task marker (NOW, LATER, etc.) |
| `?b :block/priority` | Priority (A, B, C) |
| `?b :block/page ?p` | Block's parent page |
| `?b :block/refs ?r` | Pages referenced by block |
| `?p :block/name` | Page name (lowercase) |
| `?p :block/journal?` | Whether page is a journal |
| `?p :block/journal-day` | Journal date as number (yyyyMMdd) |
| `?b :block/scheduled` | Scheduled date as number |
| `?b :block/deadline` | Deadline date as number |
| `?p :block/properties` | Page properties map |

### Practical Examples

#### All NOW/DOING Tasks from the Past 14 Days

```markdown
- #+BEGIN_QUERY
  {:title "🔨 NOW"
   :query [:find (pull ?h [*])
           :in $ ?start ?today
           :where
           [?h :block/marker ?marker]
           [(contains? #{"NOW" "DOING"} ?marker)]
           [?h :block/page ?p]
           [?p :block/journal? true]
           [?p :block/journal-day ?d]
           [(>= ?d ?start)]
           [(<= ?d ?today)]]
   :inputs [:14d :today]
   :result-transform (fn [result]
                       (sort-by (fn [h]
                                  (get h :block/priority "Z")) result))
   :group-by-page? false
   :collapsed? false}
  #+END_QUERY
```

#### Upcoming Tasks (Next 7 Days)

```markdown
- #+BEGIN_QUERY
  {:title "📅 NEXT"
   :query [:find (pull ?h [*])
           :in $ ?start ?next
           :where
           [?h :block/marker ?marker]
           [(contains? #{"NOW" "LATER" "TODO"} ?marker)]
           [?h :block/page ?p]
           [?p :block/journal? true]
           [?p :block/journal-day ?d]
           [(> ?d ?start)]
           [(< ?d ?next)]]
   :inputs [:today :7d-after]
   :group-by-page? false
   :collapsed? false}
  #+END_QUERY
```

#### All Tasks with Deadlines This Week

```markdown
- #+BEGIN_QUERY
  {:title "⏰ Deadlines This Week"
   :query [:find (pull ?b [*])
           :in $ ?start ?end
           :where
           [?b :block/deadline ?d]
           [(>= ?d ?start)]
           [(<= ?d ?end)]]
   :inputs [:today :7d-after]
   :collapsed? false}
  #+END_QUERY
```

#### Blocks Tagged with a Specific Page, Sorted by Priority

```markdown
- #+BEGIN_QUERY
  {:title "🏷 Project Alpha Tasks"
   :query [:find (pull ?b [*])
           :where
           [?b :block/marker ?marker]
           [(contains? #{"NOW" "LATER"} ?marker)]
           [?b :block/refs ?r]
           [?r :block/name "project alpha"]]
   :result-transform (fn [result]
                       (sort-by (fn [h]
                                  (get h :block/priority "Z")) result))
   :collapsed? false}
  #+END_QUERY
```

Note: `:block/name` stores page names in **lowercase**.

#### Pages with a Specific Property Value

```markdown
- #+BEGIN_QUERY
  {:title "📂 Active Projects"
   :query [:find (pull ?p [*])
           :where
           [?p :block/properties ?props]
           [(get ?props :status) ?status]
           [(= ?status "active")]
           [?p :block/properties ?props2]
           [(get ?props2 :tags) ?tags]]}
  #+END_QUERY
```

#### Scheduled Tasks Overdue

```markdown
- #+BEGIN_QUERY
  {:title "⚠️ Overdue"
   :query [:find (pull ?b [*])
           :in $ ?today
           :where
           [?b :block/marker ?marker]
           [(contains? #{"NOW" "LATER" "TODO"} ?marker)]
           [?b :block/scheduled ?d]
           [(< ?d ?today)]]
   :inputs [:today]
   :result-transform (fn [result]
                       (sort-by (fn [h]
                                  (get h :block/scheduled)) result))
   :collapsed? false}
  #+END_QUERY
```

### Tips for Advanced Queries

1. **Page names are lowercase** in `:block/name` — always use lowercase strings when matching
2. **Use `(pull ?b [*])` for full block data** — or specify attributes like `(pull ?b [:block/content :block/priority])`
3. **`:inputs` are resolved at render time** — `:today` updates daily, making queries dynamic
4. **`:result-transform` takes a Clojure function** — use `sort-by`, `filter`, `take`, etc.
5. **Combine journal date filtering with task markers** for time-scoped task views
6. **Test queries incrementally** — start with a simple `:where` clause and add constraints one at a time
