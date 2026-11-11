import { describe, expect, it } from 'vitest';
import {
  LocalStorageAdapter,
  MemoryStorageAdapter,
  STORAGE_KEYS,
  loadPrivacyConsent,
  revokePrivacyConsentAndPurge,
  savePrivacyConsent,
} from '../../lib/storage/storage';
import { Student } from '../../lib/domain/students';

const SAMPLE_STUDENT: Student = {
  id: 'stu-demo-0001',
  code: 'DEMO-0001',
  name: 'Helena Costa Ficticia',
  course: 'Software Engineering',
  createdAt: '2026-11-10T10:00:00.000Z',
  updatedAt: '2026-11-10T10:00:00.000Z',
};

describe('Storage & Privacy Layer (RNF-WEB-003, RNF-WEB-004, RNF-WEB-006)', () => {
  it('stores records only in memory by default without touching localStorage (RNF-WEB-003)', () => {
    const memoryAdapter = new MemoryStorageAdapter();
    expect(memoryAdapter.mode).toBe('memory');

    memoryAdapter.saveStudents([SAMPLE_STUDENT]);
    expect(memoryAdapter.loadStudents().students).toHaveLength(1);
    expect(window.localStorage.getItem(STORAGE_KEYS.STUDENTS)).toBeNull();

    memoryAdapter.clearStudents();
    expect(memoryAdapter.loadStudents().students).toHaveLength(0);
  });

  it('blocks localStorage persistence when user has not authorized consent (RNF-WEB-004)', () => {
    let authorized = false;
    const localAdapter = new LocalStorageAdapter(() => authorized);

    const saveAttempt = localAdapter.saveStudents([SAMPLE_STUDENT]);
    expect(saveAttempt.ok).toBe(false);
    expect(saveAttempt.warning).toBe('LOCAL_STORAGE_NOT_AUTHORIZED');
    expect(window.localStorage.getItem(STORAGE_KEYS.STUDENTS)).toBeNull();

    const loadAttempt = localAdapter.loadStudents();
    expect(loadAttempt.students).toEqual([]);
    expect(loadAttempt.warning).toBe('LOCAL_STORAGE_NOT_AUTHORIZED');

    authorized = true;
    const authorizedSave = localAdapter.saveStudents([SAMPLE_STUDENT]);
    expect(authorizedSave.ok).toBe(true);
    expect(window.localStorage.getItem(STORAGE_KEYS.STUDENTS)).not.toBeNull();
    expect(localAdapter.loadStudents().students).toEqual([SAMPLE_STUDENT]);
  });

  it('revokes consent and immediately purges persisted student records (RNF-WEB-004)', () => {
    savePrivacyConsent(true);
    const localAdapter = new LocalStorageAdapter(() => true);
    localAdapter.saveStudents([SAMPLE_STUDENT]);

    expect(loadPrivacyConsent().allowLocalStorage).toBe(true);
    expect(window.localStorage.getItem(STORAGE_KEYS.STUDENTS)).not.toBeNull();

    const revoked = revokePrivacyConsentAndPurge();
    expect(revoked.state.decided).toBe(true);
    expect(revoked.state.allowLocalStorage).toBe(false);
    expect(window.localStorage.getItem(STORAGE_KEYS.STUDENTS)).toBeNull();
  });

  it('purges synthetic attendance and grade preferences on consent revocation (RNF-009)', () => {
    savePrivacyConsent(true);
    window.localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify({sessions:[],records:[],weights:{EXAM:40,PROJECT:30,LAB:20,QUIZ:10}}));
    expect(window.localStorage.getItem(STORAGE_KEYS.PROGRESS)).not.toBeNull();
    revokePrivacyConsentAndPurge();
    expect(window.localStorage.getItem(STORAGE_KEYS.PROGRESS)).toBeNull();
  });

  it('handles localStorage exceptions and corrupted payloads gracefully (RNF-WEB-006)', () => {
    const throwingStorage: Storage = {
      length: 0,
      clear: () => {
        throw new Error('SecurityError');
      },
      getItem: () => {
        throw new Error('SecurityError');
      },
      key: () => null,
      removeItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    };

    const brokenAdapter = new LocalStorageAdapter(
      () => true,
      () => throwingStorage
    );

    const saveRes = brokenAdapter.saveStudents([SAMPLE_STUDENT]);
    expect(saveRes.ok).toBe(false);
    expect(saveRes.warning).toBe('LOCAL_STORAGE_WRITE_ERROR');

    const loadRes = brokenAdapter.loadStudents();
    expect(loadRes.warning).toBe('LOCAL_STORAGE_READ_ERROR');
    expect(loadRes.students).toEqual([SAMPLE_STUDENT]);

    window.localStorage.setItem(STORAGE_KEYS.STUDENTS, '{not-valid-json');
    const normalAdapter = new LocalStorageAdapter(() => true);
    const corruptedLoad = normalAdapter.loadStudents();
    expect(corruptedLoad.warning).toBe('LOCAL_STORAGE_READ_ERROR');
    expect(corruptedLoad.students).toEqual([]);
  });
});
