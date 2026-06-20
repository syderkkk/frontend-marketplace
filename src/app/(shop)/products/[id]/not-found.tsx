import Link from 'next/link';

export default function ProductNotFound() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in">
            {/* Back */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors mb-8 group"
            >
                <span className="w-7 h-7 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm group-hover:border-zinc-300 group-hover:bg-zinc-50 transition-all">
                    <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </span>
                Volver al catálogo
            </Link>

            <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-16 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-zinc-100 flex items-center justify-center mb-6">
                    <svg className="w-9 h-9 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                    </svg>
                </div>
                <h1 className="text-xl font-bold text-zinc-900 mb-2">Producto no encontrado</h1>
                <p className="text-zinc-400 text-sm mb-8 max-w-xs">
                    Este producto no existe o fue eliminado del catálogo.
                </p>
                <Link
                    href="/"
                    className="btn-press px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors"
                >
                    Ver catálogo completo
                </Link>
            </div>
        </div>
    );
}
