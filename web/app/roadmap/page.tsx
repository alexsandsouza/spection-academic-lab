'use client';

import React from 'react';
import { Map, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { useAcademicLab } from '../../lib/context/AcademicLabContext';

export default function RoadmapPage() {
  const { locale } = useAcademicLab();
  const isPt = locale === 'pt';

  const milestones = [
    {
      version: 'v0.1',
      feature: 'FEAT-001',
      title: isPt
        ? 'Cadastro Sintetico em Python 3 & SQLite (Baseline)'
        : 'Synthetic Student Registry in Python 3 & SQLite (Baseline)',
      status: 'Implemented & Verified',
      completed: true,
      items: isPt
        ? [
            'Modulo students.py sem dependencias externas',
            'Validacao DEMO-0001, tamanho de nome (2-80) e SQL parametrizado',
            'Testes unitarios automatizados em tests/test_students.py',
            '9 Agent Skills locais em .agents/skills/',
          ]
        : [
            'Zero-dependency students.py module with in-memory SQLite default',
            'DEMO-0001 normalization, name bounds (2-80), and parameterized SQL',
            'Automated unit tests in tests/test_students.py',
            '9 local SPECTION Agent Skills in .agents/skills/',
          ],
    },
    {
      version: 'v0.3',
      feature: 'FEAT-WEB-001',
      title: isPt
        ? 'Aplicacao Web Interativa, Dashboard, Privacidade & Engineering Journey'
        : 'Interactive Web Application, Dashboard, Privacy & Engineering Journey',
      status: 'Implemented & Verified',
      completed: true,
      items: isPt
        ? [
            'Next.js App Router com static export e TypeScript strict',
            'Camada de dominio independente, busca, ordenacao e exportacao CSV segura',
            'Armazenamento em memoria por padrao e localStorage opcional (LGPD/GDPR)',
            'Testes unitarios (Vitest), de componentes (RTL) e E2E (Playwright)',
          ]
        : [
            'Next.js App Router with static export and TypeScript strict mode',
            'Independent domain layer, search, sorting, and formula-safe CSV export',
            'Ephemeral memory storage by default and consent-gated localStorage',
            'Unit (Vitest), component (RTL), and browser E2E (Playwright) test suites',
          ],
    },
    {
      version: 'v0.5 (Baseline)',
      feature: 'FEAT-WEB-002..004',
      title: isPt
        ? 'Suite Academica Relacional: Disciplinas, Matriculas e Atividades Avaliativas'
        : 'Relational Academic Suite: Courses, Enrollments & Academic Activities',
      status: 'Implemented & Verified',
      completed: true,
      items: isPt
        ? [
            'Catalogo de Disciplinas (/courses - COURSE-01) com bloqueio referencial de exclusao',
            'Gestao Relacional de Matriculas (/enrollments - ENR-0001) por periodo letivo',
            'Atividades Academicas e Notas (/activities - ACT-0001) com calculo de media no dashboard',
            'Paridade poliglota entre Python/SQLite (8 testes) e TypeScript/Next.js',
          ]
        : [
            'Synthetic Courses Catalog (/courses - COURSE-01) with referential deletion guard',
            'Relational Student Enrollments (/enrollments - ENR-0001) per academic term',
            'Academic Activities & Scores (/activities - ACT-0001) with live dashboard gradebook average',
            'Polyglot parity across Python/SQLite (8 tests) and TypeScript/Next.js',
          ],
    },
    {
      version: "v0.6 (Current)",
      feature: "FEAT-005",
      title: isPt ? "Inteligência Acadêmica: Frequência, Notas e Boletim" : "Academic Intelligence: Attendance, Grades & Transcript",
      status: "CI Verified - Human Review Pending",
      completed: false,
      items: isPt ? ["Cadastro de aulas e registro de presença fictícia","Médias ponderadas e boletim de demonstração","CI aprovado; revisão humana pendente"] : ["Attendance sessions and synthetic presence records","Weighted grades and demonstration transcript","CI passed; human review pending"],
    },
    {
      version: "v0.7 (Planned)",
      feature: "FEAT-006",
      title: isPt ? "Relatórios PDF/CSV e Importação Validada" : "Reports PDF/CSV and Validated Imports",
      status: "Planned",
      completed: false,
      items: isPt ? ["Relatórios acadêmicos consolidados","Prévia de importação e análise de conflitos"] : ["Consolidated academic reports","Import preview and conflict validation"],
    },
    {
      version: "v0.8 (Planned)",
      feature: "FEAT-007",
      title: isPt ? "Papéis Simulados e Segurança STRIDE" : "Simulated Roles and STRIDE Security",
      status: "Planned",
      completed: false,
      items: isPt ? ["Perfis demonstrativos sem autenticação real","Explorador de ameaças e medidas de proteção"] : ["Demonstration-only personas without real authorization","Threat modeling and safeguards"],
    },
    {
      version: "v0.9 (Planned)",
      feature: "FEAT-008",
      title: isPt ? "API e Banco de Dados Opcional" : "Optional API and Database",
      status: "Planned",
      completed: false,
      items: isPt ? ["API REST e PostgreSQL em ambiente separado","Testes de integração e migrações"] : ["REST API and PostgreSQL in a separate environment","Integration tests and migrations"],
    },
    {
      version: "v1.0 (Planned)",
      feature: "FEAT-009",
      title: isPt ? "Release Verificada" : "Verified Release",
      status: "Planned",
      completed: false,
      items: isPt ? ["Acessibilidade, segurança e testes E2E","Evidências e aprovação humana"] : ["Accessibility, security and end-to-end tests","Evidence and human approval"],
    },
    {
      version: "v1.1 (Exploratory)",
      feature: "FEAT-010",
      title: isPt ? "Assistente Educacional de IA" : "AI Academic Assistant",
      status: "Planned",
      completed: false,
      items: isPt ? ["Sugestões de atividades com revisão humana","Avaliação e privacidade desde a concepção"] : ["Instructor-reviewed activity suggestions","Evaluation and privacy by design"],
    },
  ];

  return (
    <>
      <section className="hero-banner">
        <div>
          <div className="hero-kicker">
            <Map size={16} aria-hidden="true" />
            <span>SPECTION Academic Lab Roadmap</span>
          </div>
          <h2 className="hero-title">
            {isPt ? 'Evolucao Incremental do Projeto' : 'Incremental Project Evolution'}
          </h2>
          <p className="hero-description">
            {isPt
              ? 'Transparencia de engenharia: diferenciamos claramente o que ja foi implementado e verificado por testes automatizados do que esta planejado para os proximos incrementos.'
              : 'Engineering transparency: we strictly distinguish between features that are implemented and verified by automated tests and modules that are planned for future increments.'}
          </p>
        </div>
        <a
          href="https://github.com/alexsandsouza/spection-academic-lab/blob/main/docs/roadmap.md"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
        >
          <span>docs/roadmap.md</span>
          <ExternalLink size={15} aria-hidden="true" />
        </a>
      </section>

      <div className="timeline">
        {milestones.map((ms) => (
          <section key={ms.version} className="card">
            <div className="card-header">
              <span className="code-pill">
                {ms.version} - {ms.feature}
              </span>
              {ms.completed ? (
                <span className="status-badge status-tests-passed">
                  <CheckCircle2 size={12} aria-hidden="true" />
                  {ms.status}
                </span>
              ) : (
                <span className="badge-planned">
                  <Clock size={11} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
                  {ms.status}
                </span>
              )}
            </div>
            <h3 className="card-title" style={{ marginBottom: '0.75rem' }}>
              {ms.title}
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--color-muted)', fontSize: '0.88rem' }}>
              {ms.items.map((item) => (
                <li key={item} style={{ marginBottom: '0.35rem' }}>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
