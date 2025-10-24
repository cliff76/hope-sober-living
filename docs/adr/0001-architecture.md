# ADR 0001: High-level Architecture and Layering

- Status: Proposed
- Date: 2025-10-23
- Authors: Team Hope
- Tags: architecture, layering, boundaries, nextjs, drizzle

## Context
We are building a Next.js App Router application backed by Postgres via Drizzle ORM. As features grow (users, residents, onboarding, etc.), we need clear boundaries so that data access, domain logic, and UI don’t bleed into each other. This helps us:
- make changes safely without breaking unrelated parts
- test logic without rendering UI
- reason about where code should live
- enable future contributors to follow consistent patterns

## Decision
Adopt a simple layered structure with explicit boundaries:

- src/app: route handlers and UI entry points (pages, layouts, server actions). Minimal orchestration only. No direct DB access.
- src/features/*: feature-centric modules (e.g., users, residents). Contains controllers/services, actions, validators, and view-model helpers specific to the feature. Can call repositories in data layer.
- src/entities/*: pure domain types and logic shared across features (no framework imports, no DB). Reusable business rules.
- src/shared/*: cross-cutting utilities (logging, error mapping, schemas, constants, UI primitives). No feature-specific logic.
- src/drizzle/*: database schemas, migrations, and the db client. Exposes repositories used by features.
- src/data/env/*: validated environment configuration using @t3-oss/env-nextjs.

Access rules (one-directional):
- app -> features -> entities/shared -> drizzle (repositories)
- features may import from shared, entities, and drizzle
- entities should not import from app, features, or drizzle
- drizzle should not import from app or features

## Rationale
- Separating concerns reduces coupling and improves testability.
- Feature-first organization aligns code with user-visible capabilities.
- Explicit repository layer (Drizzle) centralizes DB access and encourages typed results and domain errors.
- Keeping entities framework-free preserves portability and isolates business rules.

## Alternatives Considered
1. Flat folders by technical type (components/, services/, utils/)
   - Pros: simple to start
   - Cons: code for a single feature ends up scattered; harder to evolve safely
2. Monolithic “services” layer with direct access from UI
   - Pros: fewer folders
   - Cons: encourages leaky boundaries and tight coupling to DB/API shapes

## Consequences
Positive:
- Clear place for each kind of code
- Easier refactors and parallel work
- Better unit tests for entities and repositories

Trade-offs:
- Slight overhead creating folders and barrels
- Requires code reviews to enforce boundaries

## Implementation Notes
- Co-locate server actions with their feature (e.g., src/features/users/actions), and import them from app routes.
- Add repositories per table (e.g., UsersRepo, ResidentsRepo) under src/drizzle or src/features/*/db depending on preference—but expose only repository functions to features.
- Validate all external inputs with zod in features; return normalized errors (SaveError).
- Use shared logger wrapper instead of raw console.*
- Store role logic and constants under shared or entities as appropriate.

## Example File Map (target)
- src/app/users/onboarding/ (UI + route entry)
- src/features/users/actions/ (server actions)
- src/features/users/controllers/ (or services)
- src/features/users/validators/
- src/entities/user.ts (types and business rules)
- src/shared/logger.ts, src/shared/errors.ts, src/shared/ui/
- src/drizzle/schema.ts, src/drizzle/schema/users.ts, src/drizzle/migrations/*

## References
- ADRs: https://adr.github.io/
- Architecture boundaries inspiration: Feature-first modular monoliths, Clean Architecture concepts
