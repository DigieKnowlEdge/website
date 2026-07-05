# 4. Security Architecture

Scope: authN/authZ, transport/session hardening, input/output handling, threat modeling, and how
each maps to OWASP ASVS. This is the control baseline every module in doc 8 must implement against
— "Security controls" in each module's deliverable list means "show which of these rows it
satisfies."

## 4.1 Authentication

- **Identity provider**: Keycloak (OIDC, Authorization Code + PKCE from the Next.js app).
- **Tokens**: short-lived JWT access token (RS256, 5–15 min TTL), rotating refresh token (Keycloak
  refresh token rotation enabled, reuse detection revokes the whole chain). NestJS validates
  access tokens against Keycloak's JWKS endpoint (cached, refreshed on `kid` miss).
- **MFA**: mandatory for Super Admin/Admin (TOTP or WebAuthn via Keycloak required actions),
  optional-but-encouraged for Mentor, optional for Student.
- **Password policy**: enforced in Keycloak (min length 12, breached-password check via
  Keycloak's password policy SPI or HaveIBeenPwned k-anonymity API at registration/reset time).
- **Account lockout**: Keycloak brute-force detection (progressive lockout after N failed
  attempts), mirrored into our `login_logs.success=false` stream for admin visibility.

## 4.2 Authorization

- **Permission-based**, not role-string checks (see doc 2 §2.3). A `PermissionsGuard` resolves
  the caller's effective permission set (role defaults + `user_permissions` overrides) once per
  request (cached in Redis, keyed by user + a version counter bumped on any permission change) and
  checks it against a `@RequirePermission('resource:action')` decorator on each controller method.
- **Row-level scoping is enforced in the repository layer, not just the guard.** The guard answers
  "can this user do this *type* of action"; repository methods answer "on *which rows*" — e.g.
  `MentorScopeGuard` injects `batchIds` the mentor is assigned to into every query; student-facing
  repositories require a `studentProfileId` filter matching the authenticated user by construction
  (see doc 2 §2.2, "fail-safe by construction").
- **Impersonation** ("view as student" support tool): time-boxed (default 15 min), requires
  re-auth if Admin's own session is older than a threshold, writes `audit_logs` entries at start
  and end, and the impersonated session is visibly banner-flagged in the UI so support staff can't
  silently act as the student.

## 4.3 Session & device management (credential-sharing prevention)

- **Concurrent session cap**: configurable per role (e.g., Student = 2 devices, Mentor = 3, Admin
  = 2). Enforced against the `sessions` table at login; over-limit login prompts "you're logged in
  elsewhere — sign out a device?" rather than silently kicking the oldest session (better UX,
  avoids surprising a legitimate user).
- **Device fingerprinting**: client-side fingerprint (canvas/WebGL/font/timezone hash, e.g. via an
  open-source fingerprinting lib) sent at login, stored in `device_fingerprints` keyed by
  `(userId, fingerprintHash)`. Not treated as a hard identifier (fingerprints drift and can
  collide) — it's one signal among several, not a sole gate.
