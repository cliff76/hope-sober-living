1. [x] Establish environment configuration with @t3-oss/env-nextjs
   - [x] Create src/data/env/server.ts with zod-validated server env schema (DATABASE_URL, CLERK keys, etc.)
   - [x] Create src/data/env/client.ts for any public runtime variables
   - [x] Document required .env variables in README and add .env.example
   - [x] Fail fast on invalid/missing env at boot
2. [ ] Harden database layer (Drizzle + Postgres)
   - [ ] Add connection pool config (timeouts, max clients) and health check
   - [ ] Ensure graceful shutdown of Pool on process exit
   - [ ] Add Drizzle migrations for existing schema and verify drift
   - [ ] Create seed script for local development data
3. [ ] Define application architecture boundaries
   - [ ] Create clear domain folders: src/features, src/entities, src/shared, src/app (routes)
   - [ ] Introduce module-level indexes and barrel files where appropriate
   - [ ] Add ADR (docs/adr/0001-architecture.md) describing decisions and layering
4. [ ] Centralize logging and error handling
   - [ ] Create a lightweight logger (console wrapper) with levels and contexts
   - [ ] Add server-side error boundary utilities for actions/route handlers
   - [ ] Normalize error shapes (SaveError and variants) across app
   - [ ] Replace console.error calls with logger usage
5. [ ] Input validation and parsing
   - [ ] Define zod schemas for forms and server actions (user onboarding, residents)
   - [ ] Validate FormData on the server; map to domain types centrally
   - [ ] Return structured validation errors to UI
6. [ ] Authentication and authorization
   - [ ] Document role model (admin, employee, resident) and storage in Clerk metadata
   - [ ] Add server helpers for requireUser, hasRole, requireRole
   - [ ] Guard server actions/routes using helpers
   - [ ] Add client hooks to expose role checks in UI
7. [ ] Robust user onboarding flow
   - [ ] Move step handling to a dedicated controller/service
   - [ ] Add optimistic UI states and clear error presentation
   - [ ] Add success path tests; handle duplicate constraints gracefully
   - [ ] Ensure idempotency when createNewResident is called more than once
8. [ ] Data access patterns
   - [ ] Add repository functions per table (UsersRepo, ResidentsRepo)
   - [ ] Enforce returning typed results and domain errors
   - [ ] Add transactions where multi-table writes occur
9. [ ] API and server actions
   - [ ] Co-locate server actions with features (e.g., src/features/users/actions)
   - [ ] Standardize action response type { ok, data?, errors? }
   - [ ] Add rate limiting for sensitive endpoints (if/when route handlers are added)
10. [ ] UI/UX and accessibility
    - [ ] Audit form fields and labels for a11y (aria attributes, error associations)
    - [ ] Provide keyboard navigability and focus management for dialogs/forms
    - [ ] Ensure color contrast with current theme (light/dark)
    - [ ] Add loading and disabled states consistently to buttons
11. [ ] Styling and design system
    - [ ] Introduce a small set of shared UI primitives (Button, Input, FormField)
    - [ ] Encapsulate error styles; avoid global .error selector side-effects
    - [ ] Add CSS variables documentation and theme tokens mapping
12. [ ] Performance improvements
    - [ ] Review Next.js route segment configs (dynamic/force-static where applicable)
    - [ ] Memoize heavy components and avoid re-renders in forms
    - [ ] Add Postgres indexes for frequent lookups (email, external_id, phone_number)
13. [ ] Security best practices
    - [ ] Validate and sanitize all inputs server-side; never trust client values
    - [ ] Avoid leaking detailed DB errors to clients (map to friendly messages)
    - [ ] Ensure secrets never reach the client bundle
    - [ ] Add helmet-like headers via Next config or middleware (if needed)
14. [ ] Testing strategy
    - [ ] Unit tests for utils, validators, and repositories
    - [ ] Component tests for forms with Testing Library
    - [ ] Integration tests for server actions with a test DB
    - [ ] Add coverage thresholds and CI script
15. [ ] Developer experience and code quality
    - [ ] Configure ESLint rules for import order, unused imports, and strictness
    - [ ] Add Prettier and a format script; set up lint-staged and simple pre-commit hook
    - [ ] Add TypeScript path aliases consistency and strict type checks (noImplicitAny, exactOptionalPropertyTypes)
16. [ ] Observability
    - [ ] Add simple request/response logging in actions
    - [ ] Capture slow query logs from Drizzle/pg
    - [ ] Optional: Wire to an external log sink in production
17. [ ] Configuration for Docker and local dev
    - [ ] Ensure docker-compose healthcheck uses correct env vars (POSTGRES_*)
    - [ ] Provide a Makefile or npm scripts to bootstrap: db up, migrate, seed
    - [ ] Document local dev workflow with Docker vs local Postgres
18. [ ] Residents feature hardening
    - [ ] Add pages for listing/searching residents with pagination
    - [ ] Validate [id] route input and handle not-found gracefully
    - [ ] Provide edit flows with optimistic UI and server validation
19. [ ] Error boundaries and fallback UI
    - [ ] Add global error.tsx and not-found.tsx for app routes
    - [ ] Provide feature-level error boundaries where appropriate
20. [ ] Documentation
    - [ ] Expand README with architecture overview, scripts, and env setup
    - [ ] Add docs/development.md for common workflows
    - [ ] Track decisions via ADRs in docs/adr
21. [ ] CI/CD pipeline (optional but recommended)
    - [ ] Add GitHub Actions for lint, build, test, and typecheck
    - [ ] Cache node_modules and build artifacts for speed
    - [ ] Add a preview deployment step if applicable
22. [ ] Data privacy and compliance
    - [ ] Review PII handling (email, phone, sobrietyDate); document retention and access
    - [ ] Mask PII in logs and error messages
    - [ ] Add a data export/delete pathway if required
23. [ ] Cleanup and consistency tasks
    - [ ] Remove unused imports and dead code
    - [ ] Normalize file naming (kebab-case for files, PascalCase for components)
    - [ ] Ensure all exports are used; eliminate circular deps
24. [ ] Type safety improvements
    - [ ] Replace any with precise types; prefer branded IDs for entity identifiers
    - [ ] Ensure API boundaries accept/return typed DTOs, separate from DB types
    - [ ] Add readonly where applicable and narrow nullability
25. [ ] Migrations and drift control
    - [ ] Lock in drizzle-kit version and config; ensure reproducible migrations
    - [ ] Add pre-push hook to run drizzle-kit check (if available) or a drift script
26. [ ] Secrets management
    - [ ] Use .env.local for local, .env.production for prod; avoid committing secrets
    - [ ] If deploying to Vercel/others, document env setup and rotation
27. [ ] Robust duplicate handling
    - [ ] Improve asDuplicateError to cover more constraint patterns and localization
    - [ ] Add unique constraint guards before write to reduce failures
28. [ ] Idempotency and retries for writes
    - [ ] Use externalId + upsert semantics where safe for onboarding
    - [ ] Wrap multi-write operations in transactions with retries on deadlocks
29. [ ] Accessibility testing
    - [ ] Add a11y lint rules and run axe checks in component tests
    - [ ] Provide skip links and verify heading structure on key pages
30. [ ] Monitoring readiness (future)
    - [ ] Add health endpoint/ping and db connectivity check for uptime monitors
    - [ ] Expose basic metrics (timings, counts) if/when a metrics sink is introduced