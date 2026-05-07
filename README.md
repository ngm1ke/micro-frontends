# Micro Frontend Marketplace

A micro frontend architecture built with **Vite Module Federation**, composing independently developed and deployed apps into a single marketplace experience.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     app-shell (React)                │
│              Host app — routing, layout, nav          │
│                                                        │
│   ┌────────────────┐  ┌────────────┐  ┌───────────┐  │
│   │ detail-product │  │    cart    │  │ shared-ui │  │
│   │    (React)     │  │   (Vue)    │  │(Web Comp.)│  │
│   └────────────────┘  └────────────┘  └───────────┘  │
└─────────────────────────────────────────────────────┘
```

| App | Framework | Role |
|---|---|---|
| **app-shell** | React | Host application. Owns routing, layout, header/footer, and mounts remote modules. |
| **detail-product** | React | Remote exposing the product detail page, lazy-loaded into the shell. |
| **cart** | Vue | Remote exposing the cart page, mounted manually into a React wrapper via `mountCart`. |
| **shared-ui** | Web Components | Framework-agnostic shared library exposing UI primitives (`<shared-button>`, `<shared-toast>`) and a shared reactive `store` for products and cart state, consumed by all remotes regardless of framework. |

> `shared-ui` is not consumed via Module Federation `remotes` — it's installed as a shared npm/workspace package so both React and Vue apps import it directly (`import "shared-ui"`).
