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
    relatedIds: ['FEAT-001', 'FEAT-WEB-001'],
    summaryEn:
      'Defines actors, problem evidence, measurable metrics (M-01..M-04), strict exclusions of real personal data, and scope boundaries.',
    summaryPt:
      'Define atores, evidencias do problema, metricas mensuraveis (M-01..M-04), exclusao estrita de dados pessoais reais e limites de escopo.',
  },
  {
    stepNumber: 2,
    id: 'STAGE-02',
    title: 'PRD (Requirements)',
    artifactPath: 'docs/prd.md',
    githubUrl: `${REPO_BLOB_BASE}/docs/prd.md`,
    status: 'Implemented',
    relatedIds: ['RF-001..RF-004', 'RF-WEB-001..RF-WEB-014', 'RNF-WEB-001..RNF-WEB-007'],
    summaryEn:
      'Specifies functional and non-functional requirements, business rules, security/privacy controls, and acceptance criteria.',
    summaryPt:
      'Especifica requisitos funcionais e nao funcionais, regras de negocio, controles de seguranca/privacidade e criterios de aceitacao.',
  },
  {
    stepNumber: 3,
    id: 'STAGE-03',
    title: 'HLD (High-Level Design)',
    artifactPath: 'docs/hld.md',
    githubUrl: `${REPO_BLOB_BASE}/docs/hld.md`,
    status: 'Implemented',
    relatedIds: ['ADR-0001..ADR-0006', 'RNF-WEB-003..RNF-WEB-007'],
    summaryEn:
      'Maps client-side component architecture, Mermaid data flow, storage ports, trust boundaries, and static hosting topology.',
    summaryPt:
      'Mapeia a arquitetura de componentes cliente, fluxo de dados Mermaid, portas de armazenamento, fronteiras de confianca e publicacao estatica.',
  },
  {
    stepNumber: 4,
    id: 'STAGE-04',
    title: 'LLD (Low-Level Design)',
    artifactPath: 'docs/lld.md',
    githubUrl: `${REPO_BLOB_BASE}/docs/lld.md`,
    status: 'Implemented',
    relatedIds: ['RF-WEB-001..RF-WEB-014', 'RNF-WEB-006'],
    summaryEn:
      'Details TypeScript strict contracts, validation error keys, CSV formula neutralization algorithm, storage error recovery, and test layers.',
    summaryPt:
      'Detalha contratos TypeScript strict, chaves de validacao, algoritmo contra CSV Injection, recuperacao de falhas de armazenamento e camadas de teste.',
  },
  {
    stepNumber: 5,
    id: 'STAGE-05',
    title: 'ADR (Architecture Decisions)',
    artifactPath: 'docs/adr.md',
    githubUrl: `${REPO_BLOB_BASE}/docs/adr.md`,
    status: 'Implemented',
    relatedIds: ['ADR-0001', 'ADR-0002', 'ADR-0003', 'ADR-0004', 'ADR-0005', 'ADR-0006'],
    summaryEn:
      'Records six explicit architectural decisions: Python SQLite baseline, Next.js static export, opt-in localStorage, Python preservation, zero backend V1, and GitHub Pages CI.',
    summaryPt:
      'Registra seis decisoes arquiteturais: baseline Python SQLite, Next.js static export, localStorage opcional, preservacao do Python, V1 sem backend e CI do GitHub Pages.',
  },
  {
    stepNumber: 6,
    id: 'STAGE-06',
    title: 'Feature Specification',
    artifactPath: 'specs/academic-web/spec.md',
    githubUrl: `${REPO_BLOB_BASE}/specs/academic-web/spec.md`,
    status: 'Implemented',
    relatedIds: ['FEAT-001', 'FEAT-WEB-001', 'AC-WEB-001..AC-WEB-011'],
    summaryEn:
      'Defines bounded feature specifications and Given/When/Then acceptance criteria in specs/feature-001.md and specs/academic-web/.',
    summaryPt:
      'Define especificacoes delimitadas de funcionalidades e criterios Given/When/Then em specs/feature-001.md e specs/academic-web/.',
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
    relatedIds: ['TASK-WEB-001..TASK-WEB-012'],
    summaryEn:
      'Breaks FEAT-WEB-001 into 12 verifiable engineering tasks mapped directly to requirements and test suites.',
    summaryPt:
      'Divide a FEAT-WEB-001 em 12 tarefas verificaveis de engenharia mapeadas diretamente para requisitos e suites de teste.',
  },
  {
    stepNumber: 9,
    id: 'STAGE-09',
    title: 'Quality Gates',
    artifactPath: 'docs/traceability.md',
    githubUrl: `${REPO_BLOB_BASE}/docs/traceability.md`,
    status: 'Tests Passed',
    relatedIds: ['Python unittest', 'Vitest Unit/Component', 'Playwright E2E', 'TypeScript strict'],
    summaryEn:
      'Verifies all requirements against automated unit, component, E2E browser, and static export build checks.',
    summaryPt:
      'Verifica todos os requisitos contra testes automatizados unitarios, de componentes, E2E no navegador e build estatico.',
  },
  {
    stepNumber: 10,
    id: 'STAGE-10',
    title: 'Release Evidence',
    artifactPath: 'docs/evidence.md',
    githubUrl: `${REPO_BLOB_BASE}/docs/evidence.md`,
    status: 'Tests Passed',
    relatedIds: ['CI Workflow', 'GitHub Pages', 'Human Review Checkpoint'],
    summaryEn:
      'Records actual test execution outputs, build verification, screenshots, and explicit human review checkpoints.',
    summaryPt:
      'Registra resultados reais de execucao de testes, verificacao de build, capturas de tela e pontos de revisao humana.',
  },
];

