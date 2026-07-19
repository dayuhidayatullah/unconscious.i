import { useState, useEffect, useRef } from 'react'
import './App.css'

// Types
interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  image: string
  badge?: string
  description: string
  sizes: string[]
}

interface CartItem extends Product {
  quantity: number
  selectedSize: string
}

// Data
const products: Product[] = [
  {
    id: 1,
    name: 'Abstract Graphic Tee',
    category: 'Tees',
    price: 375000,
    originalPrice: 450000,
    image: '/images/tshirt-graphic.png',
    badge: 'SALE',
    description: 'Oversized graphic t-shirt with abstract blue artwork. Premium 240gsm cotton, screen-printed artwork. True to the unconscious expression.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 2,
    name: 'Quilted Liner Vest',
    category: 'Outerwear',
    price: 485000,
    image: '/images/vest-quilted.png',
    badge: 'NEW',
    description: 'Military-inspired quilted liner vest with diamond quilting pattern. Lightweight warmth, versatile layering piece.',
    sizes: ['M', 'L', 'XL'],
  },
  {
    id: 3,
    name: 'Cable Knit Pullover',
    category: 'Sweaters',
    price: 520000,
    image: '/images/pullover-sweater.png',
    description: 'Oversized cable knit pullover in dark olive. Chunky texture, dropped shoulders. Perfect for the urban explorer.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 4,
    name: 'Fleece Balaclava "Blue Camo"',
    category: 'Accessories',
    price: 175000,
    image: '/images/fleece-balaclava.png',
    badge: 'HOT',
    description: 'Camouflage fleece balaclava with adjustable elastics. Cozy fit, statement piece for the bold.',
    sizes: ['ONE SIZE'],
  },
  {
    id: 5,
    name: 'Quilted Crossbody Bag',
    category: 'Bags',
    price: 345000,
    image: '/images/quilted-bag.png',
    description: 'Quilted crossbody bag with multiple compartments. Water-resistant fabric, adjustable strap.',
    sizes: ['ONE SIZE'],
  },
  {
    id: 6,
    name: 'Leaf Camo Crewneck',
    category: 'Sweaters',
    price: 425000,
    originalPrice: 500000,
    image: '/images/camo-longsleeve.png',
    badge: 'SALE',
    description: 'All-over autumn leaf camouflage crewneck sweatshirt. Heavy 350gsm fleece, ribbed cuffs and hem.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 7,
    name: 'Essential Jogger Pants',
    category: 'Bottoms',
    price: 385000,
    image: '/images/jogger-pants.png',
    description: 'Relaxed fit jogger pants in navy. Elastic waistband with drawcord, side pockets, tapered leg with elastic cuffs.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 8,
    name: 'Oversized Pullover - Olive',
    category: 'Sweaters',
    price: 520000,
    image: '/images/pullover-sweater.png',
    badge: 'BEST',
    description: 'Our best-selling oversized pullover. Cable knit construction, dark olive colorway. Cozy and stylish.',
    sizes: ['M', 'L', 'XL'],
  },
]

const categories = [
  { name: 'Tees & Longsleeves', count: '12 Products', image: '/images/tshirt-graphic.png' },
  { name: 'Sweaters & Outerwear', count: '8 Products', image: '/images/pullover-sweater.png' },
  { name: 'Accessories', count: '6 Products', image: '/images/fleece-balaclava.png' },
]

