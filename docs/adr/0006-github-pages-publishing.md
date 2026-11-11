# ADR-0006: Quality-Gated GitHub Pages Publishing Pipeline

- **Status**: Implemented (Verified)
- **Date**: 2026-11-10
- **Deciders**: Alexsand Farias de Souza
- **Related Requirements**: RNF-WEB-007

## Context
In Spec-Driven Development, software should only be published after automated quality gates verify type safety, unit logic, component behavior, end-to-end browser flows, and the historical Python baseline.

## Considered Alternatives
1. **Manual static branch push (`gh-pages` branch without CI checks)**: Prone to human error and allows broken builds to reach production.
2. **GitHub Actions workflow (`actions/deploy-pages`) gated by quality jobs**: Runs Python tests, TypeScript typecheck, Vitest unit/component tests, Next.js static export build (`basePath: '/spection-academic-lab'`), and Playwright E2E tests before deploying `web/out`.

## Decision
Configure automated GitHub Actions workflows in `.github/workflows/` with explicit least-privilege permissions (`contents: read`, `pages: write`, `id-token: write` for deployment) that block GitHub Pages publication if any test or build step fails.

## Consequences
- **Positive**: Every published build at `https://alexsandsouza.github.io/spection-academic-lab/` is backed by verifiable CI execution logs and test artifacts.
- **Negative**: Requires GitHub Pages source in repository settings to be set to `GitHub Actions`.
