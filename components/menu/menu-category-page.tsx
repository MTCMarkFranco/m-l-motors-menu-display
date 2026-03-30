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
    <section className={cn("py-[1px] px-[1px]", className)}>
      <div className="max-w-4xl mx-auto">
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
