'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSaved, removeSaved, SavedProduct } from '@/lib/saved';
import { useCart } from '@/context/CartContext';

export default function SavedPage() {
    const [items, setItems] = useState<SavedProduct[]>([]);
    const [mounted, setMounted] = useState(false);
    const { addItem } = useCart();

    useEffect(() => {
        setItems(getSaved());
        setMounted(true);
    }, []);

    const remove = (id: number) => {
        removeSaved(id);
        setItems(prev => prev.filter(p => p.id !== id));
    };

    const moveToCart = (item: SavedProduct) => {
        addItem(item);
        remove(item.id);
    };

    if (!mounted) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8 animate-in">
                <h1 className="text-[28px] font-bold text-zinc-900 tracking-tight flex items-center gap-3">
                    Guardados
                    {items.length > 0 && (
                        <span className="text-base font-semibold text-zinc-400">{items.length}</span>
                    )}
                </h1>
                <p className="text-zinc-400 mt-1 text-sm">Productos que guardaste para después</p>
            </div>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-zinc-100 animate-in">
                    <svg className="w-14 h-14 text-zinc-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    <p className="font-semibold text-zinc-500 mb-1">No tienes productos guardados</p>
                    <p className="text-sm text-zinc-400 mb-6">Pulsa el corazón en cualquier producto para guardarlo</p>
                    <Link
                        href="/"
                        className="px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors"
                    >
                        Ver catálogo
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items.map((item, i) => (
                        <div
                            key={item.id}
                            className="bg-white border border-zinc-100 rounded-2xl overflow-hidden card-lift"
                            style={{ animation: `fade-in-up 0.38s cubic-bezier(0.22,1,0.36,1) ${i * 45}ms both` }}
                        >
                            {/* Image */}
                            <Link href={`/products/${item.id}`}>
                                <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
                                    {item.imageUrl
                                        ? <img src={item.imageUrl} alt={item.nombre} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                        : <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-10 h-10 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                                            </svg>
                                        </div>
                                    }
                                </div>
                            </Link>

                            <div className="p-5">
                                {item.categoryName && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 text-zinc-600 mb-2">
                                        {item.categoryName}
                                    </span>
                                )}
                                <Link href={`/products/${item.id}`}>
                                    <h2 className="text-[15px] font-semibold text-zinc-900 line-clamp-1 mb-1 hover:text-zinc-600 transition-colors">
                                        {item.nombre}
                                    </h2>
                                </Link>
                                <p className="text-xl font-bold text-emerald-600 mb-4">
                                    ${Number(item.precio).toFixed(2)}
                                </p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => moveToCart(item)}
                                        className="btn-press flex-1 bg-zinc-900 text-white py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
                                    >
                                        Agregar al carrito
                                    </button>
                                    <button
                                        onClick={() => remove(item.id)}
                                        className="btn-press p-2 border border-zinc-200 text-zinc-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-xl transition-colors"
                                        title="Quitar de guardados"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
