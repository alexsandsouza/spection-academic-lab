---
name: product-brief
description: Produce a product brief from a user-supplied idea. Identify actors, problem evidence, goals, constraints, risks, measurable success metrics and out-of-scope items. Never assume stakeholder approval.
---

# SPECTION Skill: product-brief

## Goal
Produce a product brief from a user-supplied idea. Identify actors, problem evidence, goals, constraints, risks, measurable success metrics and out-of-scope items. Never assume stakeholder approval.

## Inputs
- Current approved project context and related requirement IDs
- Existing specifications, relevant ADRs and project conventions
- Human feedback and constraints

## Workflow
1. Read `AGENTS.md` and applicable documentation.
2. Identify missing facts, risks and unresolved dependencies.
3. Draft or review `docs/product-brief.md`, preserving stable requirement IDs.
4. Connect deliverables to acceptance criteria and verification methods.
5. State assumptions, pending decisions and next human approval checkpoint.

## Safety & quality
Do not fabricate business requirements, approvals, test output, source citations or deployment status. Never disclose secrets. Separate verified evidence from proposals.

## Deliverable
Updated, reviewable documents with open questions and traceability.
