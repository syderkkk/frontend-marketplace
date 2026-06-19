import Link from 'next/link';
import { Suspense } from 'react';
import { Product, Category, ApiResponse } from '@/types/product';
import CategoryFilter from '@/components/CategoryFilter';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getCategories(): Promise<Category[]> {
    try {
        const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 60 } });
        if (!res.ok) return [];
        const data: ApiResponse<Category[]> = await res.json();
        return data.success ? data.data : [];
    } catch { return []; }
}

async function getProducts(categoryId?: string): Promise<Product[]> {
    try {
        const url = categoryId
            ? `${API_URL}/products?categoryId=${categoryId}`
            : `${API_URL}/products`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return [];
        const data: ApiResponse<Product[]> = await res.json();
        return data.success ? data.data : [];
    } catch { return []; }
}

function PillSkeleton() {
    return (
        <div className="flex gap-2 flex-wrap">
            {[80, 96, 72, 88, 64].map(w => (
                <div key={w} className="shimmer h-8 rounded-full" style={{ width: w }} />
            ))}
        </div>
    );
}

function CardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
            <div className="shimmer aspect-[4/3]" />
            <div className="p-5 space-y-3">
                <div className="shimmer h-3 rounded-full w-1/4" />
                <div className="shimmer h-4 rounded-full w-3/4" />
                <div className="shimmer h-5 rounded-full w-1/3" />
                <div className="shimmer h-3 rounded-full w-full" />
                <div className="shimmer h-3 rounded-full w-2/3" />
            </div>
        </div>
    );
}

function ProductImage({ product }: { product: Product }) {
    if (product.imageUrl) {
        return (
            <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={product.imageUrl}
                    alt={product.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>
        );
    }
    return (
        <div className="aspect-[4/3] bg-zinc-50 flex items-center justify-center">
            <svg className="w-10 h-10 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
        </div>
    );
}

async function ProductsGrid({ categoryId }: { categoryId?: string }) {
    const products = await getProducts(categoryId);

    if (!products.length) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-zinc-100 animate-in">
                <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
                    </svg>
                </div>
                <p className="font-semibold text-zinc-700">Sin resultados</p>
                <p className="text-sm text-zinc-400 mt-1">Prueba seleccionando otra categoría</p>
            </div>
        );
    }

    return (
        <>
            {products.map((product, i) => (
                <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="card-lift group bg-white border border-zinc-100 rounded-2xl overflow-hidden"
                    style={{ animationDelay: `${i * 45}ms`, opacity: 0, animation: `fade-in-up 0.38s cubic-bezier(0.22,1,0.36,1) ${i * 45}ms both` }}
                >
                    <ProductImage product={product} />
                    <div className="p-5">
                        {product.category && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 text-zinc-600 mb-2">
                                {product.category.name}
                            </span>
                        )}
                        <h2 className="text-[15px] font-semibold text-zinc-900 line-clamp-1 mb-1 group-hover:text-zinc-600 transition-colors">
                            {product.nombre}
                        </h2>
                        <p className="text-xl font-bold text-emerald-600 mb-2">
                            ${Number(product.precio).toFixed(2)}
                        </p>
                        {product.descripcion && (
                            <p className="text-zinc-400 text-[13px] line-clamp-2 leading-relaxed">
                                {product.descripcion}
                            </p>
                        )}
                    </div>
                </Link>
            ))}
        </>
    );
}

export default async function HomePage({
    searchParams,
}: {
    searchParams: Promise<{ categoryId?: string }>;
}) {
    const { categoryId } = await searchParams;
    const categories = await getCategories();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8 animate-in">
                <h1 className="text-[28px] font-bold text-zinc-900 tracking-tight">Catálogo</h1>
                <p className="text-zinc-400 mt-1 text-sm">Descubre nuestra selección de productos</p>
            </div>

            <div className="mb-7">
                <Suspense fallback={<PillSkeleton />}>
                    <CategoryFilter categories={categories} />
                </Suspense>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <Suspense fallback={<>{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</>}>
                    <ProductsGrid categoryId={categoryId} />
                </Suspense>
            </div>
        </div>
    );
}
