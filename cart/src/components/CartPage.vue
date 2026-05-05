<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { store, type CartItem } from "shared-ui";

const cartItems = ref<CartItem[]>(store.getCart());
const checkoutSuccess = ref(false);

const updateCart = () => {
  cartItems.value = [...store.getCart()];
};

onMounted(() => store.addEventListener("cart-updated", updateCart));
onUnmounted(() => store.removeEventListener("cart-updated", updateCart));

const subtotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
const shipping = computed(() => (subtotal.value === 0 || subtotal.value > 200 ? 0 : 15));
const tax = computed(() => subtotal.value * 0.0825);
const total = computed(() => subtotal.value + shipping.value + tax.value);

const incrementQty = (item: CartItem) => store.updateQuantity(item.product.id, item.quantity + 1);
const decrementQty = (item: CartItem) => store.updateQuantity(item.product.id, item.quantity - 1);
const removeItem = (productId: string) => store.removeFromCart(productId);

const handleCheckout = () => {
  checkoutSuccess.value = true;
  setTimeout(() => {
    store.clearCart();
    checkoutSuccess.value = false;
  }, 4000);
};

const formatPrice = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD" });
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-8 text-slate-100 md:px-8">
    <h2 class="mb-8 text-3xl font-extrabold tracking-tight text-white">Shopping cart</h2>

    <div v-if="checkoutSuccess" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div class="w-full max-w-md rounded-3xl border border-emerald-400/30 bg-slate-900 p-8 text-center shadow-2xl">
        <div class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-400/15 text-3xl text-emerald-300">✓</div>
        <h3 class="mt-5 text-2xl font-bold text-white">Order placed!</h3>
        <p class="mt-2 text-slate-400">Thank you for your purchase. We’re preparing your order now.</p>
        <div class="mt-6 h-1 overflow-hidden rounded-full bg-white/10"><div class="h-full w-full origin-left animate-pulse bg-emerald-400"></div></div>
      </div>
    </div>

    <section v-if="cartItems.length === 0 && !checkoutSuccess" class="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/50 px-6 py-24 text-center shadow-2xl shadow-black/20">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08),transparent_70%)]"></div>
      <div class="relative">
        <div class="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 text-5xl shadow-lg shadow-violet-950/30 ring-1 ring-white/10">
          🛒
        </div>
        <h3 class="mt-7 text-3xl font-extrabold tracking-tight text-white">Your cart is empty</h3>
        <a href="/" class="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 hover:shadow-xl hover:shadow-violet-950/40 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 focus:ring-offset-slate-900">
          <span>Browse products</span>
          <span aria-hidden="true" class="text-lg">→</span>
        </a>
      </div>
    </section>

    <div v-else-if="!checkoutSuccess" class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div class="space-y-4">
        <article v-for="item in cartItems" :key="item.product.id" class="grid gap-5 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/10 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center">
          <div class="aspect-square rounded-xl bg-white p-3">
            <img :src="item.product.image" :alt="item.product.name" class="h-full w-full object-contain" />
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-violet-300">{{ item.product.category }}</p>
            <h3 class="mt-1 font-bold text-white">{{ item.product.name }}</h3>
            <p class="mt-2 text-slate-400">{{ formatPrice(item.product.price) }}</p>
          </div>
          <div class="flex items-center justify-between gap-5 sm:flex-col sm:items-end">
            <div class="flex items-center rounded-lg border border-white/10 bg-white/5 p-1">
              <button class="grid h-8 w-8 place-items-center rounded-md text-lg text-white hover:bg-white/10" aria-label="Decrease quantity" @click="decrementQty(item)">−</button>
              <span class="w-9 text-center font-semibold">{{ item.quantity }}</span>
              <button class="grid h-8 w-8 place-items-center rounded-md text-lg text-white hover:bg-white/10" aria-label="Increase quantity" @click="incrementQty(item)">+</button>
            </div>
            <div class="text-right">
              <p class="font-bold text-white">{{ formatPrice(item.product.price * item.quantity) }}</p>
              <button class="mt-1 text-sm font-semibold text-rose-300 hover:text-rose-200" @click="removeItem(item.product.id)">Remove</button>
            </div>
          </div>
        </article>
      </div>

      <aside class="h-fit rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-black/20 lg:sticky lg:top-6">
        <h3 class="text-xl font-bold text-white">Order summary</h3>
        <dl class="mt-6 space-y-4 text-sm">
          <div class="flex justify-between text-slate-400"><dt>Subtotal</dt><dd class="text-slate-100">{{ formatPrice(subtotal) }}</dd></div>
          <div class="flex justify-between text-slate-400"><dt>Shipping</dt><dd :class="shipping === 0 ? 'font-semibold text-emerald-300' : 'text-slate-100'">{{ shipping === 0 ? 'FREE' : formatPrice(shipping) }}</dd></div>
          <div class="flex justify-between text-slate-400"><dt>Estimated tax</dt><dd class="text-slate-100">{{ formatPrice(tax) }}</dd></div>
          <div class="flex justify-between border-t border-white/10 pt-4 text-lg font-bold text-white"><dt>Total</dt><dd>{{ formatPrice(total) }}</dd></div>
        </dl>
        <p v-if="shipping > 0" class="mt-5 rounded-xl bg-violet-500/10 p-3 text-sm text-violet-200">Add {{ formatPrice(200 - subtotal) }} more for free shipping.</p>
        <button class="mt-6 w-full rounded-xl bg-violet-600 px-5 py-3 font-bold text-white transition hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-300" @click="handleCheckout">Proceed to checkout</button>
      </aside>
    </div>
  </div>
</template>
