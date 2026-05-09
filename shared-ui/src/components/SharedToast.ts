export class SharedToast extends HTMLElement {
  private timeoutId?: number;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    window.addEventListener("shared:toast", this.handleToast as EventListener);
  }

  disconnectedCallback() {
    window.removeEventListener(
      "shared:toast",
      this.handleToast as EventListener
    );
  }

  private handleToast = (event: CustomEvent<{ message: string }>) => {
    this.show(event.detail.message);
  };

  private show(message: string) {
    const toast = this.shadowRoot!.querySelector(".toast") as HTMLDivElement;
    const text = this.shadowRoot!.querySelector(".message") as HTMLSpanElement;

    text.textContent = message;

    toast.classList.add("is-open");

    window.clearTimeout(this.timeoutId);

    this.timeoutId = window.setTimeout(() => {
      toast.classList.remove("is-open");
    }, 3000);
  }

  private render() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: contents;
        }

        .toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 17px;
          border-radius: 14px;
          background: #171525;
          border: 1px solid rgba(167, 139, 250, 0.38);
          color: #f5f3ff;
          font: 600 14px/1.4 system-ui, sans-serif;
          box-shadow: 0 18px 48px rgba(0, 0, 0, 0.36);

          opacity: 0;
          transform: translateY(-12px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          pointer-events: none;
          z-index: 9999;
        }

        .toast.is-open {
          opacity: 1;
          transform: translateY(0);
        }

        .icon {
          color: #a78bfa;
        }

        @media (max-width: 640px) {
          .toast {
            left: 16px;
            right: 16px;
            top: 16px;
          }
        }
      </style>

      <div class="toast" role="status" aria-live="polite">
        <span class="icon">✓</span>
        <span class="message"></span>
      </div>
    `;
  }
}

if (!customElements.get("shared-toast")) {
  customElements.define("shared-toast", SharedToast);
}