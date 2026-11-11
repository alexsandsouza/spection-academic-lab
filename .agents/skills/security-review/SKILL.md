---
name: security-review
description: Identify data classification, attack surfaces, permissions, input validation, secrets exposure, dependencies and plausible abuse cases. Recommend mitigations; escalate high risk decisions to human experts.
---

# SPECTION Skill: security-review

## Goal
Identify data classification, attack surfaces, permissions, input validation, secrets exposure, dependencies and plausible abuse cases. Recommend mitigations; escalate high risk decisions to human experts.

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
