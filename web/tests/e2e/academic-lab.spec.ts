import { test, expect } from '@playwright/test';
import path from 'path';

const SCREENSHOTS_DIR = path.resolve(__dirname, '../../../docs/screenshots');

test.describe('SPECTION Academic Lab End-to-End Verification', () => {
  test('1. Access dashboard, refuse optional storage, and verify ephemeral memory default', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByTestId('demo-env-indicator')).toBeVisible();
    await expect(page.getByTestId('privacy-banner')).toBeVisible();
    await expect(page.getByTestId('metric-total-students-value')).toHaveText('0');
    await expect(page.getByTestId('metric-storage-value')).toContainText(
      'Temporary (In-Memory)'
    );

    // Refuse optional storage (Essential Only)
    await page.getByTestId('privacy-essential-btn').click();
    await expect(page.getByTestId('privacy-banner')).toBeHidden();

    // Load demo data for visual verification & capture real dashboard screenshot
    await page.getByTestId('dashboard-load-demo-btn').click();
    await expect(page.getByTestId('metric-total-students-value')).toHaveText('6');

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'dashboard-dark.png'),
      fullPage: true,
    });

    // Verify nothing was persisted to localStorage for students
    const storedStudents = await page.evaluate(() =>
      window.localStorage.getItem('spection_academic_lab_students_v1')
    );
    expect(storedStudents).toBeNull();

    // Reload page and confirm memory state was ephemeral
    await page.reload();
    await expect(page.getByTestId('metric-total-students-value')).toHaveText('0');
  });

  test('2. Register, reject duplicate, search, edit, and delete synthetic student', async ({
    page,
  }) => {
    await page.goto('/students');
    await page.getByTestId('privacy-essential-btn').click();

    // Register student
    await page.getByTestId('student-code-input').fill(' demo-0001 ');
    await page.getByTestId('student-name-input').fill('Helena Costa Ficticia');
    await page
      .getByTestId('student-course-select')
      .selectOption('Software Engineering');
    await page.getByTestId('student-submit-btn').click();

    await expect(page.getByTestId('student-row-DEMO-0001')).toBeVisible();

    // Attempt duplicate code registration
    await page.getByTestId('student-code-input').fill('demo-0001');
    await page.getByTestId('student-name-input').fill('Duplicate Attempt');
    await page.getByTestId('student-submit-btn').click();
    await expect(page.getByTestId('student-code-error')).toBeVisible();

    // Register a second student for search test
    await page.getByTestId('student-code-input').fill('DEMO-0002');
    await page.getByTestId('student-name-input').fill('Lucas Almeida Sintetico');
    await page
      .getByTestId('student-course-select')
      .selectOption('Cybersecurity');
    await page.getByTestId('student-submit-btn').click();

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'students-crud.png'),
      fullPage: true,
    });

    // Search student
    await page.getByTestId('students-search-input').fill('Lucas');
    await expect(page.getByTestId('student-row-DEMO-0002')).toBeVisible();
    await expect(page.getByTestId('student-row-DEMO-0001')).toBeHidden();

    await page.getByTestId('students-search-input').fill('');
    await expect(page.getByTestId('student-row-DEMO-0001')).toBeVisible();

    // Edit student
    await page.getByTestId('edit-student-DEMO-0001').click();
    await page
      .getByTestId('student-name-input')
      .fill('Helena Costa Editada');
    await page.getByTestId('student-submit-btn').click();
    await expect(page.getByTestId('student-row-DEMO-0001')).toContainText(
      'Helena Costa Editada'
    );

    // Delete student with confirmation
    await page.getByTestId('delete-student-DEMO-0002').click();
    await page.getByTestId('confirm-dialog-confirm').click();
    await expect(page.getByTestId('student-row-DEMO-0002')).toBeHidden();
  });

  test('3. Authorize local storage, persist across reload, and revoke consent to purge data', async ({
    page,
  }) => {
    await page.goto('/students');

    // Authorize local storage
    await page.getByTestId('privacy-allow-local-btn').click();

    await page.getByTestId('student-code-input').fill('DEMO-0077');
    await page.getByTestId('student-name-input').fill('Persistente Ficticio');
    await page.getByTestId('student-submit-btn').click();

    await expect(page.getByTestId('student-row-DEMO-0077')).toBeVisible();

    // Reload page and verify record persists
    await page.reload();
    await expect(page.getByTestId('student-row-DEMO-0077')).toBeVisible();

    // Open Privacy Preferences from footer and revoke consent
    await page.getByTestId('footer-privacy-preferences-btn').click();
    await expect(page.getByTestId('privacy-modal')).toBeVisible();
    await page.getByTestId('modal-revoke-btn').click();

    await expect(page.getByTestId('student-row-DEMO-0077')).toBeHidden();
    const storedAfterRevoke = await page.evaluate(() =>
      window.localStorage.getItem('spection_academic_lab_students_v1')
    );
    expect(storedAfterRevoke).toBeNull();
  });

  test('4. Verify Courses, Enrollments, and Activities relational workflows', async ({
    page,
  }) => {
    await page.goto('/courses');
    await page.getByTestId('privacy-essential-btn').click();

    // Register a new synthetic course
    await page.getByTestId('course-code-input').fill(' course-10 ');
    await page
      .getByTestId('course-title-input')
      .fill('Harness Engineering & Quality Gates');
    await page.getByTestId('course-workload-input').fill('60');
    await page.getByTestId('course-submit-btn').click();

    await expect(page.getByTestId('course-row-COURSE-10')).toBeVisible();

    // Load full demo suite and navigate to Enrollments
    await page.getByTestId('courses-load-demo-btn').click();
    await expect(page.getByTestId('course-row-COURSE-01')).toBeVisible();

    await page.getByTestId('nav-enrollments').click();
    await expect(page.getByTestId('enrollment-row-ENR-0001')).toBeVisible();

    // Navigate to Activities and verify synthetic gradebook
    await page.getByTestId('nav-activities').click();
    await expect(page.getByTestId('activity-row-ACT-0001')).toBeVisible();
    await expect(page.getByTestId('activities-average-badge')).toContainText(
      'Avg Score:'
    );
  });

  test('5. Verify Engineering Journey view and mobile navigation drawer', async ({
    page,
  }) => {
    await page.goto('/documentation');
    await page.getByTestId('privacy-essential-btn').click();

    await expect(page.getByTestId('engineering-journey-section')).toBeVisible();
    await expect(page.getByTestId('traceability-matrix-section')).toBeVisible();
    await expect(page.getByTestId('journey-stage-1')).toBeVisible();
    await expect(page.getByTestId('journey-stage-10')).toBeVisible();

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'engineering-journey.png'),
      fullPage: true,
    });

    // Resize to mobile viewport and test mobile navigation
    await page.setViewportSize({ width: 375, height: 667 });
    await page.getByTestId('mobile-menu-open').click();
    await expect(page.getByTestId('app-sidebar')).toHaveClass(/mobile-open/);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'mobile-view.png'),
    });

    await page.getByTestId('nav-students').click();
    await expect(page).toHaveURL(/\/students/);
  });
});
