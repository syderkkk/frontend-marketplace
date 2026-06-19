'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { saveAuth } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const ROLES = [
    { value: 'CUSTOMER', label: 'Cliente', desc: 'Explorar y ver productos', icon: '🛍️' },
    { value: 'ADMIN',    label: 'Admin',   desc: 'Gestionar el catálogo',   icon: '⚙️' },
];

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', role: 'CUSTOMER' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) return setError('Las contraseñas no coinciden');
        if (form.password.length < 6) return setError('Mínimo 6 caracteres');
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, password: form.password, role: form.role }),
            });
            const data = await res.json();
            if (data.success) {
                saveAuth(data.data.token, data.data.role, data.data.email);
                router.push('/');
                router.refresh();
            } else {
                setError(data.message || 'Error al crear cuenta');
            }
        } catch {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-[400px] animate-in">

                {/* Brand */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                        </svg>
                    </div>
                    <span className="font-bold text-zinc-900">ProductStore</span>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="px-7 pt-7 pb-5 border-b border-zinc-100">
                        <h1 className="text-xl font-bold text-zinc-900">Crear una cuenta</h1>
                        <p className="text-sm text-zinc-400 mt-1">Únete y empieza a explorar</p>
                    </div>

                    <div className="p-7">
                        {error && (
                            <div className="mb-5 flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl animate-in">
                                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">Email</label>
                                <input
                                    type="email" required autoComplete="email"
                                    placeholder="tu@email.com"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all bg-zinc-50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">Contraseña</label>
                                <input
                                    type="password" required autoComplete="new-password"
                                    placeholder="Mín. 6 caracteres"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all bg-zinc-50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">Confirmar contraseña</label>
                                <input
                                    type="password" required autoComplete="new-password"
                                    placeholder="••••••••"
                                    value={form.confirmPassword}
                                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all bg-zinc-50"
                                />
                            </div>

                            {/* Role selector */}
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">Tipo de cuenta</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {ROLES.map(r => (
                                        <button
                                            key={r.value} type="button"
                                            onClick={() => setForm({ ...form, role: r.value })}
                                            className={`pill p-3.5 rounded-xl border-2 text-left transition-all ${
                                                form.role === r.value
                                                    ? 'border-zinc-900 bg-zinc-900'
                                                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                                            }`}
                                        >
                                            <div className="text-xl mb-1">{r.icon}</div>
                                            <div className={`text-sm font-semibold ${form.role === r.value ? 'text-white' : 'text-zinc-700'}`}>{r.label}</div>
                                            <div className={`text-xs mt-0.5 ${form.role === r.value ? 'text-zinc-400' : 'text-zinc-400'}`}>{r.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="btn-press w-full bg-zinc-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                        </svg>
                                        Creando cuenta...
                                    </>
                                ) : 'Crear cuenta'}
                            </button>
                        </form>
                    </div>
                </div>

                <p className="mt-5 text-center text-sm text-zinc-500">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/login" className="font-semibold text-zinc-900 hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
