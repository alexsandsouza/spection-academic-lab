# ADR-0002: Next.js App Router with Static Export for Web Layer

- **Status**: Implemented (Verified)
- **Date**: 2026-11-10
- **Deciders**: Alexsand Farias de Souza
- **Related Requirements**: RNF-WEB-001, RNF-WEB-002, RNF-WEB-007

## Context
To make SPECTION Academic Lab accessible as an interactive live demonstration on GitHub Pages without recurring hosting fees or server maintenance, we need a modern, strongly typed web framework that produces static HTML/CSS/JS assets while supporting component-based architecture and automated testing.

## Considered Alternatives
1. **Next.js with App Router and `output: 'export'` + TypeScript `strict`**: Industry-standard React architecture, clean route organization (`/`, `/students`, `/documentation`, `/roadmap`, `/about`), seamless integration with Vitest, React Testing Library, and Playwright, and native static export support.
2. **Plain HTML/CSS/JS**: No build step, but harder to maintain strict type contracts, reusable accessible components, and component-level automated tests as the lab grows.
3. **Server-rendered Next.js with Node.js hosting**: Requires paid or managed compute hosting and introduces server attack surfaces unnecessary for a synthetic data demo.

## Decision
Build the web application inside `web/` using Next.js (App Router), React, and TypeScript in `strict` mode, configured with `output: 'export'` and customizable `basePath` (`/spection-academic-lab` in GitHub Pages CI builds).

## Consequences
- **Positive**: Zero hosting cost on GitHub Pages; strong compile-time type safety; clean separation between UI components (`web/components/`) and pure domain logic (`web/lib/domain/`).
- **Negative**: Server-only Next.js features (API routes, server actions, dynamic SSR headers) cannot be used in V1.
