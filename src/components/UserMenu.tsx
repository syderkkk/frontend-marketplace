'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { clearAuth } from '@/lib/auth';
import { getSaved } from '@/lib/saved';

interface Props { email: string; role: string }

export default function UserMenu({ email, role }: Props) {
    const [open, setOpen] = useState(false);
    const [savedCount, setSavedCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        setSavedCount(getSaved().length);
    }, [open]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const logout = () => {
        setOpen(false);
        clearAuth();
        router.push('/login');
        router.refresh();
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                className={`flex items-center gap-2 pl-3 border-l border-zinc-200 transition-opacity ${open ? 'opacity-100' : 'hover:opacity-80'}`}
            >
                <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-white">{email.charAt(0).toUpperCase()}</span>
                </div>
                <div className="hidden sm:block leading-none text-left">
                    <div className="text-xs font-medium text-zinc-700">{email.split('@')[0]}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{role}</div>
                </div>
                <svg className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-zinc-100 rounded-2xl shadow-lg shadow-zinc-900/8 overflow-hidden animate-in z-50">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/60">
                        <p className="text-xs font-semibold text-zinc-900 truncate">{email}</p>
                        <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            role === 'ADMIN'
                                ? 'bg-zinc-900 text-white'
                                : 'bg-emerald-100 text-emerald-700'
                        }`}>
                            {role}
                        </span>
                    </div>

                    {/* Links */}
                    <div className="py-1.5">
                        <Link
                            href="/saved"
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-between px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                        >
                            <span className="flex items-center gap-2.5">
                                <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                                Guardados
                            </span>
                            {savedCount > 0 && (
                                <span className="text-[11px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{savedCount}</span>
                            )}
                        </Link>

                        <div className="my-1 border-t border-zinc-100" />

                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
