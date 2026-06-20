export interface CartItem {
    id: number;
    nombre: string;
    precio: number;
    imageUrl?: string;
    quantity: number;
}

const KEY = 'cart_items';

export function loadCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function saveCart(items: CartItem[]) {
    localStorage.setItem(KEY, JSON.stringify(items));
}
