'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { saveAuth } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const ROLES = [
    {
        value: 'CUSTOMER',
        label: 'Cliente',
        desc: 'Explora y descubre productos',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
        ),
    },
    {
        value: 'ADMIN',
        label: 'Administrador',
        desc: 'Gestiona el catálogo completo',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
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
        <div className="min-h-screen flex">

            {/* ── Left dark panel ── */}
            <div className="hidden lg:flex lg:w-[45%] bg-zinc-950 flex-col justify-between p-12 relative overflow-hidden">
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
                    <p className="text-zinc-500 text-sm font-medium mb-4 uppercase tracking-widest">Nueva cuenta</p>
                    <h1 className="text-white text-[42px] font-bold leading-[1.1] tracking-tight">
                        Empieza a<br />explorar hoy<br />mismo.
                    </h1>
                    <p className="text-zinc-400 mt-5 text-[15px] leading-relaxed max-w-xs">
                        Únete y accede a todo el catálogo de productos con la experiencia que mereces.
                    </p>
                </div>

                {/* What you get */}
                <div className="relative space-y-4">
                    {[
                        ['Catálogo completo', 'Accede a todos los productos y categorías'],
                        ['Carrito y guardados', 'Guarda lo que te gusta, compra cuando quieras'],
                        ['Gestión avanzada', 'Los admins pueden crear y editar productos'],
                    ].map(([title, desc]) => (
                        <div key={title} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white text-sm font-medium">{title}</p>
                                <p className="text-zinc-500 text-xs mt-0.5">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right white panel ── */}
            <div className="flex-1 flex items-center justify-center bg-white px-8 py-12 overflow-y-auto">
                <div className="w-full max-w-[380px] animate-in">

                    {/* Mobile brand */}
                    <div className="lg:hidden flex items-center gap-2 mb-10">
                        <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                            </svg>
                        </div>
                        <span className="font-semibold text-zinc-900">ProductStore</span>
                    </div>

                    <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-1">Crear una cuenta</h2>
                    <p className="text-zinc-400 text-sm mb-8">Completa los datos para empezar</p>

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
                            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">Email</label>
                            <input
                                type="email" required autoComplete="email"
                                placeholder="tu@email.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all bg-zinc-50"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
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
                                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">Confirmar</label>
                                <input
                                    type="password" required autoComplete="new-password"
                                    placeholder="••••••••"
                                    value={form.confirmPassword}
                                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all bg-zinc-50"
                                />
                            </div>
                        </div>

                        {/* Role selector */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">Tipo de cuenta</label>
                            <div className="grid grid-cols-2 gap-3">
                                {ROLES.map(r => (
                                    <button
                                        key={r.value} type="button"
                                        onClick={() => setForm({ ...form, role: r.value })}
                                        className={`pill relative p-4 rounded-xl border-2 text-left transition-all ${
                                            form.role === r.value
                                                ? 'border-zinc-900 bg-zinc-900'
                                                : 'border-zinc-200 hover:border-zinc-300 bg-white'
                                        }`}
                                    >
                                        {form.role === r.value && (
                                            <span className="absolute top-3 right-3 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                                <svg className="w-2.5 h-2.5 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            </span>
                                        )}
                                        <span className={`block mb-2 ${form.role === r.value ? 'text-white' : 'text-zinc-500'}`}>
                                            {r.icon}
                                        </span>
                                        <span className={`block text-sm font-semibold ${form.role === r.value ? 'text-white' : 'text-zinc-800'}`}>
                                            {r.label}
                                        </span>
                                        <span className={`block text-xs mt-0.5 leading-snug ${form.role === r.value ? 'text-zinc-400' : 'text-zinc-400'}`}>
                                            {r.desc}
                                        </span>
                                    </button>
                                ))}
                            </div>
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
                                    Creando cuenta...
                                </>
                            ) : 'Crear cuenta'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-zinc-100">
                        <p className="text-center text-sm text-zinc-500">
                            ¿Ya tienes cuenta?{' '}
                            <Link href="/login" className="font-semibold text-zinc-900 hover:underline">
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
