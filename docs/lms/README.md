# DigieKnowledge LMS — Phase 1: Architecture & Design

Status: **Awaiting approval.** Per the project brief, no application code is generated in this
phase (the `prisma/schema.prisma` design artifact is the one exception, since it is an explicit
Database Design deliverable). Module implementation begins after sign-off on these documents.

## Document map

| # | Document | Covers |
|---|----------|--------|
| 1 | [`01-architecture.md`](./01-architecture.md) | System architecture, tech-stack rationale, auth strategy (Keycloak), component & sequence diagrams, scalability plan |
| 2 | [`02-domain-model-rbac.md`](./02-domain-model-rbac.md) | Domain model, entity relationships at a conceptual level, RBAC matrix for Super Admin / Admin / Mentor / Student |
| 3 | [`03-database-design.md`](./03-database-design.md) | Full ER diagram, table-by-table notes, migration strategy. Schema itself lives in [`prisma/schema.prisma`](../../prisma/schema.prisma) |
| 4 | [`04-security-architecture.md`](./04-security-architecture.md) | STRIDE threat model, OWASP ASVS control mapping, authN/authZ, session & device tracking, headers, rate limiting |
| 5 | [`05-video-platform-content-protection.md`](./05-video-platform-content-protection.md) | Upload → transcode → deliver pipeline, AWS services, anti-piracy, watermarking, credential-sharing detection, DLP realism check |
| 6 | [`06-ui-ux-design.md`](./06-ui-ux-design.md) | Sitemap, IA, navigation per role, core user flows, dashboard wireframe descriptions |
| 7 | [`07-deployment-infrastructure.md`](./07-deployment-infrastructure.md) | Docker Compose (dev), AWS architecture (staging/prod), CI/CD pipelines, backup & DR |
| 8 | [`08-roadmap.md`](./08-roadmap.md) | Module-by-module delivery plan (15 modules) with sequencing and per-module deliverable checklist |

## How to review

These documents are meant to be reviewed **in order** — each later document assumes decisions
made in the earlier ones (e.g. the database design assumes the RBAC model in doc 2, the video
pipeline assumes the AWS account structure in doc 7). Flag disagreements at the doc level; once
approved, doc 8's roadmap becomes the backlog for module-by-module builds, one module per
iteration, each with functional requirements → DB migration → API design → backend → frontend →
tests → security controls → deployment notes, matching the brief.

## Key decisions made in this phase (flag now if wrong)

- **Auth provider: Keycloak** (self-hosted, OIDC), not a build-your-own auth system — rationale in doc 1.
- **Backend: NestJS modular monolith** at launch, decomposable into services later — not
  microservices from day one, since the traffic profile (hundreds → 10k students) doesn't justify
  the operational cost yet.
- **Video protection tier: signed HLS + watermarking + session/device controls**, *not* full DRM
  (Widevine/FairPlay/PlayReady) at launch — DRM is flagged as a fast-follow if piracy becomes a
  measured problem, given its added cost and integration complexity. See doc 5 for the honest
  limitations of this approach.
- **Multi-course/no-code-changes requirement** is met by making Course/Category/Tag/Module/Batch
  fully data-driven (admin CRUD), not hardcoded — reflected in the schema.
