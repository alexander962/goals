import type { Metadata } from 'next';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Progress Control',
  description: 'Личная система контроля целей, подготовки и собеседований',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
