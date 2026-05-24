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
        "group relative py-2 px-4 rounded-sm w-full overflow-hidden bg-card border border-border/70",
        featured && "border-primary/30",
        className
      )}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-chalk text-foreground leading-tight",
            featured ? "text-xl" : "text-base"
          )}>
            <span className="block truncate">{truncateText(item.name, 40)}</span>
          </h3>
          {item.description && (
            <p className={cn(
              "font-sans text-muted-foreground mt-2 leading-relaxed",
              "text-xs"
            )}>
              <span className="block overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                {truncateWords(item.description, featured ? 20 : 10)}
              </span>
            </p>
          )}
          {priceDisplay.type === "range" && item.variations && (
            <p className="font-sans text-muted-foreground mt-2 text-xs leading-relaxed">
              <span className="block truncate">
                {truncateWords(item.variations.map((v) => v.name).join(" · "), 8)}
              </span>
            </p>
          )}
        </div>
        
        {config.showPrices && (
          <div className={cn(
            "flex-shrink-0 font-serif text-foreground",
            featured ? "text-xl" : "text-base"
          )}>
            {priceDisplay.type === "tiers" ? (
              <div className="flex flex-col items-end gap-0.5">
                {priceDisplay.tiers.slice(0, 2).map((tier, i) => (
                  <span key={i} className="flex items-center gap-2 text-sm">
                    <span className="font-sans text-muted-foreground text-xs tracking-wide">
                      {truncateText(tier.name, 10)}
                    </span>
                    <span>{formatPrice(tier.price, config)}</span>
                  </span>
                ))}
                {priceDisplay.tiers.length > 2 && (
                  <span className="font-sans text-muted-foreground text-[10px]">
                    +{priceDisplay.tiers.length - 2} more
                  </span>
                )}
              </div>
            ) : priceDisplay.type === "range" ? (
              <span className="flex items-center gap-1 text-sm">
                <span>{formatPrice(priceDisplay.min, config)}</span>
                <span className="text-muted-foreground">–</span>
                <span>{formatPrice(priceDisplay.max, config)}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span className="text-primary/60">&middot;</span>
                <span>{formatPrice(item.price, config)}</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
