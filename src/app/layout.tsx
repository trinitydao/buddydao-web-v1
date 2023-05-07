import type { Metadata } from 'next';

import { App } from './_components/App';
import '@/styles/globals.css';

// Static metadata
export const metadata: Metadata = {
  title: 'BuddyDao',
  viewport: 'width=device-width, initial-scale=1',
  description: 'Buddy Dao',
  icons: '/favicon.ico',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://kit.fontawesome.com/fc10128944.js" crossOrigin="anonymous"></script>
      </head>
      <body>
        <App>{children}</App>
      </body>
    </html>
  );
}
