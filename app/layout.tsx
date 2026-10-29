import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'AL YOUNUS Trading and Services', description: 'Hygiene, sanitation and facility supply solutions.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }