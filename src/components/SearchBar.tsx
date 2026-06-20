'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [value, setValue] = useState(searchParams.get('q') || '');
    const [, startTransition] = useTransition();

    const search = useCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        term ? params.set('q', term) : params.delete('q');
        startTransition(() => { router.push(`/?${params.toString()}`); });
    }, [router, searchParams]);

    return (
        <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
            </svg>
            <input
                type="text"
                placeholder="Buscar productos..."
                value={value}
                onChange={e => {
                    setValue(e.target.value);
                    search(e.target.value);
                }}
                className="w-full sm:w-72 pl-10 pr-4 py-2 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
            />
            {value && (
                <button
                    onClick={() => { setValue(''); search(''); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
