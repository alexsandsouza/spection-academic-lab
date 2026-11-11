'use client';

import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ClipboardCheck,
  Database,
  Download,
  Save,
  Search,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import {
  ACTIVITY_CATEGORIES,
  ACTIVITY_STATUSES,
  AcademicActivity,
  AcademicErrorKey,
  ActivityStatus,
  exportActivitiesToCsv,
  nextActivityCode,
} from '../../lib/domain/academic';
import { useAcademicLab } from '../../lib/context/AcademicLabContext';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export default function ActivitiesPage() {
  const {
    enrollments,
    activities,
    suiteSummary,
    registerActivity,
    editActivityScore,
    removeActivity,
    loadDemoData,
    t,
  } = useAcademicLab();

  const [code, setCode] = useState<string>('');
  const [enrollmentId, setEnrollmentId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>(ACTIVITY_CATEGORIES[0]);
  const [score, setScore] = useState<string>('90');
  const [status, setStatus] = useState<string>('GRADED');

  const [errorKey, setErrorKey] = useState<AcademicErrorKey | null>(null);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [activityToDelete, setActivityToDelete] =
    useState<AcademicActivity | null>(null);

  const filteredActivities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return activities.filter((act) => {
      if (categoryFilter !== 'ALL' && act.category !== categoryFilter) {
        return false;
      }
      if (!q) return true;
      return (
        act.code.toLowerCase().includes(q) ||
        act.title.toLowerCase().includes(q) ||
        act.studentCode.toLowerCase().includes(q) ||
        act.studentName.toLowerCase().includes(q) ||
        act.courseCode.toLowerCase().includes(q) ||
        act.courseTitle.toLowerCase().includes(q)
      );
    });
  }, [activities, searchQuery, categoryFilter]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorKey(null);
    setBannerMessage(null);

    const res = registerActivity({
      code: code.trim() || nextActivityCode(activities),
      enrollmentId: enrollmentId || (enrollments[0]?.id ?? ''),
      title,
      category,
      score: Number(score),
      status,
    });

    if (!res.ok) {
      setErrorKey(res.errorKey ?? 'ACTIVITY_CODE_INVALID');
      return;
    }

    setCode('');
    setTitle('');
    setScore('90');
    setBannerMessage(t.activities.successCreated);
  };

  const handleConfirmDelete = () => {
    if (!activityToDelete) return;
    removeActivity(activityToDelete.id);
    setActivityToDelete(null);
    setBannerMessage(t.activities.successDeleted);
  };

  const handleExportCsv = () => {
    const csv = exportActivitiesToCsv(filteredActivities);
    if (typeof window !== 'undefined' && typeof Blob !== 'undefined') {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'spection-synthetic-activities.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      <div className="alert alert-warning" role="note">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={18} aria-hidden="true" />
          {t.students.fictionalNotice}
        </span>
        <strong data-testid="activities-average-badge">
          Avg Score: {suiteSummary.averageScore} / 100
        </strong>
      </div>

      <section className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">{t.activities.formTitle}</h2>
            <p className="card-subtitle">{t.activities.pageSubtitle}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                loadDemoData();
                setBannerMessage(t.students.successDemoLoaded);
              }}
              data-testid="activities-load-demo-btn"
            >
              <Database size={15} aria-hidden="true" />
              {t.students.loadDemoButton}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleExportCsv}
              disabled={activities.length === 0}
              data-testid="activities-export-csv-btn"
            >
              <Download size={15} aria-hidden="true" />
              {t.students.exportCsvButton}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-field form-col-3">
              <label htmlFor="activity-code-input" className="form-label">
                {t.activities.codeLabel}
              </label>
              <input
                id="activity-code-input"
                type="text"
                className="form-input"
                placeholder={nextActivityCode(activities)}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                data-testid="activity-code-input"
              />
              <span className="field-hint">{t.activities.codeHint}</span>
            </div>

            <div className="form-field form-col-4">
              <label htmlFor="activity-enrollment-select" className="form-label">
                {t.activities.enrollmentLabel}
              </label>
              <select
                id="activity-enrollment-select"
                className="form-select"
                value={enrollmentId || (enrollments[0]?.id ?? '')}
                onChange={(e) => setEnrollmentId(e.target.value)}
                data-testid="activity-enrollment-select"
              >
                <option value="">{t.activities.enrollmentPlaceholder}</option>
                {enrollments.map((enr) => (
                  <option key={enr.id} value={enr.id}>
                    {enr.code}: {enr.studentCode} / {enr.courseCode} ({enr.term})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field form-col-5">
              <label htmlFor="activity-title-input" className="form-label">
                {t.activities.titleLabel}
              </label>
              <input
                id="activity-title-input"
                type="text"
                className="form-input"
                placeholder={t.activities.titlePlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                data-testid="activity-title-input"
              />
            </div>

            <div className="form-field form-col-3">
              <label htmlFor="activity-category-select" className="form-label">
                {t.activities.categoryLabel}
              </label>
              <select
                id="activity-category-select"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                data-testid="activity-category-select"
              >
                {ACTIVITY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field form-col-3">
              <label htmlFor="activity-score-input" className="form-label">
                {t.activities.scoreLabel}
              </label>
              <input
                id="activity-score-input"
                type="number"
                min={0}
                max={100}
                className="form-input"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                data-testid="activity-score-input"
              />
            </div>

            <div className="form-field form-col-3">
              <label htmlFor="activity-status-select" className="form-label">
                {t.activities.statusLabel}
              </label>
              <select
                id="activity-status-select"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                data-testid="activity-status-select"
              >
                {ACTIVITY_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field form-col-3 form-actions-cell">
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', height: '42px' }}
                data-testid="activity-submit-btn"
              >
                <Save size={16} aria-hidden="true" />
                {t.activities.saveButton}
              </button>
            </div>
          </div>

          {errorKey && (
            <div
              className="alert alert-error"
              role="alert"
              style={{ marginTop: '1rem' }}
              data-testid="activity-error-alert"
            >
              <span>{t.academicErrors[errorKey]}</span>
            </div>
          )}

          {bannerMessage && (
            <div
              className="alert alert-success"
              role="status"
              aria-live="polite"
              style={{ marginTop: '1rem' }}
              data-testid="activity-success-alert"
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} aria-hidden="true" />
                {bannerMessage}
              </span>
            </div>
          )}
        </form>
      </section>

      <section className="card">
        <div className="table-toolbar">
          <div className="toolbar-filters">
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-muted)',
                }}
                aria-hidden="true"
              />
              <input
                type="search"
                className="form-input"
                style={{ paddingLeft: '2.2rem' }}
                placeholder={t.activities.searchPlaceholder}
                aria-label={t.activities.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="activities-search-input"
              />
            </div>

            <select
              className="form-select"
              style={{ width: 'auto' }}
              aria-label={t.activities.categoryLabel}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              data-testid="activities-category-filter"
            >
              <option value="ALL">{t.activities.filterCategoryAll}</option>
              {ACTIVITY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activities.length === 0 ? (
          <div className="empty-state" data-testid="activities-empty-state">
            <ClipboardCheck size={32} color="var(--color-muted)" aria-hidden="true" />
            <h3 style={{ margin: 0 }}>{t.activities.emptyTitle}</h3>
            <p style={{ margin: 0, color: 'var(--color-muted)' }}>
              {t.activities.emptyDesc}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table" data-testid="activities-table">
              <thead>
                <tr>
                  <th>{t.activities.codeLabel}</th>
                  <th>{t.activities.titleLabel}</th>
                  <th>{t.enrollments.studentLabel}</th>
                  <th>{t.enrollments.courseLabel}</th>
                  <th>{t.activities.categoryLabel}</th>
                  <th>{t.activities.scoreLabel}</th>
                  <th>{t.activities.statusLabel}</th>
                  <th>{t.students.tableActions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map((act) => (
                  <tr key={act.id} data-testid={`activity-row-${act.code}`}>
                    <td className="cell-nowrap">
                      <span className="code-pill">{act.code}</span>
                    </td>
                    <td>{act.title}</td>
                    <td>
                      <div className="cell-entity">
                        <span className="cell-entity-code">{act.studentCode}</span>
                        <span className="cell-entity-name">{act.studentName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="cell-entity">
                        <span className="cell-entity-code">{act.courseCode}</span>
                        <span className="cell-entity-name">{act.courseTitle}</span>
                      </div>
                    </td>
                    <td className="cell-nowrap">
                      <span className="course-pill">{act.category}</span>
                    </td>
                    <td className="cell-nowrap">
                      <strong>{act.score}</strong> / {act.maxScore}
                    </td>
                    <td className="cell-nowrap">
                      <select
                        className="form-select"
                        style={{ height: '34px', lineHeight: '32px', padding: '0 0.55rem', fontSize: '0.8rem', width: '132px' }}
                        aria-label={`Status for ${act.code}`}
                        value={act.status}
                        onChange={(e) => {
                          editActivityScore(
                            act.id,
                            act.score,
                            e.target.value as ActivityStatus
                          );
                          setBannerMessage(t.activities.successUpdated);
                        }}
                        data-testid={`status-activity-${act.code}`}
                      >
                        {ACTIVITY_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="cell-nowrap">
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setActivityToDelete(act)}
                        data-testid={`delete-activity-${act.code}`}
                      >
                        <Trash2 size={14} aria-hidden="true" />
                        {t.students.deleteAction}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(activityToDelete)}
        title={t.activities.deleteConfirmTitle}
        description={
          activityToDelete
            ? `${t.activities.deleteConfirmBody} (${activityToDelete.code} - ${activityToDelete.title})`
            : t.activities.deleteConfirmBody
        }
        confirmLabel={t.students.confirmYes}
        cancelLabel={t.students.confirmCancel}
        onConfirm={handleConfirmDelete}
        onCancel={() => setActivityToDelete(null)}
      />
    </>
  );
}
