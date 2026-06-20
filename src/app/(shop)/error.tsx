'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ShopError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => { console.error(error); }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-in">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            </div>
            <h1 className="text-xl font-bold text-zinc-900 mb-2">Algo salió mal</h1>
            <p className="text-zinc-400 text-sm mb-2 text-center max-w-sm">
                Ocurrió un error al cargar esta página.
            </p>
            {process.env.NODE_ENV === 'development' && (
                <p className="text-xs font-mono text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-6 max-w-sm text-center break-all">
                    {error.message}
                </p>
            )}
            <div className="flex gap-3 mt-4">
                <button
                    onClick={reset}
                    className="btn-press px-5 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Reintentar
                </button>
                <Link
                    href="/"
                    className="btn-press px-5 py-2.5 border border-zinc-200 text-zinc-700 text-sm font-medium rounded-xl hover:bg-zinc-50 transition-colors"
                >
                    Ir al catálogo
                </Link>
            </div>
        </div>
    );
}
