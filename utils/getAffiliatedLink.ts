export type Plataforms = "mercado_livre" | "shopee" | "magazine";

export async function getAffiliatedLink(
  productLink: string,
  affiliatedId: string,
  platform: Plataforms,
) {
  let affiliatedLink = "";

  switch (platform) {
    case "mercado_livre":
    case "shopee":
    case "magazine":
      const parts = productLink.split("/p/");
      const productId = parts[1]?.split("/")[0];

      affiliatedLink = `https://magazinevoce.com.br/${affiliatedId}/p/${productId}`;
  }

  return affiliatedLink;
}
