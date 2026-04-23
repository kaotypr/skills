---
tags:
  - implementation
  - user-service
  - auth
date: 2026-03-20
status: done
parent: "[[User Service]]"
---

# Auth Module Setup

> [!abstract]
> Implementation notes for the authentication module.

## Summary

Set up JWT-based authentication with refresh token rotation.

## Decision Log

- Chose RS256 over HS256 for key rotation support
- Token expiry set to 15 minutes with 7-day refresh tokens
