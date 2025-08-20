import '@/styles/globals.css';
import { Metadata, Viewport } from 'next';
import clsx from 'clsx';
import { Noto_Sans_Thai } from 'next/font/google';
import Head from 'next/head';

import { Providers } from './providers';

import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

const notosans_thai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  variable: '--font-noto-sans-thai',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className={`${notosans_thai.className}`}
      lang="en"
    >
      <Head>
        <title>HLLC 2025</title>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href="/logo-sdad.png" rel="icon" type="image/png" />
        <link href="/logo-sdad.png" rel="apple-touch-icon" type="image/png" />
      </Head>
      <body
        className={clsx(
          'bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>
          <div className="flex flex-col h-dvh max-h-dvh justify-center">
            <main className="grow">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
