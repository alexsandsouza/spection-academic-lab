'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  BookOpen,
  Clock,
  HardDrive,
  PlusCircle,
  Database,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';
import { useAcademicLab } from '../lib/context/AcademicLabContext';
import { ENGINEERING_JOURNEY_STAGES } from '../lib/data/engineering';

export default function DashboardPage() {
  const { students, metrics, storageMode, loadDemoData, t } = useAcademicLab();
  const [seedFeedback, setSeedFeedback] = useState<string | null>(null);

  const handleLoadDemo = () => {
    loadDemoData();
    setSeedFeedback(t.dashboard.demoLoadedMessage);
  };

  const recentStudents = [...students]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <>
      <section className="hero-banner">
        <div>
          <div className="hero-kicker">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>{t.dashboard.kicker}</span>
          </div>
          <h2 className="hero-title">{t.dashboard.heroTitle}</h2>
          <p className="hero-description">{t.dashboard.heroDescription}</p>
        </div>
        <div className="hero-actions">
          <Link
            href="/students"
            className="btn btn-primary"
            data-testid="dashboard-register-cta"
          >
            <PlusCircle size={17} aria-hidden="true" />
            <span>{t.dashboard.ctaRegister}</span>
          </Link>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleLoadDemo}
            data-testid="dashboard-load-demo-btn"
          >
            <Database size={17} aria-hidden="true" />
            <span>{t.dashboard.ctaLoadDemo}</span>
          </button>
          <Link href="/documentation" className="btn btn-secondary">
            <span>{t.dashboard.ctaEngineering}</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {seedFeedback && (
        <div
          className="alert alert-success"
          role="status"
          aria-live="polite"
          data-testid="dashboard-seed-alert"
        >
          <span>{seedFeedback}</span>
        </div>
      )}

      <section className="metrics-grid" aria-label="Academic Dashboard Indicators">
        <article className="metric-card" data-testid="metric-total-students">
          <div className="metric-top">
            <span>{t.dashboard.cards.totalStudents}</span>
            <Users size={18} color="var(--color-primary)" aria-hidden="true" />
          </div>
          <div className="metric-value" data-testid="metric-total-students-value">
            {metrics.totalStudents}
          </div>
          <div className="metric-meta">{t.dashboard.cards.totalStudentsMeta}</div>
        </article>

        <article className="metric-card" data-testid="metric-courses-represented">
          <div className="metric-top">
            <span>{t.dashboard.cards.coursesRepresented}</span>
            <BookOpen size={18} color="var(--color-accent)" aria-hidden="true" />
          </div>
          <div className="metric-value" data-testid="metric-courses-value">
            {metrics.totalCoursesRepresented}
          </div>
          <div className="metric-meta">{t.dashboard.cards.coursesRepresentedMeta}</div>
        </article>

        <article className="metric-card" data-testid="metric-latest-registration">
          <div className="metric-top">
            <span>{t.dashboard.cards.latestRegistration}</span>
            <Clock size={18} color="var(--color-success)" aria-hidden="true" />
          </div>
          <div
            className="metric-value"
            style={{ fontSize: '1.25rem' }}
            data-testid="metric-latest-value"
          >
            {metrics.latestStudent
              ? `${metrics.latestStudent.code} - ${metrics.latestStudent.name}`
              : t.dashboard.cards.latestRegistrationEmpty}
          </div>
          <div className="metric-meta">
            {metrics.latestStudent ? metrics.latestStudent.course : 'DEMO-0001..DEMO-9999'}
          </div>
        </article>

        <article className="metric-card" data-testid="metric-storage-mode">
          <div className="metric-top">
            <span>{t.dashboard.cards.storageMode}</span>
            <HardDrive size={18} color="var(--color-warning)" aria-hidden="true" />
          </div>
          <div
            className="metric-value"
            style={{ fontSize: '1.2rem' }}
            data-testid="metric-storage-value"
          >
            {storageMode === 'local'
              ? t.dashboard.cards.storageModeLocal
              : t.dashboard.cards.storageModeMemory}
          </div>
          <div className="metric-meta">
            {storageMode === 'local'
              ? t.dashboard.cards.storageModeMetaLocal
              : t.dashboard.cards.storageModeMetaMemory}
          </div>
        </article>
      </section>

      <div className="two-col-grid">
        <section className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">{t.dashboard.recentTitle}</h3>
              <p className="card-subtitle">{t.dashboard.recentSubtitle}</p>
            </div>
            <Link href="/students" className="btn btn-secondary btn-sm">
              <span>{t.dashboard.viewAllStudents}</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          {recentStudents.length === 0 ? (
            <div className="empty-state" data-testid="dashboard-empty-state">
              <Users size={32} color="var(--color-muted)" aria-hidden="true" />
              <h4 style={{ margin: 0 }}>{t.dashboard.emptyStateTitle}</h4>
              <p style={{ margin: 0, color: 'var(--color-muted)', maxWidth: '420px' }}>
                {t.dashboard.emptyStateDesc}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <Link href="/students" className="btn btn-primary btn-sm">
                  {t.dashboard.ctaRegister}
                </Link>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleLoadDemo}
                >
                  {t.dashboard.ctaLoadDemo}
                </button>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.students.tableCode}</th>
                    <th>{t.students.tableName}</th>
                    <th>{t.students.tableCourse}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.map((stu) => (
                    <tr key={stu.id}>
                      <td>
                        <span className="code-pill">{stu.code}</span>
                      </td>
                      <td>{stu.name}</td>
                      <td>
                        <span className="course-pill">{stu.course}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="card" data-testid="dashboard-distribution-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">{t.dashboard.distributionTitle}</h3>
              <p className="card-subtitle">{t.dashboard.distributionSubtitle}</p>
            </div>
          </div>

          <div className="chart-list">
            {metrics.courseDistribution.map((item) => (
              <div key={item.course} className="chart-row">
                <div className="chart-row-header">
                  <span>{item.course}</span>
                  <strong>
                    {item.count} ({item.percentage}%)
                  </strong>
                </div>
                <div className="chart-bar-track" aria-hidden="true">
                  <div
                    className="chart-bar-fill"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="two-col-grid">
        <section className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">{t.dashboard.progressTitle}</h3>
              <p className="card-subtitle">{t.dashboard.progressSubtitle}</p>
            </div>
            <Link href="/roadmap" className="btn btn-ghost btn-sm">
              Roadmap <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                <strong>FEAT-001</strong> - Python 3 &amp; SQLite Student Registry Baseline
              </span>
              <span className="status-badge status-tests-passed">Tests Passed</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                <strong>FEAT-WEB-001</strong> - Web Application, Dashboard, CRUD &amp; Privacy
              </span>
              <span className="status-badge status-tests-passed">Tests Passed</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                <strong>FEAT-002 (v0.2)</strong> - Courses &amp; Enrollment Relational Module
              </span>
              <span className="badge-planned">{t.nav.plannedBadge}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                <strong>FEAT-003 (v0.4)</strong> - Authentication &amp; Authorization Threat Model
              </span>
              <span className="badge-planned">{t.nav.plannedBadge}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                <strong>FEAT-004 (v0.5)</strong> - Academic Activities &amp; Gradebook Sandbox
              </span>
              <span className="badge-planned">{t.nav.plannedBadge}</span>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">{t.dashboard.evidenceTitle}</h3>
              <p className="card-subtitle">{t.dashboard.evidenceSubtitle}</p>
            </div>
            <Link href="/documentation" className="btn btn-ghost btn-sm">
              Engineering Journey <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {ENGINEERING_JOURNEY_STAGES.slice(0, 4).map((stage) => (
              <a
                key={stage.id}
                href={stage.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="timeline-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.88rem' }}>{stage.title}</strong>
                  <FileCheck2 size={16} color="var(--color-primary)" />
                </div>
                <span style={{ fontSize: '0.76rem', color: 'var(--color-muted)' }}>
                  {stage.artifactPath}
                </span>
                <span className="status-badge status-implemented">
                  <CheckCircle2 size={12} /> {stage.status}
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
