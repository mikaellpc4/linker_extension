import { truncateAtSentence } from "@/utils/truncateAtSetence";
import TurndownService from "turndown";

function extractPrice(element: Element | null) {
  if (!element) return null;

  const fraction =
    element.querySelector(".andes-money-amount__fraction")?.textContent || "0";
  const cents =
    element.querySelector(".andes-money-amount__cents")?.textContent || "00";

  const fullText = element.parentElement?.parentElement?.textContent ?? "";

  const installmentMatch = fullText.match(/(\d+)\s*x/i);
  const installments = installmentMatch ? installmentMatch[1] : null;

  return {
    raw: `${fraction.replace(".", "")}${cents}`,
    formatted: `R$ ${fraction.replace(".", "")},${cents}`,
    installments,
  };
}

export async function scrapeMercadoLivre() {
  const pixPriceElement = document.querySelector(
    '.ui-pdp-price__second-line .andes-money-amount[itemprop="offers"]',
  );

  const creditCardPriceElement = document.querySelector(
    ".ui-pdp-price__subtitles .andes-money-amount",
  );

  const titleElement = document.querySelector(".ui-pdp-title");
  const description = document.querySelector(".ui-pdp-description__content");

  // Get the checked radio input
  const selectedRadio = document.querySelector(
    ".ui-pdp-gallery__input:checked",
  );

  // Find the wrapper span that contains the image
  const wrapper = selectedRadio?.nextElementSibling;

  // Get the image element inside the wrapper
  const thumbnailElement = wrapper?.querySelector(
    ".ui-pdp-gallery__figure__image",
  ) as HTMLImageElement;

  const productThumbnail = thumbnailElement?.src;
  const creditCardPrice = extractPrice(creditCardPriceElement);
  const pixPrice = extractPrice(pixPriceElement);
  const productTitle = titleElement?.textContent?.trim();
  const productDescriptionHtml = description?.innerHTML;

  const turndownService = new TurndownService();

  const cleanProductDescription = turndownService.turndown(
    productDescriptionHtml ?? "",
  );

  const truncatedDescription = truncateAtSentence(
    cleanProductDescription ?? "",
    50,
  );

  async function getAffiliateLink() {
    const generateLinkButton = document.querySelector(
      '[data-testid="generate_link_button"]',
    );
    if (generateLinkButton instanceof HTMLButtonElement === false) {
      return "Erro ao detectar botão para gerar o link";
    }

    generateLinkButton.click();

    const maxWaitTime = 5000;
    const checkInterval = 200;
    let elapsed = 0;

    while (elapsed < maxWaitTime) {
      const linkField = document.querySelector(
        '[data-testid="text-fieldlabel_link"]',
      );
      if (linkField instanceof HTMLTextAreaElement) {
        return linkField.value;
      }
      await new Promise((resolve) => setTimeout(resolve, checkInterval));
      elapsed += checkInterval;
    }
    return "Erro ao buscar textarea com o link";
  }

  const affiliatedLink = await getAffiliateLink();

  const formattedText = `
${productTitle}

Por ${creditCardPrice?.installments}x de ${creditCardPrice?.formatted}${pixPrice ? ` (PIX: ${pixPrice.formatted})` : ""}🚨🚨

${truncatedDescription || "Descrição do produto"}

Compre aqui: ${affiliatedLink}
  `.trim();

  return {
    thumbnail: productThumbnail,
    text: formattedText,
  };
}
