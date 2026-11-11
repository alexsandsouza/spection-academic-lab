'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, HardDrive, Trash2, Settings } from 'lucide-react';
import { useAcademicLab } from '../lib/context/AcademicLabContext';

export function PrivacyBanner() {
  const {
    consent,
    storageMode,
    storageWarning,
    t,
    isPrivacyModalOpen,
    openPrivacyModal,
    closePrivacyModal,
    chooseEssentialOnly,
    authorizeLocalStorage,
    revokeLocalStorageConsent,
  } = useAcademicLab();

  return (
    <>
      {!consent.decided && (
        <aside
          className="privacy-banner"
          role="region"
          aria-label={t.privacy.bannerTitle}
          data-testid="privacy-banner"
        >
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 700,
                marginBottom: '0.35rem',
                color: 'var(--color-primary)',
              }}
            >
              <ShieldCheck size={20} aria-hidden="true" />
              <span>{t.privacy.bannerTitle}</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--color-muted)' }}>
              {t.privacy.bannerBody}{' '}
              <Link
                href="/about/#privacy-policy"
                style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
              >
                {t.privacy.policyLink}
              </Link>
              .
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={chooseEssentialOnly}
              data-testid="privacy-essential-btn"
            >
              {t.privacy.essentialOnlyBtn}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={authorizeLocalStorage}
              data-testid="privacy-allow-local-btn"
            >
              {t.privacy.allowLocalBtn}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={openPrivacyModal}
              data-testid="privacy-preferences-open-btn"
            >
              <Settings size={16} aria-hidden="true" />
              {t.privacy.preferencesBtn}
            </button>
          </div>
        </aside>
      )}

      {isPrivacyModalOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-modal-title"
          data-testid="privacy-modal"
        >
          <div className="modal-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShieldCheck size={22} color="var(--color-primary)" aria-hidden="true" />
              <h2 id="privacy-modal-title" className="card-title">
                {t.privacy.modalTitle}
              </h2>
            </div>

            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-muted)' }}>
              {t.privacy.modalDescription}
            </p>

            {storageWarning && (
              <div className="alert alert-warning" role="alert">
                <span>{t.privacy.storageWarning}</span>
              </div>
            )}

            <div
              className="alert"
              style={{
                background: 'var(--color-background-elevated)',
                border: '1px solid var(--color-border)',
              }}
              data-testid="privacy-current-status"
            >
              <span style={{ fontWeight: 600 }}>
                {storageMode === 'local'
                  ? t.privacy.statusAuthorized
                  : t.privacy.statusEssential}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border:
                    storageMode === 'memory'
                      ? '1px solid var(--color-primary)'
                      : '1px solid var(--color-border)',
                  background: 'var(--color-background-elevated)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                  <Lock size={16} color="var(--color-primary)" aria-hidden="true" />
                  <span>{t.privacy.modeMemoryTitle}</span>
                </div>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.82rem', color: 'var(--color-muted)' }}>
                  {t.privacy.modeMemoryDesc}
                </p>
              </div>

              <div
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border:
                    storageMode === 'local'
                      ? '1px solid var(--color-primary)'
                      : '1px solid var(--color-border)',
                  background: 'var(--color-background-elevated)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                  <HardDrive size={16} color="var(--color-accent)" aria-hidden="true" />
                  <span>{t.privacy.modeLocalTitle}</span>
                </div>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.82rem', color: 'var(--color-muted)' }}>
                  {t.privacy.modeLocalDesc}
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: '0.65rem',
                marginTop: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    chooseEssentialOnly();
                    closePrivacyModal();
                  }}
                  data-testid="modal-essential-btn"
                >
                  {t.privacy.essentialOnlyBtn}
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    authorizeLocalStorage();
                    closePrivacyModal();
                  }}
                  data-testid="modal-allow-local-btn"
                >
                  {t.privacy.allowLocalBtn}
                </button>
                {consent.allowLocalStorage && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      revokeLocalStorageConsent();
                      closePrivacyModal();
                    }}
                    data-testid="modal-revoke-btn"
                  >
                    <Trash2 size={14} aria-hidden="true" />
                    {t.privacy.revokeBtn}
                  </button>
                )}
              </div>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={closePrivacyModal}
                data-testid="modal-close-btn"
              >
                {t.privacy.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
