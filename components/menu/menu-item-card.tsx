"use client";

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
            "font-serif text-foreground leading-tight",
            featured ? "text-xl md:text-2xl" : "text-lg"
          )}>
            {item.name}
          </h3>
          <p className={cn(
            "font-sans text-muted-foreground mt-2 leading-relaxed",
            featured ? "text-sm md:text-base" : "text-sm"
          )}>
            {item.description}
          </p>
        </div>
        
        {config.showPrices && (
          <div className={cn(
            "flex-shrink-0 font-serif text-foreground",
            featured ? "text-xl" : "text-base"
          )}>
            <span className="flex items-center gap-1">
              <span className="text-primary/60">&middot;</span>
              <span>{formatPrice(item.price, config)}</span>
            </span>
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
