# PRD

RF-001: register a synthetic student with normalized DEMO-0001 code and fictional name.
RF-002: reject codes outside DEMO-[0-9]{4} and names outside 2-80 characters.
RF-003: reject duplicate codes without overwriting.
RF-004: list records sorted by code.
RNF-001: use parameterized SQL; no network calls.
RNF-002: memory database by default; no real student data.
Acceptance: all five automated tests pass; review before release.
