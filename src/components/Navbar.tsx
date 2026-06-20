'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserEmail, getUserRole } from '@/lib/auth';
import { useCart } from '@/context/CartContext';
import UserMenu from '@/components/UserMenu';

export default function Navbar() {
    const pathname = usePathname();
    const [email, setEmail] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const { count, openCart } = useCart();

    useEffect(() => {
        setEmail(getUserEmail());
        setRole(getUserRole());
    }, [pathname]);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    const active = (href: string) => pathname === href;

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${
            scrolled
                ? 'bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-sm'
                : 'bg-white/90 backdrop-blur-sm border-b border-zinc-100'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center shadow-sm group-hover:bg-zinc-800 transition-colors">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-zinc-900 text-sm tracking-tight">ProductStore</span>
                </Link>

                <nav className="flex items-center gap-0.5">
                    <Link href="/" className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${active('/') ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}`}>
                        Catálogo
                    </Link>

                    {role === 'ADMIN' && (
                        <Link href="/admin" className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${active('/admin') ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}`}>
                            Admin
                        </Link>
                    )}

                    {/* Cart */}
                    <button onClick={openCart} className="relative p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors ml-0.5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                        {count > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-zinc-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-in">
                                {count > 99 ? '99+' : count}
                            </span>
                        )}
                    </button>

                    {/* User */}
                    {email && role ? (
                        <div className="ml-1">
                            <UserMenu email={email} role={role} />
                        </div>
                    ) : (
                        <Link href="/login" className="ml-2 px-3.5 py-1.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 active:scale-95 transition-all">
                            Iniciar sesión
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
