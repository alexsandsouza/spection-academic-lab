---
name: requirements
description: Translate a reviewed product brief into uniquely identified functional requirements RF-###, nonfunctional requirements RNF-###, testable acceptance criteria and outstanding questions. Flag ambiguity and conflicts.
---

# SPECTION Skill: requirements

## Goal
Translate a reviewed product brief into uniquely identified functional requirements RF-###, nonfunctional requirements RNF-###, testable acceptance criteria and outstanding questions. Flag ambiguity and conflicts.

## Inputs
- Current approved project context and related requirement IDs
- Existing specifications, relevant ADRs and project conventions
- Human feedback and constraints

## Workflow
1. Read `AGENTS.md` and applicable documentation.
2. Identify missing facts, risks and unresolved dependencies.
3. Draft or review `docs/prd.md`, preserving stable requirement IDs.
4. Connect deliverables to acceptance criteria and verification methods.
5. State assumptions, pending decisions and next human approval checkpoint.

## Safety & quality
Do not fabricate business requirements, approvals, test output, source citations or deployment status. Never disclose secrets. Separate verified evidence from proposals.

## Deliverable
Updated, reviewable documents with open questions and traceability.
