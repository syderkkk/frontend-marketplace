import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <div className="min-h-screen flex flex-col bg-zinc-50">
                <Navbar />
                <main className="flex-1">{children}</main>
            </div>
            <CartDrawer />
        </CartProvider>
    );
}
