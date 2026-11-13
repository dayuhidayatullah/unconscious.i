import { useEffect, useRef, useState } from "react";
import type { CartItem, CategoryFilter, Product } from "./types";
import { buildWhatsAppUrl } from "./lib/whatsapp";
import { type AppliedPromo } from "./lib/promo";
import { api } from "./lib/api";
import { products as staticProducts } from "./data/products";
import { useWishlist } from "./lib/useWishlist";
import { DropCountdown } from "./components/DropCountdown";
import { Testimonials } from "./components/Testimonials";
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
import { saveDetails, type CheckoutDetails } from "./lib/checkoutDetails";
import { Toast } from "./components/Toast";

const CART_KEY = "unconscious-cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function App() {
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [filter, setFilter] = useState<CategoryFilter | null>(null);
  const [promo, setPromo] = useState<AppliedPromo | null>(null);
  const [catalog, setCatalog] = useState<Product[]>(staticProducts);
  const wishlist = useWishlist();
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* storage penuh / diblokir: abaikan */
    }
  }, [cart]);

  // Ambil katalog dari API; jika server tidak tersedia, pakai data statis sebagai fallback.
  useEffect(() => {
    api
      .products()
      .then((list) => list.length > 0 && setCatalog(list))
      .catch(() => {});
  }, []);

  const showToast =(msg: string) => {
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

  const changeQty = (productId: number, size: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.selectedSize === size
          ? { ...item, quantity: Math.min(10, Math.max(1, item.quantity + delta)) }
          : item,
      ),
    );
  };

  const selectCategory = (f: CategoryFilter) => {
    setFilter(f);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  const openQuickView =(product: Product) => {
    setQuickViewProduct(product);
    setSelectedSize(product.sizes[0]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  /** Validasi kode ke server. Mengembalikan pesan error, atau null jika berhasil. */
  const applyPromo = async (code: string): Promise<string | null> => {
    try {
      const p = await api.validatePromo(code);
      setPromo(p);
      showToast(`Kode ${p.code} diterapkan!`);
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : "Kode promo tidak valid";
    }
  };

  const checkout = async (details: CheckoutDetails) => {
    // Server menghitung ulang harga, stok, dan diskon; total dari server yang dipakai.
    const order = await api.createOrder({
      ...details,
      promoCode: promo?.code ?? null,
      items: cart.map((i) => ({ productId: i.id, size: i.selectedSize, quantity: i.quantity })),
    });
    saveDetails(details);
    const url = buildWhatsAppUrl(cart, {
      total: order.total,
      discount: order.discount,
      shipping: order.shipping,
      promoCode: order.promoCode,
      orderId: order.id,
    });
    setCart([]);
    setPromo(null);
    setCartOpen(false);
    showToast(`Pesanan #${order.id} dibuat. Mengarahkan ke WhatsApp...`);
    if (!window.open(url, "_blank", "noopener,noreferrer")) window.location.href = url;
  };

  const subscribe = async (email: string) => {
    try {
      await api.subscribe(email);
      showToast("Terima kasih sudah subscribe! 🔥");
      return true;
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Gagal subscribe");
      return false;
    }
  };

  return (
    <>
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <Hero />
      <Marquee />
      <Categories onSelect={selectCategory} />
      <Products
        products={catalog}
        filter={filter}
        onFilterChange={setFilter}
        onQuickView={openQuickView}
        wishlist={wishlist.ids}
        onToggleWish={wishlist.toggle}
      />
      <DropCountdown />
      <Lookbook />
      <Features />
      <Testimonials />
      <Newsletter onSubscribe={subscribe} />
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
        cartSubtotal={cartSubtotal}
        promo={promo}
        onApplyPromo={applyPromo}
        onRemovePromo={() => setPromo(null)}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
        onChangeQty={changeQty}
        onCheckout={checkout}
      />

      <Toast message={toast} />
    </>
  );
}

export default App;
