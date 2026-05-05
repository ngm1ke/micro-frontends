declare module "cart/mountCart" {
  export function mountCart(element: Element): () => void;
}

declare module "detail/ProductDetail" {
  const ProductDetail: import("react").ComponentType<{ productId: string }>;
  export default ProductDetail;
}
