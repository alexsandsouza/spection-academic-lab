'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  ChartNoAxesCombined,
  FileCode2,
  Map,
  Info,
  ExternalLink,
  Sun,
  Moon,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { PrivacyBanner } from './PrivacyBanner';
import { useAcademicLab } from '../lib/context/AcademicLabContext';
import { Locale } from '../lib/i18n/dictionaries';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const { locale, setLocale, theme, toggleTheme, t, openPrivacyModal } =
    useAcademicLab();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isRouteActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const getPageTitle = () => {
    if (pathname.startsWith('/students')) return t.nav.students;
    if (pathname.startsWith('/courses')) return t.nav.courses;
    if (pathname.startsWith('/enrollments')) return t.nav.enrollments;
    if (pathname.startsWith('/activities')) return t.nav.activities;
    if (pathname.startsWith('/progress')) return locale === 'pt' ? 'Inteligência Acadêmica' : 'Academic Intelligence';
    if (pathname.startsWith('/documentation')) return t.nav.documentation;
    if (pathname.startsWith('/roadmap')) return t.nav.roadmap;
    if (pathname.startsWith('/about')) return t.nav.about;
    return t.nav.overview;
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="app-layout">
      <aside
        className={`app-sidebar ${collapsed ? 'collapsed' : ''} ${
          mobileOpen ? 'mobile-open' : ''
        }`}
        aria-label="Sidebar Navigation"
        data-testid="app-sidebar"
      >
        <div className="sidebar-top">
          <div className="sidebar-brand-row">
            <Link href="/" onClick={closeMobile}>
              <BrandLogo compact={collapsed} />
            </Link>
            <button
              type="button"
              className="btn btn-ghost desktop-collapse-btn"
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label={collapsed ? t.nav.expandSidebar : t.nav.collapseSidebar}
              title={collapsed ? t.nav.expandSidebar : t.nav.collapseSidebar}
            >
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
            <button
              type="button"
              className="btn btn-ghost mobile-menu-btn"
              onClick={closeMobile}
              aria-label={t.nav.closeMobileMenu}
              data-testid="mobile-menu-close"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="sidebar-nav" aria-label="Primary Navigation">
            {!collapsed && (
              <div className="sidebar-section-label">{t.nav.navigationGroup}</div>
            )}

            <Link
              href="/"
              onClick={closeMobile}
              className={`nav-item ${isRouteActive('/') ? 'active' : ''}`}
              data-testid="nav-overview"
            >
              <span className="nav-item-main">
                <LayoutDashboard size={18} aria-hidden="true" />
                {!collapsed && <span>{t.nav.overview}</span>}
              </span>
            </Link>

            <Link
              href="/students"
              onClick={closeMobile}
              className={`nav-item ${isRouteActive('/students') ? 'active' : ''}`}
              data-testid="nav-students"
            >
              <span className="nav-item-main">
                <Users size={18} aria-hidden="true" />
                {!collapsed && <span>{t.nav.students}</span>}
              </span>
            </Link>

            <Link
              href="/courses"
              onClick={closeMobile}
              className={`nav-item ${isRouteActive('/courses') ? 'active' : ''}`}
              data-testid="nav-courses"
            >
              <span className="nav-item-main">
                <BookOpen size={18} aria-hidden="true" />
                {!collapsed && <span>{t.nav.courses}</span>}
              </span>
            </Link>

            <Link
              href="/enrollments"
              onClick={closeMobile}
              className={`nav-item ${isRouteActive('/enrollments') ? 'active' : ''}`}
              data-testid="nav-enrollments"
            >
              <span className="nav-item-main">
                <Layers size={18} aria-hidden="true" />
                {!collapsed && <span>{t.nav.enrollments}</span>}
              </span>
            </Link>

            <Link
              href="/activities"
              onClick={closeMobile}
              className={`nav-item ${isRouteActive('/activities') ? 'active' : ''}`}
              data-testid="nav-activities"
            >
              <span className="nav-item-main">
                <ClipboardCheck size={18} aria-hidden="true" />
                {!collapsed && <span>{t.nav.activities}</span>}
              </span>
            </Link>

            <Link
              href="/progress"
              onClick={closeMobile}
              className={`nav-item ${isRouteActive('/progress') ? 'active' : ''}`}
              data-testid="nav-progress"
            >
              <span className="nav-item-main">
                <ChartNoAxesCombined size={18} aria-hidden="true" />
                {!collapsed && <span>{locale === 'pt' ? 'Inteligência Acadêmica' : 'Academic Intelligence'}</span>}
              </span>
            </Link>

            {!collapsed && (
              <div className="sidebar-section-label">{t.nav.engineeringGroup}</div>
            )}

            <Link
              href="/documentation"
              onClick={closeMobile}
              className={`nav-item ${isRouteActive('/documentation') ? 'active' : ''}`}
              data-testid="nav-documentation"
            >
              <span className="nav-item-main">
                <FileCode2 size={18} aria-hidden="true" />
                {!collapsed && <span>{t.nav.documentation}</span>}
              </span>
            </Link>

            <Link
              href="/roadmap"
              onClick={closeMobile}
              className={`nav-item ${isRouteActive('/roadmap') ? 'active' : ''}`}
              data-testid="nav-roadmap"
            >
              <span className="nav-item-main">
                <Map size={18} aria-hidden="true" />
                {!collapsed && <span>{t.nav.roadmap}</span>}
              </span>
            </Link>

            <Link
              href="/about"
              onClick={closeMobile}
              className={`nav-item ${isRouteActive('/about') ? 'active' : ''}`}
              data-testid="nav-about"
            >
              <span className="nav-item-main">
                <Info size={18} aria-hidden="true" />
                {!collapsed && <span>{t.nav.about}</span>}
              </span>
            </Link>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <a
            href="https://alexsandsouza.github.io/spection/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-item"
          >
            <span className="nav-item-main">
              <ExternalLink size={17} aria-hidden="true" />
              {!collapsed && <span>{t.nav.spectionFramework}</span>}
            </span>
          </a>
          <a
            href="https://github.com/alexsandsouza/spection-academic-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-item"
          >
            <span className="nav-item-main">
              <ExternalLink size={17} aria-hidden="true" />
              {!collapsed && <span>{t.nav.githubRepo}</span>}
            </span>
          </a>
        </div>
      </aside>

      <div className="app-main-wrapper">
        <header className="app-header">
          <div className="header-left">
            <button
              type="button"
              className="btn btn-secondary btn-sm mobile-menu-btn"
              onClick={() => setMobileOpen(true)}
              aria-label={t.nav.openMobileMenu}
              data-testid="mobile-menu-open"
            >
              <Menu size={18} />
            </button>
            <div>
              <nav className="breadcrumbs" aria-label="Breadcrumb">
                <Link href="/">SPECTION Academic Lab</Link>
                <span>/</span>
                <span aria-current="page">{getPageTitle()}</span>
              </nav>
              <h1 className="header-title">{getPageTitle()}</h1>
            </div>
          </div>

          <div className="header-actions">
            <span className="env-badge" data-testid="demo-env-indicator">
              <ShieldAlert size={14} aria-hidden="true" />
              {t.header.demoBadge}
            </span>

            <label
              htmlFor="language-switcher"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem' }}
            >
              <span className="sr-only">{t.header.languageLabel}</span>
              <select
                id="language-switcher"
                aria-label={t.header.languageLabel}
                className="form-select"
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.82rem', width: 'auto' }}
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
                data-testid="language-switcher"
              >
                <option value="en">EN</option>
                <option value="pt">PT-BR</option>
              </select>
            </label>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t.header.themeLight : t.header.themeDark}
              data-testid="theme-toggle-btn"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span>{theme === 'dark' ? t.header.themeLight : t.header.themeDark}</span>
            </button>

            <a
              href="https://github.com/alexsandsouza/spection-academic-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              <ExternalLink size={15} aria-hidden="true" />
              <span>{t.header.repoButton}</span>
            </a>
          </div>
        </header>

        <main className="app-content">{children}</main>

        <footer className="app-footer">
          <div>
            <strong>SPECTION Academic Lab</strong> - {t.footer.license} -{' '}
            {t.footer.authorLabel}
          </div>
          <div className="footer-links">
            <a
              href="https://alexsandsouza.github.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.footer.portfolio}
            </a>
            <a
              href="https://github.com/alexsandsouza"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.footer.github}
            </a>
            <a
              href="https://www.linkedin.com/in/alexsandfarias"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.footer.linkedin}
            </a>
            <Link href="/about/#privacy-policy">{t.footer.privacyPolicy}</Link>
            <Link href="/about/#terms-of-use">{t.footer.termsOfUse}</Link>
            <button
              type="button"
              className="footer-link-btn"
              onClick={openPrivacyModal}
              data-testid="footer-privacy-preferences-btn"
            >
              {t.footer.privacyPreferences}
            </button>
          </div>
        </footer>
      </div>

      <PrivacyBanner />
    </div>
  );
}
