import { createRoot } from "react-dom/client";
import { AffiliateButton } from "@/components/AffiliateButton";
import "@/entrypoints/style.css";
import { scrapeMagazine } from "./scrapMagazine";

export default defineContentScript({
  matches: ["*://*.magazineluiza.com.br/*", "*://*.magazinevoce.com.br/*"],
  main() {
    const observer = new MutationObserver(() => {
      const buyButton = document.querySelector(
        'button[data-testid="buyButton"]',
      );
      const buyButtonLabel = document.querySelector(
        'button[data-testid="buyButton"] > label',
      );
      const buyButtonParent = buyButton?.parentElement?.parentElement;

      if (
        !buyButton ||
        !buyButtonParent ||
        !buyButtonLabel ||
        buyButtonParent.querySelector("[data-affiliate-injected]")
      )
        return;

      const buttonStyle = buyButton.className;
      const buttonLabelStyle = buyButtonLabel.className;

      const container = document.createElement("div");
      container.setAttribute("data-affiliate-injected", "true");
      buyButtonParent.appendChild(container);

      const root = createRoot(container);

      root.render(
        <AffiliateButton
          labelClassName={buttonLabelStyle}
          buttonClassName={buttonStyle}
          scrapeSite={scrapeMagazine}
        />,
      );
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  },
});
