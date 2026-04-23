---
tags:
  - decision-record
  - architecture
  - eval-test
date: "2026-04-24"
status: closed
parent: "[[Eval Test Project]]"
---

# SQLite vs JSON for Stats Cache

> [!abstract]
> Decision record for choosing between SQLite and JSON files as the storage backend for vault statistics cache.

## Context

The vault statistics cache stores computed metrics about vault notes — tag frequencies, link counts, note creation trends, and related aggregates. We needed a persistent local cache to avoid recomputing these on every operation.

Two options were evaluated: a plain JSON file and an SQLite database.

## Options Considered

| Criterion | JSON File | SQLite |
|---|---|---|
| Query flexibility | Low — full parse required for any filter | High — SQL queries, indexes, partial reads |
| Concurrent access safety | Poor — no locking, write collisions possible | Strong — WAL mode, built-in locking |
| Human readability | High — plain text, easy to inspect | Low — binary format, requires tooling |
| Dependency footprint | None — stdlib only | Minimal — sqlite3 in stdlib (Python/Node) |
| Schema evolution | Manual — brittle JSON reshaping | Managed — ALTER TABLE, migrations |
| Performance at scale | Degrades — full file load | Stable — indexed reads, partial scans |

## Decision

**SQLite was chosen.**

## Rationale

Query flexibility and concurrent access safety were the deciding factors.

The statistics cache is frequently read by multiple vault operations running in parallel (tag lookups, backlink scans, search indexing). JSON files have no locking mechanism — concurrent writes corrupt the file silently. SQLite's WAL (Write-Ahead Logging) mode handles concurrent readers and a single writer safely without external coordination.

Query flexibility matters because the cache is not read as a whole — callers request slices: top N tags, notes modified in a date range, notes with no outbound links. With JSON, every query requires loading and parsing the full file, then filtering in memory. SQLite handles these with indexed queries that scale as the vault grows.

The loss of human readability is acceptable: the cache is a derived artifact, not a source of truth. It can be deleted and rebuilt from vault notes at any time.

> [!info] Reversibility
> This decision is low-risk to reverse. The cache layer is behind an interface — swapping the backend requires changing only the storage module, not callers.

## Decision Log

- Chose SQLite over JSON for query flexibility and concurrent access safety
- WAL mode enabled to support parallel read access during vault scans
- Cache schema versioned in a `meta` table to support future migrations without full rebuilds
