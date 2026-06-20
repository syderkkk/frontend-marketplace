'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const router = useRouter();
    const [orderNum] = useState(() => Math.floor(Math.random() * 90000) + 10000);
    const [animate, setAnimate] = useState(false);
    const cleared = useRef(false);

    useEffect(() => {
        if (items.length === 0 && !cleared.current) {
            router.replace('/');
            return;
        }
        const t = setTimeout(() => setAnimate(true), 100);
        return () => clearTimeout(t);
    }, []);

    const handleDone = () => {
        cleared.current = true;
        clearCart();
        router.push('/');
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md text-center animate-in">

                {/* Animated checkmark */}
                <div className="flex items-center justify-center mb-8">
                    <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-700 ${
                        animate ? 'border-emerald-500 bg-emerald-50 scale-100' : 'border-zinc-200 bg-zinc-50 scale-90'
                    }`}>
                        <svg
                            className="w-12 h-12"
                            viewBox="0 0 52 52"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth={3.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path
                                d="M14 26 L22 34 L38 18"
                                className={`transition-all duration-500 ${animate ? 'check-draw' : ''}`}
                                style={{
                                    strokeDasharray: 40,
                                    strokeDashoffset: animate ? 0 : 40,
                                    transition: 'stroke-dashoffset 0.5s cubic-bezier(0.22,1,0.36,1) 0.3s',
                                }}
                            />
                        </svg>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-zinc-900 mb-2">¡Pedido confirmado!</h1>
                <p className="text-zinc-400 text-sm mb-6">
                    Gracias por tu compra. Tu pedido está siendo procesado.
                </p>

                {/* Order card */}
                <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-6 mb-6 text-left space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Número de pedido</span>
                        <span className="font-mono font-bold text-zinc-900">#{orderNum}</span>
                    </div>

                    {/* Items summary */}
                    <div className="space-y-2">
                        {items.map(item => (
                            <div key={item.id} className="flex items-center justify-between">
                                <span className="text-sm text-zinc-600 truncate max-w-[220px]">
                                    {item.nombre}
                                    <span className="text-zinc-400"> ×{item.quantity}</span>
                                </span>
                                <span className="text-sm font-semibold text-zinc-900 shrink-0 ml-2">
                                    ${(item.precio * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                        <span className="text-sm font-semibold text-zinc-900">Total pagado</span>
                        <span className="text-lg font-bold text-emerald-600">${total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Status steps */}
                <div className="flex items-center justify-center gap-2 mb-8 text-xs text-zinc-400">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-emerald-600 font-medium">Confirmado</span>
                    </div>
                    <div className="w-8 h-px bg-zinc-200" />
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-zinc-200" />
                        <span>En preparación</span>
                    </div>
                    <div className="w-8 h-px bg-zinc-200" />
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-zinc-200" />
                        <span>Enviado</span>
                    </div>
                </div>

                <button
                    onClick={handleDone}
                    className="btn-press w-full bg-zinc-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors mb-3"
                >
                    Volver al catálogo
                </button>
                <Link
                    href="/"
                    className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                    Seguir comprando
                </Link>
            </div>
        </div>
    );
}
