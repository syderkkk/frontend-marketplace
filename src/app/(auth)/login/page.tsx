'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { saveAuth } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const trimmed = { email: form.email.trim(), password: form.password.trim() };
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trimmed),
            });
            const data = await res.json();
            if (data.success) {
                saveAuth(data.data.token, data.data.role, data.data.email);
                router.push('/');
                router.refresh();
            } else {
                setError(data.message || 'Credenciales inválidas');
            }
        } catch {
            setError('No se pudo conectar al servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* ── Left dark panel ── */}
            <div className="hidden lg:flex lg:w-[45%] bg-zinc-950 flex-col justify-between p-12 relative overflow-hidden">
                {/* Subtle grain texture via radial gradients */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_40%,rgba(120,119,198,0.08),transparent)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(255,255,255,0.03),transparent)]" />

                {/* Brand */}
                <div className="relative flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                        </svg>
                    </div>
                    <span className="text-white font-semibold text-[15px] tracking-tight">ProductStore</span>
                </div>

                {/* Main copy */}
                <div className="relative">
                    <p className="text-zinc-500 text-sm font-medium mb-4 uppercase tracking-widest">Marketplace</p>
                    <h1 className="text-white text-[42px] font-bold leading-[1.1] tracking-tight">
                        Todo lo que<br />necesitas,<br />en un lugar.
                    </h1>
                    <p className="text-zinc-400 mt-5 text-[15px] leading-relaxed max-w-xs">
                        Gestiona, explora y descubre productos con una experiencia diseñada para ti.
                    </p>
                </div>

                {/* Footer feature list */}
                <div className="relative space-y-3">
                    {[
                        ['10+', 'Productos disponibles'],
                        ['5+', 'Categorías organizadas'],
                        ['2 roles', 'Cliente y Administrador'],
                    ].map(([v, l]) => (
                        <div key={l} className="flex items-center gap-3">
                            <span className="text-white font-bold text-sm min-w-[40px]">{v}</span>
                            <span className="text-zinc-500 text-sm">{l}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right white panel ── */}
            <div className="flex-1 flex items-center justify-center bg-white px-8 py-12">
                <div className="w-full max-w-[360px] animate-in">

                    {/* Mobile brand */}
                    <div className="lg:hidden flex items-center gap-2 mb-10">
                        <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                            </svg>
                        </div>
                        <span className="font-semibold text-zinc-900">ProductStore</span>
                    </div>

                    <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-1">Iniciar sesión</h2>
                    <p className="text-zinc-400 text-sm mb-8">Ingresa tus datos para continuar</p>

                    {error && (
                        <div className="mb-6 flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl animate-in">
                            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 tracking-wide uppercase">Email</label>
                            <input
                                type="email" required autoComplete="email"
                                placeholder="tu@email.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                onBlur={e => setForm(f => ({ ...f, email: e.target.value.trim() }))}
                                className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all bg-zinc-50"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 tracking-wide uppercase">Contraseña</label>
                            <input
                                type="password" required autoComplete="current-password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all bg-zinc-50"
                            />
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="btn-press w-full bg-zinc-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                    </svg>
                                    Iniciando...
                                </>
                            ) : 'Iniciar sesión'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-zinc-100 space-y-3">
                        <p className="text-center text-sm text-zinc-500">
                            ¿No tienes cuenta?{' '}
                            <Link href="/register" className="font-semibold text-zinc-900 hover:underline">
                                Regístrate
                            </Link>
                        </p>
                        <div className="space-y-1.5">
                            <p className="text-center text-xs text-zinc-400">
                                <span className="font-medium text-zinc-500">Admin: </span>
                                <span className="font-mono text-zinc-600">admin@marketplace.com</span>
                                {' / '}
                                <span className="font-mono text-zinc-600">admin123</span>
                            </p>
                            <p className="text-center text-xs text-zinc-400">
                                <span className="font-medium text-zinc-500">Cliente: </span>
                                <span className="font-mono text-zinc-600">cliente@marketplace.com</span>
                                {' / '}
                                <span className="font-mono text-zinc-600">cliente123</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
