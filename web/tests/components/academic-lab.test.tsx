import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AcademicLabProvider } from '../../lib/context/AcademicLabContext';
import DashboardPage from '../../app/page';
import StudentsPage from '../../app/students/page';
import { PrivacyBanner } from '../../components/PrivacyBanner';
import { STORAGE_KEYS } from '../../lib/storage/storage';

vi.mock('next/navigation', () => ({
  usePathname: () => '/students',
}));

function renderWithLab(ui: React.ReactNode) {
  return render(
    <AcademicLabProvider>
      {ui}
      <PrivacyBanner />
    </AcademicLabProvider>
  );
}

describe('SPECTION Academic Lab Component Suite', () => {
  it('renders empty state initially and registers a valid synthetic student (RF-WEB-001..006)', async () => {
    const user = userEvent.setup();
    renderWithLab(<StudentsPage />);

    expect(screen.getByTestId('students-empty-state')).toBeInTheDocument();

    await user.type(screen.getByTestId('student-code-input'), ' demo-0001 ');
    await user.type(
      screen.getByTestId('student-name-input'),
      'Ada Lovelace Fictional'
    );
    await user.selectOptions(
      screen.getByTestId('student-course-select'),
      'Computer Science'
    );
    await user.click(screen.getByTestId('student-submit-btn'));

    expect(screen.getByTestId('student-form-success')).toBeInTheDocument();
    const row = screen.getByTestId('student-row-DEMO-0001');
    expect(row).toBeInTheDocument();
    expect(within(row).getByText('Ada Lovelace Fictional')).toBeInTheDocument();
    expect(within(row).getByText('Computer Science')).toBeInTheDocument();
  });

  it('displays validation errors for invalid form inputs and duplicate codes (RF-WEB-002..005)', async () => {
    const user = userEvent.setup();
    renderWithLab(<StudentsPage />);

    await user.type(screen.getByTestId('student-code-input'), 'INVALID-99');
    await user.type(screen.getByTestId('student-name-input'), 'A');
    await user.selectOptions(screen.getByTestId('student-course-select'), '');
    await user.click(screen.getByTestId('student-submit-btn'));

    expect(screen.getByTestId('student-code-error')).toBeInTheDocument();
    expect(screen.getByTestId('student-name-error')).toBeInTheDocument();
    expect(screen.getByTestId('student-course-error')).toBeInTheDocument();

    await user.clear(screen.getByTestId('student-code-input'));
    await user.clear(screen.getByTestId('student-name-input'));
    await user.type(screen.getByTestId('student-code-input'), 'DEMO-0001');
    await user.type(screen.getByTestId('student-name-input'), 'First Student');
    await user.selectOptions(
      screen.getByTestId('student-course-select'),
      'Software Engineering'
    );
    await user.click(screen.getByTestId('student-submit-btn'));

    await user.type(screen.getByTestId('student-code-input'), 'demo-0001');
    await user.type(screen.getByTestId('student-name-input'), 'Duplicate Student');
    await user.click(screen.getByTestId('student-submit-btn'));

    expect(screen.getByTestId('student-code-error')).toHaveTextContent(
      /already registered/i
    );
  });

  it('confirms deletion before removing a student record (RF-WEB-010)', async () => {
    const user = userEvent.setup();
    renderWithLab(<StudentsPage />);

    await user.type(screen.getByTestId('student-code-input'), 'DEMO-0005');
    await user.type(screen.getByTestId('student-name-input'), 'Delete Target');
    await user.click(screen.getByTestId('student-submit-btn'));

    expect(screen.getByTestId('student-row-DEMO-0005')).toBeInTheDocument();

    await user.click(screen.getByTestId('delete-student-DEMO-0005'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByTestId('confirm-dialog-cancel'));
    expect(screen.getByTestId('student-row-DEMO-0005')).toBeInTheDocument();

    await user.click(screen.getByTestId('delete-student-DEMO-0005'));
    await user.click(screen.getByTestId('confirm-dialog-confirm'));

    expect(screen.queryByTestId('student-row-DEMO-0005')).not.toBeInTheDocument();
  });

  it('updates dashboard indicators dynamically when demo data is loaded (RF-WEB-011, RF-WEB-014)', async () => {
    const user = userEvent.setup();
    renderWithLab(<DashboardPage />);

    expect(screen.getByTestId('metric-total-students-value')).toHaveTextContent('0');
    expect(screen.getByTestId('dashboard-empty-state')).toBeInTheDocument();

    await user.click(screen.getByTestId('dashboard-load-demo-btn'));

    expect(screen.getByTestId('metric-total-students-value')).toHaveTextContent('6');
    expect(screen.getByTestId('metric-courses-value')).toHaveTextContent('5');
  });

  it('manages privacy preferences and revokes localStorage persistence (RNF-WEB-003, RNF-WEB-004)', async () => {
    const user = userEvent.setup();
    renderWithLab(
      <>
        <DashboardPage />
        <StudentsPage />
      </>
    );

    expect(screen.getByTestId('privacy-banner')).toBeInTheDocument();
    expect(screen.getByTestId('metric-storage-value')).toHaveTextContent(
      /Temporary \(In-Memory\)/i
    );

    await user.click(screen.getByTestId('privacy-allow-local-btn'));
    expect(screen.queryByTestId('privacy-banner')).not.toBeInTheDocument();
    expect(screen.getByTestId('metric-storage-value')).toHaveTextContent(
      /Authorized \(localStorage\)/i
    );

    await user.type(screen.getByTestId('student-code-input'), 'DEMO-0009');
    await user.type(screen.getByTestId('student-name-input'), 'Persisted Student');
    await user.click(screen.getByTestId('student-submit-btn'));

    expect(window.localStorage.getItem(STORAGE_KEYS.STUDENTS)).toContain('DEMO-0009');
  });
});
