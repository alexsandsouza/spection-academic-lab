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
            '5 testes automatizados em tests/test_students.py',
            '9 Agent Skills locais em .agents/skills/',
          ]
        : [
            'Zero-dependency students.py module with in-memory SQLite default',
            'DEMO-0001 normalization, name bounds (2-80), and parameterized SQL',
            '5 automated unit tests in tests/test_students.py',
            '9 local SPECTION Agent Skills in .agents/skills/',
          ],
    },
    {
      version: 'v0.3 (Current)',
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
      version: 'v0.2 (Next)',
      feature: 'FEAT-002',
      title: isPt
        ? 'Disciplinas, Cursos e Restricoes Relacionais de Matricula'
        : 'Courses, Curricula, and Enrollment Relational Constraints',
      status: 'Planned',
      completed: false,
      items: isPt
        ? [
            'Cadastro dedicado de disciplinas com carga horaria e pre-requisitos',
            'Vinculo relacional entre estudantes ficticios e turmas demonstrativas',
          ]
        : [
            'Dedicated course entity management with credit hours and prerequisites',
            'Relational enrollment constraints between synthetic students and classes',
          ],
    },
    {
      version: 'v0.4',
      feature: 'FEAT-003',
      title: isPt
        ? 'Arquitetura de Autenticacao, Autorizacao (RBAC) e Threat Model'
        : 'Authentication, Authorization (RBAC) Design, and Threat Model',
      status: 'Planned',
      completed: false,
      items: isPt
        ? [
            'Modelagem de ameacas STRIDE para cenarios multi-usuario',
            'Simulacao de perfis (Secretaria, Docente, Estudante) com controle de acesso',
          ]
        : [
            'Formal STRIDE threat model for multi-user web architecture',
            'Role-based access control simulation (Registrar, Professor, Student)',
          ],
    },
    {
      version: 'v0.5',
      feature: 'FEAT-004',
      title: isPt
        ? 'Atividades Academicas e Simulacao de Avaliacoes Sinteticas'
        : 'Academic Activities, Assignments, and Synthetic Gradebook',
      status: 'Planned',
      completed: false,
      items: isPt
        ? [
            'Lancamento de atividades demonstrativas e calculo de indicadores',
            'Relatorios exportaveis e auditoria de regras de aprovacao',
          ]
        : [
            'Synthetic assignment submissions and academic performance indicators',
            'Exportable audit reports and grading rule verification',
          ],
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
