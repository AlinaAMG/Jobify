import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jobify',
  description:
    "Beheer je volledige carrière-zoektocht vanuit één centraal dashboard. Organiseer vacatures, beheer contactgegevens en blijf altijd up-to-date met je sollicitaties.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="nl" suppressHydrationWarning className={inter.className}>
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
