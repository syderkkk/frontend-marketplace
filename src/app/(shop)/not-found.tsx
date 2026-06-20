import Link from 'next/link';

export default function ShopNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-in">
            <p className="text-8xl font-bold text-zinc-100 select-none mb-2">404</p>
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">Página no encontrada</h1>
            <p className="text-zinc-400 text-sm mb-8 text-center max-w-sm">
                La dirección que buscas no existe o fue movida a otra ruta.
            </p>
            <Link
                href="/"
                className="btn-press px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors"
            >
                Volver al catálogo
            </Link>
        </div>
    );
}
