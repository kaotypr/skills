---
tags:
  - decision
  - user-service
  - database
date: 2026-04-24
status: accepted
parent: "[[User Service]]"
---

# PostgreSQL over MongoDB for User Service

> [!abstract]
> Decision to use PostgreSQL instead of MongoDB as the database for the User Service.

## Context

We needed to choose a database for the User Service, which manages user profiles and permissions.

## Options Considered

1. **PostgreSQL** — relational database with strong SQL support, ACID compliance, and mature tooling
2. **MongoDB** — document-oriented NoSQL database with flexible schema and horizontal scaling

## Decision

PostgreSQL. The relational model better fits the structured nature of user profiles and permissions, and the team already has strong SQL expertise.

## Consequences

- User profiles and permissions data are stored in relational tables
- Complex permission queries benefit from joins and relational integrity constraints
- Team can leverage existing SQL knowledge, reducing onboarding friction
- Schema migrations managed via standard SQL migration tooling
