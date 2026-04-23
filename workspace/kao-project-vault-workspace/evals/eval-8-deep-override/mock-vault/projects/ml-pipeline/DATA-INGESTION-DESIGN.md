---
title: Data Ingestion Design
created: 2026-04-05
team: data
status: final
---

# Data Ingestion Design

Design doc for the data ingestion pipeline. #data #ingestion #architecture

## Overview

Kafka-based ingestion with Spark streaming processors.

```mermaid
graph LR
  Sources --> Kafka --> Spark --> FeatureStore
```

> [!question]
> Should we support batch backfill alongside streaming?

## See Also

- [[ML-PIPELINE]]
