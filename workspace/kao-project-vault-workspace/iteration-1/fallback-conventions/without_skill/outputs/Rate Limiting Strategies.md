# Rate Limiting Strategies

A research note covering the three primary approaches to rate limiting.

## Token Bucket

The token bucket algorithm maintains a "bucket" that holds a maximum number of tokens. Tokens are added to the bucket at a fixed rate, and each request consumes one or more tokens. If the bucket has enough tokens, the request is allowed; if not, it is rejected or queued.

**Key properties:**
- Allows bursting up to the bucket capacity
- Smooths out traffic over time
- Memory-efficient: only stores token count and last refill timestamp per client
- Widely used in APIs (e.g., AWS, Stripe)

**Trade-offs:** Burst traffic is permitted up to bucket size, which may be undesirable for strict rate enforcement.

## Sliding Window

The sliding window algorithm tracks request counts within a rolling time window (e.g., the last 60 seconds), as opposed to a fixed boundary. It combines the accuracy of a log-based approach with lower memory requirements.

Two common variants:

- **Sliding window log**: Stores a timestamp for every request. Accurate but memory-intensive at high traffic.
- **Sliding window counter**: Interpolates between two adjacent fixed windows to estimate the count in the sliding window. Approximates the log variant with O(1) memory.

**Key properties:**
- More accurate than fixed window at window boundaries
- Prevents the "double burst" problem of fixed windows
- Counter variant trades slight inaccuracy for efficiency

**Trade-offs:** The counter variant introduces a small approximation error. The log variant is memory-intensive at scale.

## Fixed Window

The fixed window (or fixed window counter) algorithm divides time into fixed intervals (e.g., one-minute buckets) and counts requests within each interval. When a new interval starts, the counter resets.

**Key properties:**
- Simple to implement and reason about
- O(1) memory per client
- Easy to distribute across multiple nodes

**Trade-offs:** Vulnerable to boundary bursts — a client can make double the allowed requests by sending requests at the end of one window and the beginning of the next.

## Comparison

| Algorithm | Burst Handling | Memory | Accuracy | Complexity |
|---|---|---|---|---|
| Token Bucket | Allows controlled bursting | Low | High | Low |
| Sliding Window Counter | No boundary bursts | Low | Near-exact | Medium |
| Sliding Window Log | No boundary bursts | High | Exact | Medium |
| Fixed Window Counter | Boundary burst possible | Very low | Moderate | Very low |

## When to Use Each

- **Token bucket**: Prefer when you want to allow short bursts (e.g., API consumers doing batch work) while enforcing a sustained average rate.
- **Sliding window**: Prefer when fairness and accuracy at window edges matter — especially in user-facing APIs with strict per-user quotas.
- **Fixed window**: Prefer for internal systems, simple use cases, or when distributed coordination overhead must be minimized.
