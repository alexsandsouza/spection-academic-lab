import type { Metadata } from 'next';
import './globals.css';
import { AcademicLabProvider } from '../lib/context/AcademicLabContext';
import { AcademicProgressProvider } from '../lib/context/AcademicProgressContext';
import { AppShell } from '../components/AppShell';

export const metadata: Metadata = {
  title: 'SPECTION Academic Lab - Spec-Driven Development Web Demonstration',
  description:
    'Official demonstration project of the SPECTION Framework by Alexsand Farias de Souza. Manage synthetic students, inspect live SDD artifacts, and verify engineering evidence.',
  authors: [
    {
      name: 'Alexsand Farias de Souza',
      url: 'https://alexsandsouza.github.io/',
    },
  ],
  icons: {
    icon: '/spection-academic-lab/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <AcademicLabProvider>
          <AcademicProgressProvider><AppShell>{children}</AppShell></AcademicProgressProvider>
        </AcademicLabProvider>
      </body>
    </html>
  );
}
