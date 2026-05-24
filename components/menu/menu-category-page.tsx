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
    <section className={cn("relative overflow-hidden flex flex-col", className)}>
      {category.imageUrl && (
        <img
          src={category.imageUrl}
          alt=""
          className="absolute top-0 left-0 w-full h-auto"
          style={{ opacity: 0.2 }}
        />
      )}
      <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col flex-1">
        {/* Items List — each item gets an equal share of the available height */}
        <div className="flex flex-col flex-1 divide-y divide-border/50">
          {items.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              config={config}
              className="flex-1 flex items-center"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
