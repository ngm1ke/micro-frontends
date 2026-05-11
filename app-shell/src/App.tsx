import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  useParams,
} from "react-router-dom";
import "./App.css";
import "shared-ui";

import { showToast } from "../../shared-ui/src/toast";
import { mountCart } from "cart/mountCart";
import { store, type Product } from "shared-ui";

const ProductDetail = lazy(() => import("detail/ProductDetail"));

const formatPrice = (price: number) =>
  price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

function VueCartWrapper() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let unmount: (() => void) | undefined;

    if (containerRef.current) {
      try {
        unmount = mountCart(containerRef.current);
      } catch (error) {
        console.error("Failed to mount Vue Cart:", error);
      }
    }

    return () => unmount?.();
  }, []);

  return <div ref={containerRef} />;
}

function CatalogPage({
  products,
  productsError,
  handleAddToCart,
}: {
  products: Product[];
  productsError: string | null;
  handleAddToCart: (product: Product) => void;
}) {
  return (
    <div className="animate-fade-in">
      {productsError && (
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-400/30 bg-red-500/10 p-5 text-center text-red-100">
          Could not load the catalog. {productsError}
        </div>
      )}

      <section className="catalog-section mt-6">
        <h2 className="catalog-title">Explore Catalog</h2>

        {!productsError && !products.length && (
          <div className="py-24 text-center text-slate-400">
            Loading products…
          </div>
        )}

        <div className="product-grid">
          {products.map((product) => (
            <article
              key={product.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-violet-400/50"
            >
              <div className="flex h-40 items-center justify-center bg-white p-5 md:h-44">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                />
              </div>

              <div className="flex flex-1 flex-col p-4">
                <span className="mb-2 text-xs font-bold uppercase tracking-widest text-violet-300">
                  {product.category}
                </span>

                <h3 className="text-lg font-bold text-white">{product.name}</h3>

                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-5 text-slate-400">
                  {product.description}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-lg font-extrabold text-white">
                    {formatPrice(product.price)}
                  </span>

                  <div className="flex gap-2">
                    <shared-button
                      variant="secondary"
                      onClick={() => {
                        // handled via Link below in real usage;
                        // kept for parity with shared-button custom element API
                      }}
                    >
                      <Link
                        to={`/product/${product.id}`}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        View
                      </Link>
                    </shared-button>

                    <shared-button
                      variant="primary"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add
                    </shared-button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProductPage() {
  const { productId } = useParams<{ productId: string }>();

  if (!productId) return null;

  return (
    <div className="animate-fade-in">
      <ProductDetail productId={productId} />
    </div>
  );
}

function CartPage() {
  return (
    <div className="animate-fade-in">
      <VueCartWrapper />
    </div>
  );
}

function AppShell() {
  const location = useLocation();

  const [cartCount, setCartCount] = useState(store.getCartTotalCount());
  const [products, setProducts] = useState<Product[]>(store.getProducts());
  const [productsError, setProductsError] = useState<string | null>(null);

  const isCatalog = location.pathname === "/";
  const isCart = location.pathname === "/cart";

  useEffect(() => {
    const updateProducts = () => setProducts(store.getProducts());

    store.addEventListener("products-updated", updateProducts);

    store
      .loadProducts()
      .catch((error: Error) => setProductsError(error.message));

    return () => store.removeEventListener("products-updated", updateProducts);
  }, []);

  useEffect(() => {
    const updateCart = () => {
      setCartCount(store.getCartTotalCount());
    };

    store.addEventListener("cart-updated", updateCart);

    return () => store.removeEventListener("cart-updated", updateCart);
  }, []);

  const handleAddToCart = (product: Product) => {
    store.addToCart(product, 1);
    showToast(`Added ${product.name} to Cart!`);
  };

  return (
    <div className="app-shell">
      <shared-toast />

      <header className="site-header">
        <Link to="/" className="brand">
          <span className="brand-text text-gradient">Market</span>
        </Link>

        <nav className="site-nav">
          <Link
            to="/"
            className={isCatalog ? "nav-link is-active" : "nav-link"}
          >
            Catalog
          </Link>

          <Link
            to="/cart"
            className={
              isCart
                ? "nav-link is-active cart-nav-link"
                : "nav-link cart-nav-link"
            }
          >
            <span className="cart-icon">🛒</span>
            <span>Cart</span>

            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </nav>
      </header>

      <main className="main-content">
        <Suspense
          fallback={
            <div className="loading-viewport">
              <div className="loading-spinner" />
            </div>
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <CatalogPage
                  products={products}
                  productsError={productsError}
                  handleAddToCart={handleAddToCart}
                />
              }
            />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-section">
            
            <span className="footer-copy">© 2026 Marketplace. All rights reserved.</span>
          </div>
          <nav className="footer-links">
            <a href="#" className="footer-link">About</a>
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Terms</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
