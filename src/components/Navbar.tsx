'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearAuth, getUserEmail, getUserRole } from '@/lib/auth';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [email, setEmail] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setEmail(getUserEmail());
        setRole(getUserRole());
    }, [pathname]);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    const logout = () => { clearAuth(); router.push('/login'); router.refresh(); };
    const active = (href: string) => pathname === href;

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-sm'
                    : 'bg-white/90 backdrop-blur-sm border-b border-zinc-100'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center shadow-sm group-hover:bg-zinc-800 transition-colors">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-zinc-900 text-sm tracking-tight">
                        ProductStore
                    </span>
                </Link>

                {/* Nav links */}
                <nav className="flex items-center gap-0.5">
                    <Link
                        href="/"
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                            active('/')
                                ? 'bg-zinc-100 text-zinc-900'
                                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                        }`}
                    >
                        Catálogo
                    </Link>

                    {role === 'ADMIN' && (
                        <Link
                            href="/admin"
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                active('/admin')
                                    ? 'bg-zinc-100 text-zinc-900'
                                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                            }`}
                        >
                            Admin
                        </Link>
                    )}

                    {email ? (
                        <div className="flex items-center gap-2 ml-2 pl-3 border-l border-zinc-200">
                            <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-zinc-700">
                                    {email.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="hidden sm:block leading-none">
                                <div className="text-xs font-medium text-zinc-700">{email.split('@')[0]}</div>
                                <div className="text-[11px] text-zinc-400 mt-0.5">{role}</div>
                            </div>
                            <button
                                onClick={logout}
                                className="ml-1 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Cerrar sesión"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="ml-2 px-3.5 py-1.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 active:scale-95 transition-all"
                        >
                            Iniciar sesión
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
