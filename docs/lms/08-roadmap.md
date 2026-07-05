# 8. Development Roadmap

Each module below, once we begin build, is delivered as: functional requirements → DB migration →
API design → backend code → frontend code → unit tests → integration tests → security controls →
deployment notes, per the brief. This doc defines **scope and sequencing**; it is the backlog, not
the implementation.

## 8.1 Sequencing rationale

Foundation and Auth must exist before anything else can be meaningfully built or demoed end-to-end.
Course/Batch/Mentor management come before Content and the Video Platform because content is
meaningless without a place to attach it to. The Student Portal comes after content exists to
display. Assignments, Notifications, Audit, and Analytics layer on top of a working core. Security
Enhancements and Deployment/Production Readiness close out the list — not because security is an
afterthought (it's threaded through every module per doc 4), but because that module is
specifically for cross-cutting hardening passes (pen-test fixes, load testing, chaos drills) that
only make sense once the full surface area exists.

## 8.2 Modules

| # | Module | Scope | Depends on |
|---|---|---|---|
| 1 | **Project Foundation** | Monorepo layout, NestJS + Next.js scaffolding, Docker Compose dev env, Prisma init + seed script, CI skeleton (lint/test/build), base ShadCN theme | — |
| 2 | **Authentication & RBAC** | Keycloak deployment + realm config, OIDC integration both sides, JWT validation, `Role`/`Permission`/`RolePermission`/`UserPermission` CRUD (Super Admin only), `PermissionsGuard`, session/device/login-log capture | 1 |
| 3 | **User Management** | Admin CRUD for Students/Mentors/Admins, suspend/activate/delete (soft), password reset flow, profile self-service (student/mentor) | 2 |
| 4 | **Course Management** | Category/Tag/Course/Module CRUD, admin authoring UI, course catalog read APIs | 2, 3 |
| 5 | **Batch Management** | Batch CRUD/scheduling, mentor assignment, student assignment/transfer, enrollment lifecycle | 4 |
| 6 | **Mentor Management** | Mentor profile CRUD, mentor-facing batch/roster views, mentor scope enforcement | 3, 5 |
| 7 | **Content Management** | `Content`/`VideoAsset` CRUD, non-video upload flows (PDF/doc/presentation/resource), `BatchContentAssignment` (incl. drip release), archive/rename/delete | 5 |
| 8 | **Video Platform** | Multipart upload, S3/Lambda/MediaConvert pipeline, HLS ABR delivery, CloudFront signed cookies, resume/progress tracking, watermark overlay | 7 |
| 9 | **Student Portal** | Dashboard (progress, streak, readiness score, mentor card, fee reminders), learning area (player, notes, PiP, resources), profile | 8 |
| 10 | **Assignment System** | Assignment CRUD (mentor/admin), submission flows (file/zip/GitHub link), grading + feedback, submission history | 6, 9 |
| 11 | **Notifications** | Broadcast/course/batch/individual notification send + read receipts, in-app + email delivery | 9 |
| 12 | **Audit Logging** | `AuditLog` write-path wiring across all prior modules' mutating actions, Admin-facing audit/login/device explorer UI | 2–11 (retrofits logging into each) |
| 13 | **Analytics** | Admin dashboard metrics (enrollment, engagement, course/batch breakdowns), anomaly-detection dashboard (doc 4 §4.3) | 12 |
| 14 | **Security Enhancements** | Pen-test remediation pass, rate-limit tuning under load, CSP/header audit, dependency audit, MFA rollout hardening | 1–13 |
| 15 | **Deployment & Production Readiness** | Staging/prod AWS stand-up (Terraform), full CI/CD cutover, load testing, DR drill, go-live runbook | 1–14 |

## 8.3 What's explicitly deferred past these 15 modules

Called out here so it isn't silently forgotten: **payments/billing integration**, **native mobile
app**, and **corporate training tenant self-service** are designed *for* (schema has
`Organization`, dashboard has revenue-metric placeholders, permission system supports new roles
without migration) but are **not** modules 1–15 — they're future phases once the core LMS is live,
per the brief's "future" framing for those three items.

## 8.4 Next step

This concludes the Phase 1 deliverable set (docs 1–8 + `prisma/schema.prisma`). Per the brief:
**wait for approval before module implementation begins.** Once approved, Module 1 (Project
Foundation) is the first PR.
