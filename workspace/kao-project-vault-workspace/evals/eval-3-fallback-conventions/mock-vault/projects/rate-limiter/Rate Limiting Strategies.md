---
tags:
  - rate-limiting
  - research
  - token-bucket
  - sliding-window
  - fixed-window
date: 2026-04-24
status: active
parent: "[[Rate Limiter]]"
---

# Rate Limiting Strategies

> [!abstract]
> Comparison of token bucket, sliding window, and fixed window approaches to rate limiting. Use this note to inform the choice of algorithm for the rate limiting service.

## Token Bucket

Token bucket maintains a bucket of tokens that replenishes at a fixed rate up to a maximum capacity. Each incoming request consumes one or more tokens. If the bucket has enough tokens the request is allowed; otherwise it is rejected or queued.

**How it works:**

| Property | Detail |
|---|---|
| Bucket capacity | Maximum burst size |
| Refill rate | Tokens added per second |
| Token cost | Tokens consumed per request |
| Behavior on empty | Reject or queue |

**Characteristics:**

- Allows controlled bursting up to the bucket capacity
- Smooths out traffic over time — the refill rate is the sustained limit
- Simple to implement with a counter and a timestamp
- Works well for APIs that want to permit short bursts while enforcing an average rate

**Trade-offs:**

- Two parameters to tune (capacity and refill rate) — misconfiguration can allow larger-than-expected bursts
- Distributed implementations require shared state or approximate algorithms (e.g., Redis with atomic decrement + TTL)

## Sliding Window

Sliding window tracks the count of requests within a rolling time window that moves with the current timestamp. As time advances, old requests fall out of the window.

**Variants:**

| Variant | Description |
|---|---|
| Log-based | Store each request timestamp; count entries in the window. Exact but memory-intensive. |
| Counter-based | Divide time into small sub-buckets; sum buckets within the window. Approximate but memory-efficient. |

**Characteristics:**

- More accurate than fixed window — no boundary surge effect
- The log-based variant is exact but has O(n) memory per client
- The counter-based variant trades a small approximation error for O(buckets) memory
- Better fairness: a client that hit the limit at t=59s cannot immediately burst again at t=60s

**Trade-offs:**

- More complex than fixed window
- Distributed sliding window requires sorted sets (e.g., Redis ZSET with `ZADD` + `ZRANGEBYSCORE` + `ZREMRANGEBYSCORE`)
- Log-based variant memory grows with request volume

## Fixed Window

Fixed window divides time into fixed-size slots (e.g., 1-minute windows) and counts requests per slot. When the window resets the counter resets.

**How it works:**

| Property | Detail |
|---|---|
| Window size | e.g., 60 seconds |
| Counter | Requests in current window |
| Reset | Counter zeroed at window boundary |
| Behavior at limit | Reject until reset |

**Characteristics:**

- Simplest to implement — a single counter with a TTL (or a timestamp-keyed counter)
- Very cheap in distributed systems: one Redis key per client per window, atomic `INCR` + `EXPIRE`
- Predictable behavior: clients know exactly when they can retry

**Trade-offs:**

- Boundary surge problem: a client can make 2x the limit in a short period by hitting the limit at the end of one window and the start of the next
- Not suitable when burst control at window boundaries is critical

## Comparison

| Criterion | Token Bucket | Sliding Window | Fixed Window |
|---|---|---|---|
| Burst handling | Controlled burst up to capacity | Smooth — no boundary surge | Boundary surge risk |
| Implementation complexity | Medium | High (log) / Medium (counter) | Low |
| Memory per client | O(1) | O(n) log / O(buckets) counter | O(1) |
| Distributed cost | Medium (atomic ops) | Higher (sorted sets) | Low (INCR + EXPIRE) |
| Accuracy | High | Exact (log) / Near-exact (counter) | Approximate at boundaries |

> [!tip]
> For most API rate limiting scenarios, the **sliding window counter** variant offers the best balance of accuracy and implementation cost. Use **token bucket** when explicit burst allowances are a product requirement. Use **fixed window** only when simplicity and minimal Redis cost outweigh the boundary surge risk.
