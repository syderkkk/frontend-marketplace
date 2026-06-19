'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/types/product';

interface Props { categories: Category[] }

export default function CategoryFilter({ categories }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selected = searchParams.get('categoryId');

    const navigate = (id: string | null) => {
        const p = new URLSearchParams(searchParams.toString());
        id ? p.set('categoryId', id) : p.delete('categoryId');
        router.push(`/?${p.toString()}`);
    };

    if (!categories.length) return null;

    return (
        <div className="flex gap-2 flex-wrap animate-in">
            {[{ id: null, name: 'Todos' }, ...categories.map(c => ({ id: String(c.id), name: c.name }))].map(cat => {
                const isActive = cat.id === null ? !selected : selected === cat.id;
                return (
                    <button
                        key={cat.id ?? 'all'}
                        onClick={() => navigate(cat.id)}
                        className={`pill px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${
                            isActive
                                ? 'bg-zinc-900 text-white border-zinc-900'
                                : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900'
                        }`}
                    >
                        {cat.name}
                    </button>
                );
            })}
        </div>
    );
}
