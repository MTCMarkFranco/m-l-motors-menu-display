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
        "group relative p-6 rounded-sm transition-all duration-300",
        featured
          ? "bg-card border border-border hover:border-primary/30 hover:shadow-lg"
          : "hover:bg-card/50",
        className
      )}
    >
      {featured && (
        <div className="absolute -top-2 left-6">
          <span className="inline-block bg-accent text-accent-foreground text-xs px-3 py-1 tracking-wider uppercase font-sans">
            Vedette
          </span>
        </div>
      )}
      
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-chalk text-foreground leading-tight",
            featured ? "text-3xl md:text-4xl" : "text-2xl"
          )}>
            {item.name}
          </h3>
          {item.description && (
            <p className={cn(
              "font-sans text-muted-foreground mt-2 leading-relaxed",
              featured ? "text-sm md:text-base" : "text-sm"
            )}>
              {item.description}
            </p>
          )}
          {priceDisplay.type === "range" && item.variations && (
            <p className="font-sans text-muted-foreground mt-2 text-xs leading-relaxed">
              {item.variations.map((v) => v.name).join(" · ")}
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
                {priceDisplay.tiers.map((tier, i) => (
                  <span key={i} className="flex items-center gap-2 text-sm">
                    <span className="font-sans text-muted-foreground text-xs tracking-wide">
                      {tier.name}
                    </span>
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
              <span className="flex items-center gap-1">
                <span className="text-primary/60">&middot;</span>
                <span>{formatPrice(item.price, config)}</span>
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Decorative line for featured items */}
      {featured && (
        <div className="mt-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      )}
    </div>
  );
}
