---
title: JWT Token Setup
created: 2026-04-10
modified: 2026-04-10
type: implementation
project: auth-app
tags:
  - "#dev/auth"
  - "#project/auth-app"
---

# JWT Token Setup

Status: **done**

Implemented JWT-based auth with RS256 signing.

## Details

- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Key rotation via JWKS endpoint

## Related

- [[auth-app]]
