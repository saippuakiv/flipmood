import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'flipmood',
  description:
    'Mood-based curated music and movie discovery via swipeable cards',
  keywords: ['music', 'movies', 'mood', 'discovery', 'swipeable', 'cards'],
  authors: [{ name: 'saippuakiv' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link rel="preload" href="/bg.jpg" as="image" />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
