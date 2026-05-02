import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

export function mount(element: Element) {
  const app = createApp(App);
  app.mount(element);

  return () => app.unmount();
}
