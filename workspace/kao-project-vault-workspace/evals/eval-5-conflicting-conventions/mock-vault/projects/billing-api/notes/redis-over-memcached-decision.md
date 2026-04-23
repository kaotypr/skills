---
title: Redis over Memcached for Billing API Caching
created: 2026-04-24
modified: 2026-04-24
category: decision
project: billing-api
tags:
  - area/billing
  - type/decision
  - project/billing-api
---

# Redis over Memcached for Billing API Caching

**Chose Redis as the caching layer for the billing API due to its richer data structure support and built-in persistence options.**

## Context

The billing API requires a caching layer to reduce database load and improve response times for frequently accessed data (e.g., pricing plans, subscription states, invoice summaries).

Two options were evaluated: Redis and Memcached.

## Decision

**Redis** was selected over Memcached.

## Rationale

### Data Structure Support

Redis supports strings, hashes, lists, sets, sorted sets, and more. Billing data often requires:

- Hash maps for storing multi-field subscription objects without serialization overhead
- Sorted sets for time-ordered billing event queues
- Lists for ordered line items

Memcached supports only string key-value pairs, requiring full object serialization/deserialization for every cache operation.

### Persistence Options

Redis offers configurable persistence via RDB snapshots and AOF (Append-Only File) logging. This means:

- Cache can survive restarts without a full cold-start penalty
- Billing-related warm cache data (e.g., active subscriptions) is recoverable after deploys

Memcached is purely in-memory with no persistence — all data is lost on restart.

### Additional Considerations

- Redis supports atomic operations and Lua scripting, useful for cache invalidation logic
- Redis has native pub/sub for cache invalidation events across services
- Memcached has simpler horizontal scaling, but this is not a current bottleneck

## Outcome

Redis is the chosen caching backend for the billing API. Memcached is not adopted.

---

## Links

- [[Billing API]]
