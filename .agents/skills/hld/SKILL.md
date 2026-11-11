---
name: hld
description: Create a high-level system architecture describing context, components, interfaces, trust boundaries, deployment assumptions, quality trade-offs and candidate decisions. Provide Mermaid diagrams when helpful.
---

# SPECTION Skill: hld

## Goal
Create a high-level system architecture describing context, components, interfaces, trust boundaries, deployment assumptions, quality trade-offs and candidate decisions. Provide Mermaid diagrams when helpful.

## Inputs
- Current approved project context and related requirement IDs
- Existing specifications, relevant ADRs and project conventions
- Human feedback and constraints

## Workflow
1. Read `AGENTS.md` and applicable documentation.
2. Identify missing facts, risks and unresolved dependencies.
3. Draft or review `docs/hld.md`, preserving stable requirement IDs.
4. Connect deliverables to acceptance criteria and verification methods.
5. State assumptions, pending decisions and next human approval checkpoint.

## Safety & quality
Do not fabricate business requirements, approvals, test output, source citations or deployment status. Never disclose secrets. Separate verified evidence from proposals.

## Deliverable
Updated, reviewable documents with open questions and traceability.
