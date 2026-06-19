import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 animate-in">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mb-6">
                <span className="text-4xl">404</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Página no encontrada</h1>
            <p className="text-slate-400 text-[14px] mb-8 text-center max-w-xs">
                La página que buscas no existe o fue movida.
            </p>
            <Link
                href="/"
                className="btn-press px-6 py-3 bg-indigo-600 text-white rounded-xl text-[14px] font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
            >
                Volver al catálogo
            </Link>
        </div>
    );
}
