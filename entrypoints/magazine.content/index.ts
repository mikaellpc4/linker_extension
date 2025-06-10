import { getAffiliatedLink } from "@/utils/getAffiliatedLink";

export default defineContentScript({
  matches: ["*://*.magazineluiza.com.br/*"],
  main() {
    const buyButton = document.querySelector('button[data-testid="buyButton"]');
    const buyButtonParent = buyButton?.parentElement?.parentElement;

    if (!buyButton || !buyButtonParent) return;

    const buttonStyle = buyButton.className;

    const newButton = document.createElement("button");
    const span = document.createElement("span");
    const label = document.createElement("label");
    span.innerHTML = `
<svg fill stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 252.118V48C0 21.49 21.49 0 48 0h204.118a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882L293.823 497.941c-18.745 18.745-49.137 18.745-67.882 0L14.059 286.059A48 48 0 0 1 0 252.118zM112 64c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z"></path>
</svg>
`;
    span.style.width = "20px";
    label.textContent = "GERAR AFILIADO";
    label.style.fontWeight = "500";
    label.style.fontSize = "14px";
    label.style.alignSelf = "center";

    newButton.appendChild(span);
    newButton.appendChild(label);

    newButton.className = buttonStyle;
    newButton.onclick = async () => {
      const { thumbnail, text } = await scrapeSite();

      showScrapeModal(text, thumbnail);
    };

    buyButtonParent.appendChild(newButton);

    function showScrapeModal(text: string, thumbnail?: string) {
      const existing = document.getElementById("scrape-modal");
      if (existing) existing.remove();

      const modal = document.createElement("div");
      modal.id = "scrape-modal";
      modal.style.position = "fixed";
      modal.style.top = "50%";
      modal.style.left = "50%";
      modal.style.width = "500px";
      modal.style.height = "80vh";
      modal.style.transform = "translate(-50%,-50%)";
      modal.style.padding = "16px";
      modal.style.paddingTop = "34px";
      modal.style.background = "#f9f9f9";
      modal.style.border = "2px solid rgba(0,0,0,0.5)";
      modal.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.2)";
      modal.style.zIndex = "9999";
      modal.style.borderRadius = "8px";

      const closeBtn = document.createElement("button");
      closeBtn.innerHTML = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
</svg>
`;
      closeBtn.style.position = "absolute";
      closeBtn.style.right = "6px";
      closeBtn.style.top = "6px";
      closeBtn.style.width = "28px";
      closeBtn.style.border = "none";
      closeBtn.style.background = "transparent";
      closeBtn.style.cursor = "pointer";
      closeBtn.onclick = () => modal.remove();

      modal.appendChild(closeBtn);

      // Optional image
      if (thumbnail) {
        const img = document.createElement("img");
        img.src = thumbnail;
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        img.style.borderRadius = "8px";
        img.style.marginBottom = "12px";
        modal.appendChild(img);
      }

      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.readOnly = true;
      textarea.style.width = "100%";
      textarea.style.height = "35%";
      textarea.style.marginBottom = "8px";
      textarea.style.resize = "none";

      const copyBtn = document.createElement("button");
      const copyBtnSpan = document.createElement("span");
      copyBtnSpan.innerHTML = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
  <path d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"></path>
</svg>`;
      copyBtnSpan.style.width = "20px";
      const copyBtnLabel = document.createElement("label");
      copyBtnLabel.textContent = "COPIAR";
      copyBtnLabel.style.fontWeight = "500";
      copyBtnLabel.style.fontSize = "14px";
      copyBtnLabel.style.alignSelf = "center";
      copyBtnLabel.style.cursor = "pointer";

      copyBtn.appendChild(copyBtnSpan);
      copyBtn.appendChild(copyBtnLabel);

      copyBtn.className = buttonStyle;
      copyBtn.style.cursor = "pointer";
      copyBtn.onclick = async () => {
        await navigator.clipboard.writeText(text);
        copyBtnLabel.textContent = "COPIADO!";
        setTimeout(() => (copyBtnLabel.textContent = "Copiar"), 2000);
      };

      modal.appendChild(textarea);
      modal.appendChild(copyBtn);
      document.body.appendChild(modal);
    }

    async function scrapeSite() {
      const thumbnailElement = document.querySelector(
        'img[data-testid="image-selected-thumbnail"]',
      ) as HTMLImageElement;
      const priceElement = document.querySelector(
        'p[data-testid="installment"]',
      );
      const pixPriceElement = document.querySelector(
        'p[data-testid="price-value"]',
      );
      const titleElement = document.querySelector(
        'h1[data-testid="heading-product-title"]',
      );
      const richContentElements = document.querySelectorAll(
        'div[data-testid="rich-content-container"]',
      );

      const productThumbnail = thumbnailElement.src;
      const price = priceElement?.textContent?.trim();
      const pixPrice = pixPriceElement?.textContent?.trim();
      const productTitle = titleElement?.textContent?.trim();
      const richContent =
        richContentElements[1]?.textContent?.trim() ??
        richContentElements[0]?.textContent?.trim();

      const cleanPixPrice = pixPrice?.replace(/^ou\s+/i, "");

      const truncateAtSentence = (text: string, maxWords: number) => {
        if (!text) return "";

        const words = text.split(/\s+/);
        if (words.length <= maxWords) return text;

        const truncated = words.slice(0, maxWords).join(" ");

        const remainingText = text.substring(truncated.length);
        const nextDotIndex = remainingText.indexOf(".");

        if (nextDotIndex === -1) return truncated + "...";

        return truncated + remainingText.substring(0, nextDotIndex + 1);
      };

      const truncatedDescription = truncateAtSentence(richContent ?? "", 50);

      const affiliatedLink = await getAffiliatedLink(
        window.location.href,
        "samyofertas1",
        "magazine",
      );

      const formattedText = `
${productTitle}

Por ${price}${pixPrice ? ` (PIX: ${cleanPixPrice})` : ""}🚨🚨

${truncatedDescription || "Descrição do produto"}

Compre aqui: ${affiliatedLink}
  `.trim();

      return {
        thumbnail: productThumbnail,
        text: formattedText,
      };
    }
  },
});
