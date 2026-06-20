'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQty, total, count, clearCart } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        closeCart();
        router.push('/checkout');
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={closeCart}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                        <h2 className="font-bold text-zinc-900 text-lg">Carrito</h2>
                        {count > 0 && (
                            <span className="text-xs font-bold bg-zinc-900 text-white px-2 py-0.5 rounded-full">
                                {count}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-400 px-6">
                            <svg className="w-14 h-14 text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                            </svg>
                            <p className="font-medium text-zinc-500">Tu carrito está vacío</p>
                            <p className="text-sm text-center">Agrega productos desde el catálogo</p>
                            <button
                                onClick={closeCart}
                                className="mt-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors"
                            >
                                Ver catálogo
                            </button>
                        </div>
                    ) : (
                        <ul className="divide-y divide-zinc-50 px-4 py-2">
                            {items.map(item => (
                                <li key={item.id} className="flex gap-3 py-4 animate-in">
                                    {/* Thumbnail */}
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                                        {item.imageUrl
                                            ? <img src={item.imageUrl} alt={item.nombre} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                                                </svg>
                                            </div>
                                        }
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-zinc-900 truncate">{item.nombre}</p>
                                        <p className="text-sm font-bold text-emerald-600 mt-0.5">
                                            ${Number(item.precio).toFixed(2)}
                                        </p>

                                        {/* Qty controls */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => updateQty(item.id, -1)}
                                                className="w-6 h-6 rounded-md bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 transition-colors btn-press"
                                            >
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15"/></svg>
                                            </button>
                                            <span className="text-sm font-semibold text-zinc-900 min-w-[20px] text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQty(item.id, 1)}
                                                className="w-6 h-6 rounded-md bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 transition-colors btn-press"
                                            >
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subtotal + remove */}
                                    <div className="flex flex-col items-end justify-between shrink-0">
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-1 text-zinc-300 hover:text-red-400 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        <p className="text-sm font-bold text-zinc-900">
                                            ${(item.precio * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-zinc-100 px-6 py-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-500">Total</span>
                            <span className="text-xl font-bold text-zinc-900">${total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="btn-press w-full bg-zinc-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors"
                        >
                            Completar compra
                        </button>
                        <button
                            onClick={clearCart}
                            className="w-full text-xs text-zinc-400 hover:text-red-500 transition-colors py-1"
                        >
                            Vaciar carrito
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
