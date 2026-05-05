export class SharedButton extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'disabled'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const variant = this.getAttribute('variant') || 'primary';
    const disabled = this.hasAttribute('disabled');
    
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: var(--font-sans, system-ui, sans-serif);
        }
        button {
          font-family: inherit;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 10px 18px;
          border-radius: 8px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          user-select: none;
        }
        
        button.primary {
          background: linear-gradient(135deg, var(--primary, #8b5cf6) 0%, #6366f1 100%);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);
        }
        button.primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(139, 92, 246, 0.35);
          filter: brightness(1.1);
        }
        
        button.secondary {
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-primary, #f3f4f6);
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
          backdrop-filter: blur(8px);
        }
        button.secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        
        button.danger {
          background: linear-gradient(135deg, var(--danger, #ef4444) 0%, #b91c1c 100%);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }
        button.danger:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(239, 68, 68, 0.3);
          filter: brightness(1.1);
        }

        button:active:not(:disabled) {
          transform: translateY(0);
        }
        
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }
      </style>
      <button class="${variant}" ${disabled ? 'disabled' : ''}>
        <slot></slot>
      </button>
    `;
  }
}

if (!customElements.get('shared-button')) {
  customElements.define('shared-button', SharedButton);
}
