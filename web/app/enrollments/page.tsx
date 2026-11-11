'use client';

import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Database,
  Download,
  Layers,
  Save,
  Search,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import {
  ACADEMIC_TERMS,
  AcademicErrorKey,
  ENROLLMENT_STATUSES,
  Enrollment,
  EnrollmentStatus,
  exportEnrollmentsToCsv,
  nextEnrollmentCode,
} from '../../lib/domain/academic';
import { useAcademicLab } from '../../lib/context/AcademicLabContext';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export default function EnrollmentsPage() {
  const {
    students,
    courses,
    enrollments,
    registerEnrollment,
    changeEnrollmentStatus,
    removeEnrollment,
    loadDemoData,
    t,
  } = useAcademicLab();

  const [code, setCode] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [courseId, setCourseId] = useState<string>('');
  const [term, setTerm] = useState<string>(ACADEMIC_TERMS[0]);
  const [status, setStatus] = useState<string>('ACTIVE');

  const [errorKey, setErrorKey] = useState<AcademicErrorKey | null>(null);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [enrollmentToDelete, setEnrollmentToDelete] = useState<Enrollment | null>(
    null
  );

  const filteredEnrollments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return enrollments.filter((enr) => {
      if (statusFilter !== 'ALL' && enr.status !== statusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        enr.code.toLowerCase().includes(q) ||
        enr.studentCode.toLowerCase().includes(q) ||
        enr.studentName.toLowerCase().includes(q) ||
        enr.courseCode.toLowerCase().includes(q) ||
        enr.courseTitle.toLowerCase().includes(q) ||
        enr.term.toLowerCase().includes(q)
      );
    });
  }, [enrollments, searchQuery, statusFilter]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorKey(null);
    setBannerMessage(null);

    const res = registerEnrollment({
      code: code.trim() || nextEnrollmentCode(enrollments),
      studentId: studentId || (students[0]?.id ?? ''),
      courseId: courseId || (courses[0]?.id ?? ''),
      term,
      status,
    });

    if (!res.ok) {
      setErrorKey(res.errorKey ?? 'ENROLLMENT_CODE_INVALID');
      return;
    }

    setCode('');
    setBannerMessage(t.enrollments.successCreated);
  };

  const handleConfirmDelete = () => {
    if (!enrollmentToDelete) return;
    removeEnrollment(enrollmentToDelete.id);
    setEnrollmentToDelete(null);
    setBannerMessage(t.enrollments.successDeleted);
  };

  const handleExportCsv = () => {
    const csv = exportEnrollmentsToCsv(filteredEnrollments);
    if (typeof window !== 'undefined' && typeof Blob !== 'undefined') {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'spection-synthetic-enrollments.csv');
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
      </div>

      <section className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">{t.enrollments.formTitle}</h2>
            <p className="card-subtitle">{t.enrollments.pageSubtitle}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                loadDemoData();
                setBannerMessage(t.students.successDemoLoaded);
              }}
              data-testid="enrollments-load-demo-btn"
            >
              <Database size={15} aria-hidden="true" />
              {t.students.loadDemoButton}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleExportCsv}
              disabled={enrollments.length === 0}
              data-testid="enrollments-export-csv-btn"
            >
              <Download size={15} aria-hidden="true" />
              {t.students.exportCsvButton}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div
            className="form-grid"
            style={{ gridTemplateColumns: '0.9fr 1.3fr 1.3fr 0.8fr 0.9fr auto' }}
          >
            <div className="form-field">
              <label htmlFor="enrollment-code-input" className="form-label">
                {t.enrollments.codeLabel}
              </label>
              <input
                id="enrollment-code-input"
                type="text"
                className="form-input"
                placeholder={nextEnrollmentCode(enrollments)}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                data-testid="enrollment-code-input"
              />
              <span className="field-hint">{t.enrollments.codeHint}</span>
            </div>

            <div className="form-field">
              <label htmlFor="enrollment-student-select" className="form-label">
                {t.enrollments.studentLabel}
              </label>
              <select
                id="enrollment-student-select"
                className="form-select"
                value={studentId || (students[0]?.id ?? '')}
                onChange={(e) => setStudentId(e.target.value)}
                data-testid="enrollment-student-select"
              >
                <option value="">{t.enrollments.studentPlaceholder}</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="enrollment-course-select" className="form-label">
                {t.enrollments.courseLabel}
              </label>
              <select
                id="enrollment-course-select"
                className="form-select"
                value={courseId || (courses[0]?.id ?? '')}
                onChange={(e) => setCourseId(e.target.value)}
                data-testid="enrollment-course-select"
              >
                <option value="">{t.enrollments.coursePlaceholder}</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="enrollment-term-select" className="form-label">
                {t.enrollments.termLabel}
              </label>
              <select
                id="enrollment-term-select"
                className="form-select"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                data-testid="enrollment-term-select"
              >
                {ACADEMIC_TERMS.map((tm) => (
                  <option key={tm} value={tm}>
                    {tm}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="enrollment-status-select" className="form-label">
                {t.enrollments.statusLabel}
              </label>
              <select
                id="enrollment-status-select"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                data-testid="enrollment-status-select"
              >
                {ENROLLMENT_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="form-field"
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: '1.45rem',
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                data-testid="enrollment-submit-btn"
              >
                <Save size={16} aria-hidden="true" />
                {t.enrollments.saveButton}
              </button>
            </div>
          </div>

          {errorKey && (
            <div
              className="alert alert-error"
              role="alert"
              style={{ marginTop: '1rem' }}
              data-testid="enrollment-error-alert"
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
              data-testid="enrollment-success-alert"
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
                placeholder={t.enrollments.searchPlaceholder}
                aria-label={t.enrollments.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="enrollments-search-input"
              />
            </div>

            <select
              className="form-select"
              style={{ width: 'auto' }}
              aria-label={t.enrollments.statusLabel}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              data-testid="enrollments-status-filter"
            >
              <option value="ALL">{t.enrollments.filterStatusAll}</option>
              {ENROLLMENT_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {enrollments.length === 0 ? (
          <div className="empty-state" data-testid="enrollments-empty-state">
            <Layers size={32} color="var(--color-muted)" aria-hidden="true" />
            <h3 style={{ margin: 0 }}>{t.enrollments.emptyTitle}</h3>
            <p style={{ margin: 0, color: 'var(--color-muted)' }}>
              {t.enrollments.emptyDesc}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table" data-testid="enrollments-table">
              <thead>
                <tr>
                  <th>{t.enrollments.codeLabel}</th>
                  <th>{t.enrollments.studentLabel}</th>
                  <th>{t.enrollments.courseLabel}</th>
                  <th>{t.enrollments.termLabel}</th>
                  <th>{t.enrollments.statusLabel}</th>
                  <th>{t.students.tableActions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.map((enr) => (
                  <tr key={enr.id} data-testid={`enrollment-row-${enr.code}`}>
                    <td>
                      <span className="code-pill">{enr.code}</span>
                    </td>
                    <td>
                      <strong>{enr.studentCode}</strong> - {enr.studentName}
                    </td>
                    <td>
                      <strong>{enr.courseCode}</strong> - {enr.courseTitle}
                    </td>
                    <td>{enr.term}</td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '0.28rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                        aria-label={`Status for ${enr.code}`}
                        value={enr.status}
                        onChange={(e) => {
                          changeEnrollmentStatus(
                            enr.id,
                            e.target.value as EnrollmentStatus
                          );
                          setBannerMessage(t.enrollments.successUpdated);
                        }}
                        data-testid={`status-enrollment-${enr.code}`}
                      >
                        {ENROLLMENT_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => setEnrollmentToDelete(enr)}
                        data-testid={`delete-enrollment-${enr.code}`}
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
        open={Boolean(enrollmentToDelete)}
        title={t.enrollments.deleteConfirmTitle}
        description={
          enrollmentToDelete
            ? `${t.enrollments.deleteConfirmBody} (${enrollmentToDelete.code})`
            : t.enrollments.deleteConfirmBody
        }
        confirmLabel={t.students.confirmYes}
        cancelLabel={t.students.confirmCancel}
        onConfirm={handleConfirmDelete}
        onCancel={() => setEnrollmentToDelete(null)}
      />
    </>
  );
}
