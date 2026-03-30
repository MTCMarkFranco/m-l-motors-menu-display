export interface MenuConfig {
  itemsPerPage: number;
  autoRotateInterval: number; // in milliseconds, 0 to disable
  showPrices: boolean;
  currency: string;
  currencyPosition: "before" | "after";
}

export const defaultMenuConfig: MenuConfig = {
  itemsPerPage: 12,
  autoRotateInterval: 10000, // 10 seconds
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
