export class SharedCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .card {
          background: var(--bg-surface-glass, rgba(17, 18, 25, 0.7));
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          border-radius: 16px;
          padding: 24px;
          backdrop-filter: var(--glass-blur, blur(16px));
          -webkit-backdrop-filter: var(--glass-blur, blur(16px));
          box-shadow: var(--glass-shadow, 0 8px 32px 0 rgba(0, 0, 0, 0.3));
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .card:hover {
          transform: translateY(-4px);
          border-color: var(--border-hover, rgba(139, 92, 246, 0.3));
          box-shadow: 0 12px 40px 0 rgba(139, 92, 246, 0.15), var(--glass-shadow, 0 8px 32px 0 rgba(0, 0, 0, 0.3));
        }
      </style>
      <div class="card">
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get('shared-card')) {
  customElements.define('shared-card', SharedCard);
}
