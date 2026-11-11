'use client';

import React, { useEffect, useState } from 'react';
import { Save, XCircle, CheckCircle2 } from 'lucide-react';
import {
  DEMO_COURSES,
  Student,
  StudentInput,
  ValidationFieldErrors,
} from '../lib/domain/students';
import { useAcademicLab } from '../lib/context/AcademicLabContext';

type StudentFormProps = {
  editingStudent?: Student | null;
  onCancelEdit?: () => void;
  onSuccess?: (message: string) => void;
};

export function StudentForm({
  editingStudent = null,
  onCancelEdit,
  onSuccess,
}: StudentFormProps) {
  const { registerStudent, editStudent, t } = useAcademicLab();

  const [code, setCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [course, setCourse] = useState<string>(DEMO_COURSES[0]);
  const [errors, setErrors] = useState<ValidationFieldErrors>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (editingStudent) {
      setCode(editingStudent.code);
      setName(editingStudent.name);
      setCourse(editingStudent.course);
      setErrors({});
      setFeedback(null);
    } else {
      setCode('');
      setName('');
      setCourse(DEMO_COURSES[0]);
      setErrors({});
    }
  }, [editingStudent]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    const payload: StudentInput = { code, name, course };

    if (editingStudent) {
      const result = editStudent(editingStudent.id, payload);
      if (!result.ok) {
        setErrors(result.errors ?? {});
        return;
      }
      setErrors({});
      const msg = t.students.successUpdated;
      setFeedback(msg);
      if (onSuccess) {
        onSuccess(msg);
      }
      if (onCancelEdit) {
        onCancelEdit();
      }
    } else {
      const result = registerStudent(payload);
      if (!result.ok) {
        setErrors(result.errors ?? {});
        return;
      }
      setErrors({});
      setCode('');
      setName('');
      setCourse(DEMO_COURSES[0]);
      const msg = t.students.successCreated;
      setFeedback(msg);
      if (onSuccess) {
        onSuccess(msg);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label={editingStudent ? t.students.formEditTitle : t.students.formCreateTitle}>
      <div className="form-grid">
        <div className="form-field form-col-3">
          <label htmlFor="student-code-input" className="form-label">
            {t.students.codeLabel}
          </label>
          <input
            id="student-code-input"
            name="code"
            type="text"
            className={`form-input ${errors.code ? 'invalid' : ''}`}
            placeholder={t.students.codePlaceholder}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-invalid={Boolean(errors.code)}
            aria-describedby={errors.code ? 'student-code-error' : 'student-code-hint'}
            data-testid="student-code-input"
          />
          <span id="student-code-hint" className="field-hint">
            {t.students.codeHint}
          </span>
          {errors.code && (
            <span
              id="student-code-error"
              className="field-error"
              role="alert"
              data-testid="student-code-error"
            >
              {t.validation[errors.code]}
            </span>
          )}
        </div>

        <div className="form-field form-col-4">
          <label htmlFor="student-name-input" className="form-label">
            {t.students.nameLabel}
          </label>
          <input
            id="student-name-input"
            name="name"
            type="text"
            className={`form-input ${errors.name ? 'invalid' : ''}`}
            placeholder={t.students.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'student-name-error' : 'student-name-hint'}
            data-testid="student-name-input"
          />
          <span id="student-name-hint" className="field-hint">
            {t.students.nameHint}
          </span>
          {errors.name && (
            <span
              id="student-name-error"
              className="field-error"
              role="alert"
              data-testid="student-name-error"
            >
              {t.validation[errors.name]}
            </span>
          )}
        </div>

        <div className="form-field form-col-3">
          <label htmlFor="student-course-select" className="form-label">
            {t.students.courseLabel}
          </label>
          <select
            id="student-course-select"
            name="course"
            className={`form-select ${errors.course ? 'invalid' : ''}`}
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            aria-invalid={Boolean(errors.course)}
            aria-describedby={errors.course ? 'student-course-error' : undefined}
            data-testid="student-course-select"
          >
            <option value="">{t.students.coursePlaceholder}</option>
            {DEMO_COURSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.course && (
            <span
              id="student-course-error"
              className="field-error"
              role="alert"
              data-testid="student-course-error"
            >
              {t.validation[errors.course]}
            </span>
          )}
        </div>

        <div className="form-field form-col-2 form-actions-cell">
          <button
            type="submit"
            className="btn btn-primary"
            style={{ height: '42px' }}
            data-testid="student-submit-btn"
          >
            <Save size={16} aria-hidden="true" />
            {editingStudent ? t.students.updateButton : t.students.saveButton}
          </button>
          {editingStudent && onCancelEdit && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ height: '42px' }}
              onClick={onCancelEdit}
              data-testid="student-cancel-edit-btn"
            >
              <XCircle size={16} aria-hidden="true" />
              {t.students.cancelEditButton}
            </button>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className="alert alert-success"
          role="status"
          aria-live="polite"
          style={{ marginTop: '1rem' }}
          data-testid="student-form-success"
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} aria-hidden="true" />
            {feedback}
          </span>
        </div>
      )}
    </form>
  );
}
