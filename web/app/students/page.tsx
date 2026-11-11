'use client';

import React, { useMemo, useState } from 'react';
import {
  Search,
  Download,
  Database,
  Trash2,
  Edit3,
  UserPlus,
  ShieldAlert,
} from 'lucide-react';
import {
  DEMO_COURSES,
  SortDirection,
  SortField,
  Student,
  exportStudentsToCsv,
  filterAndSortStudents,
} from '../../lib/domain/students';
import { useAcademicLab } from '../../lib/context/AcademicLabContext';
import { StudentForm } from '../../components/StudentForm';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export default function StudentsPage() {
  const {
    students,
    removeStudent,
    loadDemoData,
    clearAllStudents,
    t,
  } = useAcademicLab();

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [courseFilter, setCourseFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('code');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState<boolean>(false);

  const filteredStudents = useMemo(
    () =>
      filterAndSortStudents(
        students,
        searchQuery,
        courseFilter,
        sortField,
        sortDirection
      ),
    [students, searchQuery, courseFilter, sortField, sortDirection]
  );

  const handleLoadDemo = () => {
    loadDemoData();
    setBannerMessage(t.students.successDemoLoaded);
  };

  const handleExportCsv = () => {
    const csvContent = exportStudentsToCsv(filteredStudents);
    if (typeof window !== 'undefined' && typeof Blob !== 'undefined') {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'spection-synthetic-students.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      if (editingStudent?.id === studentToDelete.id) {
        setEditingStudent(null);
      }
      removeStudent(studentToDelete.id);
      setStudentToDelete(null);
      setBannerMessage(t.students.successDeleted);
    }
  };

  const handleConfirmClearAll = () => {
    setEditingStudent(null);
    clearAllStudents();
    setConfirmClearOpen(false);
    setBannerMessage(t.students.successCleared);
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
              {editingStudent ? t.students.formEditTitle : t.students.formCreateTitle}
            </h2>
            <p className="card-subtitle">{t.students.pageSubtitle}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleLoadDemo}
              data-testid="students-load-demo-btn"
            >
              <Database size={15} aria-hidden="true" />
              {t.students.loadDemoButton}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleExportCsv}
              disabled={students.length === 0}
              data-testid="students-export-csv-btn"
            >
              <Download size={15} aria-hidden="true" />
              {t.students.exportCsvButton}
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => setConfirmClearOpen(true)}
              disabled={students.length === 0}
              data-testid="students-clear-all-btn"
            >
              <Trash2 size={15} aria-hidden="true" />
              {t.students.clearLocalButton}
            </button>
          </div>
        </div>

        <StudentForm
          editingStudent={editingStudent}
          onCancelEdit={() => setEditingStudent(null)}
          onSuccess={(msg) => setBannerMessage(msg)}
        />
      </section>

      {bannerMessage && (
        <div
          className="alert alert-success"
          role="status"
          aria-live="polite"
          data-testid="students-action-feedback"
        >
          <span>{bannerMessage}</span>
        </div>
      )}

      <section className="card">
        <div className="table-toolbar">
          <div className="toolbar-filters">
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
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
                placeholder={t.students.searchPlaceholder}
                aria-label={t.students.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="students-search-input"
              />
            </div>

            <select
              className="form-select"
              style={{ width: 'auto' }}
              aria-label={t.students.courseLabel}
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              data-testid="students-course-filter"
            >
              <option value="ALL">{t.students.filterCourseAll}</option>
              {DEMO_COURSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              className="form-select"
              style={{ width: 'auto' }}
              aria-label={t.students.sortByLabel}
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              data-testid="students-sort-field"
            >
              <option value="code">{t.students.sortCode}</option>
              <option value="name">{t.students.sortName}</option>
              <option value="course">{t.students.sortCourse}</option>
              <option value="createdAt">{t.students.sortDate}</option>
            </select>

            <select
              className="form-select"
              style={{ width: 'auto' }}
              aria-label="Sort direction"
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value as SortDirection)}
              data-testid="students-sort-direction"
            >
              <option value="asc">{t.students.sortAsc}</option>
              <option value="desc">{t.students.sortDesc}</option>
            </select>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="empty-state" data-testid="students-empty-state">
            <UserPlus size={32} color="var(--color-muted)" aria-hidden="true" />
            <h3 style={{ margin: 0 }}>{t.dashboard.emptyStateTitle}</h3>
            <p style={{ margin: 0, color: 'var(--color-muted)' }}>
              {t.dashboard.emptyStateDesc}
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleLoadDemo}
            >
              {t.students.loadDemoButton}
            </button>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state" data-testid="students-no-matches">
            <p style={{ margin: 0, color: 'var(--color-muted)' }}>
              {t.students.emptyFiltered}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table" data-testid="students-table">
              <thead>
                <tr>
                  <th>{t.students.tableCode}</th>
                  <th>{t.students.tableName}</th>
                  <th>{t.students.tableCourse}</th>
                  <th>{t.students.tableCreated}</th>
                  <th>{t.students.tableActions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((stu) => (
                  <tr key={stu.id} data-testid={`student-row-${stu.code}`}>
                    <td>
                      <span className="code-pill">{stu.code}</span>
                    </td>
                    <td>{stu.name}</td>
                    <td>
                      <span className="course-pill">{stu.course}</span>
                    </td>
                    <td>{stu.createdAt.slice(0, 10)}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingStudent(stu)}
                          data-testid={`edit-student-${stu.code}`}
                        >
                          <Edit3 size={14} aria-hidden="true" />
                          {t.students.editAction}
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setStudentToDelete(stu)}
                          data-testid={`delete-student-${stu.code}`}
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
        open={Boolean(studentToDelete)}
        title={t.students.deleteConfirmTitle}
        description={
          studentToDelete
            ? `${t.students.deleteConfirmBody} (${studentToDelete.code} - ${studentToDelete.name})`
            : t.students.deleteConfirmBody
        }
        confirmLabel={t.students.confirmYes}
        cancelLabel={t.students.confirmCancel}
        onConfirm={handleConfirmDelete}
        onCancel={() => setStudentToDelete(null)}
      />

      <ConfirmDialog
        open={confirmClearOpen}
        title={t.students.clearConfirmTitle}
        description={t.students.clearConfirmBody}
        confirmLabel={t.students.confirmYes}
        cancelLabel={t.students.confirmCancel}
        onConfirm={handleConfirmClearAll}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </>
  );
}
