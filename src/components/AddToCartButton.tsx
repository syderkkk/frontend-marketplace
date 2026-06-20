'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

interface Props {
    id: number;
    nombre: string;
    precio: number;
    imageUrl?: string;
}

export default function AddToCartButton({ id, nombre, precio, imageUrl }: Props) {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addItem({ id, nombre, precio, imageUrl });
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    return (
        <button
            onClick={handleAdd}
            className={`btn-press w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800'
            }`}
        >
            {added ? (
                <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    ¡Agregado!
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    Agregar al carrito
                </>
            )}
        </button>
    );
}
