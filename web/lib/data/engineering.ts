export type EngineeringStageStatus =
  | 'Draft'
  | 'Under Review'
  | 'Implemented'
  | 'Tests Passed'
  | 'Released';

export type EngineeringStageItem = {
  stepNumber: number;
  id: string;
  title: string;
  artifactPath: string;
  githubUrl: string;
  status: EngineeringStageStatus;
  relatedIds: string[];
  summaryEn: string;
  summaryPt: string;
};

export type TraceabilityRow = {
  reqId: string;
  category: 'Functional (Web)' | 'Non-Functional (Web)' | 'Baseline (Python)';
  titleEn: string;
  titlePt: string;
  featureId: string;
  implementationRef: string;
  testRef: string;
  status: 'Tests Passed';
};

const REPO_BLOB_BASE =
  'https://github.com/alexsandsouza/spection-academic-lab/blob/main';

export const ENGINEERING_JOURNEY_STAGES: ReadonlyArray<EngineeringStageItem> = [
  {
    stepNumber: 1,
    id: 'STAGE-01',
    title: 'Product Brief',
    artifactPath: 'docs/product-brief.md',
    githubUrl: `${REPO_BLOB_BASE}/docs/product-brief.md`,
    status: 'Implemented',
    relatedIds: ['FEAT-001..004', 'FEAT-WEB-001..004'],
    summaryEn:
      'Defines actors, problem evidence, measurable metrics (M-01..M-04), strict exclusions of real personal data, and scope boundaries across all academic modules.',
    summaryPt:
      'Define atores, evidencias do problema, metricas mensuraveis (M-01..M-04), exclusao estrita de dados pessoais reais e limites de escopo em todos os modulos.',
  },
  {
    stepNumber: 2,
    id: 'STAGE-02',
    title: 'PRD (Requirements)',
    artifactPath: 'docs/prd.md',
    githubUrl: `${REPO_BLOB_BASE}/docs/prd.md`,
    status: 'Implemented',
    relatedIds: ['RF-001..RF-007', 'RF-WEB-001..RF-WEB-026', 'RNF-WEB-001..RNF-WEB-007'],
    summaryEn:
      'Specifies functional and non-functional requirements for Students, Courses, Enrollments, Activities, privacy controls, and acceptance criteria.',
    summaryPt:
      'Especifica requisitos funcionais e nao funcionais para Estudantes, Disciplinas, Matriculas, Atividades, controles de privacidade e criterios de aceitacao.',
  },
  {
    stepNumber: 3,
    id: 'STAGE-03',
    title: 'HLD (High-Level Design)',
    artifactPath: 'docs/hld.md',
    githubUrl: `${REPO_BLOB_BASE}/docs/hld.md`,
    status: 'Implemented',
    relatedIds: ['ADR-0001..ADR-0007', 'RNF-WEB-003..RNF-WEB-007'],
    summaryEn:
      'Maps polyglot architecture (Python/SQLite + Next.js static export), Mermaid data flows, relational invariants, storage ports, and trust boundaries.',
    summaryPt:
      'Mapeia a arquitetura poliglota (Python/SQLite + Next.js static export), fluxos Mermaid, invariantes relacionais, portas de armazenamento e fronteiras de confianca.',
  },
  {
    stepNumber: 4,
    id: 'STAGE-04',
    title: 'LLD (Low-Level Design)',
    artifactPath: 'docs/lld.md',
    githubUrl: `${REPO_BLOB_BASE}/docs/lld.md`,
    status: 'Implemented',
    relatedIds: ['RF-WEB-001..RF-WEB-026', 'RNF-WEB-006'],
    summaryEn:
      'Details TypeScript strict contracts for Student, CourseItem, Enrollment, and AcademicActivity, CSV formula guard, and multi-entity storage recovery.',
    summaryPt:
      'Detalha contratos TypeScript strict para Student, CourseItem, Enrollment e AcademicActivity, protecao CSV Injection e recuperacao de armazenamento.',
  },
  {
    stepNumber: 5,
    id: 'STAGE-05',
    title: 'ADR (Architecture Decisions)',
    artifactPath: 'docs/adr.md',
    githubUrl: `${REPO_BLOB_BASE}/docs/adr.md`,
    status: 'Implemented',
    relatedIds: ['ADR-0001..ADR-0007'],
    summaryEn:
      'Records seven explicit architectural decisions including Next.js static export, opt-in localStorage, Python coexistence, and relational domain evolution.',
    summaryPt:
      'Registra sete decisoes arquiteturais incluindo Next.js static export, localStorage opcional, coexistencia Python e evolucao relacional do dominio.',
  },
  {
    stepNumber: 6,
    id: 'STAGE-06',
    title: 'Feature Specification',
    artifactPath: 'specs/academic-web/spec.md',
    githubUrl: `${REPO_BLOB_BASE}/specs/academic-web/spec.md`,
    status: 'Implemented',
    relatedIds: ['FEAT-001..004', 'FEAT-WEB-001..004', 'AC-WEB-001..AC-WEB-014'],
    summaryEn:
      'Defines bounded feature specifications and Given/When/Then acceptance criteria across Students, Courses, Enrollments, and Activities.',
    summaryPt:
      'Define especificacoes delimitadas e criterios Given/When/Then para Estudantes, Disciplinas, Matriculas e Atividades.',
  },
  {
    stepNumber: 7,
    id: 'STAGE-07',
    title: 'Implementation Plan',
    artifactPath: 'specs/academic-web/plan.md',
    githubUrl: `${REPO_BLOB_BASE}/specs/academic-web/plan.md`,
    status: 'Implemented',
    relatedIds: ['Phase A..Phase G'],
    summaryEn:
      'Sequences execution from Discovery and Specification to Architecture, Bounded Implementation, Quality Gate, Release, and Portal Integration.',
    summaryPt:
      'Sequencia a execucao desde Discovery e Specification ate Architecture, Implementacao Incremental, Quality Gate, Release e Integracao ao Portal.',
  },
  {
    stepNumber: 8,
    id: 'STAGE-08',
    title: 'Tasks Breakdown',
    artifactPath: 'specs/academic-web/tasks.md',
    githubUrl: `${REPO_BLOB_BASE}/specs/academic-web/tasks.md`,
    status: 'Implemented',
    relatedIds: ['TASK-WEB-001..TASK-WEB-015'],
    summaryEn:
      'Breaks the web workspace into 15 verifiable engineering tasks mapped directly to requirements and automated test suites.',
    summaryPt:
      'Divide o ambiente web em 15 tarefas verificaveis de engenharia mapeadas diretamente para requisitos e suites de testes.',
  },
  {
    stepNumber: 9,
    id: 'STAGE-09',
    title: 'Quality Gates',
    artifactPath: 'docs/traceability.md',
    githubUrl: `${REPO_BLOB_BASE}/docs/traceability.md`,
    status: 'Tests Passed',
    relatedIds: ['Python unittest (8)', 'Vitest Unit/Component', 'Playwright E2E', 'TypeScript strict'],
    summaryEn:
      'Verifies all requirements against automated Python, Vitest unit/component, Playwright E2E browser, and static export build checks.',
    summaryPt:
      'Verifica todos os requisitos contra testes automatizados Python, Vitest unitarios/componentes, Playwright E2E e build estatico.',
  },
  {
    stepNumber: 10,
    id: 'STAGE-10',
    title: 'Release Evidence',
    artifactPath: 'docs/evidence.md',
    githubUrl: `${REPO_BLOB_BASE}/docs/evidence.md`,
    status: 'Released',
    relatedIds: ['CI Workflow', 'GitHub Pages Live', 'Portal Integrated'],
    summaryEn:
      'Records actual test execution outputs, live GitHub Pages deployment verification, screenshots, and explicit human review checkpoints.',
    summaryPt:
      'Registra resultados reais de execucao de testes, verificacao do deploy no GitHub Pages, capturas de tela e pontos de revisao humana.',
  },
];

