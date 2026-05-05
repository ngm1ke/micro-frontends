export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  specs: Record<string, string>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const PRODUCTS_URL = "https://fakestoreapi.com/products";

const toProduct = (product: FakeStoreProduct): Product => ({
  id: String(product.id),
  name: product.title,
  price: product.price,
  description: product.description,
  image: product.image,
  category: product.category,
  specs: {
    Category: product.category,
    "Product ID": String(product.id),
    Availability: "In stock",
  },
});

class MarketplaceStore extends EventTarget {
  private cart: CartItem[] = [];
  private products: Product[] = [];
  private productsPromise: Promise<Product[]> | null = null;

  constructor() {
    super();

    try {
      const savedCart = localStorage.getItem("mp_cart");
      if (savedCart) this.cart = JSON.parse(savedCart);
    } catch (error) {
      console.error("Failed to restore cart:", error);
    }
  }

  async loadProducts(): Promise<Product[]> {
    if (this.products.length) return this.products;
    if (this.productsPromise) return this.productsPromise;

    this.productsPromise = fetch(PRODUCTS_URL)
      .then(async (response) => {
        if (!response.ok) throw new Error(`Unable to load products (${response.status})`);
        return (await response.json()) as FakeStoreProduct[];
      })
      .then((products) => {
        this.products = products.map(toProduct);
        this.dispatchEvent(new Event("products-updated"));
        return this.products;
      })
      .catch((error) => {
        this.productsPromise = null;
        throw error;
      });

    return this.productsPromise;
  }

  getProducts(): Product[] {
    return this.products;
  }

  getProduct(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }

  getCart(): CartItem[] {
    return this.cart;
  }

  getCartTotalCount(): number {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  addToCart(product: Product, quantity = 1) {
    const existing = this.cart.find((item) => item.product.id === product.id);
    if (existing) existing.quantity += quantity;
    else this.cart.push({ product, quantity });
    this.saveCart();
  }

  removeFromCart(productId: string) {
    this.cart = this.cart.filter((item) => item.product.id !== productId);
    this.saveCart();
  }

  updateQuantity(productId: string, quantity: number) {
    const item = this.cart.find((cartItem) => cartItem.product.id === productId);
    if (!item || quantity <= 0) return this.removeFromCart(productId);
    item.quantity = quantity;
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  private saveCart() {
    try {
      localStorage.setItem("mp_cart", JSON.stringify(this.cart));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
    this.dispatchEvent(new Event("cart-updated"));
  }
}

const GLOBAL_STORE_KEY = "__MARKETPLACE_STORE__";
const globalStore = window as unknown as Record<string, unknown>;
if (!globalStore[GLOBAL_STORE_KEY]) {
  globalStore[GLOBAL_STORE_KEY] = new MarketplaceStore();
}

export const store = globalStore[GLOBAL_STORE_KEY] as MarketplaceStore;
