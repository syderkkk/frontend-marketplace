'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Product, Category, ApiResponse } from '@/types/product';
import { getAuthHeaders } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const EMPTY = { nombre: '', precio: '', descripcion: '', imageUrl: '', categoryId: '' };

/* ─── Toast ─── */
type ToastT = { id: number; msg: string; type: 'ok' | 'err' };

function Toast({ t, onDone }: { t: ToastT; onDone: () => void }) {
    useEffect(() => { const id = setTimeout(onDone, 3200); return () => clearTimeout(id); }, [onDone]);
    return (
        <div className={`toast-in flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-[13px] font-medium border ${
            t.type === 'ok'
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                : 'bg-red-50 border-red-100 text-red-800'
        }`}>
            {t.type === 'ok'
                ? <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                : <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
            }
            {t.msg}
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">{label}</label>
            {children}
        </div>
    );
}

const inputCls = 'w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-[13.5px] text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all bg-white';

export default function AdminPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(EMPTY);
    const [editId, setEditId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [toasts, setToasts] = useState<ToastT[]>([]);
    const toastId = useRef(0);
    const formRef = useRef<HTMLDivElement>(null);

    const toast = (msg: string, type: 'ok' | 'err') =>
        setToasts(prev => [...prev, { id: ++toastId.current, msg, type }]);

    const fetchAll = useCallback(async () => {
        try {
            const [pr, cr] = await Promise.all([
                fetch(`${API_URL}/products`).then(r => r.json()),
                fetch(`${API_URL}/categories`).then(r => r.json()),
            ]);
            if (pr.success) setProducts(pr.data);
            if (cr.success) setCategories(cr.data);
        } catch { toast('Error al cargar datos', 'err'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const field = (k: keyof typeof EMPTY, v: string) => setForm(p => ({ ...p, [k]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editId ? `${API_URL}/products/${editId}` : `${API_URL}/products`;
            const res = await fetch(url, {
                method: editId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                body: JSON.stringify({
                    nombre: form.nombre,
                    precio: parseFloat(form.precio),
                    descripcion: form.descripcion || undefined,
                    imageUrl: form.imageUrl || undefined,
                    categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setForm(EMPTY); setEditId(null);
                fetchAll();
                toast(editId ? 'Producto actualizado ✓' : 'Producto creado ✓', 'ok');
            } else { toast(data.message, 'err'); }
        } catch { toast('Error de conexión', 'err'); }
        finally { setSaving(false); }
    };

    const startEdit = (p: Product) => {
        setForm({
            nombre: p.nombre, precio: p.precio.toString(),
            descripcion: p.descripcion || '', imageUrl: p.imageUrl || '',
            categoryId: p.categoryId?.toString() || '',
        });
        setEditId(p.id);
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleDelete = async (id: number, nombre: string) => {
        if (!confirm(`¿Eliminar "${nombre}"?`)) return;
        try {
            const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
            const data = await res.json();
            if (data.success) { fetchAll(); toast('Producto eliminado', 'ok'); }
            else toast(data.message, 'err');
        } catch { toast('Error de conexión', 'err'); }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in">
            {/* Toast stack */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 items-end">
                {toasts.map(t => (
                    <Toast key={t.id} t={t} onDone={() => setToasts(p => p.filter(x => x.id !== t.id))} />
                ))}
            </div>

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h1 className="text-[26px] font-bold text-zinc-900 tracking-tight">Panel de administración</h1>
                </div>
                <p className="text-zinc-400 text-sm ml-12">
                    {loading ? 'Cargando...' : `${products.length} productos · ${categories.length} categorías`}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-7">
                {/* Form */}
                <div className="lg:col-span-2" ref={formRef}>
                    <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/60 flex items-center gap-2">
                            {editId ? (
                                <>
                                    <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>
                                    <span className="text-[13.5px] font-semibold text-zinc-700">Editar producto</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
                                    <span className="text-[13.5px] font-semibold text-zinc-700">Nuevo producto</span>
                                </>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <Field label="Nombre *">
                                <input type="text" required value={form.nombre} onChange={e => field('nombre', e.target.value)}
                                    placeholder='Ej: Laptop HP 15"' className={inputCls} />
                            </Field>

                            <Field label="Precio *">
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium">$</span>
                                    <input type="number" step="0.01" min="0.01" required value={form.precio}
                                        onChange={e => field('precio', e.target.value)}
                                        placeholder="0.00"
                                        className={`${inputCls} pl-7`} />
                                </div>
                            </Field>

                            <Field label="Categoría">
                                <select value={form.categoryId} onChange={e => field('categoryId', e.target.value)} className={inputCls}>
                                    <option value="">Sin categoría</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </Field>

                            <Field label="URL de imagen">
                                <input type="url" value={form.imageUrl} onChange={e => field('imageUrl', e.target.value)}
                                    placeholder="https://..." className={inputCls} />
                                {form.imageUrl && (
                                    <div className="mt-2 rounded-xl overflow-hidden border border-zinc-100 aspect-video bg-zinc-50">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover"
                                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                    </div>
                                )}
                            </Field>

                            <Field label="Descripción">
                                <textarea rows={3} value={form.descripcion} onChange={e => field('descripcion', e.target.value)}
                                    placeholder="Descripción del producto..." className={`${inputCls} resize-none`} />
                            </Field>

                            <div className="flex gap-2.5 pt-1">
                                <button type="submit" disabled={saving}
                                    className="btn-press flex-1 bg-zinc-900 text-white py-2.5 rounded-xl text-[13.5px] font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                    {saving && <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                                    {editId ? 'Guardar cambios' : 'Crear producto'}
                                </button>
                                {editId && (
                                    <button type="button" onClick={() => { setForm(EMPTY); setEditId(null); }}
                                        className="btn-press px-4 py-2.5 border border-zinc-200 text-zinc-600 rounded-xl text-[13.5px] hover:bg-zinc-50 transition-colors">
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Products list */}
                <div className="lg:col-span-3">
                    {loading ? (
                        <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-6 space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="shimmer w-11 h-11 rounded-xl shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="shimmer h-3.5 rounded-full w-2/3" />
                                        <div className="shimmer h-3 rounded-full w-1/3" />
                                    </div>
                                    <div className="shimmer w-16 h-7 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-16 text-center animate-in">
                            <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                            </div>
                            <p className="text-zinc-500 font-medium">No hay productos aún</p>
                            <p className="text-zinc-400 text-[13px] mt-1">Crea el primero usando el formulario</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden animate-in">
                            <div className="px-5 py-3.5 border-b border-zinc-100 bg-zinc-50/60 flex items-center justify-between">
                                <span className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider">Productos</span>
                                <span className="text-[12px] font-semibold text-zinc-700 bg-zinc-100 px-2.5 py-0.5 rounded-full">{products.length}</span>
                            </div>
                            <ul className="divide-y divide-zinc-50">
                                {products.map((p, i) => (
                                    <li
                                        key={p.id}
                                        className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-50/80 transition-colors"
                                        style={{ animation: `fade-in-up 0.3s ${i * 35}ms both` }}
                                    >
                                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-zinc-100 shrink-0 flex items-center justify-center border border-zinc-100">
                                            {p.imageUrl
                                                ? <img src={p.imageUrl} alt={p.nombre} className="w-full h-full object-cover" />
                                                : <svg className="w-5 h-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
                                            }
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13.5px] font-semibold text-zinc-800 truncate">{p.nombre}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[13px] font-bold text-emerald-600">${Number(p.precio).toFixed(2)}</span>
                                                {p.category && (
                                                    <span className="text-[11px] text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">{p.category.name}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            <button onClick={() => startEdit(p)}
                                                className="btn-press p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                                                title="Editar">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>
                                            </button>
                                            <button onClick={() => handleDelete(p.id, p.nombre)}
                                                className="btn-press p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
