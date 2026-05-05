export function showToast(message: string) {
  window.dispatchEvent(
    new CustomEvent("shared:toast", {
      detail: { message },
    })
  );
}