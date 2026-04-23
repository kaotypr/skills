---
title: Query Caching with Redis for Elasticsearch
date: 2026-04-24
author: kao
type: devlog
tags:
  - search
  - elasticsearch
  - redis
  - caching
  - devlog
---

# Query Caching with Redis for Elasticsearch

> [!tldr]
> Added a 5-minute TTL Redis cache for frequent search queries in the search service's Elasticsearch integration.

## Details

Implemented query caching in front of Elasticsearch to reduce load and improve response times for repeated searches.

- Cache layer: Redis
- TTL: 5 minutes
- Scope: frequent/repeated search queries
- Cache key derived from query parameters

## See Also

- [[Search Service]]
- [[2026-04-10-elasticsearch-setup]]
