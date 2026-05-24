"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/lib/menu-data";
import { MenuConfig, formatPrice } from "@/lib/menu-config";

interface MenuItemCardProps {
  item: MenuItem;
  config: MenuConfig;
  featured?: boolean;
  className?: string;
}

function truncateWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")}...`;
}

function truncateText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars).trimEnd()}...`;
}

export function MenuItemCard({ item, config, featured, className }: MenuItemCardProps) {
  const isGroupTitle = featured && item.isGroupTitle;
  const isVariationRow = featured && item.isVariationRow;
  const hasVariations = !!item.variations && item.variations.length > 0;
  const hasPricedVariations = hasVariations && item.variations!.some((variation) => variation.price > 0);

  // Deduplicate variations by price to group same-priced options
  const priceDisplay = useMemo(() => {
    if (!item.variations || item.variations.length <= 1) {
      return { type: "single" as const };
    }

    const uniquePrices = [...new Set(item.variations.map((v) => v.price))];

    // If all variations have the same price, show single price
    if (uniquePrices.length === 1) {
      return { type: "single" as const };
    }

    // If there are a reasonable number of distinct price tiers (≤5), show each
    if (uniquePrices.length <= 5) {
      // Group variations by price, pick the first name per price
      const tiers = uniquePrices
        .sort((a, b) => a - b)
        .map((price) => {
          const match = item.variations!.find((v) => v.price === price)!;
          return { name: match.name, price };
        });
      return { type: "tiers" as const, tiers };
    }

    // Many price points — show a range
    const min = Math.min(...uniquePrices);
    const max = Math.max(...uniquePrices);
    return { type: "range" as const, min, max };
  }, [item.variations]);

  return (
    <div
      className={cn(
        "group relative rounded-sm w-full overflow-hidden bg-card border border-border/70",
        isGroupTitle ? "py-1 px-3" : featured ? "py-1.5 px-3" : "py-2 px-4",
        featured && "border-primary/30",
        isGroupTitle && "bg-muted/40 border-border/40",
        className
      )}
    >
      <div className="flex w-full justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-chalk text-foreground leading-tight",
            isGroupTitle ? "text-sm tracking-wide uppercase" : featured ? "text-lg" : "text-base"
          )}>
            <span className={cn("block", !featured && "truncate")}>
              {featured ? (
                isVariationRow && item.description ? (
                  <>
                    <span>{item.name}</span>
                    <span className="ml-2 text-[11px] text-muted-foreground/90 align-middle">
                      {`{${item.description}}`}
                    </span>
                  </>
                ) : (
                  item.name
                )
              ) : (
                truncateText(item.name, 40)
              )}
            </span>
          </h3>
          {featured && !isGroupTitle && !isVariationRow && item.description && (
            <p className={cn(
              "font-sans text-muted-foreground mt-1",
              featured ? "text-[11px] leading-tight" : "text-xs leading-relaxed"
            )}>
              <span className={cn(
                "block",
                !featured && "overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]"
              )}>
                {featured ? item.description : truncateWords(item.description, 10)}
              </span>
            </p>
          )}
          {featured && !isGroupTitle && item.variations && item.variations.length > 0 && (
            <ul className="mt-1 pl-4 space-y-0">
              {item.variations.map((variation, index) => (
                <li key={`${item.id}-variation-${index}`} className="font-sans text-[11px] leading-tight text-muted-foreground list-disc">
                  <div>
                    {hasPricedVariations && variation.price > 0
                      ? `${variation.name} ${formatPrice(variation.price, config)}`
                      : variation.name}
                  </div>
                  {variation.description && (
                    <div className="ml-3 mt-0.5 text-[10px] leading-tight text-muted-foreground/90">
                      {variation.description}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
          {priceDisplay.type === "range" && item.variations && !featured && (
            <p className="font-sans text-muted-foreground mt-2 text-xs leading-relaxed">
              <span className="block truncate">
                {truncateWords(item.variations.map((v) => v.name).join(" · "), 8)}
              </span>
            </p>
          )}
        </div>
        
        {config.showPrices && !isGroupTitle && (!featured || !hasPricedVariations) && (
          <div className={cn(
            "ml-auto flex-shrink-0 font-serif text-foreground text-right whitespace-nowrap self-start",
            featured ? "text-[18px]" : "text-[14px]"
          )}>
            {priceDisplay.type === "tiers" ? (
              <div className="flex flex-col items-end gap-0.5">
                {priceDisplay.tiers.map((tier, i) => (
                  <span key={i} className="flex items-center gap-2 text-sm">
                    {!featured && (
                      <span className="font-sans text-muted-foreground text-xs tracking-wide">
                        {truncateText(tier.name, 10)}
                      </span>
                    )}
                    <span>{formatPrice(tier.price, config)}</span>
                  </span>
                ))}
              </div>
            ) : priceDisplay.type === "range" ? (
              <span className="flex items-center gap-1 text-sm">
                <span>{formatPrice(priceDisplay.min, config)}</span>
                <span className="text-muted-foreground">–</span>
                <span>{formatPrice(priceDisplay.max, config)}</span>
              </span>
            ) : (
              <span>{formatPrice(item.price, config)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
