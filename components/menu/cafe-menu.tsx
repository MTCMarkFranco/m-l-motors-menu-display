"use client";

import { useState, useEffect, useMemo } from "react";
import { fallbackMenuItems, fallbackCategories, MenuItem, MenuCategory } from "@/lib/menu-data";
import { MenuConfig, defaultMenuConfig } from "@/lib/menu-config";
import { MenuItemCard } from "./menu-item-card";

interface ColumnData {
  title: string;
  basisClass: string;
  items: MenuItem[];
}

function normalizeCategoryName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, " ").trim();
}

export function CafeMenu() {
  const [config] = useState<MenuConfig>(defaultMenuConfig);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(fallbackMenuItems);
  const [categories, setCategories] = useState<MenuCategory[]>(fallbackCategories);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch menu data from Square API
  useEffect(() => {
    let cancelled = false;

    async function fetchMenu() {
      try {
        const res = await fetch("/api/menu");
        if (!res.ok) throw new Error("API error");
        const data = await res.json();

        if (cancelled) return;

        if (data.items && data.items.length > 0) {
          setMenuItems(data.items);
          setCategories(data.categories);
        }
        // If API returns empty data, keep the fallback
      } catch {
        // On error, keep using fallback data — no action needed
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchMenu();

    const refreshTimer = setInterval(fetchMenu, 60_000);
    return () => {
      cancelled = true;
      clearInterval(refreshTimer);
    };
  }, []);

  const categoriesById = useMemo(() => {
    const map = new Map<string, MenuCategory>();
    for (const category of categories) {
      map.set(category.id, category);
    }
    return map;
  }, [categories]);

  const columns = useMemo<ColumnData[]>(() => {
    const hotItems: MenuItem[] = [];
    const coldItems: MenuItem[] = [];
    const featuredItems: MenuItem[] = [];

    for (const item of menuItems) {
      const categoryName = normalizeCategoryName(categoriesById.get(item.category)?.name ?? "");

      if (categoryName.includes("featured")) {
        featuredItems.push(item);
        continue;
      }

      if (categoryName.includes("hot")) {
        hotItems.push(item);
        continue;
      }

      if (categoryName.includes("cold") || categoryName.includes("iced")) {
        coldItems.push(item);
      }
    }

    return [
      { title: "Hot Drinks", basisClass: "basis-[35%]", items: hotItems },
      { title: "Cold Drinks", basisClass: "basis-[35%]", items: coldItems },
      { title: "Featured Drinks", basisClass: "basis-[30%]", items: featuredItems },
    ];
  }, [categoriesById, menuItems]);

  return (
    <div className="h-screen w-screen bg-background overflow-hidden">
      {/* Decorative wood texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vintage ornate border frame */}
      <div className="vintage-border-frame">
        <div className="vintage-border-corner vintage-border-corner-tl" />
        <div className="vintage-border-corner vintage-border-corner-tr" />
        <div className="vintage-border-corner vintage-border-corner-bl" />
        <div className="vintage-border-corner vintage-border-corner-br" />
        <div className="vintage-border-edge vintage-border-edge-top" />
        <div className="vintage-border-edge vintage-border-edge-bottom" />
        <div className="vintage-border-edge vintage-border-edge-left" />
        <div className="vintage-border-edge vintage-border-edge-right" />
      </div>

      <div className="relative z-10 h-full w-full flex items-center justify-center p-4 lg:p-6">
        <div
          className="h-full max-h-full w-full max-w-full flex flex-col"
          style={{
            width: "min(100vw, calc(100vh * 16 / 9))",
            height: "min(100vh, calc(100vw * 9 / 16))",
          }}
        >
          <main className="flex-1 min-h-0 flex gap-3 px-6 py-3">
            {isLoading ? (
              <div className="w-full flex items-center justify-center">
                <p className="font-chalk text-2xl text-muted-foreground">Loading menu...</p>
              </div>
            ) : (
              columns.map((column) => (
                <section
                  key={column.title}
                  className={[
                    "min-h-0 overflow-hidden rounded-md border border-border/60 bg-card/70 backdrop-blur-sm shrink-0",
                    "flex flex-col",
                    column.basisClass,
                  ].join(" ")}
                >
                  <header className="px-3 py-2 border-b border-border/50 bg-muted/30">
                    <h2 className="font-chalk text-xl leading-none text-foreground">{column.title}</h2>
                  </header>

                  <div className="flex-1 min-h-0 flex flex-col divide-y divide-border/40">
                    {column.items.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center px-4 text-center">
                        <p className="font-sans text-sm text-muted-foreground">No items in this group</p>
                      </div>
                    ) : (
                      column.items.map((item) => (
                        <MenuItemCard
                          key={item.id}
                          item={item}
                          config={config}
                          featured={column.title === "Featured Drinks"}
                          className="flex-1 min-h-0 flex items-center"
                        />
                      ))
                    )}
                  </div>
                </section>
              ))
            )}
          </main>

          <div className="py-2 text-center border-t border-border/30 bg-background/70 backdrop-blur-sm">
            <p className="font-sans text-sm font-semibold text-muted-foreground">
              Please inform us of any allergies
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
