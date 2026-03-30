export interface MenuConfig {
  itemsPerPage: number;
  autoRotateInterval: number; // in milliseconds, 0 to disable
  showPrices: boolean;
  currency: string;
  currencyPosition: "before" | "after";
}

export const defaultMenuConfig: MenuConfig = {
  itemsPerPage: 12,
  autoRotateInterval: Number(process.env.NEXT_PUBLIC_AUTO_ROTATE_INTERVAL ?? 5000),
  showPrices: true,
  currency: "$",
  currencyPosition: "before",
};

export function formatPrice(price: number, config: MenuConfig): string {
  const formattedPrice = price.toFixed(2);
  if (config.currencyPosition === "before") {
    return `${config.currency}${formattedPrice}`;
  }
  return `${formattedPrice}${config.currency}`;
}
