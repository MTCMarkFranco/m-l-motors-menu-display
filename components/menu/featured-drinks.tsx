"use client";

import { cn } from "@/lib/utils";
import { MenuItem } from "@/lib/menu-data";
import { MenuConfig } from "@/lib/menu-config";
import { MenuItemCard } from "./menu-item-card";

interface FeaturedDrinksProps {
  items: MenuItem[];
  config: MenuConfig;
  className?: string;
}

export function FeaturedDrinks({ items, config, className }: FeaturedDrinksProps) {
  return (
    <section className={cn("py-10 px-4", className)}>
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="block w-8 h-px bg-primary/40" />
              <span className="block w-2 h-2 rounded-full bg-accent" />
              <span className="block w-8 h-px bg-primary/40" />
            </div>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-2">
            Boissons Vedettes
          </h2>
          <p className="font-sans text-muted-foreground text-sm tracking-wide">
            Our signature creations, crafted with care
          </p>
        </div>

        {/* Featured Items Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              config={config}
              featured
            />
          ))}
        </div>

        {/* Decorative footer */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="h-px w-20 bg-border" />
          <svg
            className="w-5 h-5 text-primary/50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 3v18M5.5 8.5l13 7M5.5 15.5l13-7" />
          </svg>
          <div className="h-px w-20 bg-border" />
        </div>
      </div>
    </section>
  );
}
