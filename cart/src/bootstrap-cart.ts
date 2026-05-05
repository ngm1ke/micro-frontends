import { createApp } from "vue";
import CartPage from "./components/CartPage.vue";
import "./style.css";
import "shared-ui/style.css";

export function mountCart(element: Element) {
  const app = createApp(CartPage);
  app.mount(element);
  return () => app.unmount();
}
