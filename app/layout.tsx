import './globals.css';
import type { Metadata } from 'next';
import { Footer } from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'Content Writing Assistant',
  description: 'AI-powered content writing tool for UK Government Digital Service',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen flex flex-col bg-[#f3f2f1]">
        {children}
        <Footer />
      </body>
    </html>
  );
} 