'use client';

import React from 'react';
import {
  Info,
  ShieldCheck,
  FileText,
  ExternalLink,
  Settings,
} from 'lucide-react';
import { useAcademicLab } from '../../lib/context/AcademicLabContext';

export default function AboutPage() {
  const { locale, openPrivacyModal } = useAcademicLab();
  const isPt = locale === 'pt';

  return (
    <>
      <section className="hero-banner">
        <div>
          <div className="hero-kicker">
            <Info size={16} aria-hidden="true" />
            <span>SPECTION Academic Lab</span>
          </div>
          <h2 className="hero-title">
            {isPt
              ? 'Sobre o Projeto, Privacidade e Termos de Uso'
              : 'About the Project, Privacy Policy & Terms of Use'}
          </h2>
          <p className="hero-description">
            {isPt
              ? 'O SPECTION Academic Lab e o projeto demonstrativo oficial do SPECTION Framework, criado e mantido por Alexsand Farias de Souza sob licenca MIT.'
              : 'SPECTION Academic Lab is the official demonstration project of the SPECTION Framework, created and maintained by Alexsand Farias de Souza under the MIT License.'}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={openPrivacyModal}
        >
          <Settings size={16} aria-hidden="true" />
          <span>{isPt ? 'Preferencias de Privacidade' : 'Privacy Preferences'}</span>
        </button>
      </section>

      <div className="two-col-grid">
        <section className="card">
          <h3 className="card-title">
            {isPt ? 'Proposito Educacional e Metodologico' : 'Educational & Methodological Purpose'}
          </h3>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.92rem' }}>
            {isPt
              ? 'Este projeto demonstra, passo a passo, como combinar Inteligencia Artificial, Especificacoes (SDD), Arquitetura (HLD/LLD/ADR), Agent Skills, Testes Automatizados e Evidencias Verificaveis na construcao de software.'
              : 'This project demonstrates, step by step, how to combine Artificial Intelligence, Specifications (SDD), Architecture (HLD/LLD/ADR), Agent Skills, Automated Tests, and Verifiable Evidence when building software.'}
          </p>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.92rem' }}>
            {isPt
              ? 'A implementacao original em Python 3 + SQLite (students.py) e preservada na raiz do repositorio e testada continuamente ao lado desta aplicacao web Next.js + TypeScript.'
              : 'The original Python 3 + SQLite implementation (students.py) is preserved at the repository root and continuously tested alongside this Next.js + TypeScript web application.'}
          </p>
        </section>

        <section className="card">
          <h3 className="card-title">
            {isPt ? 'Autor e Ecossistema SPECTION' : 'Author & SPECTION Ecosystem'}
          </h3>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.92rem' }}>
            <strong>Alexsand Farias de Souza</strong> -{' '}
            {isPt
              ? 'Autor e mantenedor do SPECTION Framework e do SPECTION Academic Lab.'
              : 'Author and maintainer of the SPECTION Framework and SPECTION Academic Lab.'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1rem' }}>
            <a
              href="https://alexsandsouza.github.io/spection/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              <span>SPECTION Portal</span>
              <ExternalLink size={14} />
            </a>
            <a
              href="https://github.com/alexsandsouza/spection"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              <span>SPECTION Framework Repo</span>
              <ExternalLink size={14} />
            </a>
            <a
              href="https://alexsandsouza.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              <span>Portfolio</span>
              <ExternalLink size={14} />
            </a>
            <a
              href="https://www.linkedin.com/in/alexsandfarias"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              <span>LinkedIn</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </section>
      </div>

      <section id="privacy-policy" className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="var(--color-primary)" aria-hidden="true" />
            <h3 className="card-title">
              {isPt
                ? 'Politica de Privacidade (Principios LGPD / GDPR)'
                : 'Privacy Policy (LGPD / GDPR Principles)'}
            </h3>
          </div>
        </div>
        <div style={{ color: 'var(--color-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <p style={{ margin: 0 }}>
            <strong>1. {isPt ? 'Natureza Demonstrativa e Dados Sinteticos' : 'Educational Demonstration & Synthetic Data'}:</strong>{' '}
            {isPt
              ? 'O SPECTION Academic Lab e uma demonstracao educacional de engenharia de software. Devem ser utilizados exclusivamente dados ficticios (codigos DEMO-0001 e nomes sinteticos). Nao insira dados pessoais reais.'
              : 'SPECTION Academic Lab is an educational software engineering demonstration. Visitors must use exclusively fictional data (DEMO-0001 codes and synthetic names). Never enter real personal data.'}
          </p>
          <p style={{ margin: 0 }}>
            <strong>2. {isPt ? 'Armazenamento em Memoria por Padrao' : 'In-Memory Ephemeral Storage by Default'}:</strong>{' '}
            {isPt
              ? 'Por padrao (modo Somente Essenciais), todos os registros cadastrados ficam apenas na memoria temporaria da aba do navegador e sao descartados ao fechar ou recarregar a pagina.'
              : 'By default (Essential Only mode), all registered student records remain strictly in temporary browser tab memory and are discarded when the tab is closed or reloaded.'}
          </p>
          <p style={{ margin: 0 }}>
            <strong>3. {isPt ? 'Armazenamento Local Opcional e Revogavel' : 'Optional & Revocable Local Storage'}:</strong>{' '}
            {isPt
              ? 'O armazenamento no localStorage do navegador so e ativado se o visitante autorizar explicitamente. O visitante pode revogar essa escolha a qualquer momento nas Preferencias de Privacidade, apagando imediatamente os dados persistidos.'
              : 'Browser localStorage persistence is only activated if the visitor explicitly opts in. You may revoke consent at any time via Privacy Preferences, which immediately erases persisted student records.'}
          </p>
          <p style={{ margin: 0 }}>
            <strong>4. {isPt ? 'Ausencia de Transmissao a Servidores, Analytics ou IA' : 'Zero Server Transmission, Analytics, or AI Tracking'}:</strong>{' '}
            {isPt
              ? 'A aplicacao nao possui backend, nao carrega scripts de publicidade ou analytics e nao envia registros cadastrados para nenhum servidor externo ou modelo de IA.'
              : 'The application has no backend, loads zero advertising or analytics scripts, and never transmits student registry records to any external server or AI model.'}
          </p>
          <p style={{ margin: 0 }}>
            <strong>5. {isPt ? 'Hospedagem GitHub Pages e Ressalva Juridica' : 'GitHub Pages Hosting & Legal Disclaimer'}:</strong>{' '}
            {isPt
              ? 'A hospedagem estatica via GitHub Pages pode registrar dados tecnicos padrao de acesso HTTP conforme a politica de privacidade do proprio GitHub. Este projeto educacional nao declara certificacao juridica integral com LGPD ou GDPR; qualquer adaptacao para uso com dados reais exige revisao juridica e de seguranca independente.'
              : 'Static hosting via GitHub Pages may process standard technical HTTP access logs under GitHub privacy policies. This educational project does not claim formal legal certification under LGPD or GDPR; any adaptation involving real personal data requires independent legal and security review.'}
          </p>
        </div>
      </section>

      <section id="terms-of-use" className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="var(--color-accent)" aria-hidden="true" />
            <h3 className="card-title">
              {isPt ? 'Termos de Uso' : 'Terms of Use'}
            </h3>
          </div>
        </div>
        <div style={{ color: 'var(--color-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <p style={{ margin: 0 }}>
            {isPt
              ? '1. Licenca MIT: O codigo-fonte e distribuido sob a licenca MIT (Copyright (c) 2026 Alexsand Farias de Souza), fornecido "como esta" (AS IS), sem garantias de qualquer especie.'
              : '1. MIT License: The source code is distributed under the MIT License (Copyright (c) 2026 Alexsand Farias de Souza), provided "AS IS", without warranty of any kind.'}
          </p>
          <p style={{ margin: 0 }}>
            {isPt
              ? '2. Uso Aceitavel: O visitante compromete-se a inserir apenas dados ficticios de demonstracao e a nao utilizar a interface para armazenar informacoes pessoais reais ou confidenciais.'
              : '2. Acceptable Use: Visitors agree to input only synthetic demonstration data and must not use the interface to store real personal or confidential information.'}
          </p>
          <p style={{ margin: 0 }}>
            {isPt
              ? '3. Independencia Institucional: O SPECTION Academic Lab e uma iniciativa aberta e independente de engenharia de software, sem vinculo com sistemas academicos institucionais reais.'
              : '3. Institutional Independence: SPECTION Academic Lab is an independent open-source software engineering demonstration with no affiliation to real institutional student registries.'}
          </p>
        </div>
      </section>
    </>
  );
}
