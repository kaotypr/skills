---
tags:
  - decision
  - billing
  - infrastructure
date: 2026-04-24
status: done
parent: "[[Billing API]]"
---

# Caching Layer - Redis vs Memcached

> [!abstract]
> Decision note for choosing a caching layer for the Billing API.

## Summary

Chose Redis over Memcached as the caching layer for the Billing API.

## Decision Log

- Chose Redis over Memcached for its rich data structure support (hashes, sorted sets, lists) needed for billing state
- Redis persistence options (RDB/AOF) allow cache recovery after restarts, reducing cold-start impact on billing operations
- Memcached's simpler key-value model was insufficient for the billing API's caching needs
