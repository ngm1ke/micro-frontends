import { useEffect, useState } from "react";
import ProductDetail from "./components/ProductDetail";
import { store, type Product } from "shared-ui";
import "shared-ui/style.css";

export default function App() {
  const [products, setProducts] = useState<Product[]>(store.getProducts());
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    const updateProducts = () => {
      const nextProducts = store.getProducts();
      setProducts(nextProducts);
      setSelectedId((current) => current || nextProducts[0]?.id || "");
    };
    store.addEventListener("products-updated", updateProducts);
    store.loadProducts().catch((error) => console.error("Failed to load products:", error));
    return () => store.removeEventListener("products-updated", updateProducts);
  }, []);

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-100 flex flex-col">
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-center font-bold uppercase tracking-wider text-sm shadow-md">
        Standalone Preview of Product Detail Remote (React)
      </header>

      <div className="flex-1 flex flex-col md:flex-row gap-6 p-6">
        {/* Standalone Sidebar Switcher */}
        <div className="w-full md:w-64 space-y-3 shrink-0">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">
            Switch Devices
          </h2>
          <div className="space-y-1 bg-white/2 p-2 border border-white/5 rounded-2xl">
            {products.map((prod) => (
              <button
                key={prod.id}
                onClick={() => setSelectedId(prod.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  selectedId === prod.id
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {prod.name}
              </button>
            ))}
          </div>
        </div>

        {/* Component Display */}
        <div className="flex-1 bg-white/[0.01] border border-white/5 rounded-3xl p-4 overflow-hidden">
          {selectedId ? <ProductDetail productId={selectedId} /> : <p className="p-8 text-gray-400">Loading products…</p>}
        </div>
      </div>
    </div>
  );
}
