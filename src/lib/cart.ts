export interface CartItem {
    id: number;
    nombre: string;
    precio: number;
    imageUrl?: string;
    quantity: number;
}

function key(): string {
    try { return `cart_${localStorage.getItem('userEmail') || 'guest'}`; } catch { return 'cart_guest'; }
}

export function loadCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(key()) || '[]'); } catch { return []; }
}

export function saveCart(items: CartItem[]) {
    localStorage.setItem(key(), JSON.stringify(items));
}
