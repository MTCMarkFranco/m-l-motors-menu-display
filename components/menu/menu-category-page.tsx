"use client";

import { cn } from "@/lib/utils";
import { MenuItem, MenuCategory } from "@/lib/menu-data";
import { MenuConfig } from "@/lib/menu-config";
import { MenuItemCard } from "./menu-item-card";

interface MenuCategoryPageProps {
  category: MenuCategory;
  items: MenuItem[];
  config: MenuConfig;
  className?: string;
}

export function MenuCategoryPage({ category, items, config, className }: MenuCategoryPageProps) {
  return (
    <section className={cn("py-10 px-4", className)}>
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-2">
            {category.name}
          </h2>
          {category.description && (
            <p className="font-sans text-muted-foreground text-sm tracking-wide">
              {category.description}
            </p>
          )}
          <div className="mt-4 flex items-center justify-center">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>
        </div>

        {/* Items List */}
        <div className="divide-y divide-border/50">
          {items.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              config={config}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
