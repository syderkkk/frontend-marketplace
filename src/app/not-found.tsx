import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Minimal header */}
            <div className="px-8 py-6 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                    </svg>
                </div>
                <span className="font-semibold text-zinc-900 text-sm">ProductStore</span>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 animate-in">
                <p className="text-8xl font-bold text-zinc-100 select-none mb-2">404</p>
                <h1 className="text-2xl font-bold text-zinc-900 mb-2">Página no encontrada</h1>
                <p className="text-zinc-400 text-sm mb-8 text-center max-w-sm">
                    La dirección que buscas no existe o fue movida a otra ruta.
                </p>
                <Link
                    href="/"
                    className="btn-press px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}
