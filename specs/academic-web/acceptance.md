# Acceptance Criteria: FEAT-WEB-001 - Synthetic Student Management Web Application

All scenarios below are verified via automated tests (`web/tests/unit/`, `web/tests/components/`, and `web/tests/e2e/`).

---

### Scenario AC-WEB-001: Register a valid synthetic student (`RF-WEB-001`, `RF-WEB-002`, `RF-WEB-003`, `RF-WEB-004`, `RF-WEB-014`)
- **Given** the visitor is on the Students page (`/students`) with an empty registry
- **When** the visitor enters code `" demo-0001 "`, name `" Ada Lovelace Fictional "`, selects course `"Software Engineering"`, and submits the form
- **Then** the code is normalized to `"DEMO-0001"`, the student appears in the table, a success message is announced, and the Dashboard total students indicator updates to `1`.

### Scenario AC-WEB-002: Reject invalid inputs (`RF-WEB-002`, `RF-WEB-003`, `RF-WEB-004`)
- **Given** the visitor is on the Students page
- **When** the visitor submits a code not matching `DEMO-[0-9]{4}` (e.g., `"REAL-1234"`), a name shorter than 2 or longer than 80 characters, or an unlisted course
- **Then** the form submission is blocked, field-specific validation messages are displayed, and no record is added to the registry.

### Scenario AC-WEB-003: Prevent duplicate student codes after normalization (`RF-WEB-005`)
- **Given** a student with code `"DEMO-0001"` is already registered
- **When** the visitor attempts to register another student with code `"demo-0001"` or `" DEMO-0001 "`
- **Then** the system rejects the submission with a duplicate code error and preserves the original record unchanged.

### Scenario AC-WEB-004: Search, filter, and sort records (`RF-WEB-006`, `RF-WEB-007`, `RF-WEB-008`)
- **Given** multiple synthetic students are registered across different courses
- **When** the visitor enters a search term matching a student name, code, or course, or changes the sort field/direction
- **Then** only matching records are rendered in the requested deterministic sort order.

### Scenario AC-WEB-005: Edit an existing student record (`RF-WEB-009`)
- **Given** student `"DEMO-0001"` is listed in the table
- **When** the visitor clicks Edit, changes the fictional name to `"Grace Hopper Fictional"` and course to `"Computer Science"`, and saves
- **Then** the record is updated in place with a newer `updatedAt` timestamp and reflected in the table and dashboard distribution.

### Scenario AC-WEB-006: Delete a student with confirmation (`RF-WEB-010`)
- **Given** student `"DEMO-0001"` is listed in the table
- **When** the visitor clicks Delete and confirms the action in the confirmation dialog
- **Then** `"DEMO-0001"` is removed from the registry and the dashboard indicators recalculate.

### Scenario AC-WEB-007: Load demonstration dataset without duplicates (`RF-WEB-011`)
- **Given** the registry already contains `"DEMO-0001"`
- **When** the visitor clicks "Load demo data"
- **Then** the remaining demonstration records (`DEMO-0002`, `DEMO-0003`, etc.) are added without duplicating or overwriting `"DEMO-0001"`.

### Scenario AC-WEB-008: Clear all local records with confirmation (`RF-WEB-012`)
- **Given** the registry contains one or more student records
- **When** the visitor clicks "Clear local data" and confirms the action in the dialog
- **Then** all student records are removed and the empty state with a CTA to register a student is shown.

### Scenario AC-WEB-009: Export CSV with formula injection protection (`RF-WEB-013`)
- **Given** the registry contains a student whose name includes quotes or starts with a spreadsheet formula character (e.g., `"=CMD()"`)
- **When** `exportStudentsToCsv` is executed
- **Then** the resulting CSV escapes double quotes and prefixes formula-triggering values with a single quote (`'`) so spreadsheet applications treat them as plain text.

### Scenario AC-WEB-010: Privacy-by-design storage lifecycle (`RNF-WEB-003`, `RNF-WEB-004`, `RNF-WEB-006`)
- **Given** a visitor opens the application for the first time or selects "Essential Only"
- **When** the visitor registers a student and reloads the page
- **Then** no student data is written to `window.localStorage` and the registry starts empty after reload (`MemoryStorageAdapter`).
- **When** the visitor explicitly selects "Allow Local Storage", registers a student, and reloads the page
- **Then** the student record persists across the reload via `LocalStorageAdapter`.
- **When** the visitor opens Privacy Preferences and revokes local storage permission
- **Then** persisted student records are immediately deleted from `window.localStorage` and the storage mode returns to temporary memory.

### Scenario AC-WEB-011: Responsive mobile navigation and accessibility (`RNF-WEB-001`, `RNF-WEB-002`)
- **Given** the application is viewed on a mobile viewport (`375x667`)
- **When** the visitor activates the mobile menu toggle button
- **Then** the navigation drawer opens with keyboard-accessible links to Dashboard, Students, Documentation, Roadmap, and About, and planned modules clearly display a `Planned` badge.
