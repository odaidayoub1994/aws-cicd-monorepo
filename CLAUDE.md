# Project

TypeScript monorepo: NestJS backend, Next.js frontend, shared packages. Yarn v4 workspaces + Turborepo.

# Commands

- `docker compose up db pgadmin -d` — Start database + pgAdmin
- `yarn workspace backend dev` — Start backend (port 4000)
- `yarn workspace frontend dev` — Start frontend (port 3000)
- `yarn dev` — Start all via Turborepo
- `yarn workspace backend test` — Run backend tests
- `yarn build` — Build all packages
- `yarn lint` — Lint all packages

# Code Style

- Use shared types from `packages/shared-types` for cross-package interfaces
- Backend entities must implement interfaces from shared-types
- Backend DTOs use class-validator decorators
- Frontend uses Next.js Pages Router with CSS Modules

# Docker

- Database exposed on port 5433 (local PostgreSQL uses 5432)
- Dockerfiles use multi-stage builds with Node 20 Alpine
- Build context is repo root (Dockerfiles need access to packages/)

# Testing

- Backend: Jest with ts-jest, mock repositories
- Run single test: `yarn workspace backend test -- --testPathPattern=<pattern>`
