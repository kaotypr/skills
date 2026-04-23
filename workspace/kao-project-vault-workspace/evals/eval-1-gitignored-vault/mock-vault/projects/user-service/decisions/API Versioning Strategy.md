---
tags:
  - decision
  - user-service
  - api
date: 2026-03-15
status: accepted
parent: "[[User Service]]"
---

# API Versioning Strategy

> [!abstract]
> Decision on how to version the User Service API.

## Context

We need a versioning strategy before launching the public API.

## Options Considered

1. **URL path versioning** (`/v1/users`) — simple, widely understood
2. **Header versioning** (`Accept: application/vnd.api.v1+json`) — cleaner URLs

## Decision

URL path versioning. Simpler for consumers and easier to route at the gateway level.

## Consequences

- All endpoints prefixed with `/v1/`
- Gateway routing rules based on path prefix
