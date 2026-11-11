import React from 'react';

type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className="brand-logo" aria-label="SPECTION Academic Lab">
      <svg
        width="38"
        height="38"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="brand-logo-svg"
      >
        <defs>
          <linearGradient id="logoBg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#070D1F" />
            <stop offset="55%" stopColor="#0F1D3A" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>
          <linearGradient id="logoAccent" x1="8" y1="12" x2="56" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="url(#logoBg)" />
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="14"
          stroke="url(#logoAccent)"
          strokeOpacity="0.55"
          strokeWidth="2"
        />
        <path d="M32 13L11 23.5L32 34L53 23.5L32 13Z" fill="url(#logoAccent)" />
        <path
          d="M19 29.5V41C19 44.5 24.8 48.5 32 48.5C39.2 48.5 45 44.5 45 41V29.5L32 36L19 29.5Z"
          fill="#06B6D4"
          fillOpacity="0.25"
          stroke="#22D3EE"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path d="M51 24.5V39" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="51" cy="41.5" r="2.5" fill="#22D3EE" />
      </svg>
      {!compact && (
        <div className="brand-logo-text">
          <span className="brand-logo-kicker">SPECTION</span>
          <span className="brand-logo-title">Academic Lab</span>
        </div>
      )}
    </div>
  );
}