function formatPrice(price: number): string {
  return 'Rp ' + price.toLocaleString('id-ID')
}

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      setShowBackToTop(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const showToast = (msg: string) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current)
    setToast(msg)
    toastTimeout.current = setTimeout(() => setToast(null), 2500)
  }

  const addToCart = (product: Product, size: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size)
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size }]
    })
    showToast(`${product.name} (${size}) ditambahkan ke keranjang!`)
    setQuickViewProduct(null)
  }

  const removeFromCart = (productId: number, size: string) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.selectedSize === size)))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product)
    setSelectedSize(product.sizes[0])
  }

  return (
    <>
      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="container">
          <a href="#" className="nav-logo">
            UNCONSCIOUS<span className="dot">.</span>I
          </a>

          <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#categories" onClick={() => setMobileMenuOpen(false)}>Collection</a>
            <a href="#products" onClick={() => setMobileMenuOpen(false)}>Shop</a>
            <a href="#lookbook" onClick={() => setMobileMenuOpen(false)}>Lookbook</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
          </div>

          <div className="nav-actions">
            <button className="nav-cart" onClick={() => setCartOpen(true)} aria-label="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
            <button
              className={`nav-toggle ${mobileMenuOpen ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section" id="home">
        <div className="hero-bg">
          <img src="/images/hero-lookbook.png" alt="Unconscious Streetwear" />
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-tag">New Collection 2024</div>
            <h1 className="hero-title">
              LET YOUR<br />
              <span className="outline">MIND</span> <span className="accent">CHOOSE</span>
            </h1>
            <p className="hero-subtitle">
              Let Unconscious speak. Streetwear yang lahir dari ekspresi bawah sadar — 
              raw, authentic, dan tanpa batas.
            </p>
            <div className="hero-actions">
              <a href="#products" className="btn-primary">
                Shop Now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="#lookbook" className="btn-outline">
                Lookbook
              </a>
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          SCROLL
          <div className="line"></div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...Array(3)].map((_, i) => (
            <div className="marquee-item" key={i}>
              <span className="dot"></span> STREETWEAR
              <span className="dot"></span> UNCONSCIOUS
              <span className="dot"></span> AUTHENTIC
              <span className="dot"></span> RAW EXPRESSION
              <span className="dot"></span> LET YOUR MIND CHOOSE
              <span className="dot"></span> CLOTHING BRAND
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="categories-section" id="categories">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-tag">Browse by</div>
              <h2 className="section-title">Categories</h2>
            </div>
            <a href="#products" className="section-link">
              View All <span className="arrow">→</span>
            </a>
          </div>
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <div className="category-card" key={i}>
                <img src={cat.image} alt={cat.name} />
                <div className="category-card-overlay">
                  <div className="category-card-name">{cat.name}</div>
                  <div className="category-card-count">{cat.count}</div>
                </div>
                <div className="category-card-btn">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="products-section" id="products">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-tag">Our Collection</div>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <a href="#" className="section-link">
              View All <span className="arrow">→</span>
            </a>
          </div>
          <div className="products-grid">
            {products.slice(0, 8).map(product => (
              <div className="product-card" key={product.id}>
                <div className="product-image-wrapper">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  {product.badge && (
                    <span className="product-badge">{product.badge}</span>
                  )}
                  <button
                    className="product-quick-add"
                    onClick={() => openQuickView(product)}
                  >
                    Quick View
                  </button>
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <div className="product-name">{product.name}</div>
                  <div className="product-price">
                    <span className="current">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="original">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="lookbook-section" id="lookbook">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-tag">Editorial</div>
              <h2 className="section-title">Lookbook</h2>
            </div>
          </div>
          <div className="lookbook-grid">
            <div className="lookbook-large">
              <img src="/images/hero-lookbook.png" alt="Lookbook" />
              <div className="lookbook-overlay">
                <h3>Urban Night</h3>
                <p>Raw expression in the city after dark</p>
                <a href="#products" className="lookbook-cta">
                  Shop The Look <span>→</span>
                </a>
              </div>
            </div>
            <div className="lookbook-small">
              <img src="/images/lookbook-two.png" alt="Camo Collection" />
              <div className="lookbook-overlay">
                <h3>Camo Series</h3>
                <p>Military-inspired streetwear</p>
                <a href="#products" className="lookbook-cta">
                  Explore <span>→</span>
                </a>
              </div>
            </div>
            <div className="lookbook-small">
              <img src="/images/pullover-sweater.png" alt="Knitwear" />
              <div className="lookbook-overlay">
                <h3>Knitwear</h3>
                <p>Cozy oversized essentials</p>
                <a href="#products" className="lookbook-cta">
                  Explore <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="about">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <div className="feature-title">Free Shipping</div>
              <div className="feature-desc">Gratis ongkir untuk pembelian di atas Rp 500.000</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <div className="feature-title">Premium Quality</div>
              <div className="feature-desc">Material premium dengan detail finishing yang rapi</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <div className="feature-title">Easy Return</div>
              <div className="feature-desc">Pengembalian mudah dalam 7 hari setelah penerimaan</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <div className="feature-title">24/7 Support</div>
              <div className="feature-desc">Customer service siap membantu kapan saja via DM</div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-inner">
            <div className="newsletter-content">
              <div className="section-tag">Stay Updated</div>
              <h2 className="newsletter-title">Join The Movement</h2>
              <p className="newsletter-desc">
                Dapatkan update koleksi terbaru, exclusive drops, dan promo spesial langsung ke inbox kamu.
              </p>
              <form className="newsletter-form" onSubmit={e => { e.preventDefault(); showToast('Terima kasih sudah subscribe! 🔥') }}>
                <input type="email" placeholder="Email address" required />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#" className="nav-logo" style={{ marginBottom: 'var(--space-lg)', display: 'inline-block' }}>
                UNCONSCIOUS<span className="dot">.</span>I
              </a>
              <p>
                Let your mind choose. Let Unconscious speak. 
                Streetwear clothing brand yang mengekspresikan jiwa melalui fashion.
              </p>
              <div className="footer-socials">
                <a href="https://instagram.com/unconscious.i" className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a href="https://linktr.ee/unconscioubrand" className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="Linktree">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Shop</h4>
              <a href="#products">All Products</a>
              <a href="#products">Tees & Longsleeves</a>
              <a href="#products">Sweaters</a>
              <a href="#products">Outerwear</a>
              <a href="#products">Accessories</a>
            </div>
            <div className="footer-col">
              <h4>Info</h4>
              <a href="#">About Us</a>
              <a href="#">Size Guide</a>
              <a href="#">Shipping Info</a>
              <a href="#">Return Policy</a>
              <a href="#">FAQ</a>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <a href="https://instagram.com/unconscious.i" target="_blank" rel="noopener noreferrer">Instagram DM</a>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a href="mailto:hello@unconscious.id">Email</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 Unconscious. All rights reserved.</p>
            <div className="footer-payment">
              <span>BCA</span>
              <span>BNI</span>
              <span>Mandiri</span>
              <span>GoPay</span>
              <span>OVO</span>
            </div>
          </div>
        </div>
      </footer>

      {/* BACK TO TOP */}
      <button
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        ↑
      </button>

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <div className="modal-overlay" onClick={() => setQuickViewProduct(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-image">
              <img src={quickViewProduct.image} alt={quickViewProduct.name} />
            </div>
            <div className="modal-details">
              <div className="modal-category">{quickViewProduct.category}</div>
              <h2 className="modal-name">{quickViewProduct.name}</h2>
              <div className="modal-price-row">
                <span className="modal-price">{formatPrice(quickViewProduct.price)}</span>
                {quickViewProduct.originalPrice && (
                  <span className="modal-original-price">{formatPrice(quickViewProduct.originalPrice)}</span>
                )}
              </div>
              <p className="modal-desc">{quickViewProduct.description}</p>
              <div className="modal-sizes">
                <div className="modal-sizes-label">Size</div>
                <div className="modal-sizes-grid">
                  {quickViewProduct.sizes.map(size => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <button
                className="modal-add-btn"
                onClick={() => addToCart(quickViewProduct, selectedSize)}
              >
                Add to Cart — {formatPrice(quickViewProduct.price)}
              </button>
            </div>
          </div>
          <button className="modal-close" onClick={() => setQuickViewProduct(null)}>✕</button>
        </div>
      )}

      {/* CART SIDEBAR */}
      {cartOpen && (
        <>
          <div className="cart-overlay" onClick={() => setCartOpen(false)} />
          <div className="cart-sidebar">
            <div className="cart-header">
              <h3>Cart ({cartCount})</h3>
              <button className="cart-close" onClick={() => setCartOpen(false)}>✕</button>
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <div className="cart-empty-icon">🛒</div>
                  <p>Keranjang kamu masih kosong</p>
                  <button className="btn-outline" onClick={() => setCartOpen(false)} style={{ marginTop: '8px' }}>
                    Mulai Belanja
                  </button>
                </div>
              ) : (
                cart.map((item, i) => (
                  <div className="cart-item" key={`${item.id}-${item.selectedSize}-${i}`}>
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-meta">Size: {item.selectedSize} · Qty: {item.quantity}</div>
                      <div className="cart-item-price">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item.id, item.selectedSize)}>
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span className="cart-total-label">Total</span>
                  <span className="cart-total-value">{formatPrice(cartTotal)}</span>
                </div>
                <button className="cart-checkout-btn" onClick={() => {
                  showToast('Checkout via WhatsApp coming soon! 🚀')
                  setCartOpen(false)
                }}>
                  Checkout via WhatsApp
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* TOAST */}
      <div className={`toast ${toast ? 'show' : ''}`}>
        <span className="check">✓</span> {toast}
      </div>
    </>
  )
}

export default App
