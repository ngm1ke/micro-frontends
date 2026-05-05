import type { DetailedHTMLProps, HTMLAttributes } from "react";

type SharedElementAttributes = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "shared-button": SharedElementAttributes & { variant?: "primary" | "secondary" | "danger" };
      "shared-card": SharedElementAttributes;
      "shared-toast": SharedElementAttributes & { message?: string; open?: "" };
    }
  }
}
