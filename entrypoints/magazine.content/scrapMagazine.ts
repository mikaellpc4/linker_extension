import { truncateAtSentence } from "@/utils/truncateAtSetence";

export async function scrapeMagazine() {
  const thumbnailElement = document.querySelector(
    'img[data-testid="image-selected-thumbnail"]',
  ) as HTMLImageElement;
  const priceElement = document.querySelector('p[data-testid="installment"]');
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

  const truncatedDescription = truncateAtSentence(richContent ?? "", 50);

  const parts = window.location.href.split("/p/");
  const productId = parts[1]?.split("/")[0];

  const affiliatedId = "samyofertas1";

  const affiliatedLink = `https://magazinevoce.com.br/${affiliatedId}/p/${productId}`;

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
