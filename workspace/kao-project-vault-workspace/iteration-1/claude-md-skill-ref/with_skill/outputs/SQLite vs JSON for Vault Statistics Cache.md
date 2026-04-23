---
tags:
  - decision-record
  - eval-test
  - sqlite
  - caching
date: "2026-04-24"
status: closed
parent: "[[Eval Test Project]]"
---

# SQLite vs JSON for Vault Statistics Cache

> [!abstract]
> Decision record for choosing the storage backend for the vault statistics cache. SQLite was selected over plain JSON files.

## Context

The vault statistics feature requires a local cache to store computed metrics (note counts, tag frequencies, word counts, link graphs, etc.). Two candidate storage formats were evaluated: SQLite and JSON files.

## Options Considered

| Factor | SQLite | JSON Files |
|---|---|---|
| Query flexibility | High — supports SQL queries, filters, aggregations | Low — must load and parse full file in memory |
| Concurrent access safety | Built-in locking and transaction support | No concurrency primitives; race conditions on simultaneous writes |
| File size | Compact binary format with indexing | Grows linearly; large caches become unwieldy |
| Tooling | Widely supported; inspectable with standard tools | Human-readable but slow for large datasets |
| Dependencies | Requires SQLite library (commonly bundled) | No additional dependencies |
| Portability | Single `.db` file | Single `.json` file (simpler diff) |

## Decision

**SQLite** was chosen as the storage backend for vault statistics cache.

### Rationale

- **Query flexibility**: Vault stats need slicing and filtering (e.g., notes tagged `#project` modified in the last 7 days). SQL makes these ad-hoc queries straightforward without loading the entire dataset.
- **Concurrent access safety**: Multiple processes (background indexer, CLI queries, Obsidian sync) may access the cache simultaneously. SQLite's WAL mode and built-in locking prevent data corruption that would occur with naive JSON file writes.

## Consequences

- The cache file will be a `.db` file managed by SQLite.
- Consumers must use a SQLite client to read or write statistics — no direct JSON editing.
- Schema migrations will need to be handled explicitly when the stats schema evolves.

## Related

- [[Eval Test Project]]
