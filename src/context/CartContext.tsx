'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CartItem, loadCart, saveCart } from '@/lib/cart';

interface CartCtx {
    items: CartItem[];
    isOpen: boolean;
    count: number;
    total: number;
    addItem: (p: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: number) => void;
    updateQty: (id: number, delta: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => { setItems(loadCart()); }, []);
    useEffect(() => { saveCart(items); }, [items]);

    const addItem = useCallback((p: Omit<CartItem, 'quantity'>) => {
        setItems(prev => {
            const exists = prev.find(i => i.id === p.id);
            return exists
                ? prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i)
                : [...prev, { ...p, quantity: 1 }];
        });
        setIsOpen(true);
    }, []);

    const removeItem = useCallback((id: number) => {
        setItems(prev => prev.filter(i => i.id !== id));
    }, []);

    const updateQty = useCallback((id: number, delta: number) => {
        setItems(prev => prev
            .map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i)
            .filter(i => i.quantity > 0)
        );
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const count = items.reduce((s, i) => s + i.quantity, 0);
    const total = items.reduce((s, i) => s + i.precio * i.quantity, 0);

    return (
        <Ctx.Provider value={{
            items, isOpen, count, total,
            addItem, removeItem, updateQty, clearCart,
            openCart: () => setIsOpen(true),
            closeCart: () => setIsOpen(false),
        }}>
            {children}
        </Ctx.Provider>
    );
}

export function useCart() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
}
