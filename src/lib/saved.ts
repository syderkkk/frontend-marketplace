export interface SavedProduct {
    id: number;
    nombre: string;
    precio: number;
    imageUrl?: string;
    categoryName?: string;
}

const KEY = 'saved_products';

export function getSaved(): SavedProduct[] {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function isSaved(id: number): boolean {
    return getSaved().some(p => p.id === id);
}

export function toggleSaved(product: SavedProduct): boolean {
    const current = getSaved();
    const exists = current.some(p => p.id === product.id);
    const next = exists ? current.filter(p => p.id !== product.id) : [...current, product];
    localStorage.setItem(KEY, JSON.stringify(next));
    return !exists;
}

export function removeSaved(id: number) {
    const next = getSaved().filter(p => p.id !== id);
    localStorage.setItem(KEY, JSON.stringify(next));
}
