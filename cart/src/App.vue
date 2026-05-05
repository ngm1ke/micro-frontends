<script setup lang="ts">
import CartPage from "./components/CartPage.vue";
import "shared-ui/style.css";
</script>

<template>
  <div class="standalone-preview">
    <div class="banner">Standalone Preview of Cart Remote (Vue)</div>
    <CartPage />
  </div>
</template>

<style>
.standalone-preview {
  min-height: 100vh;
  background-color: #090a0f;
  color: #f3f4f6;
  padding-bottom: 60px;
}
.banner {
  background: linear-gradient(90deg, #8b5cf6, #3b82f6);
  padding: 12px;
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