export const TRACEABILITY_ITEMS: ReadonlyArray<TraceabilityRow> = [
  {
    reqId: 'RF-001..RF-004',
    category: 'Baseline (Python)',
    titleEn: 'Python/SQLite synthetic student registry & parameterized SQL',
    titlePt: 'Cadastro sintetico em Python/SQLite e SQL parametrizado',
    featureId: 'FEAT-001',
    implementationRef: 'students.py',
    testRef: 'tests/test_students.py (5 tests)',
    status: 'Tests Passed',
  },
  {
    reqId: 'RF-WEB-001',
    category: 'Functional (Web)',
    titleEn: 'Register synthetic student record',
    titlePt: 'Cadastrar estudante ficticio',
    featureId: 'FEAT-WEB-001',
    implementationRef: 'web/lib/domain/students.ts',
    testRef: 'students.test.ts, academic-lab.spec.ts',
    status: 'Tests Passed',
  },
  {
    reqId: 'RF-WEB-002',
    category: 'Functional (Web)',
    titleEn: 'Normalize and validate DEMO-0001 code pattern',
    titlePt: 'Normalizar e validar codigo no padrao DEMO-0001',
    featureId: 'FEAT-WEB-001',
    implementationRef: 'web/lib/domain/students.ts',
    testRef: 'students.test.ts, academic-lab.test.tsx',
    status: 'Tests Passed',
  },
  {
    reqId: 'RF-WEB-003',
    category: 'Functional (Web)',
    titleEn: 'Validate fictional name length (2-80 chars)',
    titlePt: 'Validar nome ficticio entre 2 e 80 caracteres',
    featureId: 'FEAT-WEB-001',
    implementationRef: 'web/lib/domain/students.ts',
    testRef: 'students.test.ts, academic-lab.test.tsx',
    status: 'Tests Passed',
  },
  {
    reqId: 'RF-WEB-004',
    category: 'Functional (Web)',
    titleEn: 'Select course from demonstration catalog',
    titlePt: 'Selecionar curso de lista demonstrativa',
    featureId: 'FEAT-WEB-001',
    implementationRef: 'web/lib/domain/students.ts',
    testRef: 'students.test.ts, academic-lab.test.tsx',
    status: 'Tests Passed',
  },
  {
    reqId: 'RF-WEB-005',
    category: 'Functional (Web)',
    titleEn: 'Prevent duplicate student codes after normalization',
    titlePt: 'Impedir duplicidade de codigo apos normalizacao',
    featureId: 'FEAT-WEB-001',
    implementationRef: 'web/lib/domain/students.ts',
    testRef: 'students.test.ts, academic-lab.spec.ts',
    status: 'Tests Passed',
  },
  {
    reqId: 'RF-WEB-006..008',
    category: 'Functional (Web)',
    titleEn: 'List, search, filter, and sort registered students',
    titlePt: 'Listar, pesquisar, filtrar e ordenar estudantes',
    featureId: 'FEAT-WEB-001',
    implementationRef: 'web/app/students/page.tsx',
    testRef: 'students.test.ts, academic-lab.spec.ts',
    status: 'Tests Passed',
  },
  {
    reqId: 'RF-WEB-009..010',
    category: 'Functional (Web)',
    titleEn: 'Edit student and delete with explicit confirmation',
    titlePt: 'Editar estudante e excluir mediante confirmacao',
    featureId: 'FEAT-WEB-001',
    implementationRef: 'web/app/students/page.tsx, ConfirmDialog.tsx',
    testRef: 'academic-lab.test.tsx, academic-lab.spec.ts',
    status: 'Tests Passed',
  },
  {
    reqId: 'RF-WEB-011..012',
    category: 'Functional (Web)',
    titleEn: 'Idempotent demo seed load and confirmed local clear',
    titlePt: 'Carga demonstrativa sem duplicar e limpeza confirmada',
    featureId: 'FEAT-WEB-001',
    implementationRef: 'web/lib/domain/students.ts, AcademicLabContext.tsx',
    testRef: 'students.test.ts, academic-lab.test.tsx',
    status: 'Tests Passed',
  },
  {
    reqId: 'RF-WEB-013',
    category: 'Functional (Web)',
    titleEn: 'CSV export with quote escaping and formula injection guard',
    titlePt: 'Exportacao CSV com protecao contra CSV Injection',
    featureId: 'FEAT-WEB-001',
    implementationRef: 'web/lib/domain/students.ts',
    testRef: 'students.test.ts',
    status: 'Tests Passed',
  },
  {
    reqId: 'RF-WEB-014',
    category: 'Functional (Web)',
    titleEn: 'Real-time academic dashboard indicators & chart',
    titlePt: 'Atualizacao automatica dos indicadores do dashboard',
    featureId: 'FEAT-WEB-001',
    implementationRef: 'web/app/page.tsx, students.ts',
    testRef: 'students.test.ts, academic-lab.test.tsx',
    status: 'Tests Passed',
  },
  {
    reqId: 'RNF-WEB-001..002',
    category: 'Non-Functional (Web)',
    titleEn: 'Responsive layout and keyboard/screen-reader accessibility',
    titlePt: 'Interface responsiva e acessivel por teclado e leitores',
    featureId: 'FEAT-WEB-001',
    implementationRef: 'web/components/AppShell.tsx, globals.css',
    testRef: 'academic-lab.spec.ts (mobile & dialog roles)',
    status: 'Tests Passed',
  },
  {
    reqId: 'RNF-WEB-003..006',
    category: 'Non-Functional (Web)',
    titleEn: 'Memory default, opt-in localStorage, zero server transmission, error fallback',
    titlePt: 'Memoria por padrao, localStorage opcional, sem envio externo e tratamento de erro',
    featureId: 'FEAT-WEB-001',
    implementationRef: 'web/lib/storage/storage.ts, PrivacyBanner.tsx',
    testRef: 'storage.test.ts, academic-lab.spec.ts',
    status: 'Tests Passed',
  },
  {
    reqId: 'RNF-WEB-007',
    category: 'Non-Functional (Web)',
    titleEn: 'Static export build for GitHub Pages deployment',
    titlePt: 'Publicacao como aplicacao web estatica',
    featureId: 'FEAT-WEB-001',
    implementationRef: 'web/next.config.mjs, .github/workflows/academic-lab.yml',
    testRef: 'npm run build (web/out)',
    status: 'Tests Passed',
  },
];
