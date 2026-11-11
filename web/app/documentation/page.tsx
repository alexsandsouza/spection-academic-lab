'use client';

import React from 'react';
import {
  FileCode2,
  ExternalLink,
  CheckCircle2,
  GitBranch,
  Layers,
} from 'lucide-react';
import { useAcademicLab } from '../../lib/context/AcademicLabContext';
import {
  ENGINEERING_JOURNEY_STAGES,
  TRACEABILITY_ITEMS,
} from '../../lib/data/engineering';

export default function DocumentationPage() {
  const { locale } = useAcademicLab();
  const isPt = locale === 'pt';

  return (
    <>
      <section className="hero-banner">
        <div>
          <div className="hero-kicker">
            <GitBranch size={16} aria-hidden="true" />
            <span>SPECTION Engineering View</span>
          </div>
          <h2 className="hero-title">Engineering Journey &amp; SDD Traceability</h2>
          <p className="hero-description">
            {isPt
              ? 'Diferencial do SPECTION Academic Lab: acompanhe as 10 etapas verificaveis do ciclo Spec-Driven Development (SDD), com links diretos para os artefatos reais do repositorio e matriz de rastreabilidade.'
              : 'What sets SPECTION Academic Lab apart: inspect all 10 verifiable stages of the Spec-Driven Development (SDD) lifecycle with direct links to repository artifacts and requirements traceability.'}
          </p>
        </div>
      </section>

      <section className="card" data-testid="engineering-journey-section">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              10-Stage SPECTION Engineering Journey Timeline
            </h3>
            <p className="card-subtitle">
              {isPt
                ? 'Estados verificaveis baseados nos artefatos e testes realmente executados no repositorio'
                : 'Verifiable lifecycle states grounded in real repository artifacts and executed automated tests'}
            </p>
          </div>
        </div>

        <div className="timeline">
          {ENGINEERING_JOURNEY_STAGES.map((stage) => (
            <article
              key={stage.id}
              className="timeline-card"
              data-testid={`journey-stage-${stage.stepNumber}`}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span className="code-pill">
                    #{stage.stepNumber} {stage.title}
                  </span>
                  <span
                    className={`status-badge ${
                      stage.status === 'Tests Passed'
                        ? 'status-tests-passed'
                        : 'status-implemented'
                    }`}
                  >
                    <CheckCircle2 size={12} aria-hidden="true" />
                    {stage.status}
                  </span>
                </div>

                <p style={{ margin: '0.5rem 0', fontSize: '0.86rem', color: 'var(--color-muted)' }}>
                  {isPt ? stage.summaryPt : stage.summaryEn}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {stage.relatedIds.map((relId) => (
                    <span
                      key={relId}
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.12rem 0.45rem',
                        borderRadius: '4px',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {relId}
                    </span>
                  ))}
                </div>

                <a
                  href={stage.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'space-between' }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileCode2 size={14} aria-hidden="true" />
                    {stage.artifactPath}
                  </span>
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card" data-testid="traceability-matrix-section">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Layers size={18} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />
              {isPt
                ? 'Matriz Visual de Rastreabilidade (Requisitos -> Codigo -> Testes)'
                : 'Visual Traceability Matrix (Requirements -> Code -> Automated Tests)'}
            </h3>
            <p className="card-subtitle">
              {isPt
                ? 'Mapeamento direto entre RF/RNF, identificadores de funcionalidade, arquivos de implementacao e suites de verificacao'
                : 'Direct mapping between RF/RNF IDs, feature identifiers, implementation modules, and automated verification suites'}
            </p>
          </div>
          <a
            href="https://github.com/alexsandsouza/spection-academic-lab/blob/main/docs/traceability.md"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <span>docs/traceability.md</span>
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Requirement ID</th>
                <th>Feature</th>
                <th>{isPt ? 'Descricao' : 'Description'}</th>
                <th>{isPt ? 'Implementacao' : 'Implementation'}</th>
                <th>{isPt ? 'Testes Automatizados' : 'Automated Tests'}</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {TRACEABILITY_ITEMS.map((item) => (
                <tr key={item.reqId}>
                  <td>
                    <span className="code-pill">{item.reqId}</span>
                  </td>
                  <td>
                    <span className="course-pill">{item.featureId}</span>
                  </td>
                  <td>{isPt ? item.titlePt : item.titleEn}</td>
                  <td>
                    <code>{item.implementationRef}</code>
                  </td>
                  <td>
                    <code>{item.testRef}</code>
                  </td>
                  <td>
                    <span className="status-badge status-tests-passed">
                      <CheckCircle2 size={12} aria-hidden="true" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