export const TRACEABILITY_ITEMS: ReadonlyArray<TraceabilityRow> = [
  {
    reqId: 'RF-001..RF-007',
    category: 'Baseline (Python)',
    titleEn: 'Python/SQLite relational registry (students, courses, enrollments, activities)',
    titlePt: 'Cadastro relacional Python/SQLite (estudantes, disciplinas, matriculas, atividades)',
    featureId: 'FEAT-001..004',
    implementationRef: 'students.py',
    testRef: 'tests/test_students.py (8 tests)',
    status: 'Tests Passed',
  },
  {
    reqId: 'RF-WEB-001..005',
    category: 'Functional (Web)',
    titleEn: 'Student registration, DEMO-0001 normalization, validation & duplicate guard',
    titlePt: 'Cadastro de estudante, normalizacao DEMO-0001, validacao e bloqueio de duplicidade',
    featureId: 'FEAT-WEB-001',
    implementationRef: 'web/lib/domain/students.ts',
    testRef: 'students.test.ts, academic-lab.spec.ts',
    status: 'Tests Passed',
  },
  {
    reqId: 'RF-WEB-006..010',
    category: 'Functional (Web)',
    titleEn: 'List, search, filter, sort, edit, and confirmed student deletion',
    titlePt: 'Listar, pesquisar, filtrar, ordenar, editar e excluir estudante com confirmacao',
    featureId: 'FEAT-WEB-001',
    implementationRef: 'web/app/students/page.tsx, ConfirmDialog.tsx',
    testRef: 'students.test.ts, academic-lab.test.tsx',
    status: 'Tests Passed',
  },
  {
    reqId: 'RF-WEB-011..014',
    category: 'Functional (Web)',
    titleEn: 'Idempotent demo seed, confirmed local clear, safe CSV export & live dashboard',
    titlePt: 'Carga demonstrativa sem duplicar, limpeza confirmada, CSV seguro e dashboard vivo',
    featureId: 'FEAT-WEB-001',
    implementationRef: 'web/lib/domain/students.ts, web/app/page.tsx',
    testRef: 'students.test.ts, academic-lab.test.tsx',
    status: 'Tests Passed',
  },
  {
    reqId: 'RF-WEB-015..018',
    category: 'Functional (Web)',
    titleEn: 'Synthetic Courses CRUD (COURSE-01), workload (15-240h), deletion guard & CSV',
    titlePt: 'CRUD de Disciplinas (COURSE-01), carga horaria (15-240h), bloqueio de exclusao e CSV',
    featureId: 'FEAT-WEB-002',
    implementationRef: 'web/lib/domain/academic.ts, web/app/courses/page.tsx',
    testRef: 'academic.test.ts, academic-lab.spec.ts',
    status: 'Tests Passed',
  },
  {
    reqId: 'RF-WEB-019..022',
    category: 'Functional (Web)',
    titleEn: 'Relational Enrollments (ENR-0001), student+course+term uniqueness, status & CSV',
    titlePt: 'Matriculas Relacionais (ENR-0001), unicidade estudante+disciplina+periodo e CSV',
    featureId: 'FEAT-WEB-003',
    implementationRef: 'web/lib/domain/academic.ts, web/app/enrollments/page.tsx',
    testRef: 'academic.test.ts, academic-lab.spec.ts',
    status: 'Tests Passed',
  },
  {
    reqId: 'RF-WEB-023..026',
    category: 'Functional (Web)',
    titleEn: 'Academic Activities (ACT-0001), score bounds (0-100), status, avg score & CSV',
    titlePt: 'Atividades Academicas (ACT-0001), notas (0-100), status, calculo de media e CSV',
    featureId: 'FEAT-WEB-004',
    implementationRef: 'web/lib/domain/academic.ts, web/app/activities/page.tsx',
    testRef: 'academic.test.ts, academic-lab.spec.ts',
    status: 'Tests Passed',
  },
  {
    reqId: 'RNF-WEB-001..002',
    category: 'Non-Functional (Web)',
    titleEn: 'Responsive layout and keyboard/screen-reader accessibility',
    titlePt: 'Interface responsiva e acessivel por teclado e leitores',
    featureId: 'FEAT-WEB-001..004',
    implementationRef: 'web/components/AppShell.tsx, globals.css',
    testRef: 'academic-lab.spec.ts (mobile & dialog roles)',
    status: 'Tests Passed',
  },
  {
    reqId: 'RNF-WEB-003..006',
    category: 'Non-Functional (Web)',
    titleEn: 'Memory default, opt-in localStorage, zero server transmission, error fallback',
    titlePt: 'Memoria por padrao, localStorage opcional, sem envio externo e tratamento de erro',
    featureId: 'FEAT-WEB-001..004',
    implementationRef: 'web/lib/storage/storage.ts, PrivacyBanner.tsx',
    testRef: 'storage.test.ts, academic-lab.spec.ts',
    status: 'Tests Passed',
  },
  {
    reqId: 'RNF-WEB-007',
    category: 'Non-Functional (Web)',
    titleEn: 'Static export build for GitHub Pages deployment',
    titlePt: 'Publicacao como aplicacao web estatica',
    featureId: 'FEAT-WEB-001..004',
    implementationRef: 'web/next.config.mjs, .github/workflows/academic-lab.yml',
    testRef: 'npm run build (web/out)',
    status: 'Tests Passed',
  },
];
