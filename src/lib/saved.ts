export interface SavedProduct {
    id: number;
    nombre: string;
    precio: number;
    imageUrl?: string;
    categoryName?: string;
}

function key(): string {
    try { return `saved_${localStorage.getItem('userEmail') || 'guest'}`; } catch { return 'saved_guest'; }
}

export function getSaved(): SavedProduct[] {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(key()) || '[]'); } catch { return []; }
}

export function isSaved(id: number): boolean {
    return getSaved().some(p => p.id === id);
}

export function toggleSaved(product: SavedProduct): boolean {
    const current = getSaved();
    const exists = current.some(p => p.id === product.id);
    const next = exists ? current.filter(p => p.id !== product.id) : [...current, product];
    localStorage.setItem(key(), JSON.stringify(next));
    return !exists;
}

export function removeSaved(id: number) {
    const next = getSaved().filter(p => p.id !== id);
    localStorage.setItem(key(), JSON.stringify(next));
}
