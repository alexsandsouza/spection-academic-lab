# ADR-0001 - Python and SQLite

Status: proposed baseline, implemented locally; human review pending.
Context: demonstrate requirements and evidence without external services.
Options: browser-only storage, Python SQLite, full web stack.
Decision: Python standard library and SQLite for deterministic local tests and a small learning surface.
Consequences: no multi-user authentication, production hosting or concurrent web access. Reassess when adding a web API.
