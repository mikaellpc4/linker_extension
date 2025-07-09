import { createRoot } from "react-dom/client";
import { AffiliateButton } from "@/components/AffiliateButton";
import "@/entrypoints/style.css";
import { scrapeMagazine } from "./scrapMagazine";

export default defineContentScript({
  matches: ["*://*.magazineluiza.com.br/*"],
  main() {
    const buyButton = document.querySelector('button[data-testid="buyButton"]');
    const buyButtonLabel = document.querySelector(
      'button[data-testid="buyButton"] > label',
    );
    const buyButtonParent = buyButton?.parentElement?.parentElement;

    if (!buyButton || !buyButtonParent || !buyButtonLabel) return;

    const buttonStyle = buyButton.className;
    const buttonLabelStyle = buyButtonLabel.className;

    const container = document.createElement("div");
    buyButtonParent.appendChild(container);

    const root = createRoot(container);

    root.render(
      <AffiliateButton
        labelClassName={buttonLabelStyle}
        buttonClassName={buttonStyle}
        scrapeSite={scrapeMagazine}
      />,
    );
  },
});
