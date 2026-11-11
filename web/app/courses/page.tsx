'use client';

import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Database,
  Download,
  Edit3,
  Save,
  Search,
  ShieldAlert,
  Trash2,
  XCircle,
  CheckCircle2,
} from 'lucide-react';
import { DEMO_COURSES } from '../../lib/domain/students';
import {
  AcademicErrorKey,
  CourseItem,
  exportCoursesToCsv,
} from '../../lib/domain/academic';
import { useAcademicLab } from '../../lib/context/AcademicLabContext';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export default function CoursesPage() {
  const {
    courses,
    registerCourse,
    editCourse,
    removeCourse,
    loadDemoData,
    t,
  } = useAcademicLab();

  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [code, setCode] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [program, setProgram] = useState<string>(DEMO_COURSES[0]);
  const [workloadHours, setWorkloadHours] = useState<string>('60');

  const [errorKey, setErrorKey] = useState<AcademicErrorKey | null>(null);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [courseToDelete, setCourseToDelete] = useState<CourseItem | null>(null);

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.program.toLowerCase().includes(q)
    );
  }, [courses, searchQuery]);

  const startEdit = (course: CourseItem) => {
    setEditingCourse(course);
    setCode(course.code);
    setTitle(course.title);
    setProgram(course.program);
    setWorkloadHours(String(course.workloadHours));
    setErrorKey(null);
    setBannerMessage(null);
  };

  const resetForm = () => {
    setEditingCourse(null);
    setCode('');
    setTitle('');
    setProgram(DEMO_COURSES[0]);
    setWorkloadHours('60');
    setErrorKey(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorKey(null);
    setBannerMessage(null);

    const payload = {
      code,
      title,
      program,
      workloadHours: Number(workloadHours),
    };

    if (editingCourse) {
      const res = editCourse(editingCourse.id, payload);
      if (!res.ok) {
        setErrorKey(res.errorKey ?? 'COURSE_CODE_INVALID');
        return;
      }
      resetForm();
      setBannerMessage(t.courses.successUpdated);
    } else {
      const res = registerCourse(payload);
      if (!res.ok) {
        setErrorKey(res.errorKey ?? 'COURSE_CODE_INVALID');
        return;
      }
      resetForm();
      setBannerMessage(t.courses.successCreated);
    }
  };

  const handleConfirmDelete = () => {
    if (!courseToDelete) return;
    setErrorKey(null);
    const res = removeCourse(courseToDelete.id);
    setCourseToDelete(null);
    if (!res.ok) {
      setErrorKey(res.errorKey ?? 'COURSE_HAS_ENROLLMENTS');
      return;
    }
    if (editingCourse?.id === courseToDelete.id) {
      resetForm();
    }
    setBannerMessage(t.courses.successDeleted);
  };

  const handleExportCsv = () => {
    const csv = exportCoursesToCsv(filteredCourses);
    if (typeof window !== 'undefined' && typeof Blob !== 'undefined') {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'spection-synthetic-courses.csv');
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
            <h2 className="card-title">
              {editingCourse ? t.courses.formEditTitle : t.courses.formCreateTitle}
            </h2>
            <p className="card-subtitle">{t.courses.pageSubtitle}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                loadDemoData();
                setBannerMessage(t.students.successDemoLoaded);
              }}
              data-testid="courses-load-demo-btn"
            >
              <Database size={15} aria-hidden="true" />
              {t.students.loadDemoButton}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleExportCsv}
              disabled={courses.length === 0}
              data-testid="courses-export-csv-btn"
            >
              <Download size={15} aria-hidden="true" />
              {t.students.exportCsvButton}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-field form-col-2">
              <label htmlFor="course-code-input" className="form-label">
                {t.courses.codeLabel}
              </label>
              <input
                id="course-code-input"
                type="text"
                className="form-input"
                placeholder={t.courses.codePlaceholder}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                data-testid="course-code-input"
              />
              <span className="field-hint">{t.courses.codeHint}</span>
            </div>

            <div className="form-field form-col-4">
              <label htmlFor="course-title-input" className="form-label">
                {t.courses.titleLabel}
              </label>
              <input
                id="course-title-input"
                type="text"
                className="form-input"
                placeholder={t.courses.titlePlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                data-testid="course-title-input"
              />
              <span className="field-hint">{t.courses.titleHint}</span>
            </div>

            <div className="form-field form-col-2">
              <label htmlFor="course-program-select" className="form-label">
                {t.courses.programLabel}
              </label>
              <select
                id="course-program-select"
                className="form-select"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                data-testid="course-program-select"
              >
                {DEMO_COURSES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field form-col-2">
              <label htmlFor="course-workload-input" className="form-label">
                {t.courses.workloadLabel}
              </label>
              <input
                id="course-workload-input"
                type="number"
                min={15}
                max={240}
                className="form-input"
                value={workloadHours}
                onChange={(e) => setWorkloadHours(e.target.value)}
                data-testid="course-workload-input"
              />
              <span className="field-hint">{t.courses.workloadHint}</span>
            </div>

            <div className="form-field form-col-2 form-actions-cell">
              <button
                type="submit"
                className="btn btn-primary"
                style={{ height: '42px' }}
                data-testid="course-submit-btn"
              >
                <Save size={16} aria-hidden="true" />
                {editingCourse ? t.courses.updateButton : t.courses.saveButton}
              </button>
              {editingCourse && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ height: '42px' }}
                  onClick={resetForm}
                >
                  <XCircle size={16} aria-hidden="true" />
                  {t.courses.cancelEditButton}
                </button>
              )}
            </div>
          </div>

          {errorKey && (
            <div
              className="alert alert-error"
              role="alert"
              style={{ marginTop: '1rem' }}
              data-testid="course-error-alert"
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
              data-testid="course-success-alert"
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
                placeholder={t.courses.searchPlaceholder}
                aria-label={t.courses.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="courses-search-input"
              />
            </div>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="empty-state" data-testid="courses-empty-state">
            <BookOpen size={32} color="var(--color-muted)" aria-hidden="true" />
            <h3 style={{ margin: 0 }}>{t.courses.emptyTitle}</h3>
            <p style={{ margin: 0, color: 'var(--color-muted)' }}>{t.courses.emptyDesc}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table" data-testid="courses-table">
              <thead>
                <tr>
                  <th>{t.courses.codeLabel}</th>
                  <th>{t.courses.titleLabel}</th>
                  <th>{t.courses.programLabel}</th>
                  <th>{t.courses.workloadLabel}</th>
                  <th>{t.students.tableActions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((crs) => (
                  <tr key={crs.id} data-testid={`course-row-${crs.code}`}>
                    <td>
                      <span className="code-pill">{crs.code}</span>
                    </td>
                    <td>{crs.title}</td>
                    <td>
                      <span className="course-pill">{crs.program}</span>
                    </td>
                    <td>{crs.workloadHours}h</td>
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => startEdit(crs)}
                          data-testid={`edit-course-${crs.code}`}
                        >
                          <Edit3 size={14} aria-hidden="true" />
                          {t.students.editAction}
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setCourseToDelete(crs)}
                          data-testid={`delete-course-${crs.code}`}
                        >
                          <Trash2 size={14} aria-hidden="true" />
                          {t.students.deleteAction}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(courseToDelete)}
        title={t.courses.deleteConfirmTitle}
        description={
          courseToDelete
            ? `${t.courses.deleteConfirmBody} (${courseToDelete.code} - ${courseToDelete.title})`
            : t.courses.deleteConfirmBody
        }
        confirmLabel={t.students.confirmYes}
        cancelLabel={t.students.confirmCancel}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCourseToDelete(null)}
      />
    </>
  );
}
