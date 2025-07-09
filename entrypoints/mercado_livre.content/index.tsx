import { createRoot } from "react-dom/client";
import { AffiliateButton } from "@/components/AffiliateButton";
import "@/entrypoints/style.css";
import { scrapeMercadoLivre } from "./scrapMercadoLivre";

export default defineContentScript({
  matches: ["*://*.mercadolivre.com.br/*"],
  main() {
    const observer = new MutationObserver(() => {
      const buttonsContainer = document.querySelector(
        '.ui-pdp-actions__container',
      );

      if (
        !buttonsContainer ||
        buttonsContainer.querySelector("[data-affiliate-injected]")
      )
        return;

      const buyButton = document.querySelector(
        'button[formaction="https://www.mercadolivre.com.br/gz/checkout/buy"]',
      );

      const buyButtonSpan = document.querySelector(
        'button[formaction="https://www.mercadolivre.com.br/gz/checkout/buy"] > span',
      );

      const buttonStyle = buyButton?.className;

      const buttonSpanStyle = buyButtonSpan?.className;

      const container = document.createElement("div");
      container.setAttribute("data-affiliate-injected", "true");
      buttonsContainer.appendChild(container);

      const root = createRoot(container);
      root.render(
        <AffiliateButton
          buttonClassName={buttonStyle ?? ""}
          labelClassName={buttonSpanStyle ?? ""}
          scrapeSite={scrapeMercadoLivre}
        />,
      );
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  },
});