- **Anomaly detection heuristics** (flag, don't auto-ban, and surface to Admin for review):
  - Impossible travel: two logins from geographically distant IPs within a time window shorter
    than plausible travel time (IP geolocation via MaxMind GeoLite2 or AWS-native alternative).
  - New-device + new-geography combination on a paid, single-seat account.
  - Same account, > N distinct fingerprints within a rolling 30-day window.
  - Sustained parallel active sessions from different device fingerprints on a plan that expects
    one learner.
  These raise an `audit_logs` "security.anomaly" entry and (Module 13/14 — Notifications/Security
  Enhancements) a dashboard alert; **the platform does not auto-suspend on a heuristic alone**,
  because false positives (shared home Wi-Fi/NAT, VPN, mobile network IP churn) are common and
  auto-suspending real customers is worse than a slower manual review.
- **Session revocation**: Admin can revoke any session (`sessions.revokedAt`), which must also
  revoke the corresponding Keycloak SSO session so the refresh token stops working immediately —
  not just delete our local record.

## 4.4 Transport & browser-side controls

| Control | Implementation |
|---|---|
| HSTS | `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` at CloudFront/ALB |
| CSP | Strict `default-src 'self'`, `script-src` allow-listing only required origins (no `unsafe-inline` — Next.js nonce-based CSP for any inline scripts), `frame-ancestors 'none'`, `object-src 'none'` |
| Cookies | Session/refresh cookies: `HttpOnly`, `Secure`, `SameSite=Lax` (or `Strict` where flows allow); CloudFront signed-cookie for video kept separate from the app session cookie, scoped via `Path` to the video domain/prefix |
| CSRF | SameSite cookies as first line of defense + double-submit CSRF token for state-changing requests from the browser session (belt-and-suspenders, since SameSite alone doesn't cover all client bugs) |
| XSS | React's default escaping + CSP; `class-validator`/`class-transformer` DTO whitelisting strips unknown fields; any rendered rich text (mentor feedback, testimonials) sanitized server-side (e.g. `sanitize-html` with a strict allow-list) before storage and again before render |
| SQLi | Prisma parameterized queries exclusively; no raw string-interpolated `$queryRawUnsafe` — `$queryRaw` tagged templates only, and only where Prisma's query builder genuinely can't express the query |
| Rate limiting | NestJS `@nestjs/throttler` backed by Redis: per-IP global limit, tighter per-route limits on `/auth/*`, `/videos/*/playback-url`, and file upload endpoints; 429 responses logged |
| File upload safety | Content-type + magic-byte validation (not just extension), size caps enforced both client- and server-side, ZIP submissions scanned (ClamAV sidecar or AWS-native malware scanning) before being marked available to mentors |
| Secrets | AWS Secrets Manager for DB creds/Keycloak client secrets/JWT signing material; never in env files committed to the repo; rotated on a schedule |
| Dependency hygiene | `npm audit`/Dependabot in CI (see doc 7 CI/CD), lockfiles committed |

## 4.5 Audit logging

- Separate from operational logs (doc 1 — structured JSON via pino → CloudWatch/Loki, used for
  debugging/ops). `audit_logs` is a compliance-grade record of **who did what to whom, when**,
  covering at minimum: auth events, all Admin/Super Admin actions on Student/Mentor/Course/Batch/
  Content, permission changes, impersonation, and security anomaly flags.
- Write path is synchronous with the triggering action (not best-effort/fire-and-forget) for
  Admin actions on user accounts — an audit write failure should fail the request, since "the
  action happened but wasn't recorded" is worse than "the action didn't happen."
- Retention: audit logs are retained indefinitely (or per a to-be-set compliance policy);
  `login_logs`/`sessions` get a shorter hot-retention window with monthly partition archival to
  cheaper storage (S3 export) after N months.

## 4.6 STRIDE threat model (platform-level)

| Threat | Example | Primary mitigation |
|---|---|---|
| **Spoofing** | Attacker forges a session/JWT to impersonate a student or Admin | RS256 JWT signature validation against Keycloak JWKS; short access-token TTL; device/session binding |
| **Tampering** | Client-side request tampers with `studentProfileId` in a payload to view another student's data | All identity for authorization is derived server-side from the validated JWT `sub`, never trusted from request body/query params |
| **Repudiation** | Admin denies suspending a student, or a mentor denies grading | Append-only `audit_logs` with actor + timestamp + IP, DB-level write protection |
| **Information Disclosure** | Signed video URL leaked/shared publicly | Short TTL (5–15 min) signed cookies scoped to session, dynamic watermark ties any leaked recording back to the source student, anomaly detection on repeat URL fetches from new IPs |
| **Denial of Service** | Credential-stuffing bot floods `/auth/login`, or bulk video requests exhaust origin | Rate limiting (Redis-backed), Keycloak brute-force detection, CloudFront absorbs read traffic (origin barely touched for video), AWS WAF managed rules + rate-based rules at the edge |
| **Elevation of Privilege** | Student manipulates a request to hit an Admin-only endpoint, or a Mentor edits another mentor's batch | `PermissionsGuard` on every controller method (deny-by-default: unguarded routes fail closed via a global guard requiring an explicit `@Public()` or `@RequirePermission()` decorator), row-level scope checks in repositories |

## 4.7 OWASP ASVS control mapping (representative, not exhaustive)

| ASVS area | Control in this platform |
|---|---|
| V2 (Authentication) | Keycloak-managed passwords, MFA for privileged roles, brute-force lockout |
| V3 (Session Mgmt) | Short-lived JWT + rotating refresh, `sessions` table with revocation, concurrent-session cap |
| V4 (Access Control) | Permission-based guards + repository-level row scoping, deny-by-default routing |
| V5 (Validation/Sanitization) | `class-validator` DTOs at every controller boundary, `sanitize-html` for rendered rich text |
| V7 (Error Handling/Logging) | Structured logs (no secrets/PII in log bodies), append-only audit trail |
| V9 (Communications) | TLS everywhere (CloudFront/ALB terminate TLS 1.2+ only), HSTS |
| V12 (File Handling) | Type/size/magic-byte validation, malware scanning on uploads, private S3 buckets with least-privilege IAM |
| V13 (API) | Rate limiting, CORS locked to known origins, consistent error shapes (no stack traces to client in prod) |

## 4.8 What this design does *not* claim

Being direct about limits: no signed-URL/watermarking scheme stops a determined user from
screen-recording playback, and no server-side control stops a user from photographing a screen or
re-typing a PDF's contents. This design raises the cost and traceability of leaks (a watermark
identifies the source; short TTLs and session binding stop trivial link-sharing; anomaly detection
surfaces likely sharing patterns to a human) — it is a deterrence and detection strategy, not a
guarantee of un-copyable content. See doc 5 §5.5 for the fuller discussion of DRM trade-offs.
