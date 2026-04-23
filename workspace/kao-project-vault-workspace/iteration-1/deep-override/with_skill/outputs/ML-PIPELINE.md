---
title: ML Pipeline
created: 2026-04-01
team: ml
status: final
---

# ML Pipeline

Main index for the ML pipeline project. #ml #pipeline #nav

## Architecture

```mermaid
graph TD
  A[Data Ingestion] --> B[Feature Store]
  B --> C[Training]
  C --> D[Model Registry]
  D --> E[Serving]
```

## Notes

- [[DATA-INGESTION-DESIGN]]
- [[MODEL-SERVING-ARCHITECTURE]]
- [[MODEL-SERVING-LAYER]]
