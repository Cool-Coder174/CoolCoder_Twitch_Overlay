import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StreamGlass Terminal',
  description: 'A retro-futuristic streaming overlay terminal',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&family=Source+Code+Pro:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased overflow-hidden">{children}</body>
    </html>
  );
}
