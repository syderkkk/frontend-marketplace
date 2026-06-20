'use client';

import { useEffect, useState } from 'react';

const KEY = 'saved_products';

function getSaved(): number[] {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export default function SaveButton({ id }: { id: number }) {
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setSaved(getSaved().includes(id));
    }, [id]);

    const toggle = () => {
        const current = getSaved();
        const next = current.includes(id)
            ? current.filter(x => x !== id)
            : [...current, id];
        localStorage.setItem(KEY, JSON.stringify(next));
        setSaved(next.includes(id));
    };

    return (
        <button
            onClick={toggle}
            className={`btn-press w-full py-3 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-2 ${
                saved
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                    : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
            }`}
        >
            <svg
                className="w-4 h-4 transition-all"
                fill={saved ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            {saved ? 'Guardado' : 'Guardar para después'}
        </button>
    );
}
