import type { Metadata } from 'next/types';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Chatbot',
  description: 'An AI chatbot powered by xAI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-col min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}