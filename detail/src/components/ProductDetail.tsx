import { useEffect, useState } from "react";
import { store, type Product } from "shared-ui";
import "../index.css";

interface ProductDetailProps {
  productId: string;
}

interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const formatPrice = (price: number) =>
  price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

function mapFakeStoreProduct(data: FakeStoreProduct): Product {
  return {
    id: String(data.id),
    name: data.title,
    price: data.price,
    description: data.description,
    image: data.image,
    category: data.category,
    specs: {
      Rating: `${data.rating.rate}/5`,
      Reviews: `${data.rating.count}`,
    },
  };
}

export default function ProductDetail({
  productId,
}: ProductDetailProps) {
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      try {
        setLoading(true);

        const response = await fetch(
          `https://fakestoreapi.com/products/${productId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data: FakeStoreProduct = await response.json();

        if (!cancelled) {
          setProduct(mapFakeStoreProduct(data));
        }
      } catch (error) {
        console.error("Failed to load product:", error);

        if (!cancelled) {
          setProduct(undefined);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const goToCatalog = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new Event("popstate"));
  };

  const handleAddToCart = () => {
    if (!product) return;

    store.addToCart(product, 1);

    window.dispatchEvent(
      new CustomEvent("shared:toast", {
        detail: {
          message: `Added ${product.name} to Cart!`,
        },
      }),
    );
  };

  if (loading) {
    return (
      <div className="mx-auto my-12 max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-10 text-center shadow-2xl shadow-black/20">
        <p className="text-white">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto my-12 max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-10 text-center shadow-2xl shadow-black/20">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-300">
          Catalog
        </p>
        <h1 className="mt-3 text-3xl font-bold text-white">
          Product unavailable
        </h1>
        <p className="mt-3 text-slate-400">
          We could not find this product in the current catalog.
        </p>
        <a
          href="/"
          onClick={goToCatalog}
          className="mt-7 inline-flex rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-500"
        >
          Return to catalog
        </a>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <a
        href="/"
        onClick={goToCatalog}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-white"
      >
        <span aria-hidden="true">←</span>
        Continue shopping
      </a>

      <div className="mt-7 grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.95fr)] lg:gap-14">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl shadow-black/25">
          <div className="relative aspect-square p-8 sm:p-14">
            <span className="absolute left-5 top-5 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
              {product.category}
            </span>

            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
            <span>Curated essentials</span>
            <span className="font-medium text-slate-700">
              Free shipping over $200
            </span>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/15 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
            {product.category}
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-5 text-3xl font-bold text-white">
            {formatPrice(product.price)}
          </p>

          <div className="my-7 h-px bg-white/10" />

          <p className="text-base leading-7 text-slate-300">
            {product.description}
          </p>

          <div className="mt-6 rounded-xl border border-white/10 bg-slate-800/50 p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-violet-300">
              Specifications
            </h2>

            <div className="space-y-2">
              {Object.entries(product.specs).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between text-sm"
                >
                  <span className="text-slate-400">{key}</span>
                  <span className="font-medium text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-4 font-bold text-white shadow-lg shadow-violet-950/40 transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <span aria-hidden="true">🛒</span>
            Add to cart
          </button>

          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 text-center text-xs text-slate-400">
            <div>
              <span className="mb-1 block text-lg">↗</span>
              Fast delivery
            </div>

            <div>
              <span className="mb-1 block text-lg">✓</span>
              Secure checkout
            </div>

            <div>
              <span className="mb-1 block text-lg">↺</span>
              Easy returns
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}