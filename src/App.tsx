import { useRef, useState } from "react";
import type { CartItem, Product } from "./types";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Categories } from "./components/Categories";
import { Products } from "./components/Products";
import { Lookbook } from "./components/Lookbook";
import { Features } from "./components/Features";
import { Newsletter } from "./components/Newsletter";
import { Footer } from "./components/Footer";
import { BackToTop } from "./components/BackToTop";
import { QuickViewModal } from "./components/QuickViewModal";
import { CartSidebar } from "./components/CartSidebar";
import { Toast } from "./components/Toast";

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast(msg);
    toastTimeout.current = setTimeout(() => setToast(null), 2500);
  };

  const addToCart = (product: Product, size: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === size ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size }];
    });
    showToast(`${product.name} (${size}) ditambahkan ke keranjang!`);
    setQuickViewProduct(null);
  };

  const removeFromCart = (productId: number, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === productId && item.selectedSize === size)));
  };

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setSelectedSize(product.sizes[0]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <Hero />
      <Marquee />
      <Categories />
      <Products onQuickView={openQuickView} />
      <Lookbook />
      <Features />
      <Newsletter onSubscribe={() => showToast("Terima kasih sudah subscribe! 🔥")} />
      <Footer />
      <BackToTop />

      <QuickViewModal
        product={quickViewProduct}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
      />

      <CartSidebar
        open={cartOpen}
        cart={cart}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
        onCheckout={() => {
          showToast("Checkout via WhatsApp coming soon! 🚀");
          setCartOpen(false);
        }}
      />

      <Toast message={toast} />
    </>
  );
}

export default App;
