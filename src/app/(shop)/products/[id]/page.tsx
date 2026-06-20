import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Product, ApiResponse } from '@/types/product';
import AddToCartButton from '@/components/AddToCartButton';
import SaveButton from '@/components/SaveButton';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getProduct(id: string): Promise<Product | null> {
    try {
        const res = await fetch(`${API_URL}/products/${id}`, { cache: 'no-store' });
        if (!res.ok) return null;
        const data: ApiResponse<Product> = await res.json();
        return data.success ? data.data : null;
    } catch { return null; }
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await getProduct(id);
    if (!product) notFound();

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

            <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="lg:flex">
                    {/* Image */}
                    <div className="lg:w-1/2">
                        {product.imageUrl ? (
                            <div className="aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden bg-zinc-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={product.imageUrl}
                                    alt={product.nombre}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="aspect-[4/3] lg:aspect-auto lg:h-full min-h-[280px] bg-zinc-50 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3 text-zinc-300">
                                    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                                    </svg>
                                    <span className="text-xs font-medium tracking-wide uppercase text-zinc-400">Sin imagen</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col">
                        {product.category && (
                            <span className="inline-flex items-center self-start px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600 mb-4 border border-zinc-200">
                                {product.category.name}
                            </span>
                        )}

                        <h1 className="text-2xl lg:text-3xl font-bold text-zinc-900 leading-tight mb-3">
                            {product.nombre}
                        </h1>

                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-3xl lg:text-4xl font-bold text-emerald-600">
                                ${Number(product.precio).toFixed(2)}
                            </span>
                        </div>

                        {product.descripcion && (
                            <div className="mb-8">
                                <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Descripción</h2>
                                <p className="text-zinc-600 leading-relaxed text-[15px]">
                                    {product.descripcion}
                                </p>
                            </div>
                        )}

                        <div className="mt-auto space-y-3">
                            <AddToCartButton
                                id={product.id}
                                nombre={product.nombre}
                                precio={Number(product.precio)}
                                imageUrl={product.imageUrl}
                            />
                            <SaveButton
                                id={product.id}
                                nombre={product.nombre}
                                precio={Number(product.precio)}
                                imageUrl={product.imageUrl}
                                categoryName={product.category?.name}
                            />
                        </div>

                        <div className="mt-6 pt-5 border-t border-zinc-100">
                            <span className="text-xs text-zinc-400">ID: #{product.id}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
