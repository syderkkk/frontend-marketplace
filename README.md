# Frontend — Marketplace

Aplicación web construida con **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**. Consume la API del backend, implementa autenticación con JWT y control de acceso por roles mediante proxy (middleware).

---

## Stack

| Tecnología | Uso |
|---|---|
| Next.js 16 (App Router) | Framework React con SSR/SSG |
| TypeScript | Tipado estático |
| Tailwind CSS v4 | Estilos utilitarios |
| CSS View Transitions API | Animaciones entre páginas |

---

## Estructura

```
src/
├── app/
│   ├── (auth)/              # Grupo de rutas sin navbar
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (shop)/              # Grupo de rutas con navbar
│   │   ├── layout.tsx
│   │   ├── loading.tsx      # Skeleton SSR
│   │   ├── page.tsx         # Catálogo (SSR + SSG categorías)
│   │   ├── admin/page.tsx   # Panel de administración (ADMIN)
│   │   └── products/[id]/page.tsx
│   ├── globals.css          # Animaciones, shimmer, view transitions
│   ├── layout.tsx           # Root layout (html + body)
│   └── not-found.tsx
├── components/
│   ├── Navbar.tsx           # Sticky, glassmorphism, role-aware
│   └── CategoryFilter.tsx   # Client component, filtro por URL param
├── lib/
│   └── auth.ts              # saveAuth, clearAuth, getToken, getAuthHeaders
├── types/
│   └── product.ts           # Interfaces Product, Category, ApiResponse
└── proxy.ts                 # Protección de rutas por cookie (Next.js 16)
```

---

## Variables de entorno

Crea un archivo `.env.local` en la raíz:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

En producción (Vercel), apuntar a la URL del backend en Render:

```env
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com/api
```

---

## Instalación y ejecución

```bash
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build
npm start
```

---

## Páginas y acceso por rol

| Ruta | CUSTOMER | ADMIN | Sin sesión |
|---|---|---|---|
| `/login` | Redirige a `/` | Redirige a `/` | ✅ |
| `/register` | Redirige a `/` | Redirige a `/` | ✅ |
| `/` | ✅ | ✅ | Redirige a `/login` |
| `/products/[id]` | ✅ | ✅ | Redirige a `/login` |
| `/admin` | Redirige a `/` | ✅ | Redirige a `/login` |

La protección se aplica en `proxy.ts` leyendo la cookie `userRole` (servidor) y en `Navbar.tsx` leyendo `localStorage` (cliente).

---

## Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| ADMIN | `admin@marketplace.com` | `admin123` |
| CUSTOMER | `cliente@marketplace.com` | `cliente123` |

---

## Características técnicas

- **SSR**: El catálogo (`/`) se renderiza en servidor con `cache: 'no-store'`
- **SSG**: Las categorías se revalidan cada 60 segundos (`next: { revalidate: 60 }`)
- **Suspense + Skeletons**: Cada sección tiene un fallback shimmer animado mientras carga
- **View Transitions**: Animaciones fluidas entre páginas vía CSS View Transitions API
- **Animaciones**: `fade-in-up` con stagger en la grilla, `card-lift` en hover, `toast-in` en notificaciones
- **Auth dual**: JWT en `localStorage` para llamadas a la API + cookie `userRole` para el proxy de Next.js

---

## Despliegue en Vercel

1. Conectar el repositorio a Vercel
2. Configurar la variable de entorno `NEXT_PUBLIC_API_URL` con la URL del backend en Render
3. Vercel detecta Next.js automáticamente — sin configuración adicional
4. Actualizar `FRONTEND_URL` en el `.env` del backend con la URL de Vercel para el CORS
