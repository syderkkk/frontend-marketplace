import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: { default: 'ProductStore', template: '%s · ProductStore' },
    description: 'Tu tienda de productos tecnológicos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body className="antialiased">{children}</body>
        </html>
    );
}
