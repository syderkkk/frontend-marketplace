'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => { console.error(error); }, [error]);

    return (
        <html lang="es">
            <body className="min-h-screen bg-white flex flex-col antialiased">
                <div className="px-8 py-6 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-zinc-900 text-sm">ProductStore</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-zinc-900 mb-2">Algo salió mal</h1>
                    <p className="text-zinc-400 text-sm mb-8 text-center max-w-sm">
                        Ocurrió un error inesperado. Intenta recargar la página.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={reset}
                            className="px-5 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 transition-colors"
                        >
                            Reintentar
                        </button>
                        <Link
                            href="/"
                            className="px-5 py-2.5 border border-zinc-200 text-zinc-700 text-sm font-medium rounded-xl hover:bg-zinc-50 transition-colors"
                        >
                            Ir al inicio
                        </Link>
                    </div>
                </div>
            </body>
        </html>
    );
}
